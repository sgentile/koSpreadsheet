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
