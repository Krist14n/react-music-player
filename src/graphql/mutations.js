import { gql } from 'apollo-boost'

export const ADD_TRACK = gql `
    mutation addTrack($title: String!, $artist: String!, $thumbnail: String!, $duration: Float!, $url: String!) {
        insert_tracks(objects: {title: $title, artist: $artist, thumbnail: $thumbnail, duration: $duration, url: $url}) {
            affected_rows
        }
    }
`