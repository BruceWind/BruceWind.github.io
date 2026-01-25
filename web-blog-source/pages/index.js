import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Detect browser language
    const browserLang = navigator.language || navigator.userLanguage;
    const isChinese = browserLang.startsWith('zh');
    
    // Redirect to appropriate language
    const targetLang = isChinese ? 'cn' : 'en';
    router.replace(`/${targetLang}/`);
  }, [router]);

  return (
    <>
      <Head>
        <title>BruceWind's Blog</title>
        <meta name="description" content="BruceWind's personal blog - Redirecting..." />
      </Head>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Redirecting...
        </Typography>
      </Box>
    </>
  );
}
