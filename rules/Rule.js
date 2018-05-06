'use strict'

const Rule = function() {
	this.name = 'Blank Rule ~ Orz';
	this.rlts = null;
};//eo Rule

Rule.prototype.validate = function($){
	return {
		pass: true,
		rlts: []
	};
};

Rule.prototype.report = function(result){
	if(result){
		return 'There is something going on~~';
	} else {
		return 'Lazy~~~~ Come back later :)';
	}
};

module.exports = Rule;