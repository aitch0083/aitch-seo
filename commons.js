var _            = require('lodash');
var sanitizeHtml = require('sanitize-html');
var cheerio      = require('cheerio');

var utils = {
	test_url: function(str){
		return /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(_.trim(str));
	},
	sanitize: function(data){

		return sanitizeHtml(data, {
			allowedTags: [ 
			  'h1','h2','h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
			  'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'hr', 'br', 'div', 'img',
			  'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe',
			  'span', 'meta'
			],
			allowedAttributes: {
			  a:    [ 'href', 'name', 'target', 'title'],
			  img:  [ 'src', 'style', 'class' ],
			  span: [ 'style'],
			  div:  [ 'style', 'class' ],
			  iframe: ['style', 'src', 'width', 'height', 'frameborder', 'allowfullscreen', 'class'],
			  meta: '*'
			},
			// Lots of these won't come up by default because we don't allow them 
			selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ],
			// URL schemes we permit 
			allowedSchemes: [ 'http', 'https', 'mailto' ],
			allowProtocolRelative: true
		});
	},
	cheerio: function(data){
		
		return cheerio.load(data, {
			normalizeWhitespace: true,
			xmlMode: true
		});
	}
};

module.exports = utils;