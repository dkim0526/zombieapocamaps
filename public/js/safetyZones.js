var firstClick = true;
$(document).ready(function() {
  var regions = ["EAST", "INLAND", "SOUTH", "COASTAL", "CENTRAL"];
  var regionColor = ["#D6AA5E", "#6BF2E2", "#D65C93", "#3399FF", "#B491ED"];
  var regionImg = ["east.jpg", "inland.jpg", "south.jpg", "coastal.jpg", "central.jpg"];
  for(var i = 0; i < regions.length; i++){
    var html = "<div  id='" + regions[i] + "'style='background-image: url(../img/" + regionImg[i] + ");' class='sf_circle'>"
                + "<label id='" + regions[i] + "' class='district'>" + regions[i] + "</label></div>";
    $("#safety_zone_districts").append(html);
    $("#" + regions[i]).click(loadRegion);
  }

})

function loadRegion(event){
  var region = event.target.getAttribute("id");
  $("#safe_zone_information").css("display", "inline");
  $(".sf_circle, .district").removeClass("active_district");
  $("#" + region).addClass("active_district");
  getData("safe_zones", region);
  $("body").animate({ scrollTop: "100px"}, 1000);
}

function openSafetyZones() {
  openTab($("#safety_zone"), $("#safety_zone_btn"), "Safe Zones");
}

// need to find a new formular maybe to show some equal representation
function findRating(total){
    var returnVal = 1;
    if(total>=5072 && total < 50000)
        returnVal =  10;
    if(total>=50000 && total < 100000)
        returnVal =  9;
    if(total>=90000 && total < 125000)
        returnVal =  8;
    if(total>=125000 && total < 200000)
        returnVal =  7;
    if(total>=200000 && total < 220000)
        returnVal =  6;
    if(total>=220000 && total < 240000)
        returnVal =  5;
    if(total>=240000 && total < 260000)
        returnVal =  4;
    if(total>=260000 && total < 270000)
        returnVal =  3;
    if(total>=270000 && total < 280000)
        returnVal =  2;
    if(total >= 280000)
        returnVal =  1;

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
  var citiesString = "";
  var averageRating = 0;
  var totalPopulation = 0;
  var totalZombies = 0;
  var totalCount = 0;
  var newTextBoxDiv = "";
  $( "#safe_zone_header" ).html(newTextBoxDiv);
  for(var i = 0; i < array.length; i++){
    regionName = categorizeRegionName(array[i]["RegionName"]);

    if(resultType === regionName){
      console.log(regionName);
      jsonObj = {};
      jsonObj.cities = array[i]["cities"];
      jsonObj.population = array[i]["population_density"];
      jsonObj.zombies = array[i]["zombie_count"];
      jsonObj.rating = findRating(array[i]["rating"]);
      jsonObj.region = regionName;
      returnArray.push(jsonObj);
      totalCount++;
      averageRating += Number(jsonObj.rating);
      totalPopulation += Number(jsonObj.population);
      totalZombies += Number(jsonObj.zombies);
    }
  }
  averageRating = (averageRating/totalCount).toFixed(2);
  var newTextBoxDiv = "<h2><strong>" + resultType + "</strong></h2>"
                      + "<h4>Average Rating: " + averageRating + "</h4>"
                      + "<h4>Total Cities: " + totalCount + "</h4>"
                      + "<h4>Total Zombies: " + totalZombies + "</h4>"
                      + "<h4>Total Population: " + totalPopulation + "</h4>";
  $( "#safe_zone_information_text" ).html(newTextBoxDiv);
  return returnArray;
}

function getData(typeOfQuery, resultType){
  d3.json("/delphidata_" + typeOfQuery, function(err, data){
      data = makeJsonList(data, resultType);
      displayChart(data);
  });
}

function displayChart(delphidata){
  //d3.select("input").property("checked", false);
  var margin = {top: 20, right: 20, bottom: 40, left: 30},
  width = 960 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

  //var formatPercent = d3.format(".0%");
  var svg = document.getElementById("barChart");
  svg = d3.select("#barChart").html("");
  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1, 1);
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
    .html(function(d){
      return "<h4>" + d.cities + " - " + d.rating + "</h4>"
              + "<p>Zombie Count: "+ d.zombies +"</p>"
              + "<p>Population: " + d.population + "</p>";
    });

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
            return "green";
          } else if (d.rating <= yellowT) {
            return "green";
          }
            else{
            return "red";
          }
        });

     d3.select("input").on("change", change);


      var sortTimeout = setTimeout(function() {
        d3.select("input").property("checked", true).each(change);
      }, 2000);

      function change() {
        clearTimeout(sortTimeout);

        // Copy-on-write since tweens are evaluated after a delay.
        var x0 = x.domain(delphidata.sort(this.checked
            ? function(a, b) { return b.rating - a.rating; }
            : function(a, b) { return d3.ascending(a.cities, b.cities); })
            .map(function(d) { return d.cities; }))
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
