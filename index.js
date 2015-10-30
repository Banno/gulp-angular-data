'use strict';

var extend      = require('extend');
var gutil       = require('gulp-util');
var hjson       = require('hjson');
var path        = require('path');
var ngConstant  = require('gulp-ng-constant');
var through     = require('through2');
var yaml        = require('js-yaml');

var PLUGIN_NAME = 'gulp-angular-data';

var defaultOpts = {
	prefix: '',
	suffix: 'Data'
};

var supportedParsers = {
	'.json':  JSON.parse,
	'.hjson': hjson.parse,
	'.yaml':  yaml.safeLoad,
	'.yml':   yaml.safeLoad
};

module.exports = function(outputFilename, givenOpts) {
	if (!outputFilename) {
		throw new gutil.PluginError(PLUGIN_NAME, 'Missing output file for first argument');
	}

	var opts = extend({}, defaultOpts, givenOpts);
	var data = {};

	return through.obj(collectData, endCollector);

	function collectData(file, enc, cb) {
		/* jshint validthis:true */

		// Ignore empty files.
		if (file.isNull()) {
			cb();
			return;
		}

		// Streams are not supported.
		if (file.isStream()) {
			this.emit('error', new gutil.PluginError(PLUGIN_NAME,  'Streaming not supported'));
			cb();
			return;
		}

		// Extract the file extension.
		var extension = path.extname(file.path);

		// Calculate the name for the Angular constant.
		var key = opts.prefix + path.basename(file.path, extension) + opts.suffix;

		// Parse the file and save it into the data collection.
		var lcExtension = extension.toLowerCase();
		var parser = supportedParsers[lcExtension];
		if (!parser) {
			this.emit('error', new gutil.PluginError(PLUGIN_NAME,  'Unrecognized file extension: ' + file.path));
			cb();
			return;
		}
		try {
			data[key] = parser(file.contents.toString());
		} catch (err) {
			this.emit('error', new gutil.PluginError(PLUGIN_NAME,  'Unable to parse ' + file.path + ': ' + err.message));
		}

		cb();
	}

	function endCollector(cb) {
		/* jshint validthis:true */
		var moduleStream = this;

		// Run the gulp-ng-constant stream and collect the output.
		var stream = ngConstant(extend({}, opts, {
			stream: true,
			constants: data
		}));
		stream.on('data', function(file) {
			var outFile = file.clone({ contents: false });
			outFile.path = path.join(file.base, outputFilename);
			moduleStream.push(outFile);
			cb();
		});
		stream.on('error', function(err) {
			moduleStream.emit('error', new gutil.PluginError(PLUGIN_NAME,  'Error compiling with gulp-ng-constant:' + err.message));
			cb();
		});
		stream.end();
	}
};
