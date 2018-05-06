'use strict'

const _             = require('lodash');
const Rule          = require('./Rule');
const threshold_def = 15;//TODO: refactor this

const TooStrongRule = _.extend(new Rule(), {
	name: 'TooStrongRule',
	validate: function($, config){//validate if the document is too strong!!!
		var strongs = $('strong');
		var threshold = (config && config.threshold !== undefined) ? config.threshold : threshold_def;

		return {
			pass:   strongs.length > threshold ? false : true,
			rlts:   strongs,
			report: this.report(strongs)
		}
	},//eo validate

	report: function(rlts){
		var template = _.template('There <%= being %> <%= amount %> <STRONG> tag<%= postfix %> in thie HTML document');
		var being    = rlts.length > 1 ? 'are' : 'is';
		var postfix  = rlts.length > 1 ? 's' : '';
		var amount   = rlts.length;

		if(amount === 0){
			return 'There is no <STRONG> tag in this HTML document.';
		}

		return template({amount, being, postfix});
	}//eo report
});

module.exports = TooStrongRule;