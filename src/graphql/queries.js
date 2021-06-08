import {gql} from 'apollo-boost';

export const GET_TRACKS = gql `
    query getTracks {
        tracks(order_by: {created_at: desc}) {
            artist
            duration
            id
            thumbnail
            title
            url
        }
    }
`
