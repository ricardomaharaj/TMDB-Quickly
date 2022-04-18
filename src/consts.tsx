export const IMGURL = 'https://www.themoviedb.org/t/p/w94_and_h141_bestv2'
export const IMGURL_WIDE = 'https://www.themoviedb.org/t/p/w227_and_h127_bestv2'
export const HD_IMGURL = 'https://image.tmdb.org/t/p/original/'

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

export const FILM_ICON = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1zm4 0v6h8V1H4zm8 8H4v6h8V9zM1 1v2h2V1H1zm2 3H1v2h2V4zM1 7v2h2V7H1zm2 3H1v2h2v-2zm-2 3v2h2v-2H1zM15 1h-2v2h2V1zm-2 3v2h2V4h-2zm2 3h-2v2h2V7zm-2 3v2h2v-2h-2zm2 3h-2v2h2v-2z" />
</svg>

export function uniqueOnly(value: any, index: number, self: Array<any>) {
    return self.indexOf(value) === index;
}
