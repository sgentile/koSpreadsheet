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
				options.name = 'ksTableTmpl'; 
                return ko.bindingHandlers.template.init.apply(this, arguments);
            },
	update: function(element, valueAccessor, allBindingsAccessor, viewModel, context) {
                var options = ko.utils.unwrapObservable(valueAccessor());
				
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
