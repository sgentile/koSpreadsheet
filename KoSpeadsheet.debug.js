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
/*********************************************** */
ks.KoTable = function (options) {
	var defaults = {
		data: null, //ko.observableArray
	};
	
	self = this;
	
	this.$root; //this is the root element that is passed in with the binding handler
	
	this.config = $.extend(defaults, options);
	
	// set this during the constructor execution so that the
    // computed observables register correctly;
    this.data = self.config.data;
    
    //if(this.data == null){
    	this.data = {
			title : "Table",
			columns : [
				{name: "Column A", width:"100px", textAlign: 'center'}, 
				{name: "Column B", width:"100px", textAlign: 'center'}, 
				{name: "Column C", width:"100px", textAlign: 'center'},
				{name: "Column D", width:"100px", textAlign: 'center'},
				{name: "Column E", width:"100px", textAlign: 'center'},
				{name: "Column F", width:"100px", textAlign: 'center'}
			],
			rows : [[
				{ data : ""},
				{ data : ""},
				{ data : ""},
				{ data : ""},
				{ data : ""},
				{ data : ""}
			]]
		};
    //}
}
ks.templates.defaultTableTemplate = function () {
    // return  '<table style="width:95%" class="table table-bordered table-condensed">' +
    		// '<tr><td>test</td></tr>' +
            // '</table>';
            
    return '<h2 data-bind="text: title"></h2>' +
    '<ul data-bind="foreach: data">' +
        '<li><span data-bind="text: name"></span></li>' +
    '</ul>';
};
/******************************/
ks.templateManager = (new function(){
	var self = this;
	
	
	var addTemplate = function (templateText, tmplId) {
        var tmpl = document.createElement("SCRIPT");
        tmpl.type = "text/html";
        tmpl.id = tmplId;

        //        'innerText' in tmpl ? tmpl.innerText = templateText
        //                            : tmpl.textContent = templateText;

        tmpl.text = templateText;

        document.body.appendChild(tmpl);
    };
    
    this.createTemplate = function(tmplid, templateTextAccessor){
    	var templateElement = document.getElementById(tmplid);
    	if(templateElement === null){
    		addTemplate(templateTextAccessor(), tmplid);
    	}
   	};
    
    this.createTemplates = function(){
    	self.createTemplate(TABLE_TEMPLATE, ks.templates.defaultTableTemplate);
    };

}());

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
				ks.templateManager.createTemplates();
				var options = ko.utils.unwrapObservable(valueAccessor());
				options.name = 'ksTableTmpl'; 
                return ko.bindingHandlers.template.init.apply(this, arguments);
            },
	update: function(element, valueAccessor, allBindingsAccessor, viewModel, context) {
                var options = ko.utils.unwrapObservable(valueAccessor());

                if (options.context) {
                    options.context.data = options.data;
                    options.data = options.context;  
                    delete options.context;
                }

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