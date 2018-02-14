var util   		= require('util'),
	CLI		 	= require('clui'),
	Promise		= require('promise'),
	https    	= require('https'),
	extend 		= util._extend,	
	fs        = require('fs'),
	FormData  = require('form-data');

var API_TIMEOUT = 2000; // 2 seconds

function apiRequest(apiToken, action, params) {
	return new Promise(function (resolve, reject) {
		var parameters = {
			api_token: apiToken,
			action: action
		};

		extend(parameters, params || {});
		
		var postData = parameters;
		var form = new FormData();

		for(var p in parameters) {
		  form.append(p, parameters[p]);
		}

		var req = https.request({
			hostname: 'poeditor.com',
			path: '/api/',
			port: 443,
			method: 'POST',
			timeout: API_TIMEOUT,
			headers: form.getHeaders()
		}, function(res){
			var data = "";
			res.on('data', function(d){
				data += d;
			});

			res.on('end', function(){
				var parsed = JSON.parse(data);				
				var success = (parsed.response.status === "success");

				if(success){
					resolve([parsed.response, parsed.item || parsed.list || parsed.details || null]);
				} else {
					reject({
						code: parsed.response.code,
						message: parsed.response.message
					});
				}
			});

		});

		req.on('error', function (e) {
			reject(e);
		});

		form.pipe(req);

	});
}

module.exports = {
	apiRequest: apiRequest,
	
	getProjects: function(apiToken){
		return new Promise(function(resolve, reject){
			var spinner = new CLI.Spinner('Please wait, retrieving projects...');
			spinner.start();

			apiRequest(apiToken, 'list_projects')
				.then(function(res){
					spinner.stop();
					resolve(res);
				}, function(data){
					spinner.stop();
					reject(data);
				});
		});
	},

	getProjectLanguages: function(apiToken, projectId){
		return new Promise(function(resolve, reject){
			var spinner = new CLI.Spinner('Please wait...');
			spinner.start();

			apiRequest(apiToken, 'list_languages', {
				id: projectId
			}).then(function(res){
				spinner.stop();
				resolve(res);
			}, function(data){
				spinner.stop();
				reject(data);
			})
		});
	},

	upload: function(apiToken, projectId, filePath) {
		return new Promise(function(resolve, reject){
			var spinner = new CLI.Spinner('Uploading ' + filePath + ', please wait...');
			spinner.start();

			apiRequest(apiToken, 'upload', {
				id: projectId,
				updating: "terms",
				file: fs.createReadStream(filePath)
			}).then(function(res){
				spinner.stop();
				resolve(res);
			}, function(data){
				spinner.stop();
				reject(data);
			})
		});
	  
	},

	download: function(apiToken, projectId, language, savePath) {
		return new Promise(function(resolve, reject){
			var spinner = new CLI.Spinner('Downloading language ' + language + ', please wait...');
			spinner.start();

			apiRequest(apiToken, 'export', {
				id: projectId,
				updating: "terms",
				type: "key_value_json",
				language: language
			}).then(function(res){
				spinner.stop();

				if (res && res.length > 0) {
				  let stream = fs.createWriteStream(savePath);
				  https.get(res[1], (r)=>{
				    r.on('data', (d) => {
				      stream.write(d);
				    });

				    r.on('end', () => {
				      stream.end();
				      resolve('Download is done');
				    });

				  }).on('error', (e) => {
				      stream.end();
				      reject(e);
				    });
				}
				else {
				  reject('Download error');
				}
				

				
			}, function(data){
				spinner.stop();
				reject(data);
			})
		});
	  
	},
};