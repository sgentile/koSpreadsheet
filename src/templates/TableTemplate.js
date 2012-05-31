ks.templates.defaultTableTemplate = function () {
    // return  '<table style="width:95%" class="table table-bordered table-condensed">' +
    		// '<tr><td>test</td></tr>' +
            // '</table>';
            
    return '<table data-bind="with: items">' +
    	'<thread data-bind="foreach: columns">' + 
    		'<th data-bind="text: name"></th>' +
    	'</thread>' +
    	'<tbody data-bind="foreach: rows">' +
    		'<tr>' +
    			'<!-- ko foreach: $data.cells -->' +
    			'<td><div data-bind="text: data></div></td>' +
    			'<!-- /ko -->' +
    		'</tr>' +
    	'</tbody>' +
    '</table>';
    
    // '<ul data-bind="foreach: data">' +
        // '<li><span data-bind="text: name"></span></li>' +
    // '</ul>' +
    
    // return
    // '<table><tr><td>test</td></table>';
//     
    // return 
      // '<table data-bind="click: startEditTable" style="width:95%" class="table table-bordered table-condensed">' +
      // '<thead>' +
	  // '<tr>' +                                                
			// '<!-- ko foreach: columns -->' +
			// '<th class="spreadsheetHeader" data-bind="click: setSelectedColumn,  style: {width:width(), backgroundColor: selectedColumn() === true ? "#999" : "white", textAlign : textAlign()}">' +                                        
				  // '<span data-bind="visible: !editing(), text: name, click: edit">&nbsp;</span>' +
						// '<input style="width:80%;" data-bind="visible: editing, value: name, hasfocus: editing" />' +
				  // '<i data-bind="visible: $parent.editMode, click:$parent.removeColumn" class="icon-remove-sign pull-right"></i>' +
			// '</th>' +
			// '<!-- /ko -->' +
			// '<th data-bind="visible: editMode" style="width:80px; background-color:white">' +
				// '<button data-bind="click: $parent.setSelectedTableHeaderRow" class="btn"><i title="select" class="icon-chevron-left"></i></button>' +                                 	
			// '</th>' +
		// '</tr>' +
	// '</thead>' +
	// '<tbody data-bind="foreach: rows">' +
	  // '<tr data-bind="style:{backgroundColor: selectedRow() === true ? "#999" : "white"}">' +
// 			
			// '<!-- ko foreach: $data.cells -->' +
			// '<td data-bind="style:{backgroundColor: selectedCell() === true ? "#999" : "white"}">' +
				  // '<div data-bind="visible: !editMode(), text: data, style:{fontWeight : fontWeight(), fontStyle : fontStyle(), textAlign : textAlign(), textDecoration: textDecoration()}"></div>' +
						// '<input style="width:90%" data-bind="click: setSelectedTableCell, visible: editMode, value: data, style:{fontWeight : fontWeight(), fontStyle : fontStyle(), textAlign : textAlign(), textDecoration: textDecoration()}" />' +
			// '</td>' +
			// '<!-- /ko -->' +
			// '<td data-bind="visible: $parent.editMode">' +
					// '<button data-bind="click: $parent.setSelectedTableRow" class="btn"><i title="select" class="icon-chevron-left"></i></button>' +
				  // '<button data-bind="click: $parent.removeRow" class="btn"><i class="icon-trash"></i></button>' +
			// '</td>' +
		// '</tr>' +
	// '</tbody>' +
// '</table>';
    
};