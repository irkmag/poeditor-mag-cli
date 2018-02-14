var clc			= require('cli-color'),
	fs        = require('fs'),
	findUp  = require('find-up');


module.exports = function(program){

	program
		.option ('-c, --config <path>', 'Path for configuration file, like: ./.translations-config.json');

	program.parse(process.argv);

	if(!program.config) {
	  console.log(clc.red("\n>> Config parameter --config should be provided <<\n"));
	  process.exit();
	}

  var c = findUp.sync(program.config);

	if(!program.config || fs.existsSync(c) == false) {
	  console.log(clc.red("\n>> Unable to found config file for path: "+c+"  <<\n"));
	  process.exit();
	}

  var configFile = require(c);
  
  config = configFile.poeditor;
  config.potFile = configFile.output;

  if(fs.existsSync(config.potFile) == false) {
    console.log(clc.red("\n>> Pot file `"+config.potFile+"` not redable or not exists  <<\n"));
    process.exit();
  }

  if (!config.apiToken || !config.projectId) {
    console.log(clc.red("\n>>  No API token or project id found for POEditor. Please provide the necessary information in the following steps. <<\n"));
    process.exit();
	}

	return config;
};