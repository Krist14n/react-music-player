import { useSubscription, useMutation } from '@apollo/react-hooks';
import { Card, CardActions, CardContent, CardMedia, CircularProgress, IconButton, Typography, makeStyles } from '@material-ui/core';
import { Pause, PlayArrow, Save } from '@material-ui/icons';
import React from 'react'
import { SongContext } from '../App';
import { ADD_OR_REMOVE_FROM_QUEUE } from '../graphql/mutations';
import { GET_TRACKS } from '../graphql/subscriptions';

function SongList() {

    const { data, loading, error} = useSubscription(GET_TRACKS)

    if(loading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 50
            }}>
                <CircularProgress></CircularProgress>
            </div>
        )
    }

    if(error) {
        return (<div>Error fetching tracks</div>)
    }

    return <div>{ data.tracks.map(song => ( 
        <Song key={song.id} song={song} />
    ))}</div>
}

const useStyles = makeStyles(theme => ({
    container: {
        margin: theme.spacing(3)
    },
    songInfoContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    songInfo: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between'
    },
    thumbnail: {
        objectFit: 'cover',
        width: 140,
        height: 140
    }
}))

function Song({song}) {
    const classes = useStyles()
    const {id} = song
    const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
        onCompleted: data => {
            localStorage.setItem('queue', JSON.stringify(data.addOrRemoveFromQueue))
        }
    })
    const {state, dispatch} = React.useContext(SongContext)
    const [currentSongPlaying, setCurrentSongPlaying ] = React.useState(false)
    const  {artist, title, thumbnail} = song;

    React.useEffect(() => {
       const isSongPlaying  = state.isPlaying && id === state.song.id
       setCurrentSongPlaying(isSongPlaying)
    }, [id, state.song.id, state.isPlaying])

    function handleTogglePlay(params) {
        dispatch({type: 'SET_SONG', payload: {song}})
        dispatch(state.isPlaying ? {type: 'PAUSE_SONG'} : {type: 'PLAY_SONG'})
    }

    function handleAddOrRemoveFromQueue() {
        addOrRemoveFromQueue({
            variables: { input: {...song, __typename: 'Song'}}
        })
    }

    return (
        <Card className={classes.container}> 
            <div className={classes.songInfoContainer}>
                <CardMedia image={thumbnail} className={classes.thumbnail}></CardMedia>
                <div className={classes.songInfo}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {title}
                        </Typography>
                         <Typography  variant="body1" component="p" color="textSecondary">
                            {artist}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <IconButton onClick={handleTogglePlay} size="small" color="primary">
                            { currentSongPlaying ? <Pause /> :  <PlayArrow />}
                        </IconButton>
                         <IconButton size="small" color="secondary">
                            <Save onClick={handleAddOrRemoveFromQueue} />
                        </IconButton>
                    </CardActions>
                </div>
            </div>
        </Card>
    )
}

export default SongList;