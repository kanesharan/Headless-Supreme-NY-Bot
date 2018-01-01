const request = require('request');
const http = require('http');
const chalk = require('chalk');
const payloads = require('./payloads.json');
const time = require('time');

const calls = require('./jsonCalls.js');
const tools = require('./tools.js');
const checkout = require('./checkout.js');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const parse = require('url-parse');
const colors = require('colors');
const moment = require('moment');
var fs = require('fs');
const config = require('./config.js');
var server = require('./server.js');
const userConfig = require('./config.json');


function main(){
	calls.getStock(function(stockData){
		var i = 0;
		for(var payKey in payloads){
			var color = getColor(i);
			var found = tools.getOneProduct(stockData,payloads[payKey]["items"]);
			if(found[0] !== -1){
				var aToken = server.getAToken();
				checkout.checkout(aToken['token'],color,payloads[payKey]["account"],payloads[payKey]["items"],found[1], found[0], function(data){

				});
			}
			i++;
		}
	});

}
function tempMain(){
	for(var payKey in payloads){
		var tempToken = server.getAToken();
		console.log("Token: ", tempToken['token']);
	}
}
function getColor(i){
	var color = ["\x1b[31m","\x1b[32m","\x1b[33m","\x1b[34m","\x1b[35m","\x1b[36m","\x1b[37m"];
	if(i < color.length-1){
		return color[i];
	}else{
		var temp = Math.floor(Math.random() * 6);
		return color[temp];
	}

}
function findTimeLeft(){
	var now = new time.Date();
	now.setTimezone("EST");
	console.log(now.toString());
}
function timedStart(date, autostart){

    if(autostart){
        var countDownDate = new Date(date).getTime();
        var x = setInterval(function() {
            var now = new Date().getTime();
            var distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            process.stdout.write("Time Left: " + days + "d " + hours + "h "
            + minutes + "m " + seconds + "s \r");
            if (distance <= 0) {
                clearInterval(x);
                console.log("starting now...".green);
                //start main here
                main();
            }
        }, 1000);
    }else{
     	console.log("starting now...No autostart");
     	//start main here
     	main();
    }

}
server.startServer();
timedStart(userConfig['startBot']['startTime'], userConfig['startBot']['autoStart']);

//main();
//findTimeLeft();






