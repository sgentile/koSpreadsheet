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

