# Mortality, birth, natural population growth and emigration in Portugal

## Description
The aim of this project is to to visualise and combine the following variables: mortality rate, birth rate and migration in Portugal due to my interest in Portugal’s demographic situation. Its objective is to see the decreasing natural growth rate over the years whilst considering the impact of emigration as a possible cause.
![Screenshot 2024-06-19 at 07 15 17](https://github.com/mfpa231/mortality_birth_pt/assets/107937846/7836eade-a80a-4577-be15-c57bd2a51db6)

## Interface
There are three data visualisations which can be viewed individually by clicking on each button. 
![Screenshot 2024-06-19 at 07 16 21](https://github.com/mfpa231/mortality_birth_pt/assets/107937846/1d0d0ebd-d287-44f0-8316-bb7776bf7393)

The first graph is an animated scatterplot showing the mortality and birth rate during 1960-2022. By hovering on the legend, a specific decade can be seen in detail.
![Screenshot 2024-06-19 at 07 19 53](https://github.com/mfpa231/mortality_birth_pt/assets/107937846/369ccaa2-b828-4ea5-9b7c-f443ea8e67aa)

The second graph is a connected scatterplot showing the evolution of emigration and immigration from 2008-2022 as there seems to be no data on immigration before 2008.
![Screenshot 2024-06-19 at 07 23 21](https://github.com/mfpa231/mortality_birth_pt/assets/107937846/c19c2a0f-d9f5-4678-b8b0-a80e56d86c76)

The third graph is the main visualisation. It is a bubble graph with the mortality rate (%) on the x axis, the birth rate (%) on the y axis, the size of the bubbles is based on the number of emigrants per thousand inhabitants in that year and the colour of the bubble ranges from blue to red based on the natural growth rate (the lower the rate, the closer to blue on the scale). 
There is a key on the right-hand side to give the user an idea of the relation between the size of the bubbles as well as the colour gradient.

There is an animation which begins once the user selects 'Play'. The animation can be paused when 'Pause' is selected and then be continued as well as restarted once it has ended.

![Screenshot 2024-06-05 at 22 59 08](https://github.com/mfpa231/mortality_birth_pt/assets/107937846/673da4ad-e76c-4e10-a109-2f61f2cf51c9)

![Screenshot 2024-06-05 at 22 41 08](https://github.com/mfpa231/mortality_birth_pt/assets/107937846/8b483206-4682-4a07-84a7-70a662a68475)

To get the precise information per year, the user can hover on each bubble to know the exact mortality rate, birth rate, natural growth rate and number of emigrants per thousand inhabitants. 

![Screenshot 2024-06-05 at 22 35 38](https://github.com/mfpa231/mortality_birth_pt/assets/107937846/ab53ee6d-510d-4b44-b660-6217b86c0324)

## Tools used
This data visualisation was coded using the [D3.js](https://d3js.org) library. 
It uses the [bubble plot](https://d3-graph-gallery.com/bubble.html) example as a foundation, including the [bubble legend](https://d3-graph-gallery.com/graph/bubble_legend.html) and the [tooltip](https://d3-graph-gallery.com/graph/bubble_template.html) to give information on hover. The [connected scatterplot](https://d3-graph-gallery.com/connectedscatter.html) was used in the second visualisation.

## Data
The project uses five data sets obtained from [Pordata.pt](https://www.pordata.pt), a statistics database about Portugal and Europe, covering themes such as population, education and health. The data sets can be accessed here:

- [Emigrants per thousand habitants](https://www.pordata.pt/en/portugal/emigrants+per+thousand+inhabitants-832)
- [Crude birth rate](https://www.pordata.pt/en/portugal/crude+birth+rate-527)
- [Crude death rate](https://www.pordata.pt/en/portugal/crude+death+rate+and+infant+mortality+rate-528)
- [Permanent Immigrants](https://www.pordata.pt/en/portugal/permanent+immigrants+total+and+by+nationality-3795)
- [Permanent Emigrants](https://www.pordata.pt/en/portugal/permanent+emmigrants+total+and+by+nationality-3797)

The natural population growth rate was calculated by subtracting the crude death rate from the crude birth rate.

## Acknowledgments
This project was developed as part of the assessment for the Data Visualisation course given by Professor [Isaac Pante](https://isaacpante.net) at the University of Lausanne. 
