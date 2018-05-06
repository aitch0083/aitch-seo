# aitch-seo

SEO toolkit

This module supports:
1. Fetching the HTML document from the lcoation specified by URL or ReadableStream.
2. Validating the fetched document with the customised rules.
3. Exporting the evaluation reuslts with the WritableStream provided.

This module use `cheerio` to construct the DOM for you.

##Install
```
npm install --save-dev aitch-seo
```

##Test
Make sure you have installed `mocha`:

```
$i_am_console> npm install --save-dev mocha
#or you just want to party:
$i_am_console> npm i -g mocha
```

Then you can run the test:

```
$i_am_console> npm run test
```

##Usage:

Fetching by assigning the `URL`:

```
var url    = 'https://www.lian-car.com/';
var result = SEO.fetch_url(url);

result.then(function(parsed_rlt){
	var $ = parsed_rlt.selector;
	//select the <IMG> tags with class name: '.i_am_special'
	var imgs = $('img.i_am_special');
});
```

Fetching by assigning the file name:

```
var test_file = '/somewhere_out_there/random_html_document.html';
var result    = SEO.fetch_from_file(test_file);
result.then(function(parsed_rlt){
	var $ = parsed_rlt.selector;
	//select the <IMG> tags with class name: '.i_am_special'
	var imgs = $('img.i_am_special');
});
```

Fetching and validating:
 
```
//Import your rules
const AWithNoRelRule   = require('./AWithNoRelRule');
const ImgWithNoAltRule = require('./ImgWithNoAltRule');
const HeadRule         = require('./HeadRule');

const rules = [
	ImgWithNoAltRule,
	AWithNoRelRule,
	HeadRule,
];

var test_file = '/somewhere_out_there/random_html_document.html';
var result    = SEO.fetch_from_file(test_file);

result.then(function(parsed_rlt){
	var $ = parsed_rlt.selector;
	var validation_results = SEO.validate(rules, $);

	_.each(validation_results, function(rrr){ //watch out for the report 
	 	if(rrr.report !== undefined){
	 		console.info('report gets:', rrr.report);
	 	}
	});
});

#you will get the following message if succeed:
#There are 2 <IMG> tags without "alt" attributes.
#There are 11 <A> tags without "rel" attributes.
#This HTML does have <TITLE> tag.
```

Wrting to a place you like:

```
var test_writing_file = '/somewhere_awesome/output.txt';
var test_file         = '/somewhere_out_there/random_html_document.html';
var result            = SEO.fetch_from_file(test_file);

result.then(function(parsed_rlt){
	var $ = parsed_rlt.selector;
	
	var validation_results = SEO.validate(rules, $);
	var rlt = SEO.push_file(test_writing_file, validation_results);

	if(rlt){
		console.info('We did it!!');
	} else {
		console.error('Oh no!');
	}
});
```

Wrting to any WritableStream:

```
const ms = require('memory-streams');//fancy~~~

var test_file = '/somewhere_out_there/random_html_document.html';
var result    = SEO.fetch_from_file(test_file);
var writer    = new ms.WritableStream();

result.then(function(parsed_rlt){
	var $ = parsed_rlt.selector;
	var validation_results = SEO.validate(rules, $);
	
	var rlt = SEO.push(writer, validation_results);
	//writer.end(); //push() calls end() for you

	if(rlt){
		console.info('We did it!!');
	} else {
		console.error('Oh no!');
	}
});		
```

More usages, please refer to `test/test.js`.

##Customise your own Rule

Since all the rules derive from `rules/Rule`, you can use any rule in the `rules` folder as the template:

```
#file name: rules/MyOwnRule.js
'use strict'

const _    = require('lodash');
const Rule = require('./Rule');

const MyOwnRule = _.extend(new Rule(), {
	name: 'MyOwnRule',
	validate: function($){//must have this one, otherewise there will be Error thrown :( 
		var a_tags = $('a');

		return {
			pass: a_tags.length > 0 ? true : false,
			rlts: a_tags,
			report: this.report(a_tags)
		}
	},//eo validate

	report: function(rlts){//This is where you define your own styled output
		var template = _.template('There <%= being %> <%= amount %> <A> tag<%= postfix %>.');
		var being    = rlts.length > 1 ? 'are' : 'is';
		var postfix  = rlts.length > 1 ? 's' : '';
		var amount   = rlts.length;

		if(amount === 0){
			return 'There is no <A> tag in this HTML document';
		}

		return template({amount, being, postfix});
	}//eo report
});

module.exports = MyOwnRule;

#Import this rule
var MR    = require('/path/to/rules/MyOwnRule');
var rules = [MR];

var test_writing_file = '/somewhere_awesome/output.txt';
var test_file         = '/somewhere_out_there/random_html_document.html';
var result            = SEO.fetch_from_file(test_file);

result.then(function(parsed_rlt){
	var $ = parsed_rlt.selector;
	
	var validation_results = SEO.validate(rules, $);//validate with MyOwnRule!
	var rlt = SEO.push_file(test_writing_file, validation_results);

	if(rlt){
		console.info('We did it!!');
	} else {
		console.error('Oh no!');
	}
});
```

You can change the order of the rules by defining your own `rules` array:

```
const AWithNoRelRule   = require('./AWithNoRelRule');
const ImgWithNoAltRule = require('./ImgWithNoAltRule');
const HeadRule         = require('./HeadRule');
const TooStrongRule    = require('./TooStrongRule');
const TooManyH1sRule   = require('./TooManyH1sRule');

var rules = [
	ImgWithNoAltRule, //1
	AWithNoRelRule, //2
	TooStrongRule,//3
	TooManyH1sRule //4
	HeadRule, //5
];
```

Have fun~~