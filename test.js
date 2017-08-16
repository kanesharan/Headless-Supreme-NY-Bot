var request = require('request');
var http = require('http');

function atc(atcPayload){
    var options = {
        url: 'http://httpbin.org/post',
        method: 'POST',
        json: true,
        body: atcPayload,

    }
    request(options, function(error, response, body) {
        if (error != null) {
            console.log('error:', error);
        }
        if (response.statusCode != 200) {
            console.log('statusCode:', response && response.statusCode);
        } else {
            var cookieJar = request.jar();
            console.log(response.headers);
            console.log("Cookie: ",cookieJar);
            //checkout(response.headers, body['json']);
        }
    });
}
function checkout(session,payload){
    var options = {
        url: 'http://httpbin.org/post',
        method: 'POST',
        json: true,
        body: payload,
        headers: session

    }
    console.log("--------------------------");
    console.log(session);
    console.log("############");
    console.log(payload);
    
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


var testPayload = { 'style': '16249', 'size': '43386', 'qty': '1' };
atc(testPayload);