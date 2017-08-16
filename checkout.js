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

function checkout(session, selectedCaptchaToken, cookie){
    var checkoutPayload = {
        'store_credit_id':          '',   
        'from_mobile':              '1',
        'cookie-sub':               '%7B%22' + cookie + '%22%3A1%7D',
        'same_as_billing_address':  '1',
        'order[billing_name]':      config['account']['name'],
        'order[email]':             config['account']['email'],
        'order[tel]':               config['account']['phone'],
        'order[billing_address]':   config['account']['address1'],
        'order[billing_address_2]': config['account']['address2'],
        'order[billing_zip]':       config['account']['zip'],
        'order[billing_city]':      config['account']['city'],
        'order[billing_state]':     config['account']['state'],
        'order[billing_country]':   config['account']['country'],
        'store_address':            '1',
        'credit_card[type]':        config['account']['card_type'],
        'credit_card[cnb]':         config['account']['card_number'],
        'credit_card[month]':       config['account']['card_month'],
        'credit_card[year]':        config['account']['card_year'],
        'credit_card[vval]':        config['account']['cvv'],
        'order[terms]':             '0',
        'order[terms]':             '1',
        'g-recaptcha-response':     selectedCaptchaToken, 
        'is_from_ios_native':       '1'
    }

}









