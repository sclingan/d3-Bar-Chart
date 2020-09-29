
function getData(){
   req = new XMLHttpRequest();
   req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json',true);
   req.send();
   req.onload = function(){
     let json = JSON.parse(req.responseText);
     // initialize variables
     let gdp = [];
     let date = [];
     // separate gdp values and dates
     for(const[i,e] of json.data)gdp.push(e);
     for(const[i,e] of json.data)date.push(i);
     // separate year from dates
     let years = date.map(function(item){
        return item.substring(0,4);
     });
     // scale values
     const xScale = d3.scaleLinear()
                      .domain([0,d3.max(gdp,(d) => d)])
                      .range([0,794]);

      const yScale = d3.scaleLinear()
                       .domain([d3.min(years, (d) => d), d3.max(years, (d) => d)])
                       .range([1,-2]);
      // scale labels for axis
      const yLabel = d3.scaleLinear()
                       .domain([0,d3.max(gdp, (d) => d)])
                       .range([800,0]);

      const xLabel = d3.scaleLinear()
                       .domain([1947,d3.max(years, (d) => d)])
                       .range([0,1090]);

      const xAxis = d3.axisBottom(xLabel)  
                      .ticks(20,'d');

      const yAxis = d3.axisLeft(yLabel);  

      const tooltip = d3.select(".hidden")
                        .append("div")
                        .attr("id","tooltip")
                        .style("opacity",0);
     // create svg container
     svg = d3.select("#chart-card")
             .append("svg");
          // draw rectangles
          svg.selectAll("rect")
             .data(json.data)
             .enter()
             .append("rect")
             .attr("x", (d,i) => (i + 50) * 4)   
             .attr("y", (d) => yScale(d[1]) + 749)
             .attr("height" , (d) =>  xScale(d[1]))   
             .attr("width",2)
             .attr("data-gdp",function(d,i){
                return json.data[i][1];
             })
             .attr("data-date", function(d,i){
                return json.data[i][0];
            })
             .style("margin",2)
             .on("mouseover",function(d,i){
                tooltip.transition()
                       .duration(200)
                       .style("opacity",1)
                tooltip.html(
                        '$' + gdp[i].toFixed(1) + ' Billion'
                        + '<br>' + date[i]
                     )
                       .style("left", i * 2 + i + 200 + 'px')
                       .style("top", 700 + 'px')
                       .attr("data-date", date[i])
             })
             .on("mouseout",function(){
                tooltip.transition()
                        .duration(0)
                        .style("opacity",0)
             })
             .attr("class","bar");

          // draw x-axis
          svg.append("g")
             .attr("class","tick")
             .attr("id","x-axis")
             .attr("transform","translate(198,834)")
             .call(xAxis);
          // draw y-axis
          svg.append("g")   
             .attr("class","tick")
             .attr("id","y-axis")
             .attr("transform","translate(200,35)")
             .call(yAxis);
   }
}

 
 getData();

 