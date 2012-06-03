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
    //this runs on object creation:
	ko.utils.arrayForEach(data.columns, function(tableHeader) {
		self.columns.push(new ks.koTableHeader(tableHeader, self));
	});
	ko.utils.arrayForEach(data.rows, function(tableRow){
		self.rows.push(tableRow); //todo: make this a ks.koTableRow
	});
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
                return ko.bindingHandlers.template.init.apply(this, arguments);
            },
	update: function(element, valueAccessor, allBindingsAccessor, viewModel, context) {
                var options = ko.utils.unwrapObservable(valueAccessor());
				
				var table = ks.koTableCacheManager.getTable(element);
				//console.log(table.data);
				options.data = table;
				
                // if (options.context) {
                    // options.context.data = options.data;
                    // options.data = options.context;  
                    // delete options.context;
                // }

				options.name = 'ksTableTmpl'; 
                ko.bindingHandlers.template.update.apply(this, arguments);
            }
};
        	
// ko.bindingHandlers['koSpreadsheet'] = (function(){
	// var makeNewValueAccessor = function(table){
		// return function(){
			// return {
				// name: TABLE_TEMPLATE,
				// data: table
			// };	
		// };
	// };
// 	
	// return{
		// 'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
	        // //var value = ko.utils.unwrapObservable(valueAccessor()); // Get the current value of the current property we're bound to
	        // //$(element).toggle(value); // jQuery will hide/show the element depending on whether "value" or true or false
	        // var table,
	        	// options = valueAccessor(),
	        	// $element = $(element);
// 	        	
	       	// //create the Table
	       	// table = new ks.KoTable(options);
// 	       	
	       	// //make sure the templates are generated for the Grid
            // // ks.templateManager.ensureGridTemplates({
                // // rowTemplate: grid.config.rowTemplate,
                // // headerTemplate: grid.config.headerTemplate,
                // // headerCellTemplate: grid.config.headerCellTemplate,
                // // footerTemplate: grid.config.footerTemplate,
                // // columns: grid.columns(),
                // // showFilter: grid.config.allowFiltering
            // // });
	       	// ks.templateManager.createTemplates();
	       	// return ko.bindingHandlers['template'].init(element, makeNewValueAccessor(table.data), allBindingsAccessor, table, bindingContext);
// 	       		       	
	    // },
		// 'update': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
	        // // First get the latest data that we're bound to
	    	// var value = valueAccessor(), allBindings = allBindingsAccessor();
// 	        
	    // }
    // }
// }());

}(window));