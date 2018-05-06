'use strict'

const _             = require('lodash');
const Rule          = require('./Rule');
const threshold_def = 1;//TODO: refactor this

const TooManyH1sRule = _.extend(new Rule(), {
	name: 'TooManyH1sRule',
	validate: function($, config){//validate if there are too many <H1>!!!
		var h1s = $('h1');
		var threshold = (config && config.threshold !== undefined) ? config.threshold : threshold_def;

		return {
			pass:   h1s.length > threshold ? false : true,
			rlts:   h1s,
			report: this.report(h1s)
		}
	},//eo validate

	report: function(rlts){
		var template = _.template('There <%= being %> <%= amount %> <H1> tag<%= postfix %> in thie HTML document');
		var being    = rlts.length > 1 ? 'are' : 'is';
		var postfix  = rlts.length > 1 ? 's' : '';
		var amount   = rlts.length;

		if(amount === 0){
			return 'There is no <H1> tag in this HTML document.';
		}

		return template({amount, being, postfix});
	}//eo report
});

module.exports = TooManyH1sRule;