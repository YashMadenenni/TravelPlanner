let dataPath = "data/popular-tourism.csv";
let year = "2019";


function setRegion(year) {
  // console.log(document.getElementById("sales-year").value)

  d3.csv(dataPath).then(function (myData) {

    height = 300;

    let width = 1000;


    //Find Max sale value for sales
    let Sales_Max = d3.rollup(myData,
      a => d3.max(a, d => parseFloat(d[year])),
      d => d.Country);

    //  scale for y-axis
    let yScale = d3.scaleLinear()
      .domain([0, d3.max(Sales_Max.values())])
      .range([height, 0]);

    // scale for x-axis
    let xScale = d3.scaleBand()
      .domain(myData.map(function (d) {
        return d.Country;
      }))
      .range([0, width])
      .padding(0.1);

    // Select SVG element
    let svg = d3.select("#popularSVg");
    svg.selectAll("*").remove();
    
    let bar = svg.append("g")
      .attr("transform", "translate(50, 50)");

    // Add rectangle for each data point
    bar.selectAll("rect")
      .data(myData.map(function (d) {
        return {
          Country: d.Country,
          Value: Sales_Max.get(d.Country)
        };
      }))
      .enter()
      .append("rect")
      .attr("y", function (d) {
        return yScale(d.Value);
      })
      .attr("x", function (d) {
        return xScale(d.Country);
      })
      .attr("height",  function (d) {
        return ( isNaN(d.Value)?0: height - yScale(d.Value));
      })
      .attr("width", xScale.bandwidth())
      
      .on("mouseover", function (event, d) {
        d3.select(this)
          .style("fill", "red");
        let maxSales = d3.max(myData.filter(function (data) {
          return data.Country === d.Country;
        }), function (data) {
          return parseFloat(data[year]);
        });
        // Display max sales value in tooltip
       
      })
      .on('mouseout', function (event, d) {
        d3.select(this)
          .style("fill", "black");
        d3.selectAll(".tooltipBar").remove();
      })


    // Add y-axis
    let yAxis = d3.axisLeft(yScale);
    svg.append("g")
      .attr("transform", "translate(50, 50)")
      .call(yAxis);


    let xAxis = d3.axisBottom(xScale)
      .tickFormat(function (d) { return d; }) 
      .ticks(10); 


    // Add x-axis label
    svg.append("text")
      .attr("transform", "translate(225, 400)") 
      .attr("y", 30)
      .attr("x",200)
      .style("text-anchor", "middle") 
      .text("Country");
      
    // rotate x-axis labels
    svg.append("g")
      .attr("transform", "translate(50, 350)")
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
    


    // Add y-axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", -200)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text( "Arivals in Million" );

  });

}


//function to change year in bar 
let dropDown = d3.select("#year");

dropDown.on('change', function () {
  let year = dropDown.property("value");
  //console.log(menuItem);
  setRegion(year)
});

