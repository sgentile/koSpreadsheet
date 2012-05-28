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