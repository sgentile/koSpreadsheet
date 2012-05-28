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
