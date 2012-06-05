// settings
var FILE_ENCODING = 'utf-8',
    EOL = '\n',
    DIST_FILE_PATH = '../KoSpreadsheet.debug.js';

// setup
var _fs = require('fs');

function concat(fileList, distPath) {
    var out = fileList.map(function(filePath){
            return _fs.readFileSync(filePath, FILE_ENCODING);
        });
    
    _fs.writeFileSync(distPath, out.join(EOL), FILE_ENCODING);
    //eof
	var log = _fs.createWriteStream(DIST_FILE_PATH, {'flags': 'a'});
	log.end("\n}(window));");
    console.log(' '+ distPath +' built.');
}

concat([
	'builderheader.js',
	'../src/Namespace.js',
	'../src/TableCacheManager.js',
	'../src/Table.js',
	'../src/TableHeader.js',
	'../src/TableRow.js',
	'../src/TableCell.js',
	// '../src/templates/TableTemplate.js',
	// '../src/templates/TemplateManager.js',
    '../src/bindingHandlers/koSpreadsheet.js'
], DIST_FILE_PATH);

//run node builder.js
//see http://blog.millermedeiros.com/node-js-as-a-build-script/
