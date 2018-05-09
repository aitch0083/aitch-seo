# :ocean: aitch-seo

## :earth_asia: SEO toolkit
`aitch-seo` helps you with loading the HTML documents and evaluating if the HTML document has follow the rules you specified.

This module supports:
1. Fetching the HTML document from the location specified by URL or `ReadableStream`.
2. Validating the fetched document with the customised rules.
3. Exporting the evaluation results with the `WritableStream` provided, e.g., MemoryStream, FileStream, and Console etc.

This module uses `cheerio` to construct the DOM for you.

## :clipboard: Install
```
npm install --save-dev aitch-seo
```

## :clipboard: Try it out

```js
const AWithNoRelRule   = require('aitch-seo/rules/AWithNoRelRule');
const ImgWithNoAltRule = require('aitch-seo/rules/ImgWithNoAltRule');
const HeadRule         = require('aitch-seo/rules/HeadRule');
const TooStrongRule    = require('aitch-seo/rules/TooStrongRule');
const TooManyH1sRule   = require('aitch-seo/rules/TooManyH1sRule');
const SEO              = require('aitch-seo');

var rules = [
	ImgWithNoAltRule, //1
	AWithNoRelRule, //2
	TooStrongRule,//3
	TooManyH1sRule, //4
	HeadRule, //5
];

var test_writing_file = __dirname + '/output.txt';
var test_file         = 'https://www.lian-car.com';
var result            = SEO.fetch_url(test_file);

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

The content of `output.txt`:

```
There is no <IMG> tag in this HTML document without "alt" attribute.
There is no <A> tag in this HTML document without "rel" attribute.
There is no <STRONG> tag in this HTML document.
There is 1 <H1> tag in thie HTML document
This HTML does have <TITLE> tag.
This HTML does have <META> tag with "name=descriptions".
This HTML does have <META> tag with "name=keywords".
```

## :clipboard: Test the source
Make sure you have installed `mocha`:

```
$> npm install --save-dev mocha
#or you just want to party:
$> npm i -g mocha
```
Goto clone this project from GitHub page:

```
$> git clone git@github.com:aitch0083/aitch-seo.git
$> cd aitch-seo
$> npm install
```

Then you can run the test:

```
$> npm run test
```

## :clipboard: What you get:

```js
//get the HTML document from the location specified by URL
SEO.fetch_url(url){} 

//get the HTML document from the location 
//specified by "target", the file name string
SEO.fetch_from_file(target){} 

//get the HTML document from the location 
//specified by "target", the ReadableStream object
SEO.fetch(stream){}

//output the validation results to the location 
// specified by WritableStream, and join the content with "delimiter" specified
SEO.push(stream, results, delimiter){}

//output the validation results to the location 
//specified by "target", the file name string
SEO.push_file(target, results){}

//you figure it out, it's fun
SEO.push_console(results, delimiter, stream, iwantconsole){}

//validate the HTML content with the rules provided
SEO.validate(rules, selector, configs){}
```

## :clipboard: Usage:

Including the `SEO` object:

```js
var SEO = require('aitch-seo');
```

Fetching by assigning the `URL`:

```js
var SEO    = require('aitch-seo');
var url    = 'https://www.lian-car.com/';
var result = SEO.fetch_url(url);

result.then(function(parsed_rlt){
	var $ = parsed_rlt.selector;
	//select the <IMG> tags with class name: '.i_am_special'
	var imgs = $('img.i_am_special');
});
```

Fetching by assigning the file name:

```js
var SEO       = require('aitch-seo');
var test_file = '/somewhere_out_there/random_html_document.html';
var result    = SEO.fetch_from_file(test_file);
result.then(function(parsed_rlt){
	var $ = parsed_rlt.selector;
	//select the <IMG> tags with class name: '.i_am_special'
	var imgs = $('img.i_am_special');
});
```

Fetching and validating:
 
```js
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

//you will get the following message if succeed:
//There are 2 <IMG> tags without "alt" attributes.
//There are 11 <A> tags without "rel" attributes.
//This HTML does have <TITLE> tag.
```

Wrting to a place you like:

```js
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

```js
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

## :clipboard: Customise your own Rule

Since all the rules derive from `rules/Rule`, you can use any rule in the `rules` folder as the template:

```js
#file name: rules/MyOwnRule.js
'use strict'

const _    = require('lodash');
const Rule = require('aitch-seo/rules/Rule');

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

```js
const AWithNoRelRule   = require('aitch-seo/rules/AWithNoRelRule');
const ImgWithNoAltRule = require('aitch-seo/rules/ImgWithNoAltRule');
const HeadRule         = require('aitch-seo/rules/HeadRule');
const TooStrongRule    = require('aitch-seo/rules/TooStrongRule');
const TooManyH1sRule   = require('aitch-seo/rules/TooManyH1sRule');

var rules = [
	ImgWithNoAltRule, //1
	AWithNoRelRule, //2
	TooStrongRule,//3
	TooManyH1sRule, //4
	HeadRule, //5
];
```

Have fun~~

![super cute bulldog](https://imgur.com/mb3Dtqj.jpg "peace out~")