function initializeMigrationVisualization() {
    // Clear previous SVG if exists
    d3.select("#migration").select("svg").remove();

    // Dimensions and margins of the graph
    const margin = {top: 50, right: 200, bottom: 60, left: 50},
        width = 900 - margin.left - margin.right,
        height = 650 - margin.top - margin.bottom;

    // Append the SVG object to the body of the page
    const svg = d3.select("#migration")
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
            d.Emigrants = +d.Emigrants;
            d.Immigrants = +d.Immigrants;
        });

        // Filter data to include only years from 2008 onwards
        data = data.filter(d => d.Year >= 2008);

        // X axis: Year
        const x = d3.scaleLinear()
            .domain([2008, d3.max(data, d => d.Year)])
            .range([0, width]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d")))
            .attr("class", "axis-label");

        // Y axis: Emigrants and Immigrants
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.Emigrants, d.Immigrants))])
            .nice()
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y).ticks(height / 40))
            .call(g => g.select(".domain"))
            .selectAll("text")
            .attr("class", "axis-label");

        // Add X axis label
        svg.append("text")
            .text("Year")
            .attr("class", "axis-label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + margin.bottom - 10);

        // Add Y axis label
        svg.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "end")
            .attr("x", margin.top + 40)
            .attr("y", margin.left - 70)
            .text("Emigrants/Immigrants (N)");

        // Line generator function
        const line = d3.line()
            .x(d => x(d.Year))
            .y(d => y(d.value));

        // Draw the Emigrants line
        svg.append("path")
            .datum(data.map(d => ({Year: d.Year, value: d.Emigrants})))
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        // Draw the Immigrants line
        svg.append("path")
            .datum(data.map(d => ({Year: d.Year, value: d.Immigrants})))
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        // Add legend
        const legend = svg.append("g")
            .attr("transform", `translate(${width + 10},${20})`);

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", "steelblue");

        legend.append("text")
            .attr("x", 20)
            .attr("y", 10)
            .text("Emigrants")
            .attr("text-anchor", "start");

        legend.append("rect")
            .attr("x", 0)
            .attr("y", 20)
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", "red");

        legend.append("text")
            .attr("x", 20)
            .attr("y", 30)
            .text("Immigrants")
            .attr("text-anchor", "start");

        // Tooltip
        var Tooltip = d3.select("#migration")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");

        // Functions for tooltip
        var mouseover = function(event,d) {
            Tooltip.style("opacity", 1);
        };

        var mousemove = function(event,d) {
            Tooltip.html(`<strong>Year:</strong> ${d.Year}<br/><strong>Emigrants:</strong> ${d.Emigrants}<br/><strong>Immigrants:</strong> ${d.Immigrants}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 15) + "px");
        };

        var mouseleave = function(event,d) {
            Tooltip.style("opacity", 0);
        };

        // Add circles for Emigrants
        svg.selectAll(".emigrantsDot")
            .data(data)
            .enter().append("circle")
            .attr("class", "emigrantsDot")
            .attr("cx", d => x(d.Year))
            .attr("cy", d => y(d.Emigrants))
            .attr("r", 8)
            .attr("fill", "steelblue")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        // Add circles for Immigrants
        svg.selectAll(".immigrantsDot")
            .data(data)
            .enter().append("circle")
            .attr("class", "immigrantsDot")
            .attr("cx", d => x(d.Year))
            .attr("cy", d => y(d.Immigrants))
            .attr("r", 8)
            .attr("fill", "red")
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);
    });
}

// Initialize the visualization when the script is loaded
initializeMigrationVisualization();
