const request = require('request');
const http = require('http');
const chalk = require('chalk');
const payloads = require('./payloads.json');
const time = require('time');

const calls = require('./jsonCalls.js');
const tools = require('./tools.js');
//const demoStock = require('./newStockList.json');
const checkout = require('./checkout.js');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const parse = require('url-parse');
const colors = require('colors');
const moment = require('moment');
var fs = require('fs');
const config = require('./config');
var server = require('./server.js');


function main(){
	calls.getStock(function(stockData){
		var i = 0;
		for(var payKey in payloads){
			var color = getColor(i);
			var found = tools.getOneProduct(stockData,payloads[payKey]["items"]);
			if(found[0] !== -1){
				checkout.checkout(server.getAToken(),color,payloads[payKey]["account"],payloads[payKey]["items"],found[1], found[0], function(data){

				});
			}
			i++;
		}
	});
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

//server.startServer();
main();
//findTimeLeft();






