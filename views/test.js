atc(atcURL,payload, function(session){
                    console.log();
                    console.log("Session is maintained....");
                    setTimeout(function(){
                        realCheckout(color,session['set-cookie'], token, out[1], accountInfo );
                    }, config['preferences']['checkoutTimer']);
                });


atc(atcURL,payload, function(session){
                    console.log();
                    console.log("Session is maintained....");
                    setTimeout(function(){
                        realCheckout(color,session['set-cookie'], token, out[1], accountInfo );
                    }, config['preferences']['checkoutTimer']);
                });


nightmareATC(accountInfo,token,out[1], atcURL,payload, function(res){

                });