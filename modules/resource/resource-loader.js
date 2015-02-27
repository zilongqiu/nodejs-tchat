var path = require('path');

// Match url with local resource
function matchLocalResource(app, url, absoluteFilePath) {
	app.get(url,function(req,res) {
		if(path.isAbsolute(absoluteFilePath)) {
	    	res.sendFile(absoluteFilePath);
		}
	});
}

module.exports.matchLocalResource = matchLocalResource;