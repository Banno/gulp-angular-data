/* jshint mocha:true */
'use strict';

var angularData = require('../');

var assert = require('stream-assert');
var File   = require('gulp-util').File;
var fs     = require('fs');
var path   = require('path');
var should = require('should');
var Stream = require('stream');

require('mocha');

describe('gulp-angular-data', function() {

	var files, stream;

	function createFile(testPath) {
		return new File({
			base: __dirname,
			path: path.join(__dirname, testPath),
			contents: new Buffer(fs.readFileSync(
				path.join(__dirname, testPath),
				{ encoding: 'utf8' }
			).trim())
		});
	}

	var expected = {
		noFiles: createFile('expected/empty.js'),
		oneFile: createFile('expected/oneFile.js'),
		twoFiles: createFile('expected/twoFiles.js'),
		existingModuleFile: createFile('expected/existingModule.js'),
		withPrefixFile: createFile('expected/withPrefix.js'),
		withSuffixFile: createFile('expected/withSuffix.js'),
	};

	beforeEach(function() {
		files = {
			unknown: createFile('fixtures/test.wut'),
			json1: createFile('fixtures/test1.json'),
			json2: createFile('fixtures/test2.json'),
			hjson1: createFile('fixtures/test1.hjson'),
			hjson2: createFile('fixtures/test2.hjson'),
			yaml1: createFile('fixtures/test1.yml'),
			yaml2: createFile('fixtures/test2.yml'),
			stream: new File({
				base: __dirname,
				path: path.join(__dirname, 'fixtures/test1.json'),
				contents: new Stream()
			})
		};
	});

	beforeEach(function() {
		stream = angularData('test.js');
	});

	it('should throw an error when arguments are missing', function() {
		(function() {
			angularData();
		}).should.throw('Missing output file for first argument');
	});

	it('should work with no files', function(done) {
		stream
			.pipe(assert.length(1))
			.pipe(assert.first(function(file) {
				file.contents.toString().should.eql(expected.noFiles.contents.toString());
			}))
			.pipe(assert.end(done));
		stream.write(new File());
		stream.end();
	});

	it('should emit an error with a streamed file', function(done) {
		stream
			.on('error', function(err) {
				err.message.should.eql('Streaming not supported');
				done();
			});
		stream.write(files.stream);
	});

	it('should use the name given as the argument', function(done) {
		stream
			.pipe(assert.first(function(file) {
				path.basename(file.path).should.eql('test.js');
			}))
			.pipe(assert.end(done));
		stream.write(files.json1);
		stream.end();
	});

	describe('unknown source format', function() {

		it('should emit an error', function(done) {
			stream
				.on('error', function(err) {
					err.message.should.startWith('Unrecognized file extension');
					done();
				});
			stream.write(files.unknown);
		});

	});

	describe('JSON source', function() {

		it('should work with one file', function(done) {
			stream
				.pipe(assert.length(1))
				.pipe(assert.first(function(file) {
					file.contents.toString().should.eql(expected.oneFile.contents.toString());
				}))
				.pipe(assert.end(done));
			stream.write(files.json1);
			stream.end();
		});

		it('should work with multiple files', function(done) {
			stream
				.pipe(assert.length(1))
				.pipe(assert.first(function(file) {
					file.contents.toString().should.eql(expected.twoFiles.contents.toString());
				}))
				.pipe(assert.end(done));
			stream.write(files.json1);
			stream.write(files.json2);
			stream.end();
		});

	});

	describe('HJSON source', function() {

		it('should work with one file', function(done) {
			stream
				.pipe(assert.length(1))
				.pipe(assert.first(function(file) {
					file.contents.toString().should.eql(expected.oneFile.contents.toString());
				}))
				.pipe(assert.end(done));
			stream.write(files.hjson1);
			stream.end();
		});

		it('should work with multiple files', function(done) {
			stream
				.pipe(assert.length(1))
				.pipe(assert.first(function(file) {
					file.contents.toString().should.eql(expected.twoFiles.contents.toString());
				}))
				.pipe(assert.end(done));
			stream.write(files.hjson1);
			stream.write(files.hjson2);
			stream.end();
		});

	});

	describe('YAML source', function() {

		it('should work with one file', function(done) {
			stream
				.pipe(assert.length(1))
				.pipe(assert.first(function(file) {
					file.contents.toString().should.eql(expected.oneFile.contents.toString());
				}))
				.pipe(assert.end(done));
			stream.write(files.yaml1);
			stream.end();
		});

		it('should work with multiple files', function(done) {
			stream
				.pipe(assert.length(1))
				.pipe(assert.first(function(file) {
					file.contents.toString().should.eql(expected.twoFiles.contents.toString());
				}))
				.pipe(assert.end(done));
			stream.write(files.yaml1);
			stream.write(files.yaml2);
			stream.end();
		});

	});

	describe('options', function() {

		it('should accept the same options as gulp-ng-constant', function(done) {
			stream = angularData('test.js', {
				name: 'existingModule',
				deps: false
			});
			stream
				.pipe(assert.length(1))
				.pipe(assert.first(function(file) {
					file.contents.toString().should.eql(expected.existingModuleFile.contents.toString());
				}))
				.pipe(assert.end(done));
			stream.write(files.json1);
			stream.end();
		});

		it('should prepend the name with options.prefix', function(done) {
			stream = angularData('test.js', {
				prefix: 'foo'
			});
			stream
				.pipe(assert.length(1))
				.pipe(assert.first(function(file) {
					file.contents.toString().should.eql(expected.withPrefixFile.contents.toString());
				}))
				.pipe(assert.end(done));
			stream.write(files.json1);
			stream.end();
		});

		it('should append the name with options.suffix', function(done) {
			stream = angularData('test.js', {
				suffix: 'foo'
			});
			stream
				.pipe(assert.length(1))
				.pipe(assert.first(function(file) {
					file.contents.toString().should.eql(expected.withSuffixFile.contents.toString());
				}))
				.pipe(assert.end(done));
			stream.write(files.json1);
			stream.end();
		});

	});

});
