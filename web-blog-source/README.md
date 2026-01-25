# Blog - Next.js Static Site

A personal blog built with Next.js using Static Site Generation (SSG) for SEO optimization, hosted on GitHub Pages.

## Prerequisites

- Node.js 18+
- Yarn (recommended) or npm

## Local Development

```bash
# Install dependencies
yarn install

# Run development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view in your browser.

## Local Build & Preview

```bash
# Build static site (with GitHub token to avoid rate limiting)
GITHUB_TOKEN=your_token_here yarn build

# Preview the built site
npx serve out
```

The static output is generated in the `out/` directory.

### GitHub Token Setup (Required for Local Build)

The build fetches GitHub Gists, which requires authentication to avoid API rate limiting (403 errors).

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "blog-build")
4. Select scope: `gist` (read access to gists)
5. Generate and copy the token

Then use it when building:

```bash
GITHUB_TOKEN=ghp_xxxxxxxxxxxx yarn build
```

Or set it permanently in your shell profile (`~/.bashrc` or `~/.zshrc`):

```bash
export GITHUB_TOKEN=ghp_xxxxxxxxxxxx
```

## Automatic Publishing (GitHub Actions)

The site is automatically built and deployed when you push to the `master` branch.

### How it works:

1. Push changes to `master` branch
2. GitHub Actions workflow (`.github/workflows/production-work.yml`) triggers
3. Workflow runs `yarn build` in `web-blog-source/`
4. Static files from `out/` are copied to repository root
5. Changes are committed and pushed to GitHub Pages

### To publish:

```bash
git add .
git commit -m "Your commit message"
git push origin master
```

The site will be live at: https://brucewind.github.io

## Project Structure

```
web-blog-source/
├── pages/
│   ├── _app.js          # MUI ThemeProvider, dark mode
│   ├── _document.js     # MUI SSR support
│   ├── index.js         # Root redirect (language detection)
│   └── [lang]/
│       ├── index.js     # Blog list (/en/, /cn/)
│       └── blog/[slug].js  # Blog post pages
├── components/
│   ├── MarkdownRenderer.js  # Markdown rendering
│   └── LanguageSwitch.js    # Language toggle
├── lib/
│   ├── posts.js         # Build-time data fetching
│   └── createEmotionCache.js
├── styles/
│   └── globals.css      # Global styles
├── next.config.js       # Next.js config (static export)
└── out/                 # Build output (static HTML)
```

## Content Sources

- English posts: `../en_mds/` and `../config/en_blog_list.json`
- Chinese posts: `../md/` and `../config/cn_blogs.json`
- External markdown files and GitHub Gists are fetched at build time
