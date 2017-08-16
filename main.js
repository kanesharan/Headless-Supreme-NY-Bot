const request = require('request');
const http = require('http');
const chalk = require('chalk');
const config = require('./config.json');

const calls = require('./jsonCalls.js');
const tools = require('./tools.js');
const demoStock = require('./product_list.json');
const checkout = require('./checkout.js')

var keywords = config['items']['keywords'];
var types = config['items']['types'];

function main(){
	tools.parseStockList(
	demoStock,keywords,types,
		function(out){
			var ids = [];
			for (var key in out) {ids.push(out[key]);}
			calls.testData(ids, function(data){
				tools.getProductInfo(out, data, function(productInfo){
					console.log(productInfo);
					console.log(out);
					if(config['preferences']['multiCart']){
						console.log("MultiCart Checkout...");
						checkout.multiCheckout(productInfo,out, function(update){
							
						});
					}else{
						console.log("Single Cart Checkout...");

					}
					
				});
			});
		}
	);


	
}
function getCaptchas(){

}
main();


/*
	stock.getStock(function(obj){
		console.log(obj);
	});

	*/