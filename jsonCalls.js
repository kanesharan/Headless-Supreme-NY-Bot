var request = require('request');
var http = require('http');
//const demoStock = require('./product_list.json');

module.exports = {
    getStock: function(callback) {
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

        };
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
    },
    getItemData: function(ids, callback) {
        var data = [];
        var urls = [];
        for (var z = 0; z < ids.length; z++){
            urls.push('http://www.supremenewyork.com/shop/'+ids[z]+'.json');
        }
        i = 0;
        async.times(urls.length, function(i, fn) {
            var options = {
                url: urls[i],
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
            request(options, function(error, response, html) {
                fn(error, JSON.parse(html));
                i++;
            });
        },function(err, results) {
            data.push(results);
        });
        callback(data);
    },
    addToCart: function(productInfo, out, callback){
        var lastCookie = {_supreme_sess: ""};
        var urls = [];
        for (var key in out){
            urls.push('http://www.supremenewyork.com/shop/'+parseInt(out[key])+'/add.json');
        }
        for (i = 0; i < productInfo.length; i++) {
            var options = {
                url: urls[i],
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
            request(options, function(error, response, html) {
                
                
            });
            lastCookie = {_supreme_sess: res.headers}; //just extract the _supreme_sess cookie
        }


    },

    testData: function(ids, callback){
        var product = require('./product.json');
        var out = [];
        for (var z = 0; z < ids.length; z++){
            out.push(product);
        }
        callback(out);
    }
}