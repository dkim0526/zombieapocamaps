var firstClick = true;
function openSafetyZones() {
  openTab($("#safety_zone"), $("#safety_zone_btn"), "Safe Zones");
  if(firstClick){
    getData("safe_zones");
    firstClick = false;
  }
}

// need to find a new formular maybe to show some equal representation
function findRating(total){
    var returnVal = 1;
    if(total>=5072 && total < 66803)
        returnVal =  1; 
    if(total>=66803 && total < 128534)
        returnVal =  2;
    if(total>=128534 && total < 190265)
        returnVal =  3; 
    if(total>=190265 && total < 251996)
        returnVal =  4;
    if(total>=251996 && total < 313727)
        returnVal =  5;
    if(total>=313727 && total < 375458)
        returnVal =  6;
    if(total>=375458 && total < 437189)
        returnVal =  7;
    if(total>=437189 && total < 498920)
        returnVal =  8;
    if(total>=498920 && total < 560651)
        returnVal =  9;
    if(total >= 560651)
        returnVal =  10;

    return returnVal;
}

function makeJsonList(array){
  var jsonObj = {
    "cities": String,
    "population": Number,
    "zombies": Number,
    "rating": Number
  }
  var returnArray = [];
  for(var i = 0; i < array.length; i++){
    jsonObj = {};
    jsonObj.cities = array[i]["cities"];
    jsonObj.population = array[i]["population_density"];
    jsonObj.zombies = array[i]["zombie_count"];
    jsonObj.rating = findRating(array[i]["rating"]);
    returnArray.push(jsonObj);
  }

  return returnArray;
}

function getData(typeOfQuery){
  var list = [];
  d3.json("/delphidata_" + typeOfQuery, function(err, data){
      list = makeJsonList(data);
      displayChart(list);
  });
}

function displayChart(delphidata){  
  var jsonObj = {
    "cities": String,
    "population": Number,
    "zombies": Number,
    "rating": Number
  }

  var bubbleChart = new d3.svg.BubbleChart({ 
    supportResponsive: true,
    //container: => use @default
    size: 1200,
    //viewBoxSize: => use @default
    innerRadius: 460,
    //outerRadius: => use @default
    radiusMin: 50,
    //radiusMax: use @default
    //intersectDelta: use @default
    //intersectInc: use @default
    //circleColor: use @default
    data: {
      items: delphidata,
      eval: function (item) {return item.rating;},
      classed: function (item) {return item.cities.split(" ").join("");}
    },
    plugins: [
      {
        name: "central-click",
        options: { 
          text: 'Crime Rate: 30',
          style: {
            "font-size": "12px",
            "font-style": "italic",
            "font-family": "Source Sans Pro, sans-serif",
            //"font-weight": "700",
            "text-anchor": "middle",
            "fill": "white"
          },
          attr: {dy: "65px"},
          centralClick: function() {
            alert("Here is more details!!");
          }
        }
      },
      {
        name: "lines",
        options: {
          format: [
            {// Line #0
              textField: "rating",
              classed: {rating: true},
              style: {
                "font-size": "28px",
                "font-family": "Source Sans Pro, sans-serif",
                "text-anchor": "middle",
                fill: "white"
              },
              attr: {
                dy: "0px",
                x: function (d) {return d.cx;},
                y: function (d) {return d.cy;}
              }
            },
            {// Line #1
              textField: "cities",
              classed: {cities: true},
              style: {
                "font-size": "14px",
                "font-family": "Source Sans Pro, sans-serif",
                "text-anchor": "middle",
                fill: "white"
              },
              attr: {
                dy: "20px",
                x: function (d) {return d.cx;},
                y: function (d) {return d.cy;}
              }
            }
          ],
          centralFormat: [
            {// Line #0
              style: {"font-size": "50px"},
              attr: {}
            },
            {// Line #1
              style: {"font-size": "30px"},
              attr: {dy: "40px"}
            }
          ]
        }
      }]
  });
}

/*
    {text: "Chula Vista", count: "18.5"},
        {text: "Mira Mesa", count: "17.5"},
        {text: "La Jolla", count: "19"},
        {text: "Kearny Mesa", count: "18.6"},
        {text: "Oceanside", count: "14"},
        {text: "Carlsbad", count: "17"},
        {text: "Del Mar", count: "19"},
        {text: "Kearny Mesa", count: "18.6"},
        {text: "Oceanside", count: "14"},
        {text: "Carlsbad", count: "17"},
        {text: "Del Mar", count: "19"},
        {text: "Chula Vista", count: "18.5"},
        {text: "Mira Mesa", count: "17.5"},
        {text: "La Jolla", count: "19"},
        {text: "Kearny Mesa", count: "18.6"},
        {text: "Oceanside", count: "14"},
        {text: "Carlsbad", count: "17"},
        {text: "Del Mar", count: "19"},
        {text: "Kearny Mesa", count: "18.6"},
        {text: "Oceanside", count: "14"},
        {text: "Carlsbad", count: "17"},
        {text: "Del Mar", count: "19"},{text: "Chula Vista", count: "18.5"},
        {text: "Mira Mesa", count: "17.5"},
        {text: "La Jolla", count: "19"},
        {text: "Kearny Mesa", count: "18.6"},
        {text: "Oceanside", count: "14"},
        {text: "Carlsbad", count: "17"},
        {text: "Del Mar", count: "19"},
        {text: "Kearny Mesa", count: "18.6"},
        {text: "Oceanside", count: "14"},
        {text: "Carlsbad", count: "17"},
        {text: "Del Mar", count: "19"},{text: "Chula Vista", count: "18.5"},
        {text: "Mira Mesa", count: "17.5"},
        {text: "La Jolla", count: "19"},
        {text: "Kearny Mesa", count: "18.6"},
        {text: "Oceanside", count: "14"},
        {text: "Carlsbad", count: "17"},
        {text: "Del Mar", count: "19"},
        {text: "Kearny Mesa", count: "18.6"},
        {text: "Oceanside", count: "14"},
        {text: "Carlsbad", count: "17"},
        {text: "Del Mar", count: "19"},
*/