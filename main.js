// ---------------------------//
//       SET  CANVAS          //
// ---------------------------//

function initializeScatterPlot() {
    // Dimensions and margins of the graph
    const margin = {top: 50, right: 200, bottom: 60, left: 50},
        width = 900 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;

    // Append the SVG object to the body of the page
    const svg = d3.select("#main")
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
            d["Natural Growth rate"] = +d["Natural Growth rate"];
            d["Emigrants (1000)"] = +d["Emigrants (1000)"];
        });

        // ---------------------------//
        //       AXIS  AND SCALE      //
        // ---------------------------//

        // X axis: Death rate
        const x = d3.scaleLinear()
            .domain([8, 13])
            .nice()
            .range([0, width - 20]);
        
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("class", "axis-label");

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

        // Size scale for the circles: Emigrants
        const z = d3.scaleLinear()
            .domain([0, d3.max(data, d => d["Emigrants (1000)"])])
            .range([5, 20]);

        const colorScheme = [
            "#0C6CAC", "#2A87C5", "#3DA4C3", "#7CC7DE", "#B3E3F1",
            "#E6BABA", "#E28282", "#E67B7B","#E54545","#FD0000",
        ];
        const color = d3.scaleLinear()
            .domain([d3.min(data, d => d["Natural Growth rate"]), 0, d3.max(data, d => d["Natural Growth rate"])])
            .range([colorScheme[0], colorScheme[Math.floor(colorScheme.length / 2)], colorScheme[colorScheme.length - 1]])
            .interpolate(d3.interpolateRgb);

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
        //      TOOLTIP               //
        // ---------------------------//
       
        // -1- Create a tooltip div that is hidden by default:
        var tooltip = d3.select("#main")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "black")
            .style("border-radius", "5px")
            .style("padding", "10px")
            .style("color", "white")
            .style("position", "absolute");
                    
        // -2- Create 3 functions to show / update / hide the tooltip
        var showTooltip = function(event, d) {
            tooltip
            .transition()
            .duration(200)
            .style("opacity", 1);
            tooltip.html(`Year: ${d.Year}<br>Mortality rate: ${d["Death rate"]}<br>Birth rate: ${d["Birth rate"]}<br>Emigrants: ${d["Emigrants (1000)"]}<br>Natural Growth Rate: ${d["Natural Growth rate"]}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 15) + "px");
        }
        var moveTooltip = function(event, d) {
            tooltip
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 15) + "px");
        }
        var hideTooltip = function(event, d) {
            tooltip
            .transition()
            .duration(200)
            .style("opacity", 0);
        }

        // ---------------------------//
        //     CIRCLES & FUNCTION     //
        // ---------------------------//

        // Function to update the scatter plot
        function update(year) {
            // Filter data for the selected year
            const yearData = data.filter(d => d.Year === year);

            // Update circles
            const circles = svg.selectAll(".dot")
                .data(yearData, d => d.Year);

            // Enter new circles
            circles.enter()
                .append("circle")
                .attr("class", "dot")
                .attr("cx", d => x(d["Death rate"]))
                .attr("cy", d => y(d["Birth rate"]))
                .attr("r", d => z(d["Emigrants (1000)"]))
                .style("stroke", "black")
                .style("opacity", 0.7)
                .style("fill", d => color(d["Natural Growth rate"])) 
                .on("mouseover", showTooltip)
                .on("mousemove", moveTooltip)
                .on("mouseout", hideTooltip);

            // Update existing circles
            circles
                .attr("cx", d => x(d["Death rate"]))
                .attr("cy", d => y(d["Birth rate"]))
                .attr("r", d => z(d["Emigrants (1000)"]))
                .style("fill", d => color(d["Natural Growth rate"])) 
                .on("mouseover", function(event, d) {
                    showTooltip(event, d);
                })
                .on("mousemove", function(event, d) {
                    moveTooltip(event, d);
                })
                .on("mouseout", function(event, d) {
                    hideTooltip(event, d);
                });

        }

        // Circles legend
        var valuesToShow = [1, 10];  
        var xCircle = 640;  
        var xLabel = 660;   
        var yLegend = height - 220;        

        svg.selectAll("legendCircles")
            .data(valuesToShow)
            .enter()
            .append("circle")
            .attr("cx", xCircle)
            .attr("cy", d => yLegend - z(d))
            .attr("r", d => z(d))
            .style("fill", "none")
            .attr("stroke", "black");

        // Add legend: segments
        svg.selectAll("legendLines")
            .data(valuesToShow)
            .enter()
            .append("line")
            .attr('x1', d => xCircle + z(d))
            .attr('x2', xLabel)
            .attr('y1', d => yLegend - z(d))
            .attr('y2', d => yLegend - z(d))
            .attr('stroke', 'black')
            .style('stroke-dasharray', ('3,3'))
            .style("id", legendsContainer);

        // Add legend: labels
        svg.selectAll("legendLabels")
           .data(valuesToShow)
           .enter()
           .append("text")
           .attr('x', xLabel + 5)
           .attr('y', d => yLegend - z(d))
           .text(d => `${d}`)
           .style("font-size", 12)
           .attr('alignment-baseline', 'middle');

        // legend title
        svg.append("text")
            .attr('x', xCircle)
           .attr('y', yLegend - 40)
           .text("Emigrants")
           .style("font-size", 14)
           .attr('text-anchor', 'middle');

        // Add color legend
        const colorLegendWidth = 20;
        const colorLegendHeight = 100;
        const gradientId = "color-gradient";
        const legendX = xCircle + 60; 
        const legendY = yLegend + 70; 

        // Create gradient definition
        const defs = svg.append("defs");
        const linearGradient = defs.append("linearGradient")
            .attr("id", gradientId)
            .attr("x1", "0%")
            .attr("x2", "0%")
            .attr("y1", "0%")
            .attr("y2", "100%");

        linearGradient.selectAll("stop")
            .data([
                 { offset: "0%", color: colorScheme[0] },
                 { offset: "50%", color: colorScheme[Math.floor(colorScheme.length / 2)] },
                 { offset: "100%", color: colorScheme[colorScheme.length - 1] }
             ])
             .enter().append("stop")
             .attr("offset", d => d.offset)
             .attr("stop-color", d => d.color);

        // Append color legend rectangle
        svg.append("rect")
            .attr("x", xCircle - 8)
            .attr("y", yLegend + 40)
            .attr("width", colorLegendWidth)
            .attr("height", colorLegendHeight)
            .style("fill", `url(#${gradientId})`);
            
        // Add color legend label
        svg.append("text")
            .attr("x", xCircle + 10)
            .attr("y", yLegend + 30)
            .text("Natural Growth Rate")
            .style("font-size", 14)
            .attr("text-anchor", "middle");
     
        // Add top label for the gradient
        svg.append("text")
            .attr("x", xCircle + 15)
            .attr("y", yLegend + 48)
            .text("-4")
            .style("font-size", 12)
            .attr("text-anchor", "start");

        // Add bottom label for the gradient
        svg.append("text")
            .attr("x", xCircle + 15)
            .attr("y", yLegend + 140)
            .text("14")
            .style("font-size", 12)
            .attr("text-anchor", "start");

        // ---------------------------//
        //       MAIN FUNCTION        //
        // ---------------------------//

        // Initial plot with the starting year
        let currentYear = 1960;
        update(currentYear);

        let playing = false;
        let finished = false;
        let timer;

        // Function to clear bubbles
        function clearBubbles() {
            svg.selectAll(".dot").remove();
        }

        // Function to restart the animation
        function restartAnimation() {
            clearBubbles();
            currentYear = 1960;
            update(currentYear);
            d3.select("#yearLabel").text(currentYear);
            if (timer) {
                clearInterval(timer);
            }
            playing = true;
            finished = false;
            d3.select("#button").text("Pause");

            timer = setInterval(() => {
                update(currentYear);
                d3.select("#yearLabel").text(currentYear);
                if (currentYear < 2022) {
                    currentYear++;
                } else {
                    clearInterval(timer);
                    playing = false;
                    finished = true;
                    d3.select("#button").text("Restart");
                }
            }, 400);
        }

        d3.select("#button").on("click", function() {
            if (playing) {
                playing = false;
                clearInterval(timer);
                d3.select(this).text("Play");
            } else if (finished) {
                restartAnimation();
            } else {
                playing = true;
                d3.select(this).text("Pause");
                timer = setInterval(() => {
                    update(currentYear);
                    d3.select("#yearLabel").text(currentYear);
                    if (currentYear < 2022) {
                        currentYear++;
                    } else {
                        clearInterval(timer);
                        playing = false;
                        finished = true;
                        d3.select("#button").text("Restart");
                    }
                }, 400);
            }
        });
    });
}

// Call the function to initialize the scatter plot
initializeScatterPlot();
