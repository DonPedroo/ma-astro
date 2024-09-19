// src/utils/dataUtils.js

export function gatherAllData() {
  // Import all the pages with their frontmatter
  const allPages = import.meta.glob('../data/**/*.md', { eager: true });
  const allProjects = import.meta.glob('../data/projects/*.md', { eager: true });

  // Get the post from the specific Markdown file
  const post = allPages['../data/home/home.md'];

  // Check if the post exists, otherwise throw an error
  if (!post) {
    console.error('Post not found');
    return [];
  }

  // Get the frontmatter from the post
  const data = post.frontmatter;

  // Create an array to hold all the data
  const allData = [];

  // Push each section's data into the array
  if (data.introduction) allData.push(data.introduction);
  if (data.largeParagraph) allData.push(data.largeParagraph);
  if (data.whatwedo) allData.push(data.whatwedo);
  if (data.quotes) allData.push(data.quotes);
  if (data.projects) {
    const projectsArray = [];
    
    // Map over project titles from data.projects and fetch the full project data
    data.projects.projects.forEach((projectTitle) => {
      const projectFile = Object.values(allProjects).find(
        (project) => project.frontmatter.title === projectTitle
      );

      if (projectFile) {
        projectsArray.push(projectFile.frontmatter);
      }
    });

    // Push the full projects array into allData
    allData.push({ ...data.projects, projects: projectsArray });
  }
  if (data.footer) allData.push(data.footer);
  // Console log the gathered data for debugging

  return allData;
}
