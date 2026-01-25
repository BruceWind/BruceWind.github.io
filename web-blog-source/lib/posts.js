// This module is ONLY for server-side use in getStaticProps/getStaticPaths
// It cannot be imported by client-side code

/**
 * Generate a URL-safe slug from a title or filename
 * Note: We do NOT use encodeURIComponent here because Next.js handles encoding
 * and GitHub Pages expects the actual characters (not double-encoded)
 */
export function generateSlug(title, mdsource) {
  // If it's an external URL, use the title
  if (mdsource.startsWith('http://') || mdsource.startsWith('https://')) {
    // Use title, make it URL-safe (replace spaces with dashes)
    return title.replace(/\s+/g, '-').toLowerCase();
  }
  
  // For local files, use the filename without extension
  const path = require('path');
  // Decode any existing URL encoding in the filename first
  const filename = path.basename(decodeURIComponent(mdsource), '.md');
  return filename;
}

/**
 * Load blog list from JSON config files
 */
export function getBlogList(lang) {
  const fs = require('fs');
  const path = require('path');
  
  const CONFIG_DIR = path.join(process.cwd(), '..', 'config');
  const configFile = lang === 'cn' ? 'cn_blogs.json' : 'en_blog_list.json';
  const configPath = path.join(CONFIG_DIR, configFile);
  
  try {
    const fileContents = fs.readFileSync(configPath, 'utf8');
    const categories = JSON.parse(fileContents);
    
    // Add slugs to each blog post
    return categories.map(category => ({
      ...category,
      data: category.data.map(post => ({
        ...post,
        slug: generateSlug(post.title, post.mdsource),
      })),
    }));
  } catch (error) {
    console.error(`Error loading blog list for ${lang}:`, error);
    return [];
  }
}

/**
 * Get all blog posts with their slugs for static path generation
 */
export function getAllPostSlugs(lang) {
  const categories = getBlogList(lang);
  const slugs = [];
  
  categories.forEach(category => {
    category.data.forEach(post => {
      slugs.push({
        slug: post.slug,
        title: post.title,
        mdsource: post.mdsource,
        date: post.date,
        category: category.category,
      });
    });
  });
  
  return slugs;
}

/**
 * Fetch markdown content from a source (local file or URL)
 */
export async function fetchMarkdownContent(mdsource) {
  if (mdsource.startsWith('http://') || mdsource.startsWith('https://')) {
    // External URL - fetch it
    try {
      const response = await fetch(mdsource);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error(`Error fetching markdown from ${mdsource}:`, error);
      return `# Error\n\nFailed to load content from external source.`;
    }
  } else {
    // Local file - decode URL-encoded paths
    const fs = require('fs');
    const path = require('path');
    const MD_DIR = path.join(process.cwd(), '..');
    // Decode URL-encoded characters in the path (e.g., %E6%AC%BE -> actual Chinese characters)
    const decodedMdsource = decodeURIComponent(mdsource);
    const filePath = path.join(MD_DIR, decodedMdsource);
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error(`Error reading local markdown file ${filePath}:`, error);
      return `# Error\n\nFailed to load content from local file.`;
    }
  }
}

/**
 * Get a specific post by slug
 */
export function getPostBySlug(lang, slug) {
  const posts = getAllPostSlugs(lang);
  return posts.find(post => post.slug === slug) || null;
}

/**
 * Fetch GitHub Gists for a user
 */
export async function fetchGitHubGists(username = 'brucewind') {
  try {
    const headers = {
      'Accept': 'application/vnd.github.v3+json',
    };
    
    // Use GitHub token if available (avoids rate limiting)
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }
    
    const response = await fetch(`https://api.github.com/users/${username}/gists`, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch gists: ${response.status}`);
    }
    const gists = await response.json();
    
    const markdownGists = [];
    for (const gist of gists) {
      if (gist.files) {
        const fileNames = Object.keys(gist.files);
        for (const fileName of fileNames) {
          const file = gist.files[fileName];
          if (file.type === 'text/markdown' || fileName.endsWith('.md')) {
            markdownGists.push({
              title: fileName,
              mdsource: file.raw_url,
              date: gist.created_at,
              slug: generateSlug(fileName, file.raw_url),
            });
          }
        }
      }
    }
    
    return markdownGists;
  } catch (error) {
    console.error('Error fetching GitHub gists:', error);
    return [];
  }
}

/**
 * Get complete blog list including gists
 */
export async function getCompleteBlogList(lang) {
  const categories = getBlogList(lang);
  
  // Fetch gists
  const gists = await fetchGitHubGists();
  
  if (gists.length > 0) {
    categories.push({
      category: 'Gists',
      data: gists,
    });
  }
  
  return categories;
}

/**
 * Get all post slugs including gists for static path generation
 */
export async function getAllPostSlugsWithGists(lang) {
  const categories = await getCompleteBlogList(lang);
  const slugs = [];
  
  categories.forEach(category => {
    category.data.forEach(post => {
      slugs.push({
        slug: post.slug,
        title: post.title,
        mdsource: post.mdsource,
        date: post.date,
        category: category.category,
      });
    });
  });
  
  return slugs;
}
