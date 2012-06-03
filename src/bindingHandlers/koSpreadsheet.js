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
				onResize		: tableSectionViewModel.onResized
			});
		}, 1);
	});
};
