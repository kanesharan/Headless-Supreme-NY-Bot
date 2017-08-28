const async = require('async');
const config = require('./config.json');
const tools = require('./tools.js');

var debug = false;

module.exports = {
    parseStockList: function(jsonStockList, keywords, types, fn) {
        var EvaluatedIDs = {};
        for (var i = 0; i < keywords.length; i++) {
            var matchedName = [];
            for (var key in jsonStockList['products_and_categories']) {
                if (debug) {
                    console.log("Round 2.0: " + key);
                }
                if (key != "new") {
                    for (var key2 in jsonStockList['products_and_categories'][key]) {
                        var curName = jsonStockList['products_and_categories'][key][key2]['name'].toLowerCase();
                        curName = curName.replace(/[^\x00-\x7F]/g, "");
                        idZ = jsonStockList['products_and_categories'][key][key2]['id']
                        if (matchKeywords(curName, keywords[i])) {
                            if (debug) {
                                console.log("Found: " + curName);
                            }
                            matchedName.push([curName, key, idZ]);
                        }
                    }
                }
            }
            if (matchedName.length > 1) {
                if (debug) {
                    console.log("Found " + matchedName.length + " digging deeper...");
                }
                evalNames = [];
                for (var z1 = 0; z1 < matchedName.length; z1++) {
                    if (matchedName[z1][1] == type[i]) {
                        if (debug) {
                            console.log("Found Matching Type");
                        }
                        evalNames.push(matchedName[z1]);
                    }
                }
                if (evalNames.length == 0) {
                    evalNames.push(matchedName[0]);
                }
                EvaluatedIDs[evalNames[0][0]] = evalNames[0][2];
                if (debug) {
                    console.log(EvaluatedIDs);
                }
            }
            if (matchedName.length == 1) {
                if (debug) {
                    console.log("Found 1 moving on...");
                }
                EvaluatedIDs[matchedName[0][0]] = matchedName[0][2];
                if (debug) {
                    console.log(EvaluatedIDs);
                }
            }
            if (matchedName.length == 0) {
                //EvaluatedIDs['N/A'] = -1;
                if (debug) {
                    console.log("None Found... Exiting");
                }
            }
        }
        EvaluatedDict = EvaluatedIDs;
        fn(EvaluatedDict);
    },
    getOneProduct: function(stockList,item){
        var found = false;

        for(var key in stockList['products_and_categories'][item['type']]){
            var name = stockList['products_and_categories'][item['type']][key]['name'].toLowerCase();
                
            //console.log(name);
            var keywords = item['keyword'].split(" ");
            //console.log("\t" + keywords);
            var subFound = true;
            for(var i = 0; i < keywords.length; i++){
                if(name.indexOf(keywords[i].toLowerCase()) == -1){
                    subFound = false;
                }
            }
            if(subFound){
                if(debug){console.log( name + " : " + stockList['products_and_categories'][item['type']][key]['id']);}
                return [stockList['products_and_categories'][item['type']][key]['id'],name ];
            }

        }
        return [-1,""];
    },
    getProductInfo: function(origData,data, fn){
        var productInfo = [];

        for(var i = 0; i < data.length; i++){
            var colors =[];
            for(var j = 0; j < data[i]['styles'].length; j++){colors.push(data[i]['styles'][j]['name']);}
            //console.log(colors);
            var chosenStyle = "";
            var colorPos = matchColor(i,origData,colors);
            var styleID = -1;
            switch(colorPos){
                case -2:
                    styleID = 0;
                    if(debug){console.log("no Color option: " + styleID);}
                    break;
                case -3:
                    if(debug){console.log("no origData: " +styleID );}
                    break;
                case -1:
                    if(debug){console.log("no color found...");}
                    if(config['preferences']['chooseNextColor']){
                        if(debug){console.log("Color: " + data[i]['styles'][0]['name'] + " ID: " + data[i]['styles'][0]['id']);}
                        styleID = data[i]['styles'][0]['id'];
                        chosenStyle = data[i]['styles'][0]['name'];
                    }
                    break;
                default: 
                    if(debug){console.log("Color: " + data[i]['styles'][colorPos]['name'] + " ID: " + data[i]['styles'][colorPos]['id']);}
                    chosenStyle = data[i]['styles'][colorPos]['name'];
                    styleID = data[i]['styles'][colorPos]['id'];

            }
            var size = config['items']['sizes'][i];
            if(debug){ console.log("desiredSize: " + size);}
            sizeID = -1;
            var chosenSize = "";
            if(size > -1 ){
                try{
                    if(data[i]['styles'][i]['sizes'][size]['stock_level'] > 0){
                        sizeID = data[i]['styles'][i]['sizes'][size]['id'];
                        if(debug){console.log(data[i]['styles'][i]['sizes'][size]['id']);}
                        chosenSize = data[i]['styles'][i]['sizes'][size]['name'];
                    }else{
                        if(config['preferences']['chooseNextSize']){
                            for(var v = data[i]['styles'][i]['sizes'].length-1; v >= 0; v--){
                                if(data[i]['styles'][i]['sizes'][v]['stock_level'] > 0){
                                    sizeID = data[i]['styles'][i]['sizes'][v]['id'];
                                    chosenSize = data[i]['styles'][i]['sizes'][v]['name'];
                                    break;
                                }
                            }
                        }
                    }
                    //console.log(data[i]['styles'][i]['sizes']);
                }catch(e){console.log("Error_Choosing_Size: " + e);}
            }
            productInfo.push([styleID,sizeID,chosenStyle,chosenSize]);
            if(debug){console.log("--------------------");}
        }	
        fn(productInfo);
    }


}
function matchColor(i, origData, colors){
    var keyData = Object.keys(origData)
    if(keyData[i].toString().indexOf("N/A") == -1){
        var desiredColor = config['items']['colors'][i].toLowerCase();
        for(var i2 = 0; i2 < colors.length; i2++){
            if(colors[i2].toLowerCase().indexOf(desiredColor) !== -1 && desiredColor !== ""){
                return i2;
            }
        }
        if( desiredColor == ""){
            return -2;
        }
    }else{
        return -3;
    }
    return -1;
    
 
    
}

function matchKeywords(curName, keywords) {
    var keyList = keywords.split(" ");
    var ifFound = true;
    for (var i = 0; i < keyList.length; i++) {
        curName = curName.replace(/[^\x00-\x7F]/g, "").toLowerCase();
        if (!curName.includes(keyList[i].toLowerCase())) {
            ifFound = false;
        }
    }
    return ifFound
}


