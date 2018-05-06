'use strict'

var utils   = require('./commons');
var request = require('request');
var _       = require('lodash');
var Errors  = require('./errors');
var Promise = require('bluebird');
var Log     = require('log');
var fs      = Promise.promisifyAll(require('fs'));

//Init log
var log_stream = fs.createWriteStream(__dirname + '/logs.log');
var log        = new Log('info', log_stream);


var SEO = {
	fetch_url: function(url){
		var result = {
			success: false,
			message: ''
		};

		if(!utils.test_url(url)){
			result.message = 'Invalid URL: ' + url;
			return result;
		}

		return SEO.fetch(request.put(url));

	},//eo fetch

	fetch_from_file: function(target){

		var result = {
			success: false,
			message: ''
		};

		var deferred = Promise.pending(); 

		log.info('fetch_from_file called with target: ' + target);

		fs.readFileAsync(target, 'utf8').then(function(data){
			
			var $ = utils.cheerio(data);

			result.success  = true;
			result.selector = $;

			deferred.resolve(result);
		}).catch(function(err){
			result.message = 'Invalid target: ' + target;
			result.err     = err;

			log.error(result.message);

			deferred.reject(result);
		});

		return deferred.promise;
	},//eo fetch_from_file()

	fetch: function(stream){
		
		if(!_.isFunction(stream.pipe)){
			throw Errors.NOT_READABLE_STRAEM;
		}

		var result = {
			success: false,
			message: ''
		};

		var deferred = Promise.pending(); 
		var name = stream.constructor && stream.constructor.name ? 'Name: ' + stream.constructor.name : '';

		log.info('fetch called with ReadableStream. ' + name);

		if(_.isFunction(stream.setEncoding)){
			stream.setEncoding('utf8');
		}

		var lumpsum = '';

		stream.on('data', function(chunk){
			lumpsum += chunk;
		}).on('end', function(){

			var $ = utils.cheerio(lumpsum);

			result.success  = true;
			result.selector = $;

			deferred.resolve(result);

		}).on('error', function(error){
			result.message = 'Something went wrong with the ReadableStream';
			result.err     = error;

			log.error(result.message);

			deferred.reject(result);
		});

		return deferred.promise;

	},//eo fetch

	push: function(stream, results, delimiter){

		if(!_.isFunction(stream.write)){
			throw Errors.NOT_WRITABLE_STRAEM;
		}

		if(results.length === 0){
			throw Errors.OUTPUT_RESULT_EMPTY;	
		}

		var name = stream.constructor && stream.constructor.name ? 'Name: ' + stream.constructor.name : '';
		log.info('push called with WritableStream. ' + name);

		delimiter = delimiter || "\n";

		var content = '';
		_.each(results, function(result){
			if(result.report !== undefined && result.report){
				if(_.isArray(result.report)){
					content += result.report.join(delimiter) + delimiter;
				} else {
					content += result.report + delimiter;
				}
			}
		});

		if(_.isFunction(stream.setEncoding)){
			stream.setEncoding('utf8');
		}

		if(stream.write(content)){
			stream.end();
			return true;
		} else {
			throw Errors.WRITE_STREAM_FAILED;
		}

	},//eo push

	push_file: function(target, results){
		var writeStream = fs.createWriteStream(target);
		return SEO.push(writeStream, results);
	},//eo push_file

	push_console: function(results, delimiter, stream, iwantconsole){
		stream = stream || null;
		iwantconsole = iwantconsole || false;

		if(stream && stream.write === undefined){
			throw Errors.NOT_WRITABLE_STRAEM;
		} else {
			stream = process.stdout;
		}

		delimiter = delimiter || "\n";

		var content = delimiter + '-------CONSOLE OUTPUT--------' + delimiter;
		_.each(results, function(result){
			if(result.report !== undefined && result.report){
				if(_.isArray(result.report)){
					content += result.report.join(delimiter) + delimiter;
				} else {
					content += result.report + delimiter;
				}
			}
		});
		content += '-----------------------------' + delimiter;

		if(!iwantconsole){
			if(stream.write(content)){
				return true;
			} else {
				throw Errors.WRITE_STREAM_FAILED;
			}
		} else {
			console.info(content);
			return true;
		}

	},//eo push_console

	validate: function(rules, selector, configs){
		var results = {
			count: 0
		};

		if(!selector || selector.html === undefined){
			throw Errors.INVALID_SELECTOR_OBJ;
		}

		_.each(rules, function(rule){
			if(rule.name === undefined){
				throw Errors.RULE_OBJ_HAS_NO_NAME;
			}
			if(rule.validate === undefined){
				throw Errors.RULE_OBJ_HAS_NO_VALIDATE;
			}

			if(_.isObject(configs)){
				var config = configs[rule.name] || null;
			} else {
				var config = null;
			}

			var rlt = rule.validate(selector, config);

			if(rlt.pass === undefined || rlt.rlts === undefined){
				throw Errors.RULE_OBJ_RETURNS_INVALID_RLT;
			}

			results[rule.name] = rlt;
			results.count++;
		});

		return results;
	},//eo validate
};

module.exports = SEO;