var 
api			  = require('./api'),
clc			  = require('cli-color'),
configure	= require('./configure'),
program   = require('commander');



let config = configure(program);


api.getProjectLanguages(config.apiToken, config.projectId).then(function(response){
		
		if (response && response.length > 0) {
		  let langs = response[1];

		  console.log('Project languages: ', langs);

		  for(var i in langs) {
		    let lng = langs[i];

		    api.download(config.apiToken, config.projectId, lng.code, config.exportPath + lng.code + '.json').then(function(response){
		      console.log("\n[OK] download for language " + lng.code + ", response: ", response);
		    }, function(err){
		      console.log(clc.red("[ERROR] Download error language: "+ lng.code));
		    	console.log(err);
		    });

		  }

		}
		
}, function(){
		console.log(clc.red("[ERROR] No projects languages could be retrieved."));
});
