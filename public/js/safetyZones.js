var firstClick = true;

function openSafetyZones() {
  openTab($("#safety_zone"), $("#safety_zone_btn"), "Safe Zones");
  if(firstClick){
    getData("safe_zones", "EAST");
    firstClick = false;
  }

  $("#district1").click(
    function () {
      //$(".safety_zone").show();
      getData("safe_zones", "SOUTH");
      if(newTextBoxDiv == null){
        var newTextBoxDiv = $("#displayDistrict")
         .attr("id", "#zone1")
         .attr("style", "font-size:20px; display: inline;");
         newTextBoxDiv.append("<p> Cities: <br/> Death Rates: <br/> Crime Rates: <br/> Stuff:  <p/>")
         // <---- CAN YOU PASS DATA HERE 
        $( "#safety_zone_districts" ).append(newTextBoxDiv);
      }
      else if(newTextBoxDiv){
        console.log("TRUE");
      }
    }
  );

  $("#district2").click(
    function () {
      //$(".safety_zone").show();
      getData("safe_zones", "EAST");
      if(newTextBoxDiv == null){
        var newTextBoxDiv = $("#displayDistrict")
         .attr("id", "#zone2")
         .attr("style", "font-size:20px; display: inline;");
         newTextBoxDiv.append("<p> Cities: <br/> Death Rates: <br/> Crime Rates: <br/> Stuff:  <p/>")
         // <---- CAN YOU PASS DATA HERE 
        $( "#safety_zone_districts" ).append(newTextBoxDiv);
      }
      else if(newTextBoxDiv){
        console.log("TRUE");
      }
    }
  );

  $("#district3").click(
    function () {
      //$(".safety_zone").show();
      getData("safe_zones", "CENTRAL");
      if(newTextBoxDiv == null){
        var newTextBoxDiv = $("#displayDistrict")
         .attr("id", "#zone3")
         .attr("style", "font-size:20px; display: inline;");
         newTextBoxDiv.append("<p> Cities: <br/> Death Rates: <br/> Crime Rates: <br/> Stuff:  <p/>")
         // <---- CAN YOU PASS DATA HERE 
        $( "#safety_zone_districts" ).append(newTextBoxDiv);
      }
      else if(newTextBoxDiv){
        console.log("TRUE");
      }
    }
  );

  $("#district4").click(
    function () {
      //$(".safety_zone").show();
      getData("safe_zones", "INLAND");
      if(newTextBoxDiv == null){
        var newTextBoxDiv = $("#displayDistrict")
         .attr("id", "#zone4")
         .attr("style", "font-size:20px; display: inline;");
         newTextBoxDiv.append("<p> Cities: <br/> Death Rates: <br/> Crime Rates: <br/> Stuff:  <p/>")
         // <---- CAN YOU PASS DATA HERE 
        $( "#safety_zone_districts" ).append(newTextBoxDiv);
      }
      else if(newTextBoxDiv){
        console.log("TRUE");
      }
    }
  );

  $("#district5").click(
    function () {
      //$(".safety_zone").show();
      getData("safe_zones", "COASTAL");
      if(newTextBoxDiv == null){
        var newTextBoxDiv = $("#displayDistrict")
         .attr("id", "#zone5")
         .attr("style", "font-size:20px; display: inline;");
         newTextBoxDiv.append("<p> Cities: <br/> Death Rates: <br/> Crime Rates: <br/> Stuff:  <p/>")
         // <---- CAN YOU PASS DATA HERE 
        $( "#safety_zone_districts" ).append(newTextBoxDiv);
      }
      else if(newTextBoxDiv){
        console.log("TRUE");
      }
    }
  );
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

function categorizeRegionName(regionFromDB){
  var regions = ["EAST", "INLAND", "SOUTH", "COASTAL", "CENTRAL"];
  var temp = 0;

  for(var i = 0; i < regions.length; i++){
    if(regionFromDB.includes(regions[i])){
      temp = i;
      break;
    }
  }

  return regions[temp];
}

function makeJsonList(array, resultType){

  var jsonObj = {
    "cities": String,
    "population": Number,
    "zombies": Number,
    "rating": Number,
    "region": String
  }
  var returnArray = [];
  var regionName = "";

  for(var i = 0; i < array.length; i++){
    regionName = categorizeRegionName(array[i]["RegionName"]);
    if(resultType === regionName){
      jsonObj = {};
      jsonObj.cities = array[i]["cities"];
      jsonObj.population = array[i]["population_density"];
      jsonObj.zombies = array[i]["zombie_count"];
      jsonObj.rating = findRating(array[i]["rating"]);
      jsonObj.region = regionName;
      returnArray.push(jsonObj);
    }
  }

  return returnArray;
}

function getData(typeOfQuery, resultType){
  d3.json("/delphidata_" + typeOfQuery, function(err, data){
      data = makeJsonList(data, resultType);
      displayChart(data);
  });
}

function displayChart(delphidata){
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

  //var formatPercent = d3.format(".0%");
  var svg = document.getElementById("barChart");
  svg = d3.select("#barChart").html("");
  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1, 1);
  console.log("Hello");
  var y = d3.scale.linear()
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
 
  svg = d3.select("#barChart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + (margin.bottom+ 100))//added 
      .attr("class", "safety_zone")
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(delphidata.map(function(d) { return d.cities; }));
    y.domain([0, d3.max(delphidata, function(d) { return d.rating; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
  .selectAll("text")
  .attr("text-anchor", "end")
  .attr("dx", "-5.5em")
  .attr("transform", "rotate(-65)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
  .style("text-anchor", "end")
        .attr("dy", ".71em")
  .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .text("Rating");

  // reveal calculations
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d){ return "<span style='color: #f0027f>Hello</span>" });

  svg.call(tip);

   // determining bar colors 
  var max = d3.max(delphidata, function(d) {return d.rating;});
  // var threshold = max/3;
  var length = delphidata.length/3; 
  //console.log("length: " + array.length + " " + "division: " + Math.ceil(array.length/3));

  var tempData = [];
    delphidata.forEach(function(d){
      tempData.push(d.rating);
    });

    tempData.sort(); 

  var redT = tempData[Math.ceil(length)];
  var yellowT = tempData[Math.ceil(length*2)];

  d3.select("#red-text").text("(" + tempData[0] + " - " + redT + ")");
  d3.select("#yellow-text").text("(" + redT + " - " + yellowT + ")");
  d3.select("#green-text").text("(" + yellowT + " - " + tempData[tempData.length - 1] + ")");

    svg.selectAll(".bar")
        .data(delphidata)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.cities); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.rating); })
        .attr("height", function(d) { return height - y(d.rating); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .attr("fill", function(d){  
          if (d.rating < redT) {
            return "red";
          } else if (d.rating <= yellowT) {
            return "yellow";
          }
            else{
            return "green";
          }
        });

    d3.select("input").on("change", change);



    function change() {
      // Copy-on-write since tweens are evaluated after a delay.
      var x0 = x.domain(delphidata.sort(this.checked
          ? function(a, b) { return b.rating - a.rating; }
          : function(a, b) { return d3.ascending(a.cities, b.cities); })
          .map(function(d) { return d.area; }))
          .copy();

      svg.selectAll(".bar")
          .sort(function(a, b) { return x0(a.cities) - x0(b.cities); });

      var transition = svg.transition().duration(750),
          delay = function(d, i) { return i * 50; };

      transition.selectAll(".bar")
          .delay(delay)
          .attr("x", function(d) { return x0(d.cities); });

      transition.select(".x.axis")
          .call(xAxis)
        .selectAll("g")
          .delay(delay);
    }
}
