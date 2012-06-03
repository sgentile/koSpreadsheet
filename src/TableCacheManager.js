ks.koTableCacheManager = (new function(){
	var self = this, elementTableKey = '__koSpreadsheet__';
	
	//public properties
	this.tableCache = {};
	
	//public methods
	this.storeTable = function(element, table){
		self.tableCache[table.tableId] = table;
		element[elementTableKey] = table.tableId;
	};
	
	this.getTable = function(element){
		var table;
		if(element[elementTableKey]){
			table = self.tableCache[element[elementTableKey]];
		}
		return table;
	};
	
	this.clearTableCache = function(){
		self.tableCache = {};
	}
}());


