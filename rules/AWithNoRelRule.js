'use strict'

const _    = require('lodash');
const Rule = require('./Rule');

const AWithNoRelRule = _.extend(new Rule(), {
	name: 'AWithNoRelRule',
	validate: function($){//validate if there are any <a> has not attribute "rel"
		var as_have_no_rels = $('a:not([rel])');

		return {
			pass: as_have_no_rels.length ? false : true,
			rlts: as_have_no_rels,
			report: this.report(as_have_no_rels)//TODO: fefactor
		}
	},//eo validate

	report: function(rlts){
		var template = _.template('There <%= being %> <%= amount %> <A> tag<%= postfix %> without "rel" attribute<%= postfix %>.');
		var being    = rlts.length > 1 ? 'are' : 'is';
		var postfix  = rlts.length > 1 ? 's' : '';
		var amount   = rlts.length;

		if(amount === 0){
			return 'There is no <A> tag in this HTML document without "rel" attribute.';
		}

		return template({amount, being, postfix});
	}//eo report
});

module.exports = AWithNoRelRule;