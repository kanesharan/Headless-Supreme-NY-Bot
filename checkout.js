const config = require('./config.json');
const tools = require('./tools.js');
const calls = require('./jsonCalls.js');

var request = require('request');
var http = require('http');
var token = require('./main.js');

const debug = true;
const reset = "\x1b[0m";

module.exports = {
	checkout: function(token,color,accountInfo,itemInfo,productName, id, fn){
        if(debug){console.log(color + productName + " - " + id + reset);}
        var dataUrl = 'http://www.supremenewyork.com/shop/' + id + '.json';
        var atcURL = 'http://www.supremenewyork.com/shop/' + id + '/add.json';
        var payload;
        getItemData(dataUrl, function(body){
            var out = getStyle(body,itemInfo,color);
            console.log("NEW: " + out.toString());
            if( out[0] !== -1 && out[1] !== -1){
                payload = {"style": out[0], "size": out[1], "qty": 1};
                atc(atcURL,payload, function(session){
                    var temp = session['set-cookie'][3];
                    var supSession = temp.substring(0,temp.indexOf(';'));
                    console.log(supSession);
                    console.log();
                    console.log("Session is maintained....");
                    setTimeout(function(){
                        realCheckout(color,supSession, token, out[1], accountInfo );
                    }, config['preferences']['checkoutTimer']);
                });
            }

        });
        

		console.log(color + "------------------------------------" + reset);
        fn(id);
	}

}
function realCheckout(color, session, selectedCaptchaToken, cookie, accountInfo){
    var checkoutPayload = {
        "store_credit_id":          "",   
        "from_mobile":              "1",
        "cookie-sub":               "%7B%22" + cookie + "%22%3A1%7D",
        "same_as_billing_address":  "1",
        "order[billing_name]":      accountInfo["name"],
        "order[email]":             accountInfo["email"],
        "order[tel]":               accountInfo["phone"],
        "order[billing_address]":   accountInfo["address1"],
        "order[billing_address_2]": accountInfo["address2"],
        "order[billing_zip]":       accountInfo["zip"],
        "order[billing_city]":      accountInfo["city"],
        "order[billing_state]":     accountInfo["state"],
        "order[billing_country]":   accountInfo["country"],
        "credit_card[cnb]":         accountInfo["card_number"],
        "credit_card[month]":       accountInfo["card_month"],
        "credit_card[year]":        accountInfo["card_year"],
        "credit_card[vval]":        accountInfo["cvv"],
        "order[terms]":             "0",
        "order[terms]":             "1",
        "g-recaptcha-response":     selectedCaptchaToken, 
        "is_from_ios_native":       "1"
    };
    var options = {
        url: 'https://www.supremenewyork.com/checkout.json',
        method: 'POST',
        json: true,
        body: JSON.stringify(checkoutPayload),
        headers: {
            'Host':              'www.supremenewyork.com',
            'Accept':            'application/json',
            'Proxy-Connection':  'keep-alive',
            'X-Requested-With':  'XMLHttpRequest',
            'Accept-Encoding':   'gzip, deflate',
            'Accept-Language':   'en-us',
            'Content-Type':      'application/x-www-form-urlencoded',
            'Cookie':             session,
            'Origin':            'http://www.supremenewyork.com',
            'Connection':        'keep-alive',
            'User-Agent':        'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13G34',
            'Referer':           'http://www.supremenewyork.com/mobile'
        }
    };
    request(options, function(error, response, body) {
        if (error != null) {
            console.log(color + 'error:', error + reset);
        }
        if (response.statusCode != 200) {
            console.log(color + 'statusCode:', response && response.statusCode + reset);
            console.log(error);
            console.log(body);
        } else {
            console.log(color + "[!] Sucessfully Checkout!!!!!" + reset);
            console.log(body);
        }
    });

}
function getStyle(body,itemInfo,color){
    var colorID;
    var sizeID;
    var ifFound = false;
    for(var key in body['styles']){
        var color = body['styles'][key]['name'].toLowerCase();
        //console.log(itemInfo['color'].trim().toLowerCase())
        if(color.indexOf(itemInfo['color'].trim().toLowerCase()) != -1 || itemInfo['color'] == ""){
            if(itemInfo['color'] == ""){
                colorID = body['styles'][0]['id'];
            }else{
                if(debug){console.log("Found Color: " + color + " - " + body['styles'][key]['id']);}
                colorID = body['styles'][key]['id'];
            }
            if(itemInfo['size'] == -1){
                sizeID = body['styles'][key]['sizes'][0]['id'];
                if(itemInfo['color'] == ""){
                    sizeID = body['styles'][0]['sizes'][0]['id'];
                }
            }
            else{
                if(debug){console.log("Desired Size: " + itemInfo['size']);}
                if(body['styles'][key]['sizes'][itemInfo['size']]['stock_level'] > 0){
                    if(debug){console.log("Found size: " + body['styles'][key]['sizes'][itemInfo['size']]['name']);}
                    sizeID = body['styles'][key]['sizes'][itemInfo['size']]['id'];
                }else{
                    if(config['preferences']['chooseNextSize']){
                        if(debug){console.log("Could not get Desired Color... Getting Next Color");}
                        for(var temp = body['styles'][key]['sizes'].length-1; temp >= 0; temp--){
                            if(body['styles'][key]['sizes'][temp]['stock_level'] > 0){
                                sizeID = body['styles'][key]['sizes'][temp]['id'];
                                if(debug){console.log("Found Largest Size: " + body['styles'][key]['sizes'][temp]['name']);}
                                break;
                            }
                        }
                    }
                    if(!sizeID){
                        if(debug){console.log("All Sizes are Sold Out...");}
                    }
                }
            }
            if(colorID && sizeID){
                break;
            }

        }
    }
    if(colorID && sizeID){
        return [colorID,sizeID];
    }else{
        return [-1,-1];
    }

}
function getItemData(dataURL, callback){
    var options = {
        url: dataURL,
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
}
function atc(atcUrl,atcPayload, fn){
    var cookieJar;
	var options = {
        url: atcUrl,
        method: 'POST',
        json: true,
        body: JSON.stringify(atcPayload),
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

    };
    request(options, function(error, response, body) {
        if (error != null) {
            console.log('error:', error);
        }
        if (response.statusCode != 200) {
			console.log('statusCode:', response && response.statusCode);
		} else {
            console.log("Sucessfully Added to Cart... Checking out");
            fn(response.headers);
        }
    });
}











