var request = require('request');
var http = require('http');

function atc(callback){
    var options = {
            url: 'http://www.supremenewyork.com/mobile_stock.json',
            headers: {
                'Host': 'www.supremenewyork.com',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
                'Proxy-Connection': 'keep-alive',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13G34',
                'Referer': 'http://www.supremenewyork.com/mobile',
                'Accept-Language': 'en-us',
                'X-Requested-With': 'XMLHttpRequest'
            }

        }
        request(options, function(error, response, body) {
            if (error != null) {
                console.log('error:', error);
            }
            if (response.statusCode != 200) {
                console.log('statusCode:', response && response.statusCode);
            } else {
                callback(JSON.parse(body));
            }
        });
}

atc(function(data){
    console.log(data);
});