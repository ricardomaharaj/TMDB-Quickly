export const IMGURL = 'https://image.tmdb.org/t/p/w500'
export const FULLIMGURL = 'https://image.tmdb.org/t/p/original'

export interface GlobalState {
    query: string,
    page: number,
    homeTab: string,
    movieTab: string,
    showTab: string,
    seasonTab: string,
    episodeTab: string,
    personTab: string,
}

export interface Props { state: GlobalState, updateState: any }
