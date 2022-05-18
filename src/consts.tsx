export const IMGURL = 'https://image.tmdb.org/t/p/w500'
export const FULLIMGURL = 'https://image.tmdb.org/t/p/original'

export enum TABS {
    MOVIES,
    SHOWS,
    PEOPLE,
    CAST,
    CREW,
    IMAGES,
    VIDEOS,
    SEASONS,
    INFO,
    GUEST,
    POSTERS,
    BACKDROPS,
    BIO,
    EPISODES,
}

export interface GlobalState {
    query: string,
    page: number,
    homeTab: number,
    movieTab: number,
    showTab: number,
    seasonTab: number,
    episodeTab: number,
    personTab: number,
}

export interface Props { state: GlobalState, updateState: any }
