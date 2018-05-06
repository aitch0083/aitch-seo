'use strict'

const chai           = require('chai');
const chaiAsPromised = require('chai-as-promised');
const _              = require('lodash');
const fs             = require('fs');
const ms             = require('memory-streams');

const expect = chai.expect;

chai.use(chaiAsPromised);

//include the targets
const SEO   = require('../index');
const rules = require('../rules/index');

describe('Test SEO', function() {
  
  describe('#fetch_from_file()', function() {
    
	it('SEO.fetch_from_file():: should be able to read from the file and create a selector', function() {//test-case 1
		var test_file = __dirname + '/fixtures/test.html';
		var result    = SEO.fetch_from_file(test_file);

		expect(result).to.eventually.have.property('selector');
	});//eo test-case 1

	it('SEO.fetch_from_file():: should be able to detect if the file does not exist', function() {//test-case 2
		var test_file = __dirname + '/fixtures/test.nonono.html';
		var result    = SEO.fetch_from_file(test_file);

		expect(result).to.be.rejected;
	});//eo test-case 2

	it('SEO.fetch_from_file():: should be able to read from the file and run the validations specified', function() {//test-case 3
		var test_file = __dirname + '/fixtures/test.html';
		var result    = SEO.fetch_from_file(test_file);

		return result.then(function(parsed_rlt){
			var $ = parsed_rlt.selector;
			var validation_results = SEO.validate(rules, $);

			// _.each(validation_results, function(rrr){ //debug
			// 	if(rrr.report !== undefined){
			// 		console.info('report gets:', rrr.report);
			// 	}
			// });
			
			expect(validation_results).to.have.property('count');
			expect(validation_results.count).to.be.equal(rules.length);
		});		
	});//eo test-case 3

	it('SEO.fetch_url():: should be able to read from the URL specified and parse the response', function() {//test-case 4
		var url    = 'https://www.lian-car.com/';
		var result = SEO.fetch_url(url);

		return result.then(function(parsed_rlt){
			var $ = parsed_rlt.selector;
			
			expect($('h1').length).to.be.equal(1);
		});		
	});//eo test-case 4

	it('SEO.fetch():: should be able to read via the FileReadableStream provided', function() {//test-case 5
		var test_file  = __dirname + '/fixtures/test.html';
		var readStream = fs.createReadStream(test_file);
		var result     = SEO.fetch(readStream);

		return result.then(function(parsed_rlt){
			var $ = parsed_rlt.selector;
			
			expect($('h1').length).to.be.equal(1);
		});		
	});//eo test-case 5

	it('SEO.fetch():: should be able tell if FileReadableStream provided is no good', function() {//test-case 6
		var test_file  = __dirname + '/fixtures/test.nonono.html';
		var readStream = fs.createReadStream(test_file);
		var result     = SEO.fetch(readStream);

		return result.catch(function(error){
			expect(error).to.have.property('err');
		});		
	});//eo test-case 6

	it('SEO.push():: should be able to work if FileWritableStream provided', function() {//test-case 7
		var test_file   = __dirname + '/fixtures/test.output.txt';
		var writeStream = fs.createWriteStream(test_file);
		var test_file   = __dirname + '/fixtures/test.html';
		var result      = SEO.fetch_from_file(test_file);

		return result.then(function(parsed_rlt){
			var $ = parsed_rlt.selector;
			var validation_results = SEO.validate(rules, $);
			var rlt = SEO.push(writeStream, validation_results);

			expect(rlt).to.be.equal(true);
		});		
	});//eo test-case 7

	it('SEO.push_file():: should be able to work if file name provided', function() {//test-case 8
		var test_writing_file = __dirname + '/fixtures/test.output.2.txt';
		var test_file         = __dirname + '/fixtures/test.html';
		var result            = SEO.fetch_from_file(test_file);

		return result.then(function(parsed_rlt){
			var $ = parsed_rlt.selector;
			var validation_results = SEO.validate(rules, $);
			var rlt = SEO.push_file(test_writing_file, validation_results);

			expect(rlt).to.be.equal(true);
		});		
	});//eo test-case 8

	it('SEO.push_console():: should be able to work with standard console', function() {//test-case 9
		var test_file = __dirname + '/fixtures/test.html';
		var result    = SEO.fetch_from_file(test_file);

		return result.then(function(parsed_rlt){
			var $ = parsed_rlt.selector;
			var validation_results = SEO.validate(rules, $);
			var rlt = SEO.push_console(validation_results);

			expect(rlt).to.be.equal(true);
		});		
	});//eo test-case 9

	it('SEO.push_console():: should be able to work with WritableStream provided', function() {//test-case 10
		var test_file = __dirname + '/fixtures/test.html';
		var result    = SEO.fetch_from_file(test_file);
		var writer    = new ms.WritableStream();

		return result.then(function(parsed_rlt){
			var $ = parsed_rlt.selector;
			var validation_results = SEO.validate(rules, $);
			
			var rlt = SEO.push_console(validation_results, "\n", writer);
			writer.end();

			expect(rlt).to.be.equal(true);
		});		
	});//eo test-case 10

  });

});