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