/***********************************************
* KoSpeadsheet JavaScript Library
* (c) Steve Gentile
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
/***********************************************/
(function(window, undefined){
/***********************************************/ 
﻿
var ks = window['ks'] = {};
ks.templates = {};

/* Constants - if grows, move to new file */
var TABLE_TEMPLATE = 'ksTableTmpl'; 
ks.koTableCacheManager = (new function(){
	var self = this, elementTableKey = '__koSpreadsheet__';
	
	//public properties
	this.tableCache = {};
	
	//public methods
	this.storeTable = function(element, table){
		self.tableCache[table.tableId] = table;
		element[elementTableKey] = table.tableId;
	};
	
	this.getTable = function(element){
		var table;
		if(element[elementTableKey]){
			table = self.tableCache[element[elementTableKey]];
		}
		return table;
	};
	
	this.clearTableCache = function(){
		self.tableCache = {};
	}
}());



/*********************************************** */
ks.KoTable = function (data) {
	// var defaults = {
		// data: null, //ko.observableArray
	// };
	data = ko.mapping.toJS(data);
	var self = this;
	
	self.title = ko.observable();
	self.columns = ko.observableArray([]);
	self.rows = ko.observableArray([]);
	
	self.editMode = ko.observable(false);
	self.isTextSelected = ko.observable(false);
	self.selectedTableCell = ko.observable(null);
	self.selectedTableHeader = ko.observable(null);
	self.selectedTableHeaderRow = ko.observable(false);
	self.selectedTableRow = ko.observable(null);
	self.element = null;
	self.onUpdate = null;
	self.onDataUpdate = null;
	
	//table id generator for cache
	this.createNewId = function(){
		var seedId = new Date().getTime();
		return seedId += 1;
	};
	
	this.$root; //this is the root element that is passed in with the binding handler
	
	//this.config = $.extend(defaults, options);
	
	this.tableId = "ks" + this.createNewId(); //for cache
	
	// set this during the constructor execution so that the
    // computed observables register correctly;
    //this.data = self.config.data;
    
    if(data == null){
    	//default data:
    	data = {
			title : "Table",
			columns : [
				{name: "Column A", width:"100px", textAlign: 'center'}, 
				{name: "Column B", width:"100px", textAlign: 'center'}, 
				{name: "Column C", width:"100px", textAlign: 'center'},
				{name: "Column D", width:"100px", textAlign: 'center'},
				{name: "Column E", width:"100px", textAlign: 'center'},
				{name: "Column F", width:"100px", textAlign: 'center'}
			],			
			rows: [                                                              
               [{data:"magna", metadata:{fontWeight:"bold", fontStyle: "italic", textAlign: "right"}}, {data:"enim"}, {data:"minim"}, {data:"ipsum"}, {data:"dolor"}, {data:"sit"}],
               [{data:"eiusmod"}, {data:"incididunt"}, {data:"labore"}, {data:"consectetur"}, {data:"adipisicing"}, {data:"elit"}]
            ]
		};
    }
    self.title(data.title);
	
	self.setSelectedTableCell = function(rowCell) {		
		self.clearAllSelected();
		self.selectedTableCell(rowCell);
	};

	self.setSelectedTableHeader = function(rowHeader) {
		self.selectedTableHeaderRow(false);
		//toggle
		if(rowHeader.selectedColumn() === true) {
			self.clearAllSelected();
			rowHeader.selectedColumn(false);
		} else {
			self.clearAllSelected();
			self.selectedTableHeader(rowHeader);
			var selectedHeaderIndex = self.columns.indexOf(rowHeader);
			ko.utils.arrayForEach(self.rows(), function(tableRow) {
				var tableCell = tableRow.getTableCell(selectedHeaderIndex);
				tableCell.selectedCell(true);
			});
			rowHeader.selectedColumn(true);
		}
	};

	self.setSelectedTableHeaderRow = function() {
		self.clearAllSelected();
		ko.utils.arrayForEach(self.columns(), function(column) {
			column.selectedColumn(true);
		});
		self.selectedTableHeaderRow(true);
	};

	self.setSelectedTableRow = function(tableRow) {
		//toggle selected
		if(tableRow.selectedRow() === true) {
			self.clearAllSelected();
			tableRow.selectedRow(false);
		} else {
			self.clearAllSelected();
			self.selectedTableRow(tableRow);
			tableRow.selectedRow(true);
			tableRow.setSelectedTableCells();
		}
	};

	self.clearSelectedTableRows = function() {
		ko.utils.arrayForEach(self.rows(), function(row) {
			row.selectedRow(false);
			row.clearSelectedTableCells();
		});
	};

	self.clearSelectedTableHeaders = function() {
		ko.utils.arrayForEach(self.columns(), function(column) {
			column.selectedColumn(false);
		});
	};

	self.clearAllSelected = function() {
		//this should clear every selected item, both visually and 'selected'
		self.clearSelectedTableHeaders();
		self.clearSelectedTableRows();
		self.selectedTableCell(null);
		self.selectedTableHeader(null);
		self.selectedTableRow(null);
		self.selectedTableHeaderRow(false);
		self.clearSelectedTableHeaders(null);
	};

	self.removeRow = function(tableRow) {
		self.rows.remove(tableRow);
	};
	
	//this runs on object creation:
	ko.utils.arrayForEach(data.columns, function(tableHeader) {
		self.columns.push(new ks.koTableHeader(tableHeader, self));
	});
	ko.utils.arrayForEach(data.rows, function(rows){
		var tableRow = new ks.koTableRow(self);
		ko.utils.arrayForEach(rows, function(cell) {
			tableRow.addTableCell(cell);
		});
		self.rows.push(tableRow);
	});
	// end initialize

	self.startEditTable = function() {
		self.editMode(true);
	};
	
	self.stopEditTable = function() {
		self.clearAllSelected();
		self.editMode(false);
	};

	self.setWidths = function(columns) {
		$.each(columns, function(index, value) {
			if(index < self.columns().length)//skip first one... it's not a data column
			{
				self.columns()[index].width($(value).width());
			}
		});
	};

	self.onResized = function(e) {
		var columns = $(e.currentTarget).find("th");
		self.setWidths(columns);
	};

	self.addRow = function() {
		var tableRow = new ks.koTableRow(self);
		for(var x = 0; x < self.columns().length; x++) {
			tableRow.addTableCell({
				data : ""
			}, self);
		}
		self.rows.push(tableRow);
	};

	self.addColumn = function() {
		var columnName = window.prompt("Enter column name");
		var columnWidth = columnName.length + "px";
		if(columnName.length < 50){
			columnWidth = "50px";
		}
		
		self.columns.push(new ks.koTableHeader({
			name : columnName,
			width : columnWidth
		}, self));
		
		ko.utils.arrayForEach(self.rows(), function(tableRow) {
			tableRow.addTableCell({
				data : ""
			}, self);
		});
	};

	self.removeColumn = function(column) {
		if(window.confirm("Remove Column?")) {
			var indexToRemove = self.columns.indexOf(column);
			self.columns.remove(column);
			ko.utils.arrayForEach(self.rows(), function(tableRow) {
				tableRow.cells.splice(indexToRemove, 1);
			});
		}
	};

	self.exportData = function() {
		var data = self.getDataSource();
		if(self.onExportData){
			self.onExportData(data);
		}
	};
	
	self.dataUpdated = function(){
		var data = self.getDataSource();
		if(self.onDataUpdate){
			self.onDataUpdate(data);
		};
	};
	
	self.getDataSource = function(){
		return {
			columns : ko.utils.arrayMap(self.columns(), function(item) {
				return {
					name : item.name(),
					width : item.width(),
					textAlign : item.textAlign()
				};

			}),
			 rows: ko.utils.arrayMap(self.rows(), function(tableRow) {
				 return ko.utils.arrayMap(tableRow.cells(), function(cell){
					return  {
						 value	: cell.data(),
							 metadata	: {
							 fontWeight		: cell.fontWeight(),
							 fontStyle		: cell.fontStyle(),
							 textAlign		: cell.textAlign(),
							 textDecoration	: cell.textDecoration()
							 }
						 };
				 });
			 })
		};
	};

	self.makeBold = function() {
		var tableCell = self.selectedTableCell();
		if(tableCell) {
			tableCell.makeCellBold();
		}
		var tableHeader = self.selectedTableHeader();
		if(tableHeader) {
			tableHeader.makeColumnBold();			
		}
		var tableRow = self.selectedTableRow();
		if(tableRow) {
			tableRow.makeRowBold();
		}
	};

	self.makeItalic = function() {
		var tableCell = self.selectedTableCell();
		if(tableCell) {
			tableCell.makeCellItalic();
		}
		var tableHeader = self.selectedTableHeader();
		if(tableHeader) {
			tableHeader.makeColumnItalic();			
		}
		var tableRow = self.selectedTableRow();
		if(tableRow) {
			tableRow.makeRowItalic();
		}
	};

	self.makeUnderline = function() {
		var tableCell = self.selectedTableCell();
		if(tableCell) {
			tableCell.makeCellUnderline();
		}			
		var tableHeader = self.selectedTableHeader();
		if(tableHeader) {
			tableHeader.makeColumnUnderline();			
		}
		var tableRow = self.selectedTableRow();
		if(tableRow) {
			tableRow.makeRowUnderline();			
		}
	};

	self.makeAlignLeft = function() {
		self.setAlignment('left');
	};

	self.makeAlignCenter = function() {
		self.setAlignment('center');
	};

	self.makeAlignRight = function() {
		self.setAlignment('right');
	};
	
	//internal function
	self.setAlignment = function(direction){
		var tableCell = self.selectedTableCell();
		if(tableCell) {
			tableCell.textAlign(direction);
		}
		var selectedTableHeader = self.selectedTableHeader();
		if(selectedTableHeader) {
			selectedTableHeader.textAlign(direction);
			var indexOfSelectedHeader = self.columns.indexOf(selectedTableHeader);
			ko.utils.arrayForEach(self.rows(), function(tableRow) {
				var selectedTableCell = tableRow.getTableCell(indexOfSelectedHeader);
				selectedTableCell.textAlign(direction);
			});
		}
		var selectedTableRow = self.selectedTableRow();
		if(selectedTableRow) {
			selectedTableRow.setRowAlignment(direction);
		}
		if(self.selectedTableHeaderRow() === true) {
			ko.utils.arrayForEach(self.columns(), function(tableHeader) {
				tableHeader.textAlign(direction);
			});
		}
	};
}
/*********************************************** */
ks.koTableHeader = function(tableHeader, parent){
	"use strict";
	
	var self = this;
	if(!tableHeader.width) {
		tableHeader.width = tableHeader.name + "px";
		//default to size of the text
	}

	self.name = ko.observable(tableHeader.name);
	self.width = ko.observable(tableHeader.width);
	self.textAlign = ko.observable(tableHeader.textAlign);
	self.editing = ko.observable(false);
	self.selectedColumn = ko.observable(false);

	self.setSelectedColumn = function(tableHeader) {
		parent.setSelectedTableHeader(tableHeader);
	};

	self.edit = function() {
		this.editing(true);
	};

	self.makeColumnBold = function() {
		var indexOfSelectedHeader = parent.columns.indexOf(self);
		var selectedHeaderIndexRows = ko.utils.arrayMap(parent.rows(), function(tableRow) {
			return tableRow.getTableCell(indexOfSelectedHeader);
		});

		var boldCells = ko.utils.arrayFilter(selectedHeaderIndexRows, function(tableCell) {
			return tableCell.fontWeight() === 'bold';
		});

		if(selectedHeaderIndexRows.length == boldCells.length) {//all are bold
			//unbold all
			ko.utils.arrayForEach(selectedHeaderIndexRows, function(tableCell) {
				tableCell.fontWeight('normal');
			});
		} else {
			//bold all:
			ko.utils.arrayForEach(selectedHeaderIndexRows, function(tableCell) {
				tableCell.fontWeight('bold');
			});
		}
	};

	self.makeColumnItalic = function() {
		var indexOfSelectedHeader = parent.columns.indexOf(self);
		var selectedHeaderIndexRows = ko.utils.arrayMap(parent.rows(), function(tableRow) {
			return tableRow.getTableCell(indexOfSelectedHeader);
		});

		var italicCells = ko.utils.arrayFilter(selectedHeaderIndexRows, function(tableCell) {
			return tableCell.fontStyle() === 'italic';
		});

		if(selectedHeaderIndexRows.length == italicCells.length) {//all are bold
			//unitalic all
			ko.utils.arrayForEach(selectedHeaderIndexRows, function(tableCell) {
				tableCell.fontStyle('normal');
			});
		} else {
			//italic all:
			ko.utils.arrayForEach(selectedHeaderIndexRows, function(tableCell) {
				tableCell.fontStyle('italic');
			});
		}
	};

	self.makeColumnUnderline = function() {
		var indexOfSelectedHeader = parent.columns.indexOf(self);
		var selectedHeaderIndexRows = ko.utils.arrayMap(parent.rows(), function(tableRow) {
			return tableRow.getTableCell(indexOfSelectedHeader);
		});

		var underlineCells = ko.utils.arrayFilter(selectedHeaderIndexRows, function(tableCell) {
			return tableCell.textDecoration() === 'underline';
		});

		if(selectedHeaderIndexRows.length == underlineCells.length) {//all are bold
			//ununderline all
			ko.utils.arrayForEach(selectedHeaderIndexRows, function(tableCell) {
				tableCell.textDecoration('none');
			});
		} else {
			//underline all:
			ko.utils.arrayForEach(selectedHeaderIndexRows, function(tableCell) {
				tableCell.textDecoration('underline');
			});
		}
	};
};

/*********************************************** */
ks.koTableRow = function(parent) {
	'use strict';
	
	var self = this;
	self.parent = parent;

	self.cells = ko.observableArray();
	self.selectedRow = ko.observable(false);

	self.addTableCell = function(rowItem) {
		var tableCell = new ks.koTableCell(rowItem, self.parent);
		self.cells.push(tableCell);
	};

	self.getTableCell = function(index) {
		return self.cells()[index];
	};

	self.setSelectedTableCells = function() {
		ko.utils.arrayForEach(self.cells(), function(tableCell) {
			tableCell.selectedCell(true);
		});
	};

	self.clearSelectedTableCells = function() {
		ko.utils.arrayForEach(self.cells(), function(tableCell) {
			tableCell.selectedCell(false);
		});
	};

	self.makeRowBold = function() {
		//get all that are bold
		var boldedCells = ko.utils.arrayFilter(self.cells(), function(tableCell) {
			return tableCell.fontWeight() === 'bold';
		});

		if(boldedCells.length == self.cells().length)//all are bold
		{
			//unbold all:
			ko.utils.arrayForEach(self.cells(), function(tableCell) {
				tableCell.fontWeight('normal');
			});
		} else {
			//bold all:
			ko.utils.arrayForEach(self.cells(), function(tableCell) {
				tableCell.fontWeight('bold');
			});
		}
	};

	self.makeRowItalic = function() {
		//get all that are italic
		var italicCells = ko.utils.arrayFilter(self.cells(), function(tableCell) {
			return tableCell.fontStyle() === 'italic';
		});

		if(italicCells.length == self.cells().length)//all are italic
		{
			//unitalic all:
			ko.utils.arrayForEach(self.cells(), function(tableCell) {
				tableCell.fontStyle('normal');
			});
		} else {
			//italic all:
			ko.utils.arrayForEach(self.cells(), function(tableCell) {
				tableCell.fontStyle('italic');
			});
		}
	};

	self.makeRowUnderline = function() {
		//get all that are underline
		var underlineCells = ko.utils.arrayFilter(self.cells(), function(tableCell) {
			return tableCell.textDecoration() === 'underline';
		});

		if(underlineCells.length == self.cells().length)//all are underline
		{
			//ununderline all:
			ko.utils.arrayForEach(self.cells(), function(tableCell) {
				tableCell.textDecoration('none')
			});
		} else {
			//underline all:
			ko.utils.arrayForEach(self.cells(), function(tableCell) {
				tableCell.textDecoration('underline');
			});
		}
	};

	self.setRowAlignment = function(alignment) {
		ko.utils.arrayForEach(self.cells(), function(tableCell) {
			tableCell.textAlign(alignment);
		});
	};
}; 
/*********************************************** */
ks.koTableCell = function(rowItem, parent) {
	'use strict';

	var self = this;
	self.parent = parent;
	self.data = ko.observable(rowItem.data);
	//http://www.comptechdoc.org/independent/web/cgi/javamanual/javastyle.html
	self.fontWeight = ko.observable("normal");
	self.fontStyle = ko.observable("normal");
	self.textAlign = ko.observable("left");
	self.textDecoration = ko.observable("none");
	self.selectedCell = ko.observable(false);

	self.editMode = ko.computed(function() {
		return self.parent.editMode();
	});

	self.setSelectedTableCell = function(selectedCell) {
		self.parent.setSelectedTableCell(selectedCell);
	};

	if(rowItem.metadata) {
		if(rowItem.metadata.fontWeight) {
			self.fontWeight(rowItem.metadata.fontWeight);
		}
		if(rowItem.metadata.fontStyle) {
			self.fontStyle(rowItem.metadata.fontStyle);
		}
		if(rowItem.metadata.textAlign) {
			self.textAlign(rowItem.metadata.textAlign);
		}
		if(rowItem.metadata.textDecoration) {
			self.textDecoration(rowItem.metadata.textDecoration);
		}
	}

	self.makeCellBold = function() {
		if(self.fontWeight() === 'normal') {
			self.fontWeight('bold');
		} else {
			self.fontWeight('normal');
		}
	};

	self.makeCellItalic = function() {
		if(self.fontStyle() === 'normal') {
			self.fontStyle('italic');
		} else {
			self.fontStyle('normal');
		}
	};

	self.makeCellUnderline = function() {
		if(self.textDecoration() === 'none') {
			self.textDecoration('underline');
		} else {
			self.textDecoration('none');
		}
	};

	self.editing = ko.observable(false);
	// Behaviors
	self.edit = function() {
		self.editing(true);
	};
};


var makeNewValueAccessor = function(viewModel){
	return function(){
		return {
			name: 'ksTableTmpl',
			data: viewModel.items
		};	
	};
};
	
ko.bindingHandlers.koSpreadsheet = {
	init: function(element, valueAccessor, allBindingsAccessor, viewModel, context) {       	
		//ks.templateManager.createTemplates();
		var options = ko.utils.unwrapObservable(valueAccessor());
		var table = new ks.KoTable(options.data);
		var $element = $(element);				
		
		//store the table for update:
		ks.koTableCacheManager.storeTable(element, table);
		//console.log(table.data);
		options.data = table;
		options.name = 'ksTableTmpl'; 
		if(options.onExportData){
			table.onExportData = options.onExportData;
		}
		if(options.onDataUpdate){
			table.onDataUpdate = options.onDataUpdate;
		}
        return ko.bindingHandlers.template.init.apply(this, arguments);
    },
	update: function(element, valueAccessor, allBindingsAccessor, viewModel, context) {
        var options = ko.utils.unwrapObservable(valueAccessor());
		
		var table = ks.koTableCacheManager.getTable(element);
		var $element = $(element);
		
		//console.log(table.data);
		options.data = table;
		
        // if (options.context) {
            // options.context.data = options.data;
            // options.data = options.context;  
            // delete options.context;
        // }

		options.name = 'ksTableTmpl'; 
        ko.bindingHandlers.template.update.apply(this, arguments);
        ks.applyResizer($element, table);
    }
};

ks.applyResizer = function($element, table){
	//resizer
	var $colResizable = $element.find('table').colResizable(
		{
			postbackSafe	: true, 
			onResize		: table.onResized,
			disable			: table.editMode() ? false : true
		}
	);
	
	table.editMode.subscribe(function(editMode){
		if(editMode)
		{
			setTimeout(function(){
				$colResizable.colResizable({disable:true});
		
				$colResizable.colResizable(
				{
					postbackSafe	: true, 
					onResize		: table.onResized
				});
			}, 1);
		}
		else{
			$colResizable.colResizable({disable:true});
		}
	});

	table.columns.subscribe(function(columnUpdate){
		setTimeout(function(){
			$colResizable.colResizable({disable:true});
	
			$colResizable.colResizable(
			{
				postbackSafe	: true, 
				onResize		: table.onResized
			});
		}, 1);
	});
};

}(window));