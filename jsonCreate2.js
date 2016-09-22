const readline = require('readline');
const fs = require('fs');

var isTrue = true;
const rl = readline.createInterface({
  input: fs.createReadStream('indicators.csv')
});
var header;
var jsObj;
var i;

var country = [];
var jsonResult = {};
var mainArray = [];
var finalArray = [];

var asian=["Arab World","Afghanistan","Armenia","Azerbaijan","Bahrain","Bangladesh","Bhutan","Brunei Darussalam"
            ,"Cambodia","China","Cyprus","Egypt Arab Rep.","India","Indonesia","Iran Islamic Rep.","Iraq","Israel"
            ,"Japan","Jordan","Kazakhstan","Korea Dem. Rep.","Korea Rep.","Kuwait","Kyrgyz Republic","Lao PDR"
            ,"Lebanon","Malaysia","Maldives","Mongolia","Myanmar","Nepal","Oman","Pakistan","Philippines","Qatar"
            ,"Saudi Arabia","Singapore","Sri Lanka","Syrian Arab Republic","Tajikistan","Thailand","Timor-Leste"
            ,"Turkmenistan","United Arab Emirates","Uzbekistan","Vietnam","Yemen Rep."];
var country = [];
var female = [];
var  male = [];

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


  if(jsObj[3]=="SP.DYN.LE00.IN") {
    //If country doesn't exist , add the country as key
    if(country.indexOf(countryName) < 0) {
      //create object with country as key
      country.push(countryName);
      jsonResult = {};
      jsonResult["Country"] = countryName;
      jsonResult["Years"] = 0;

      mainArray.push(jsonResult);
    }

    for (i = 0 ; i < mainArray.length ; i++) {

      if(mainArray[i]["Country"] == countryName) {
        jsonResult = mainArray[i];

          indCode = "Total";
          if(!(indCode in jsonResult)) {
            //Create object with 'indicator name' as key
            jsonResult[indCode] = 0;
          }

          total = parseFloat(jsonResult[indCode]) + parseFloat(jsObj[5]);
          //femaleTotal += parseFloat(jsObj[5]);
          jsonResult[indCode] = total;
          count = parseInt(jsonResult["Years"]) +1;
          jsonResult["Years"] = count;

      }
}
}
}
});

function calculateAverage(arr) {
  for(k=0 ; k < arr.length ; k++) {
    arr[k]["Total"] = parseFloat((arr[k]["Total"])/(arr[k]["Years"]));
  }
}

function sortResults(arr, prop, asc) {
    arr = arr.sort(function(a, b) {
        if (asc) {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        } else {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });
}

function filterResults(arr , num) {
  for(j = 0 ; j < num ; j++) {
    finalArray.push(arr[j]);
  }
}

rl.on('close' , function() {

var outputFilename = 'outputJson2.json';
calculateAverage(mainArray);
sortResults(mainArray, "Total" , false);
filterResults(mainArray , 5);
fs.writeFileSync(outputFilename,JSON.stringify(finalArray,null,4),'utf-8');

});
