const readline = require('readline');
const fs = require('fs');

var isTrue = true;
const rl = readline.createInterface({
  input: fs.createReadStream('indicators.csv')
});
var header;
var jsObj;
var jsonResult = {};

var countryName;
var year;

//read a single line
rl.on('line', function (line) {

  if(isTrue){
      header = line.split(',');
      isTrue = false;
  }
  else {
    var commaRemoved = line.replace(/"[^"]+"/g, function (match) {
      match = match.replace("\"", "");
      match = match.replace("\"", "");

      return match.replace(/,/g, '');
    });
    jsObj = commaRemoved.split(',');


    countryName = jsObj[0];
    year = jsObj[4];
    indCode = jsObj[2];

//If country doesn't exist , add the country as key
    if(!(countryName in jsonResult)) {
      //create object with country as key
      jsonResult[countryName] = {};
    }

//If the year doesn't exist , add the year as key
    if(!(year in jsonResult[countryName])) {
      //Create object with year as key
      jsonResult[countryName][year] = {};
    }

    var obj = {};
    if(jsObj[3]=="SP.DYN.LE00.FE.IN" || jsObj[3]=="SP.DYN.LE00.MA.IN") {

      if(jsObj[3]=="SP.DYN.LE00.FE.IN") {
        indCode = "female";
      }else if(jsObj[3]=="SP.DYN.LE00.MA.IN") {
        indCode = "male";
      }

      if(!(indCode in jsonResult[countryName][year])) {
        //Create object with 'indicator name' as key
        jsonResult[countryName][year][indCode] = jsObj[5];
      }
    }
  }
});

rl.on('close' , function() {

var outputFilename = 'output.json';
fs.writeFileSync(outputFilename,JSON.stringify(jsonResult,null,4),'utf-8');
/*fs.writeFile(outputFilename, JSON.stringify(jsonResult, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON output file: " + outputFilename);
    }
  });*/
});
