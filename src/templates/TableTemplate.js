ks.templates.defaultTableTemplate = function () {
    // return  '<table style="width:95%" class="table table-bordered table-condensed">' +
    		// '<tr><td>test</td></tr>' +
            // '</table>';
            
    return '<h2 data-bind="text: title"></h2>' +
    '<ul data-bind="foreach: data">' +
        '<li><span data-bind="text: name"></span></li>' +
    '</ul>';
};