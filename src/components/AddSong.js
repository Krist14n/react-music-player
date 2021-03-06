import { useMutation } from '@apollo/react-hooks';
import { 
    Button,
    InputAdornment, 
    TextField, 
    Link, 
    Dialog, 
    DialogContent,
    DialogTitle, 
    DialogActions,
    makeStyles
} from '@material-ui/core';
import { AddBoxOutlined } from '@material-ui/icons';
import React from 'react'
import ReactPlayer from 'react-player'
import SoundcloudPlayer  from 'react-player/lib/players/SoundCloud';
import YoutubePlayer from 'react-player/lib/players/YouTube';
import { ADD_TRACK } from '../graphql/mutations';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        alignItems: 'center'
    },
    urlInput: {
        margin: theme.spacing(1)
    },
    addSongButton: {
        margin: theme.spacing(1)
    },
    dialog: {
        textAlign: 'center'
    },
    thumbnail: {
        width: '90%'
    }
}))

const DEFAULT_SONG = {
    duration: 0,
    title: '',
    artist: '',
    thumbnail: ''
}

function AddSong() {
    const classes = useStyles()
    const [addSong, { error }] = useMutation(ADD_TRACK)
    const [dialog, setDialog] = React.useState(false)
    const [url, setUrl] = React.useState('')
    const [playable, setPlayable] = React.useState(false)
    const [song, setSong] = React.useState(DEFAULT_SONG)

    React.useEffect(() => { 
        const isPlayable = SoundcloudPlayer.canPlay(url) || YoutubePlayer.canPlay(url) 
        setPlayable(isPlayable)

    }, [url]) 

    function handleCloseDialog() {
        setDialog(false)
    }

    async function handleEditSong({player}) {
        const nestedPlayer = player.player.player;
        let songData;
        //its a youtube link
        if (nestedPlayer.getVideoData) {
            songData = getYoutubeInfo(nestedPlayer)
            console.log(songData)
        } else if (nestedPlayer.getCurrentSound ) {
            // its a soundcloud link
            songData = await getSoundcloudInfo(nestedPlayer)
        }

        setSong({...songData, url})

    }

    async function handleAddSong() {
        try {
            const {url, thumbnail, duration, title, artist} = song
            await addSong({
                variables: {
                    url: url.length > 0 ? url : null,
                    thumbnail: thumbnail.length > 0 ? thumbnail : null,
                    duration: duration > 0 ? duration : null,
                    title: title.length > 0 ? title : null,
                    artist: artist.length > 0 ? artist : null,
                }
            })
            handleCloseDialog()
            setSong(DEFAULT_SONG)
            setUrl('')
        } catch (e) {
            console.error('error adding track:', e)
        }
        
    }

    function handleChangeSong(event) {
        const {name, value} = event.target
        // updater pattern
        // update values dinamically using the computed property sintax
        setSong(prevSong => ({
            ...prevSong,
            [name]: value
        }))

    }

    function getYoutubeInfo(player) {
        const duration = player.getDuration();
        const {title, video_id, author} = player.getVideoData();
        const thumbnail = `http://img.youtube.com/vi/${video_id}/0.jpg`
        return {
            duration,
            title,
            artist: author,
            thumbnail
        }
    }

    function getSoundcloudInfo(player) {

        return new Promise(resolve => {
            player.getCurrentSound(songData => { 
                if(songData) {
                    resolve ({
                        duration: Number(songData.duration / 1000),
                        title: songData.title,
                        artist: songData.user.username,
                        thumbnail: songData.artwork_url.replace('-large', '-t500x500')
                    })
                }
            })
        })
        
    }
    
    function handleInputError(field) {
        console.log(error)
        return error?.graphQLErrors[0]?.extensions?.path?.includes(field);
    }

    const { thumbnail, title, artist } = song
    return (
        <div className={classes.container}>
            <Dialog
                className={classes.dialog}
                open={dialog}
                onClose={handleCloseDialog}>
                <DialogTitle>Edit Track</DialogTitle>
                <DialogContent>
                    <img 
                        src={thumbnail}
                        alt="Song thumbnail"
                        className={classes.thumbnail}
                    />
                    <TextField
                        value={title}
                        onChange={handleChangeSong}
                        margin="dense"
                        name="title"
                        label="Title"
                        fullWidth
                        error={handleInputError('title')}
                        helperText={handleInputError('title') && 'Fill out field'}            
                    />
                    <TextField 
                        value={artist}
                        onChange={handleChangeSong}
                        margin="dense"
                        name="artist"
                        label="Artist"
                        error={handleInputError('artist')}
                        helperText={handleInputError('artist') && 'Fill out field'}
                        fullWidth                   
                    />
                    <TextField
                        value={thumbnail}
                        onChange={handleChangeSong}
                        margin="dense"
                        name="thumbnail"
                        label="Thumbnail"
                        error={handleInputError('thumbnail')}
                        helperText={handleInputError('thumbnail') && 'Fill out field'}
                        fullWidth                   
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
                    <Button onClick={handleAddSong} variant="outlined" color="primary">Add track</Button>
                </DialogActions>
                
            </Dialog>
            <TextField 
                className={classes.urlInput}
                onChange={event => setUrl(event.target.value)}
                value={url}
                placeholder="Add Youtube or Soundcloud Url"
                fullWidth
                margin="normal"
                type="url"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Link />
                        </InputAdornment>
                    )
                }}
            />
            <Button
                disabled={!playable}
                className={classes.addSongButton}
                onClick={() => setDialog(true)}
                variant="contained"
                color="primary"
                endIcon={<AddBoxOutlined/>}
            >
                Add
            </Button>
            <ReactPlayer url={url} hidden={true} onReady={handleEditSong}/> 
        </div>
    )
}

export default AddSong;