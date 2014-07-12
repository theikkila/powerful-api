/*
* Utilities
* Mainly stolen from https://github.com/Tug/node-pdns/blob/master/lib/util.js
*/

var dateFormat = require('dateformat');

var trim = module.exports.trim = function (str) {
    str = str.replace(/^\s\s*/, '');
    var ws = /\s/;
    var i = str.length;
    while (ws.test(str.charAt(--i)));
    return str.slice(0, i + 1);
}

var checkString = module.exports.checkString = function (obj) {
  return (obj && typeof obj == 'string' && obj.length > 0);
}


var soaSerial = module.exports.soaSerial = function (serial) {
  var currentDate = dateFormat(new Date(), "yyyymmdd");
  if(checkString(serial) && serial.slice(0,8) == currentDate) {
    var inc = Number(serial.slice(8,10)) || 0;
    return currentDate + pad(inc+1, 2);
  } else {
    return currentDate+'01';
  }
}


function pad (number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

var checkDomainName = module.exports.checkDomainName = function (obj) {
  if(!checkString(obj)) return false;
  var words = obj.split('.');
  if(words.length < 2) return false;
  var wordsOk = true;
  words.forEach(function(w) {
    wordsOk &= checkString(w);
  });
  return wordsOk;
}