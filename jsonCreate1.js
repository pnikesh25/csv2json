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
var mainObject = [];

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

//If country doesn't exist , add the country as key
if(asian.indexOf(countryName) >= 0) {
    if(country.indexOf(countryName) < 0) {
      //create object with country as key
      country.push(countryName);
      jsonResult = {};
      jsonResult["Country"] = countryName;



      mainObject.push(jsonResult);
    }

    if(jsObj[3]=="SP.DYN.LE00.FE.IN" || jsObj[3]=="SP.DYN.LE00.MA.IN") {


    for (i = 0 ; i < mainObject.length ; i++) {

      if(mainObject[i]["Country"] == countryName) {
        jsonResult = mainObject[i];

        if(jsObj[3]=="SP.DYN.LE00.FE.IN") {
          indCode = "Female";
          if(!(indCode in jsonResult)) {
            //Create object with 'indicator name' as key
            jsonResult[indCode] = 0;
            jsonResult["YearsF"] = 0;
          }

          femaleTotal = parseFloat(jsonResult[indCode]) + parseFloat(jsObj[5]);
          //femaleTotal += parseFloat(jsObj[5]);
          jsonResult[indCode] = femaleTotal;
          yearsf = parseInt(jsonResult["YearsF"]) + 1;
          jsonResult["YearsF"] = yearsf;

        }else if(jsObj[3]=="SP.DYN.LE00.MA.IN") {
          indCode = "Male";
          if(!(indCode in jsonResult)) {
            //Create object with 'indicator name' as key
            jsonResult[indCode] = 0;
            jsonResult["YearsM"] = 0;
          }

          maleTotal = parseFloat(jsonResult[indCode]);
          maleTotal += parseFloat(jsObj[5]);
          jsonResult[indCode] = maleTotal;
          yearsm = parseInt(jsonResult["YearsM"]) + 1;
          jsonResult["YearsM"] = yearsm;

        }


  }

}

    }
  }
}
});

function calculateAverage(arr) {
  for(k=0 ; k < arr.length ; k++) {
    arr[k]["Female"] = parseFloat((arr[k]["Female"])/(arr[k]["YearsF"]));
    arr[k]["Male"] = parseFloat((arr[k]["Male"])/(arr[k]["YearsM"]));

  }
}


rl.on('close' , function() {

calculateAverage(mainObject);
var outputFilename = 'outputJson1.json';
fs.writeFileSync(outputFilename,JSON.stringify(mainObject,null,4),'utf-8');

});
