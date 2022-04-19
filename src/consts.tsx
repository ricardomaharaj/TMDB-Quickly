export const IMGURL = 'https://image.tmdb.org/t/p/w500'

export const RELEASE_TYPES = [
    '',
    'Premiere',
    'Theatrical (limited)',
    'Theatrical',
    'Digital',
    'Physical',
    'TV',
]

export const API = 'http://localhost:4000/gql'
// export const API = '/gql'

export const GENDER = [
    '',
    'Female',
    'Male'
]

export const STAR = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
</svg>

export const FILM = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z" />
</svg>

export const renderStars = (average?: number) => {
    return new Array(parseInt((average! / 2).toString()!)).fill(STAR).map((x, i) => { return <span key={i}> {x} </span> })
}

export function uniqueOnly(value: any, index: number, self: Array<any>) {
    return self.indexOf(value) === index;
}
