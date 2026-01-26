import * as React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MarkdownRenderer from '../../../components/MarkdownRenderer';
import LanguageSwitch from '../../../components/LanguageSwitch';
import { getAllPostSlugsWithGists, getPostBySlug, fetchMarkdownContent } from '../../../lib/posts';

export default function BlogPost({ post, content, lang }) {
  const router = useRouter();
  const { from } = router.query;
  // Use 'from' query param if present (for gists accessed from different language), otherwise use current lang
  const backLang = from || lang;
  const isChineseUI = backLang === 'cn';

  return (
    <>
      <Head>
        <title>{post.title} - BruceWind's Blog</title>
        <meta name="description" content={`${post.title} - ${post.category}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
      </Head>

      <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: 'background.paper', padding: 2 }}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <LanguageSwitch currentLang={lang} />
            
            <Link href={`/${backLang}/`} passHref legacyBehavior>
              <Button
                component="a"
                startIcon={<ArrowBackIcon fontSize="small" />}
                sx={{ marginBottom: 2 }}
              >
                {isChineseUI ? '返回列表' : 'Back to list'}
              </Button>
            </Link>

            <Typography variant="h4" component="h1" gutterBottom>
              {post.title}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {post.category} | {post.date}
            </Typography>

            <Divider sx={{ marginY: 2 }} />

            <MarkdownRenderer content={content} />
          </Box>
        </Paper>
      </Box>
    </>
  );
}

export async function getStaticPaths() {
  const paths = [];

  // Generate paths for both languages
  for (const lang of ['en', 'cn']) {
    const posts = await getAllPostSlugsWithGists(lang);
    
    for (const post of posts) {
      paths.push({
        params: {
          lang,
          slug: post.slug,
        },
      });
    }
  }

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { lang, slug } = params;
  
  // Get all posts including gists
  const posts = await getAllPostSlugsWithGists(lang);
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return {
      notFound: true,
    };
  }

  // Fetch the markdown content
  const content = await fetchMarkdownContent(post.mdsource);

  return {
    props: {
      post,
      content,
      lang,
    },
  };
}
