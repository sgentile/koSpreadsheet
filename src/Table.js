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