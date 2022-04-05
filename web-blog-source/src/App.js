import logo from './logo.svg';
import './App.css';
// import * as React from 'react';
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import Snackbar from '@mui/material/Snackbar';
import Skeleton from '@mui/material/Skeleton';
import Paper from '@mui/material/Paper';
import { FixedSizeList } from 'react-window';
import ListSubheader from '@mui/material/ListSubheader';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
// import blogs from '../config/config.json';


import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ReactMarkdown from "react-markdown";
import 'github-markdown-css'


let isRequesting = false;
function App() {
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

  const [currentBlogTitle, setCurrentBlogTitle] = useState(null);
  const [currentBlogSrc, setCurrentBlogSrc] = useState(null);
  const [currentBlogRaw, setCurrentBlogRaw] = useState(null);


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
    // setShowingLoading(true);
    let finalUrl = (subItem.mdsource.includes('http://') || subItem.mdsource.includes('https://')) ?
      subItem.mdsource : 'https://brucewind.github.io/' + subItem.mdsource;

    console.log(finalUrl);
    setCurrentBlogSrc(finalUrl);

    fetch(finalUrl)
      .then((res) => res.text())
      .then(text => {
        setCurrentBlogRaw(text);
      })
      .catch(err => {
        setTips('请求失败！');
      });
  }


  function renderRow() {
    if (!blogs) {
      return <Box>
        <Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton />
        <Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton />
      </Box>;
    }

    return (<List
      sx={{ bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader">
      {blogs.map(item => getList(item))}
    </List>
    );
  }

  function onDialogClose() {
    setCurrentBlogSrc(null);
    setCurrentBlogRaw(null);
    setCurrentBlogTitle(null);
  }



  useEffect(() => {


    if (!blogs && !isRequesting) {
      isRequesting = true;
      fetch('https://brucewind.github.io/config/config.json').then(response => response.json())
        .then(data => {
          isRequesting = false;
          setBlogs(data);
        })
        .catch(err => {
          isRequesting = false;
          setTips('请求失败！');
          console.error(err);
        })
    }

    // Specify how to clean up after this effect:
    return function cleanup() {

    };
  });


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
          {currentBlogRaw ? '原文' : '加载中'}
        </DialogTitle>

        <Divider />
        <DialogContent>
          {currentBlogRaw ?
            <div className='markdown-body'><ReactMarkdown children={currentBlogRaw} /></div> :
            <CircularProgress color="inherit" />
          }
        </DialogContent>

        <DialogActions>
          <Button onClick={() => onDialogClose()}>关闭</Button>
        </DialogActions>
      </Dialog>

    </Box>
    </ThemeProvider>
  );
}

export default App;
