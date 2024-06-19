// ---------------------------//
//       SET  CANVAS          //
// ---------------------------//

// Dimensions and margins of the graph
const margin = {top: 50, right: 200, bottom: 60, left: 50},
    width = 900 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

// Append the SVG object to the body of the page
const svg = d3.select("#d_b")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the CSV data
d3.csv("data.csv").then(data => {
    // Convert numeric values from strings to numbers
    data.forEach(d => {
        d.Year = +d.Year;
        d["Birth rate"] = +d["Birth rate"];
        d["Death rate"] = +d["Death rate"];
    });

// ---------------------------//
//       AXIS  AND SCALE      //
// ---------------------------//

    // X axis: Death rate
    const x = d3.scaleLinear()
        .domain([8, d3.max(data, d => d["Death rate"])])
        .nice()
        .range([0, width - 20]);

    const xAxis = svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .attr("class", "myXaxis")
        .call(d3.axisBottom(x))
        .attr("opacity", "0"); 

    // Y axis: Birth rate
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d["Birth rate"])])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y).ticks(height / 40))
        .call(g => g.select(".domain"))
        .selectAll("text")
        .attr("class", "axis-label");

    // Add X axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("x", 640 + margin.left)
        .attr("y", height + margin.top + 5)
        .text("Mortality rate (%)");

    // Add Y axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("x", margin.top + 20)
        .attr("y", margin.left - 70)
        .text("Birth rate (%)");

// ---------------------------//
//     COLOR SCALE            //
// ---------------------------//

    // Define color scale for decades
    const colorScale = d3.scaleOrdinal()
        .domain(["1960-1969", "1970-1979", "1980-1989", "1990-1999", "2000-2009", "2010-2019", "2020-2022"])
        .range(["#E81212", "#DE7520","#099B82","#0148CB","#D80880","#8A04E0","#69094E"]);

    // Function to get the decade from the year
    function getDecade(year) {
        if (year >= 1960 && year <= 1969) return "decade1960-1969";
        if (year >= 1970 && year <= 1979) return "decade1970-1979";
        if (year >= 1980 && year <= 1989) return "decade1980-1989";
        if (year >= 1990 && year <= 1999) return "decade1990-1999";
        if (year >= 2000 && year <= 2009) return "decade2000-2009";
        if (year >= 2010 && year <= 2019) return "decade2010-2019";
        if (year >= 2020 && year <= 2022) return "decade2020-2022";
    }

// ---------------------------//
//     CIRCLES & FUNCTION     //
// ---------------------------//

    // Starting coordinates 
    const startX = 0;
    const startY = height; 

    // Add dots
    svg.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", d => `bubbles ${getDecade(d.Year)}`) 
        .attr("cx", startX) 
        .attr("cy", startY) 
        .attr("r", 10)
        .style("fill", d => colorScale(getDecade(d.Year)))
        .transition()
        .delay((d, i) => i * 100)
        .duration(2000)
        .attr("cx", d => x(d["Death rate"]))
        .attr("cy", d => y(d["Birth rate"]));

    // Transition the x-axis from https://d3-graph-gallery.com/graph/scatter_animation_start.html 
    svg.select(".myXaxis")
        .transition()
        .duration(2000)
        .attr("opacity", "1") // Set to 1 for animation
        .call(d3.axisBottom(x));

// ---------------------------//
//       HIGHLIGHT GROUP      //
// ---------------------------//
// Highlight function from https://d3-graph-gallery.com/graph/bubble_template.html
    // when one group is hovered
    var highlight = function(event, d){
        svg.selectAll(".bubbles").style("opacity", .05);
        svg.selectAll(`.${d}`).style("opacity", 1);
    }
    // when not hovered anymore
    var noHighlight = function(event, d){
        svg.selectAll(".bubbles").style("opacity", 1);
    }

// Add one dot in the legend for each decade.
var size = 20
var allgroups = ["decade1960-1969", "decade1970-1979", "decade1980-1989", "decade1990-1999", "decade2000-2009", "decade2010-2019", "decade2020-2022"];
svg.selectAll("myrect")
  .data(allgroups)
  .enter()
  .append("circle")
    .attr("cx", height+200)
    .attr("cy", function(d,i){ return 10 + i*(size+5)})
    .attr("r", 7)
    .style("fill", function(d){ return colorScale(d)})
    .attr("class", d => d) 
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight);

// Add labels beside legend dots
svg.selectAll("mylabels")
  .data(allgroups)
  .enter()
  .append("text")
    .attr("x", height+210)
    .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) 
    .style("fill", function(d){ return colorScale(d)})
    .text(function(d){ return d.replace("decade", "")})
    .style("alignment-baseline", "middle")
    .attr("class", d => d)
    .on("mouseover", highlight)
    .on("mouseleave", noHighlight);

});
