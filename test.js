var request = require('request');
var http = require('http');

	function req(callback){
        var lastCookie = {_supreme_sess: ""};

        for (i = 0; i < 5; i++) {
            var options = {
                url: 'http://www.google.com/',
                headers: {
					'Cookie': lastCookie._supreme_sess,
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
                    'Referer':           'http://www.supremenewyork.com/mobile'
                }
            };
            request(options);
            lastCookie = {_supreme_sess: res.headers}; 
        }


    }
function atc(callback){
	
}


req(function(){
	console.log("Test");
});