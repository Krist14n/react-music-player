
import { Grid, useMediaQuery } from '@material-ui/core';
import React from 'react';
import AddSong from './components/AddSong';
import Header from './components/Header';
import SongList from './components/SongList';
import SongPlayer from './components/SongPlayer';
import songReducer from './reducer'

export const SongContext = React.createContext({
  song: {
    id: "8bc41b62-ff0e-44f7-b75e-522af9d87638",
    title: "There Is a Light That Never Goes Out (2008 Remaster)",
    artist: "The Smiths",
    thumbnail: "https://i1.sndcdn.com/artworks-OYuOJAbR6A8C-0-t500x500.jpg",
    duration: 230,
    url: "https://soundcloud.com/thesmiths/there-is-a-light-that-never-goes-out"
  },
  isPlaying: false
})

function App() {
  const initialSongState = React.useContext(SongContext)
  const [state, dispatch] = React.useReducer(songReducer, initialSongState)
  const greaterThanMd = useMediaQuery(theme => theme.breakpoints.up('md'))

  return (
   <SongContext.Provider value={{state, dispatch}}>
    <Header />
    <Grid container spacing={3} >
      <Grid 
        style={{
          paddingTop: 80
        }}
        item xs={12} md={7}>
          <AddSong /> 
          <SongList />
      </Grid>
      <Grid style={
        greaterThanMd ?
        {
          position: 'fixed',
          width: '100%',
          right: 0,
          top: 70
      } : {
          position: 'fixed',
          left: 0,
          bottom: 0,
          width: '100%'
      }
      } item xs={12} md={5}>
          <SongPlayer />
      </Grid>  
    </Grid>
   </SongContext.Provider>
  );
}

export default App;
