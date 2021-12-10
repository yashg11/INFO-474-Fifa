let svg = d3.select('svg');

let width = +svg.attr('width');
let height = +svg.attr('height');

let padding = { t: 60, r: 40, b: 30, l: 40 };

let chartWidth = width - padding.l - padding.r;
let chartHeight = height - padding.t - padding.b;

let barBand;
let barHeight;

// Create a group element for appending chart elements
let chartG = svg.append('g')
    .attr('transform', 'translate(' + [padding.l, padding.t / 100] + ')');

/**
 * 
 * "sofifa_id"
 * "short_name",
 * "age",
 * "league_name",
 * "overall",
 * "potential",
 * "player_positions",
 * "pace",
 * "shooting"
 * ,"passing",
 * "dribbling",
 * "defending",
 * "physic",
 * "gk_diving",
 * "gk_handling",
 * "gk_kicking",
 * "gk_reflexes",
 * "gk_speed"
 */
function dataPreprocessor(row) {
    return {
        sofifa_id: +row.sofifa_id,
        short_name: row.short_name,
        age: +row.age,
        league_name: row.league_name,
        overall: row.overall,
        potential: row.potential,
        player_positions: row.player_positions,
        pace: +row.pace, 
        shooting: +row.shooting, 
        passing: +row.passing, 
        dribbling: +row.dribbling,
        defending: +row.defending, 
        physic: +row.physic, 
        gk_diving: +row.gk_diving, 
        gk_handling: +row.gk_handling, 
        gk_kicking: +row.gk_kicking, 
        gk_reflexes: +row.gk_reflexes,
        gk_speed: +row.gk_speed

    };
}

let xScale;

d3.select("button").on("click", function() {
    var player = d3.select("#player").node().value;
    d3.csv("data/fifa_21.csv", dataPreprocessor).then(function(data) {
        let filteredData = data.filter(d => {
            return d.short_name === player
        })
        // Show data
        console.log(filteredData); 
        
        let numberOfBands = 10;
        barBand = chartHeight / numberOfBands;
        barHeight = barBand * 0.7

        xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, width / 1.5]);

        let topAxis = d3.axisTop(xScale).ticks(10).tickFormat((d) => {
            return d;
        });

        svg.append('g')
            .attr('class', 'axis-label')
            .call(topAxis)
            .attr('transform', 'translate ( ' + padding.l * 4.5 + ', ' + padding.t + ')');

        svg.append('text')
            .attr('transform', 'translate (' + width / 2 + ',' + padding.t  / 3 + ')')
            .text('Rating')
            .attr('fill', '#4b8bc8')
            .attr('font-weight', 800)
            .attr('font-size', '20px');

        // player attributes
        let graphData = [
            {
                "name": "Dribbling",
                "value": filteredData[0].dribbling
            },
            {
                "name": "Defending",
                "value": filteredData[0].defending
            },
            {
                "name": "Passing",
                "value": filteredData[0].passing
            },
            {
                "name": "Pace",
                "value": filteredData[0].pace
            },
            {
                "name": "Physic",
                "value": filteredData[0].physic
            },
            {
                "name": "Shooting",
                "value": filteredData[0].shooting
            },
            {
                "name": "Overall",
                "value": filteredData[0].overall
            },
        ]

        // "gk_diving","gk_handling","gk_kicking","gk_reflexes","gk_speed"
        if (filteredData[0].player_positions === "GK") {
            graphData = [
                {
                    "name": "Diving",
                    "value": filteredData[0].gk_diving
                },
                {
                    "name": "Handling",
                    "value": filteredData[0].gk_handling
                },
                {
                    "name": "Kicking",
                    "value": filteredData[0].gk_kicking
                },
                {
                    "name": "Reflexes",
                    "value": filteredData[0].gk_reflexes
                },
                {
                    "name": "Speed",
                    "value": filteredData[0].gk_speed
                },
            ]
        }

        updateChart(graphData);
    })
})

function updateChart(data) {
    chartG.selectAll('.bar').data(data).enter().append('rect')
        .attr('class', 'bar')
        .attr('x', 2 * barBand)
        .attr('y', function(d, i) {
            return i * barBand + 2 * barBand;
        })
        .attr('width', function(d) {
            return xScale(d.value);
        })
        .attr('height', barBand / 2);

    
    chartG.selectAll('.bar-label').data(data).enter().append('text')
        .attr('class', 'bar-label')
        .attr('x', 0)
        .attr('y', function(d, i) {
            return i * barBand + 2.2 * barBand;
        })
        .text(function(d) {
            return d.name;
        });
}