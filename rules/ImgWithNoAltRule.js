'use strict'

const _    = require('lodash');
const Rule = require('./Rule');

const ImgWithNoAltRule = _.extend(new Rule(), {
	name: 'ImgWithNoAltRule',

	validate: function($){//validate if there are any <img> has not attribute "alt"
		var imgs_have_no_alts = $('img:not([alt])');

		this.rlts = {
			pass:   imgs_have_no_alts.length ? false : true,
			rlts:   imgs_have_no_alts,
			report: this.report(imgs_have_no_alts)//TODO: fefactor
		}

		return this.rlts;
	},//eo validate

	report: function(rlts){
		var template = _.template('There <%= being %> <%= amount %> <IMG> tag<%= postfix %> without "alt" attribute<%= postfix %>.');
		var being    = rlts.length > 1 ? 'are' : 'is';
		var postfix  = rlts.length > 1 ? 's' : '';
		var amount   = rlts.length;

		if(amount === 0){
			return 'There is no <IMG> tag in this HTML document without "alt" attribute.';
		}

		return template({amount, being, postfix});
	}//eo report
});

module.exports = ImgWithNoAltRule;