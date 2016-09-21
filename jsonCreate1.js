const readline = require('readline');
const fs = require('fs');

var isTrue = true;
const rl = readline.createInterface({
  input: fs.createReadStream('indicators.csv')
});
var header;
var jsObj;
var jsonResult = {};

var asian=["Arab World","Afghanistan","Armenia","Azerbaijan","Bahrain","Bangladesh","Bhutan","Brunei Darussalam"
            ,"Cambodia","China","Cyprus","Egypt Arab Rep.","India","Indonesia","Iran Islamic Rep.","Iraq","Israel"
            ,"Japan","Jordan","Kazakhstan","Korea Dem. Rep.","Korea Rep.","Kuwait","Kyrgyz Republic","Lao PDR"
            ,"Lebanon","Malaysia","Maldives","Mongolia","Myanmar","Nepal","Oman","Pakistan","Philippines","Qatar"
            ,"Saudi Arabia","Singapore","Sri Lanka","Syrian Arab Republic","Tajikistan","Thailand","Timor-Leste"
            ,"Turkmenistan","United Arab Emirates","Uzbekistan","Vietnam","Yemen Rep."];
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
if(asian.indexOf(countryName) >= 0) {
    if(!(countryName in jsonResult)) {
      //create object with country as key
      jsonResult[countryName] = {};
    }


//If the year doesn't exist , add the year as key
/*
    if(!(year in jsonResult[countryName])) {
      //Create object with year as key
      jsonResult[countryName][year] = {};
    }
*/


    if(jsObj[3]=="SP.DYN.LE00.FE.IN" || jsObj[3]=="SP.DYN.LE00.MA.IN") {

      if(jsObj[3]=="SP.DYN.LE00.FE.IN") {
        indCode = "female";
        if(!(indCode in jsonResult[countryName])) {
          //Create object with 'indicator name' as key
          jsonResult[countryName][indCode] = jsObj[5];
        }

        femaleTotal = parseFloat(jsonResult[countryName][indCode]);
        femaleTotal += parseFloat(jsObj[5]);
        jsonResult[countryName][indCode] = femaleTotal;

      }else if(jsObj[3]=="SP.DYN.LE00.MA.IN") {
        indCode = "male";
        if(!(indCode in jsonResult[countryName])) {
          //Create object with 'indicator name' as key
          jsonResult[countryName][indCode] = jsObj[5];
        }

        maleTotal = parseFloat(jsonResult[countryName][indCode]);
        maleTotal += parseFloat(jsObj[5]);
        jsonResult[countryName][indCode] = maleTotal;


      }

      if(!(indCode in jsonResult[countryName])) {
        //Create object with 'indicator name' as key
        jsonResult[countryName][indCode] = jsObj[5];
      }



    }
  }
}
});

rl.on('close' , function() {

var outputFilename = 'outputJson1.json';
fs.writeFileSync(outputFilename,JSON.stringify(jsonResult,null,4),'utf-8');
/*fs.writeFile(outputFilename, JSON.stringify(jsonResult, null, 4), function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON output file: " + outputFilename);
    }
  });*/
});
