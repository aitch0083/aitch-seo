'use strict'

const _    = require('lodash');
const Rule = require('./Rule');

const _tell_title = function(rlts){
	var template = _.template('This HTML does <%=being%>have <TITLE> tag.');
	var being    = rlts.length === 0 ? 'not' : '';

	return template({being});
};

const _tell_meta_descriptions = function(rlts){
	var template = _.template('This HTML does <%=being%>have <META> tag with "name=descriptions".');
	var being    = rlts.length === 0 ? 'not' : '';

	return template({being});
};

const _tell_meta_keywords = function(rlts){
	var template = _.template('This HTML does <%=being%>have <META> tag with "name=keywords".');
	var being    = rlts.length === 0 ? 'not' : '';

	return template({being});
};

const HeadRule = _.extend(new Rule(), {
	name: 'HeadRule',
	validate: function($){//validate <head>
		var $head                   = $('head');
		var title                   = $head.find('title');
		var metas_with_descriptions = $head.find('meta[name=descriptions]');
		var metas_with_keywords     = $head.find('meta[name=keywords]');

		var composite_rlt = [
			title.length,
			metas_with_descriptions.length,
			metas_with_keywords.length
		];

		return {
			pass: (title.length + metas_with_descriptions.length + metas_with_keywords.length) === 0 ? false : true,
			rlts: composite_rlt,
			report: this.report(composite_rlt)
		}
	},//eo validate

	report: function(rlts){
		return [
			_tell_title(rlts[0]),
			_tell_meta_descriptions(rlts[1]),
			_tell_meta_keywords(rlts[2])
		];
	}//eo report
});

module.exports = HeadRule;