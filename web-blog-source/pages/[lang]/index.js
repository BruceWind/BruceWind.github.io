import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import LanguageSwitch from '../../components/LanguageSwitch';
import { getCompleteBlogList } from '../../lib/posts';

export default function Home({ categories, lang }) {
  const isChineseUI = lang === 'cn';

  return (
    <>
      <Head>
        <title>{isChineseUI ? 'BruceWind的博客' : "BruceWind's Blog"}</title>
        <meta 
          name="description" 
          content={isChineseUI 
            ? 'BruceWind的个人博客 - Android开发、Linux等技术文章' 
            : "BruceWind's personal blog - Android development, Linux, and more."
          } 
        />
      </Head>

      <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.paper', padding: 2 }}>
        <Paper elevation={3}>
          <Box sx={{ position: 'relative' }}>
            <LanguageSwitch currentLang={lang} />
            
            <List
              sx={{ bgcolor: 'background.paper' }}
              component="nav"
              aria-labelledby="blog-list"
            >
              {categories.map((category) => (
                <React.Fragment key={category.category}>
                  <ListSubheader component="div" id={`category-${category.category}`}>
                    {category.category}
                  </ListSubheader>
                  <Divider />
                  {category.data.map((post, index) => {
                    // Gists are English-only, so always use /en/ for them
                    const isGist = category.category === 'Gists';
                    const linkLang = isGist ? 'en' : lang;
                    // Pass original language as query param for gists so back button works correctly
                    const href = isGist && lang !== 'en' 
                      ? `/${linkLang}/blog/${post.slug}/?from=${lang}`
                      : `/${linkLang}/blog/${post.slug}/`;
                    return (
                    <Link
                      key={`${category.category}-${index}`}
                      href={href}
                      passHref
                      legacyBehavior
                    >
                      <ListItemButton
                        component="a"
                        sx={{ marginLeft: 1 }}
                        divider={true}
                      >
                        <ListItemText
                          primary={
                            <Typography style={{ wordWrap: 'break-word' }} variant="body1">
                              {post.title}
                            </Typography>
                          }
                          secondary={post.date}
                        />
                      </ListItemButton>
                    </Link>
                    );
                  })}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Paper>
      </Box>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { lang: 'en' } },
      { params: { lang: 'cn' } },
    ],
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { lang } = params;
  const categories = await getCompleteBlogList(lang);

  return {
    props: {
      categories,
      lang,
    },
  };
}
