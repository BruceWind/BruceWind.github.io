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
import CircularProgress from '@mui/material/CircularProgress';
// import blogs from '../config/config.json';

import Stack from '@mui/material/Stack';


function getList(item) {
  return (
    <List key={item.category}>
      <ListSubheader component="div" id="nested-list-subheader">
        {item.category}
      </ListSubheader>
      <Divider />
      {item.data.map((subItem, index) => <ListItemButton
        sx={{ marginLeft: 2 }}
        key={item.category + index}>
        {subItem.date + ': '}<ListItemText primary={subItem.title} onClick={clickBlog(subItem)} />
      </ListItemButton>)
      }
    </List>
  );
}



function clickBlog(subItem){
  // setShowingLoading(true);
}

function App() {

  let vertical = 'top';
  let horizontal = 'center';
  const [tips, setTips] = useState(null);
  const [blogs, setBlogs] = useState(null);
  const [showingLoading, setShowingLoading] = useState(false);


  function renderRow() {
    if (!blogs) return <Box> <Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /><Skeleton /></Box>;
    blogs.map(item => console.log(item.category));




    return (<List
      sx={{ bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >

      {blogs.map(item => getList(item))}

    </List>
    );


  }





  useEffect(() => {

    if (!blogs) {
      fetch('https://brucewind.github.io/config/config.json').then(response => response.json())
        .then(data => {
          setBlogs(data);
        })
        .catch(err => {
          setTips('请求失败！');
          console.error(err);
        })
    }

    // Specify how to clean up after this effect:
    return function cleanup() {

    };
  });


  return (
    <Box sx={{ width: '100%', height: '100%', bgcolor: 'background.paper', padding: 3 }}>

      <Paper elevation={3} >
        <Stack spacing={2}>
          {renderRow()}
        </Stack>

      </Paper>
{/* 
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showingLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={tips ? true : false}
        message={tips}
        key={vertical + horizontal}
      />

    </Box>
  );
}

export default App;
