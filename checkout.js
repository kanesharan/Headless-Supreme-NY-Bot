const config = require('./config.json');
const tools = require('./tools.js');
const calls = require('./jsonCalls.js');

var request = require('request');
var http = require('http');

module.exports = {
	singleCheckout: function(){

	},
	multiCheckout: function(productInfo, origInfo, fn){
		var urls = [];
		var payloads = [];
		var i = 0;
		for( var key in origInfo){
			urls.push('http://www.supremenewyork.com/shop/' + origInfo[key] + '/add.json');

			payloads.push({'style':parseInt(productInfo[i][0]), 'size':parseInt(productInfo[i][1]), 'qty':'1' });

			i++;
		}
		console.log(urls);  
		console.log(payloads);  
		fn("out");
	}

}
function atc(atcUrl,atcPayload){
	var options = {
        url: atcUrl,
        method: 'POST',
        json: true,
        body: atcPayload,
        headers: {
            'Host':              'www.supremenewyork.com',
            'Accept':            'application/json',
            'Proxy-Connection':  'keep-alive',
            'X-Requested-With':  'XMLHttpRequest',
            'Accept-Encoding':   'gzip, deflate',
            'Accept-Language':   'en-us',
            'Content-Type':      'application/x-www-form-urlencoded',
            'Origin':            'http://www.supremenewyork.com',
            'Connection':        'keep-alive',
            'User-Agent':        'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13G34',
            'Referer':           'http://www.supremenewyork.com/mobile',

        }

    }
    request(options, function(error, response, body) {
        if (error != null) {
            console.log('error:', error);
        }
        if (response.statusCode != 200) {
			console.log('statusCode:', response && response.statusCode);
		} else {
            console.log(response.headers);
        }
    });
}
var checkoutPayload = {
	
}

function checkout(session){

}