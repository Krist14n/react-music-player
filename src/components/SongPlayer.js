import { useQuery } from '@apollo/react-hooks'
import { Card, CardContent, CardMedia, IconButton, Slider, Typography, makeStyles} from '@material-ui/core'
import { PlayArrow, SkipPrevious, SkipNext, Pause } from '@material-ui/icons'
import React from 'react'
import { SongContext } from '../App'
import { GET_QUEUED_SONGS } from '../graphql/queries'
import QueuedSongList from './QueuedSongList'

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        padding: '0px 15px'
    },
    content: {
        flex: '1 0 auto'
    },
    thumbnail: {
        width: 250,
        objectFit: 'cover',
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1)
    },
    playIcon: {
        height: 38,
        width: 38
    }
}))

function SongPlayer() {
    const {data} = useQuery(GET_QUEUED_SONGS)
    const {state, dispatch} = React.useContext(SongContext)
    const classes = useStyles()

    function handleTogglePlay(params) {
        dispatch(state.isPlaying ? {type: 'PAUSE_SONG'} : {type: 'PLAY_SONG'})
    }
    return (
        <>
            <Card variant="outlined" className={classes.container}>
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography variant="h5" component="h3">
                            {state.song.title}
                        </Typography>
                        <Typography variant="subtitle1" component="p" color="textSecondary">
                            {state.song.artist}
                        </Typography>
                    </CardContent>
                    <div className={classes.controls}>
                        <IconButton>
                            <SkipPrevious></SkipPrevious>
                        </IconButton>
                        <IconButton onClick={handleTogglePlay}>
                            { state.isPlaying ? <Pause className={classes.playIcon}/> : <PlayArrow className={classes.playIcon}/> }
                        </IconButton>
                        <IconButton>
                            <SkipNext></SkipNext>
                        </IconButton>
                        <Typography variant="subtitle1" component="p" color="textSecondary">
                            00:00:00
                        </Typography>
                    </div>
                    <Slider type="range" min={0} max={1} step={0.01} ></Slider>
                </div>
                <CardMedia image={state.song.thumbnail} className={classes.thumbnail}/>
            </Card>
            <QueuedSongList queue={data.queue} />
        </>

    )
}

export default SongPlayer;