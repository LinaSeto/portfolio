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

// // pie chart
// let rolledData = d3.rollups(
//   projects,
//   (v) => v.length,
//   (d) => d.year,
// );

// let data = rolledData.map(([year, count]) => {
//   return { value: count, label: year };
// });

// let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

// let sliceGenerator = d3.pie().value((d) => d.value);;
// let arcData = sliceGenerator(data);
// let arcs = arcData.map((d) => arcGenerator(d));
// let colors = d3.scaleOrdinal(d3.schemeTableau10);

// arcs.forEach((arc, idx) => {
//     d3.select('svg')
//       .append('path')
//       .attr('d', arc)
//       .attr("fill", colors(idx))
// });

// // pie chart legend
// let legend = d3.select('.legend');
// data.forEach((d, idx) => {
//   legend
//     .append('li')
//     .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
//     .attr('class', 'legend-item')
//     .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
// })

// // search bar
// let query = '';
// let searchInput = document.querySelector('.searchBar');

// searchInput.addEventListener('input', (event) => {
//   // update query value
//   query = event.target.value;

//   // filter the projects
//   let filteredProjects = projects.filter((project) => {
//     let values = Object.values(project).join('\n').toLowerCase();
//     return values.includes(query.toLowerCase());
//   });

//   // render updated projects
//   renderProjects(filteredProjects, projectsContainer, 'h2')
// });

// Refactor all plotting into one function
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
    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

    // re-calculate slice generator, arc data, arc, etc.
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => arcGenerator(d));
    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    // TODO: clear up paths and legends
    newArcs.forEach((arc, idx) => {
        newSVG.append('path')
            .attr('d', arc)
            .attr("fill", colors(idx))
    });
    // update paths and legends, refer to steps 1.4 and 2.2
    let legend = d3.select('.legend');
    newData.forEach((d, idx) => {
        legend
            .append('li')
            .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
            .attr('class', 'legend-item')
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
    })
}

// Call this function on page load
renderPieChart(projects);

let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
    query = event.target.value;
    // let filteredProjects = setQuery(event.target.value);
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });

    // re-render legends and pie chart when event triggers
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});