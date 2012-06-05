/*********************************************** */
ks.KoTable = function (data) {
	// var defaults = {
		// data: null, //ko.observableArray
	// };
	data = ko.mapping.toJS(data);
	var self = this;
	
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
			//title : "Table",
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