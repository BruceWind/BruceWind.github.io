import logo from './logo.svg';
import './App.css';
// import * as React from 'react';
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import Skeleton from '@mui/material/Skeleton';
import Paper from '@mui/material/Paper';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
// import blogs from '../config/config.json';


import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkMermaidjs from 'remark-mermaidjs'
import 'github-markdown-css'

const KYE_IS_C = 'isChinese';

let isRequesting = false;
let cachedIsChinese = false; //boolean
function App() {


  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(22px)',
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url('data:image/svg+xml;utf8,<?xml version="1.0" ?><svg height="20" width="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path   d="M0 0h24v24H0z" fill="none"/><path fill="white"  d="M12 19a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-5.5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm11 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM13 2v2h6v2h-1.968a18.222 18.222 0 0 1-3.621 6.302 14.685 14.685 0 0 0 5.327 3.042l-.536 1.93A16.685 16.685 0 0 1 12 13.726a16.696 16.696 0 0 1-6.202 3.547l-.536-1.929a14.7 14.7 0 0 0 5.327-3.042 18.077 18.077 0 0 1-2.822-4.3h2.24A16.031 16.031 0 0 0 12 10.876a16.168 16.168 0 0 0 2.91-4.876L5 6V4h6V2h2z"/></g></svg>')`,
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
      width: 32,
      height: 32,
      '&:before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url('data:image/svg+xml;utf8,<?xml version="1.0" ?><svg height="20" width="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z"  fill="none" /><path  fill="white"  d="M14 10h2v.757a4.5 4.5 0 0 1 7 3.743V20h-2v-5.5c0-1.43-1.175-2.5-2.5-2.5S16 13.07 16 14.5V20h-2V10zm-2-6v2H4v5h8v2H4v5h8v2H2V4h10z"/></svg>')`,
      },
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      borderRadius: 20 / 2,
    },
  }));

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );

  let vertical = 'top';
  let horizontal = 'center';
  const [tips, setTips] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const [showingLoading, setShowingLoading] = useState(false);


  const [isChinese, setIsChinese] = useState(false);

  const [currentBlogTitle, setCurrentBlogTitle] = useState(null);
  const [currentBlogSrc, setCurrentBlogSrc] = useState(null);
  const [currentBlogRaw, setCurrentBlogRaw] = useState(null);


  const onSwitchLanguage = (event, checked) => {

    console.log('onSwitchLanguage', `checked: ${checked}, event: ${event.target.checked}`);
    localStorage.setItem(KYE_IS_C, '' + checked);

    setBlogs(null);
    setIsChinese(new Boolean(checked).valueOf());
    cachedIsChinese = checked ? true : false;

    setTimeout(async () => {
      toRequestBlogs();
    }, 300);

  }

  function getList(item) {
    return (
      <List key={item.category}>
        <ListSubheader component="div" id="nested-list-subheader">
          {item.category}
        </ListSubheader>
        <Divider />
        {item.data.map((subItem, index) => <ListItemButton
          sx={{ marginLeft: 1 }}
          onClick={() => clickBlogItem(subItem)}
          divider={true}
          selected={false}
          key={item.category + index}>
          <ListItemText primary={<Typography style={{ wordWrap: "break-word" }} type="h3">{subItem.title}</Typography>} secondary={subItem.date} />
        </ListItemButton>)
        }
      </List>
    );
  }


  function clickBlogItem(subItem) {
    setShowingLoading(true);
    let finalUrl = (subItem.mdsource.includes('http://') || subItem.mdsource.includes('https://')) ?
      subItem.mdsource : 'https://brucewind.github.io/' + subItem.mdsource;

    console.log(finalUrl);
    setCurrentBlogSrc(finalUrl);

    fetch(finalUrl)
      .then((res) => res.text())
      .then(text => {
        setCurrentBlogRaw(text);
        setShowingLoading(false);
      })
      .catch(err => {
        setShowingLoading(false);
        setTips(isChinese ? '请求失败！' : 'Request failed!');
      });
  }


  function renderRow() {
    if (!blogs) {
      return <Box>
        <Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton />
        <Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton />

        <Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton />

        <Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton />
      </Box>;
    }

    return (
      <div>
        <List
          sx={{ bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader">
          {blogs.map(item => getList(item))}
        </List>

        <div style={{ position: 'absolute', top: 22, right: 15, height: 100, zIndex: 1300 }}>
          <MaterialUISwitch sx={{ m: 1 }} onChange={onSwitchLanguage} checked={isChinese} />
        </div>
      </div>
    );
  }

  function onDialogClose() {
    setCurrentBlogSrc(null);
    setCurrentBlogRaw(null);
    setCurrentBlogTitle(null);
  }


  function toRequestBlogs() {

    console.log(`toRequestBlogs isChinese: ${cachedIsChinese}`);

    const blogJSONFileName = cachedIsChinese ? 'cn_blogs.json' : 'en_blog_list.json';

    if (!isRequesting) {
      isRequesting = true;

      fetch(`https://brucewind.github.io/config/${blogJSONFileName}`)
        .then(response => response.json())
        .then(respBlogs => {
          isRequesting = false;
          // setBlogs(data);

          fetch('https://api.github.com/users/brucewind/gists').then(gitsRsp => gitsRsp.json())
            .then(gistData => {
              isRequesting = false;

              const gitsArr = [];
              gistData.map((itemGits, index) => {
                if (itemGits.files) {
                  const title = Object.keys(itemGits.files)[0];
                  if (itemGits.files[title].type == "text/markdown") {
                    gitsArr.push({
                      "title": title,
                      "mdsource": itemGits.files[title].raw_url,
                      "date": itemGits.created_at
                    });
                  }

                }
              });

              respBlogs.push({
                category: 'gits',
                data: gitsArr
              });
              setBlogs(respBlogs);

            });

        })
        .catch(err => {
          isRequesting = false;
          setTips(isChinese ? '请求失败！' : 'Request failed!');
          console.error(err);
        });
    }
    else {
      console.warn(`isRequesting: ${isRequesting}, logs: ${blogs}`);
    }
  }

  const prepareLanguages = () => {

    var language = window.navigator.userLanguage || window.navigator.language;
    let isChineseEnv = 'zh-CN' == language;

    console.log('is Chinese Env:' + isChineseEnv)

    //a string value in 'true' or 'false'.
    let strIsC = localStorage.getItem(KYE_IS_C) || isChineseEnv ? 'true' : 'false';

    console.log('set state  isChinese:' + strIsC)
    cachedIsChinese = strIsC.toLowerCase() == 'true' ? true : false;
    setIsChinese(cachedIsChinese);

  }


  useEffect(() => {

    prepareLanguages();
    toRequestBlogs(isChinese);


    // to clean up after this effect:
    return function cleanup() {
      console.log('cleanup');
    };
  }, []);


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ width: '100%', height: '100%', bgcolor: 'background.paper', padding: 2 }}>

        <Paper elevation={3} >
          {renderRow()}

        </Paper>
        {/* 
      */}

        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={tips ? true : false}
          message={tips}
          key={vertical + horizontal}
        />

        <Dialog
          fullWidth
          maxWidth="xl"
          sx={{ width: '90%', height: '100%' }}
          open={currentBlogSrc ? true : false}
          onClose={() => onDialogClose()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <DialogTitle id="alert-dialog-title">

            {
              isChinese ?
                (currentBlogRaw ? '原文' : '加载中')
                :
                (currentBlogRaw ? 'Content' : 'loading')
            }
          </DialogTitle>

          <Divider />
          <DialogContent>
            {currentBlogRaw ?
              <div className='markdown-body'><ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm,remarkMermaidjs]} children={currentBlogRaw} /></div> :
              <CircularProgress color="inherit" />
            }
          </DialogContent>

          <DialogActions>
            <Button onClick={() => onDialogClose()}>
              {isChinese ? '关闭' : 'Close'}
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </ThemeProvider>
  );
}

export default App;
