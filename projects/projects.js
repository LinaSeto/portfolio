import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

console.log('projects.js is running');

// get projects from json
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

// title with length
const projectsTitle = document.querySelector('.projects-title')
projectsTitle.textContent = `${projects.length} Projects`


// pie chart + filter
let selectedIndex = -1;
let selectedYear = null;
let query = '';
let newData = [];
let searchInput = document.querySelector('.searchBar');

function getFilteredProjects() {
    return projects.filter((project) => {
        const values = Object.values(project).join('\n').toLowerCase();
        const matchesSearch = values.includes(query.toLowerCase());
        const matchesYear = selectedYear === null || project.year === selectedYear;
        // const matchesYear = selectedIndex === -1
        //     || project.year === newData[selectedIndex]?.label;
        return matchesSearch && matchesYear;
    });
}

function renderPieChart(projectsGiven) {
    let newSVG = d3.select('svg');
    newSVG.selectAll('path').remove();
    d3.select('.legend').selectAll('li').remove();

    // re-calculate rolled data
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );

    // re-calculate data
    newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    // re-calculate slice generator, arc data, arc, etc.
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => arcGenerator(d));
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    // clear up paths and legends
    newArcs.forEach((arc, idx) => {
        newSVG.append('path')
            .attr('d', arc)
            .attr("fill", colors(idx))
            .attr('class', newData[idx].label === selectedYear ? 'selected' : '')
            .on('click', () => {
                // selectedIndex = selectedIndex === idx ? -1 : idx;
                selectedYear = selectedYear === newData[idx].label ? null : newData[idx].label;


                let filteredProjects = getFilteredProjects();
                renderProjects(filteredProjects, projectsContainer, 'h2');

                newSVG
                    .selectAll('path')
                    .attr('class', (_, i) =>
                        // i === selectedIndex ? 'selected' : ''
                        newData[i].label === selectedYear ? 'selected' : ''
                    );

                legend.selectAll('li')
                    .attr('class', (_, i) => (
                        // i === selectedIndex ? 'legend-item selected' : 'legend-item'
                        newData[i].label === selectedYear ? 'legend-item selected' : 'legend-item' 
                    ));

            });
    });
    // update paths and legends
    let legend = d3.select('.legend');
    newData.forEach((d, idx) => {
        legend
            .append('li')
            .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
            .attr('class', 'legend-item')
            .attr('class', d.label === selectedYear ? 'legend-item selected' : 'legend-item')
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
    })
}

// Call this function on page load
renderPieChart(projects);

// filter
searchInput.addEventListener('input', (event) => {
    query = event.target.value;

    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });

    // re-render legends and pie chart when event triggers
    renderProjects(getFilteredProjects(), projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});

