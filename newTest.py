import os, sys, json, time, requests, urllib, random, threading, ConfigParser

mobileStockPollSession = requests.session()
headers = {
    'Host':              'www.supremenewyork.com',
    'Accept-Encoding':   'gzip, deflate',
    'Connection':        'keep-alive',
    'Proxy-Connection':  'keep-alive',
    'Accept':            'application/json',
    'User-Agent':        'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13G34',
    'Referer':           'http://www.supremenewyork.com/mobile',
    'Accept-Language':   'en-us',
    'X-Requested-With':  'XMLHttpRequest'
}

mobileStockJson = mobileStockPollSession.get('http://www.supremenewyork.com/mobile_stock.json', headers=headers).json()
with open('output.json', 'w') as the_file:
    the_file.write(str(mobileStockJson))

print mobileStockJson