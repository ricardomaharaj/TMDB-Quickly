import { gql, useQuery } from 'urql'

interface SearchResults {
    page?: number
    results?: Result[]
    total_results?: number
    total_pages?: number
}

type Result = MovieResult | ShowResult | PersonResult

export interface MovieResult {
    poster_path?: string
    adult?: boolean
    overview?: string
    release_date?: string
    original_title?: string
    genre_ids?: number[]
    id?: number
    media_type?: string
    original_language?: string
    title?: string
    backdrop_path?: string
    popularity?: number
    vote_count?: number
    video?: boolean
    vote_average?: number
}

export interface ShowResult {
    poster_path?: string
    popularity?: number
    id?: number
    overview?: string
    backdrop_path?: string
    vote_average?: number
    media_type?: string
    first_air_date?: string
    origin_country?: string[]
    genre_ids?: number[]
    original_language?: string
    vote_count?: number
    name?: string
    original_name?: string
}

export interface PersonResult {
    profile_path?: string
    adult?: boolean
    id?: number
    media_type?: string
    name?: string
    popularity?: number
}

// 

interface Movie {
    adult?: boolean
    backdrop_path?: string
    budget?: number
    genres?: [{
        id?: number
        name?: string
    }]
    homepage?: string
    id?: number
    imdb_id?: string
    original_language?: string
    original_title?: string
    overview?: string
    popularity?: number
    poster_path?: string
    production_companies?: [{
        name?: string
        id?: number
        logo_path?: string
        origin_country?: string
    }]
    production_countries?: [{
        iso_3166_1?: string
        name?: string
    }]
    release_date?: string
    revenue?: number
    runtime?: number
    spoken_languages?: [{
        iso_639_1?: string
        name?: string
    }]
    status?: string
    tagline?: string
    title?: string
    video?: boolean
    vote_average?: number
    vote_count?: number
    credits?: {
        id?: number
        cast?: [{
            adult?: boolean
            gender?: number
            id?: number
            known_for_department?: string
            name?: string
            original_name?: string
            popularity?: number
            profile_path?: string
            cast_id?: number
            character?: string
            credit_id?: string
            order?: number
        }]
        crew?: [{
            adult?: boolean
            gender?: number
            id?: number
            known_for_department?: string
            name?: string
            original_name?: string
            popularity?: number
            profile_path?: string
            credit_id?: string
            department?: string
            job?: string
        }]
    }
    release_dates?: {
        id: number
        results?: [{
            iso_3166_1?: string
            release_dates?: [{
                certification?: string
                iso_639_1?: string
                release_date?: string
                type?: number
                note?: string
            }]
        }]
    }
    images?: {
        id?: number
        backdrops?: [{
            aspect_ratio?: number
            file_path?: string
            height?: number
            iso_639_1?: string
            vote_average?: number
            vote_count?: number
            width?: number
        }]
        posters?: [{
            aspect_ratio?: number
            file_path?: string
            height?: number
            iso_639_1?: string
            vote_average?: number
            vote_count?: number
            width?: number
        }]
    }
    videos?: {
        id?: number
        results?: [{
            iso_639_1?: string
            iso_3166_1?: string
            name?: string
            key?: string
            site?: string
            size?: number
            type?: string
            official?: boolean
            published_at?: string
            id?: string
        }]
    }
}

// 

interface Show {
    backdrop_path?: string
    created_by?: [{
        id?: number
        credit_id?: string
        name?: string
        gender?: number
        profile_path?: string
    }]
    episode_run_time?: number[]
    first_air_date?: string
    genres?: [{
        id?: number
        name?: string
    }]
    homepage?: string
    id?: number
    in_production?: boolean
    languages?: string[]
    last_air_date?: string
    name?: string
    networks?: [{
        name?: string
        id?: number
        logo_path?: string
        origin_country?: string
    }]
    number_of_episodes?: number
    number_of_seasons?: number
    origin_country?: string[]
    original_language?: string
    original_name?: string
    overview?: string
    popularity?: number
    poster_path?: string
    production_companies?: [{
        id?: number
        logo_path?: string
        name?: string
        origin_country?: string
    }]
    production_countries?: [{
        iso_3166_1?: string
        name?: string
    }]
    seasons?: [{
        air_date?: string
        episode_count?: number
        id?: number
        name?: string
        overview?: string
        poster_path?: string
        season_number?: number
    }]
    spoken_languages?: [{
        english_name?: string
        iso_639_1?: string
        name?: string
    }]
    status?: string
    tagline?: string
    type?: string
    vote_average?: number
    vote_count?: number
    credits?: {
        id?: number
        cast?: [{
            adult?: boolean
            gender?: number
            id?: number
            known_for_department?: string
            name?: string
            original_name?: string
            popularity?: number
            profile_path?: string
            cast_id?: number
            character?: string
            credit_id?: string
            order?: number
        }]
        crew?: [{
            adult?: boolean
            gender?: number
            id?: number
            known_for_department?: string
            name?: string
            original_name?: string
            popularity?: number
            profile_path?: string
            credit_id?: string
            department?: string
            job?: string
        }]
    }
    external_ids?: {
        imdb_id?: string
        freebase_mid?: string
        freebase_id?: string
        tvdb_id?: number
        tvrage_id?: number
        facebook_id?: string
        instagram_id?: string
        twitter_id?: string
        id?: number
    }
    images?: {
        id?: number
        backdrops?: [{
            aspect_ratio?: number
            file_path?: string
            height?: number
            iso_639_1?: string
            vote_average?: number
            vote_count?: number
            width?: number
        }]
        posters?: [{
            aspect_ratio?: number
            file_path?: string
            height?: number
            iso_639_1?: string
            vote_average?: number
            vote_count?: number
            width?: number
        }]
    }
    videos?: {
        id?: number
        results?: [{
            iso_639_1?: string
            iso_3166_1?: string
            name?: string
            key?: string
            site?: string
            size?: number
            type?: string
            official?: boolean
            published_at?: string
            id?: string
        }]
    }
}

// 

interface Person {
    birthday?: string
    known_for_department?: string
    deathday?: string
    id?: number
    name?: string
    also_known_as?: string[]
    gender?: number
    biography?: string
    popularity?: number
    place_of_birth?: string
    profile_path?: string
    adult?: boolean
    imdb_id?: string
    homepage?: string
    movie_credits?: {
        id?: number
        cast?: [{
            character?: string
            credit_id?: string
            release_date?: string
            vote_count?: number
            video?: boolean
            adult?: boolean
            vote_average?: number
            title?: string
            genre_ids?: number[]
            original_language?: string
            original_title?: string
            popularity?: number
            id?: number
            backdrop_path?: string
            overview?: string
            poster_path?: string
        }]
        crew?: [{
            id?: number
            department?: string
            original_language?: string
            original_title?: string
            job?: string
            overview?: string
            vote_count?: number
            video?: boolean
            poster_path?: string
            backdrop_path?: string
            title?: string
            popularity?: number
            genre_ids?: number[]
            vote_average?: number
            adult?: boolean
            release_date?: string
            credit_id?: string
        }]
    }
    tv_credits?: {
        id?: number
        cast?: [{
            credit_id?: string
            original_name?: string
            id?: number
            genre_ids?: number[]
            character?: string
            name?: string
            poster_path?: string
            vote_count?: number
            vote_average?: number
            popularity?: number
            episode_count?: number
            original_language?: string
            first_air_date?: string
            backdrop_path?: string
            overview?: string
            origin_country?: string[]
        }]
        crew?: [{
            id?: number
            department?: string
            original_language?: string
            episode_count?: number
            job?: string
            overview?: string
            origin_country?: string[]
            original_name?: string
            genre_ids?: number[]
            name?: string
            first_air_date?: string
            backdrop_path?: string
            popularity?: number
            vote_count?: number
            vote_average?: number
            poster_path?: string
            credit_id?: string
        }]
    }
    images?: {
        id?: number
        profiles?: [{
            aspect_ratio?: number
            file_path?: string
            height?: number
            iso_639_1?: null
            vote_average?: number
            vote_count?: number
            width?: number
        }]
    }
}

// 

interface Season {
    _id?: string
    air_date?: string
    episodes?: [{
        air_date?: string
        episode_number?: number
        crew?: [{
            department?: string
            job?: string
            credit_id?: string
            adult?: boolean
            gender?: number
            id?: number
            known_for_department?: string
            name?: string
            original_name?: string
            popularity?: number
            profile_path?: string
        }]
        guest_stars?: [{
            credit_id?: string
            order?: number
            character?: string
            adult?: boolean
            gender?: number
            id?: number
            known_for_department?: string
            name?: string
            original_name?: string
            popularity?: number
            profile_path?: string
        }]
        id?: number
        name?: string
        overview?: string
        production_code?: string
        season_number?: number
        still_path?: string
        vote_average?: number
        vote_count?: number
    }]
    name?: string
    overview?: string
    id?: number
    poster_path?: string
    season_number?: number
    credits?: {
        id?: number
        cast?: [{
            adult?: boolean
            gender?: number
            id?: number
            known_for_department?: string
            name?: string
            original_name?: string
            popularity?: number
            profile_path?: string
            character?: string
            credit_id?: string
            order?: number
        }]
        crew?: [{
            adult?: boolean
            gender?: number
            id?: number
            known_for_department?: string
            name?: string
            original_name?: string
            popularity?: number
            profile_path?: string
            credit_id?: string
            department?: string
            job?: string
        }]
    }
    images?: {
        id?: number
        posters?: [{
            aspect_ratio?: number
            file_path?: string
            height?: number
            iso_639_1?: string
            vote_average?: number
            vote_count?: number
            width?: number
        }]
    }
}

// 

interface Episode {
    air_date?: string
    crew?: [{
        id?: number
        credit_id?: string
        name?: string
        department?: string
        job?: string
        profile_path?: string
    }]
    episode_number?: number
    guest_stars?: [{
        id?: number
        name?: string
        credit_id?: string
        character?: string
        order?: number
        profile_path?: string
    }]
    name?: string
    overview?: string
    id?: number
    production_code?: string
    season_number?: number
    still_path?: string
    vote_average?: number
    vote_count?: number
    images?: {
        id?: number
        stills?: [{
            aspect_ratio?: number
            file_path?: string
            height?: number
            iso_639_1?: string
            vote_average?: number
            vote_count?: number
            width?: number
        }]
    }
}

// 

interface FindQueryVariables {
    query?: string
    page?: string
}

type FindQuery = { find?: SearchResults }

interface MovieQueryVariables {
    id?: string
}

type MovieQuery = { movie?: Movie }

interface ShowQueryVariables {
    id?: string
}

type ShowQuery = { show?: Show }

interface PersonQueryVariables {
    id?: string
}

type PersonQuery = { person?: Person }

interface SeasonQueryVariables {
    id?: string
    season?: string
}

type SeasonQuery = { season?: Season }

interface EpisodeQueryVariables {
    id?: string
    season?: string
    episode?: string
}

type EpisodeQuery = { episode?: Episode }

const FindDocument = gql`
query find($query: String, $page: String) {
find(query: $query, page: $page)
}`

export function useFindQuery(variables: FindQueryVariables) {
    return useQuery<FindQuery>({ query: FindDocument, variables })
}

const MovieDocument = gql`
query movie($id: ID) {
movie(id: $id)
}`

export function useMovieQuery(variables: MovieQueryVariables) {
    return useQuery<MovieQuery>({ query: MovieDocument, variables })
}

const ShowDocument = gql`
query show($id: ID) {
show(id: $id)
}`

export function useShowQuery(variables: ShowQueryVariables) {
    return useQuery<ShowQuery>({ query: ShowDocument, variables })
}

const PersonDocument = gql`
query person($id: ID) {
person(id: $id)
}`

export function usePersonQuery(variables: PersonQueryVariables) {
    return useQuery<PersonQuery>({ query: PersonDocument, variables })
}

const SeasonDocument = gql`
query season($id: ID, $season: String) {
season(id: $id, season: $season)
}`

export function useSeasonQuery(variables: SeasonQueryVariables) {
    return useQuery<SeasonQuery>({ query: SeasonDocument, variables })
}

const EpisodeDocument = gql`
query episode($id: ID, $season: String, $episode: String) {
episode(id: $id, season: $season, episode: $episode)
}`

export function useEpisodeQuery(variables: EpisodeQueryVariables) {
    return useQuery<EpisodeQuery>({ query: EpisodeDocument, variables })
}
