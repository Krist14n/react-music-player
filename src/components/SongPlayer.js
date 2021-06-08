import { Card, CardContent, CardMedia, IconButton, Slider, Typography, makeStyles} from '@material-ui/core'
import { PlayArrow, SkipPrevious, SkipNext } from '@material-ui/icons'
import React from 'react'
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
    thumnail: {
        width: 150,
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
    const classes = useStyles()
    return (
        <>
            <Card variant="outlined" className={classes.container}>
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                        <Typography variant="h5" component="h3">
                            Title
                        </Typography>
                        <Typography variant="subtitle1" component="p" color="textSecondary">
                            Artist
                        </Typography>
                    </CardContent>
                    <div className={classes.controls}>
                        <IconButton>
                            <SkipPrevious></SkipPrevious>
                        </IconButton>
                        <IconButton>
                            <PlayArrow className={classes.playIcon}></PlayArrow>
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
                <CardMedia image="" className={classes.thumnail}></CardMedia>
            </Card>
            <QueuedSongList></QueuedSongList>
        </>

    )
}

export default SongPlayer;