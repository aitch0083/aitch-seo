'use strict'

const AWithNoRelRule   = require('./AWithNoRelRule');
const ImgWithNoAltRule = require('./ImgWithNoAltRule');
const HeadRule         = require('./HeadRule');
const TooStrongRule    = require('./TooStrongRule');
const TooManyH1sRule   = require('./TooManyH1sRule');

module.exports = [
	ImgWithNoAltRule,
	AWithNoRelRule,
	HeadRule,
	TooStrongRule,
	TooManyH1sRule
];