var firstClick = true;
function openSafetyZones() {
  openTab($("#safety_zone"), $("#safety_zone_btn"), "Safe Zones");
  if(firstClick){
    displayChart();
    firstClick = false;
  }
}
function displayChart(){  
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
      items: [
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
      ],
      eval: function (item) {return item.count;},
      classed: function (item) {return item.text.split(" ").join("");}
    },
    plugins: [
      {
        name: "central-click",
        options: { 
          text: 'Crime Rate: 19',
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
              textField: "count",
              classed: {count: true},
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
              textField: "text",
              classed: {text: true},
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