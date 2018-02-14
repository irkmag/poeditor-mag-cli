var 
api			  = require('./api'),
clc			  = require('cli-color'),
configure	= require('./configure'),
program   = require('commander');



let config = configure(program);


api.upload(config.apiToken, config.projectId, config.potFile).then(function(response){
  console.log('[OK] upload - ok, response: ', response);
}, function(err){
	console.log(clc.red("[ERROR] Upload error"));
	console.log('Error details: ', err);
});
