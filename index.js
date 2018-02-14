var 
api			= require('./api'),
clc			= require('cli-color'),
findUp  = require('find-up'),
program  = require('commander');

program
	.command('upload', 'Upload strings from .pot file into poeditor')
	.command('download', 'Download for update currect locales from poeditor')
	//.option ('-c, --config <path>', 'Path for configuration file, like: ./.translations-config.json');

program.parse(process.argv);

if (program.args.length == 0) {
  console.log('No command provided.');
  process.exit();
}