import { fetchJSON, renderProjects } from '../global.js';

console.log('projects.js is running');

// get projects from json
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

// title with length
const projectsTitle = document.querySelector('.projects-title')
projectsTitle.textContent = `${projects.length} Projects`