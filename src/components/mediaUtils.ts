


interface MediaAsset {
  src: string;
  cssClass: string;
  bgType: string;
  sectionId: string;
}

interface Project {
  slug: string;
  media?: string;
}

export function gatherMediaFromSections(allData: any[]): MediaAsset[] {
  const mediaAssets: MediaAsset[] = [];

  // Loop through all sections in allData
  allData.forEach((section) => {
    // Conditional outputs based on section IDs
    if (section.id === 'how-we-get-down') {
      mediaAssets.push({ src: '/images/grunge.webp', cssClass: 'grunge', bgType:'3', sectionId:section.id });
    } else if (section.id === 'you-heard') {
      mediaAssets.push({ src: '/images/grunge.webp', cssClass: 'grunge', bgType:'3', sectionId:section.id });
    } else if (section.id === 'what-we-do') {
      mediaAssets.push({ src: '#EAEAEA', cssClass: 'bg-massgrey', bgType:'4', sectionId:section.id });
    } else {
      // Handle other cases or sections with media
      if (section.media) {
        mediaAssets.push({ src: section.media, cssClass: 'default-class', bgType:'1', sectionId:section.id });
      }
    }

        // Special case: Handle projects section which contains multiple projects
        if (section.id === 'work' && section.projects) {
          section.projects.forEach((project: Project) => {
            if (project.media) {
              const isMp4 = project.media.toLowerCase().endsWith('.mp4');
              const bgType = isMp4 ? '1' : '2'; // Set bgType to '1' for mp4, '2' for others
        
              mediaAssets.push({
                src: project.media,
                cssClass: 'default-class',
                bgType: bgType,
                sectionId: project.slug
              });
            }
          });
        }
        
    
  });

  // Console log the gathered media for debugging
  // console.log('Gathered media assets:', mediaAssets);

  return mediaAssets;
}

