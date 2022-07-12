import { gql, useQuery } from 'urql'

export interface SearchResults {
    page?: number
    results?: Result[]
    total_results?: number
    total_pages?: number
}

export interface Result {
    poster_path: string
    adult: boolean
    overview: string
    release_date: string
    original_title: string
    genre_ids: number[]
    id: number
    media_type: string
    original_language: string
    title: string
    backdrop_path: string
    popularity: number
    vote_count: number
    video: boolean
    vote_average: number
    first_air_date: string
    origin_country: string[]
    name: string
    original_name: string
    profile_path: string
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
    combined_credits?: {
        cast?: [{
            id?: number
            original_language?: string
            episode_count?: number
            overview?: string
            origin_country?: [string]
            original_name?: string
            genre_ids?: [number]
            name?: string
            media_type?: string
            poster_path?: string
            first_air_date?: string
            vote_average?: number
            vote_count?: number
            character?: string
            backdrop_path?: string
            popularity?: number
            credit_id?: string
            original_title?: string
            video?: boolean
            release_date?: string
            title?: string
            adult?: boolean
        }]
        crew?: [{
            id?: number
            department?: string
            original_language?: string
            episode_count?: number
            job?: string
            overview?: string
            origin_country?: [string]
            original_name?: string
            vote_count?: number
            name?: string
            media_type?: string
            popularity?: number
            credit_id?: string
            backdrop_path?: string
            first_air_date?: string
            vote_average?: number
            genre_ids?: [number]
            poster_path?: string
            original_title?: string
            video?: boolean
            title?: string
            adult?: boolean
            release_date?: string
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
        runtime?: number
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

export function useSearchQuery(variables: { query?: string, page?: string }) {
    return useQuery<{ search: SearchResults }>({
        query: gql`query ($query: String, $page: String) { search(query: $query, page: $page) }`,
        variables
    })
}

export function useMovieQuery(variables: { id?: string }) {
    return useQuery<{ movie: Movie }>({ query: gql`query ($id: ID) { movie(id: $id) }`, variables })
}

export function useShowQuery(variables: { id?: string }) {
    return useQuery<{ show: Show }>({ query: gql`query ($id: ID) { show(id: $id) }`, variables })
}

export function usePersonQuery(variables: { id?: string }) {
    return useQuery<{ person: Person }>({ query: gql`query ($id: ID) { person(id: $id) }`, variables })
}

export function useSeasonQuery(variables: { id?: string, season_number?: string }) {
    return useQuery<{ season: Season }>({
        query: gql`query ($id: ID, $season_number: String) { season(id: $id, season_number: $season_number) }`,
        variables
    })
}

export function useEpisodeQuery(variables: { id?: string, season_number?: string, episode_number?: String }) {
    return useQuery<{ episode: Episode }>({
        query: gql`query ($id: ID, $season_number: String, $episode_number: String) { episode(id: $id, season_number: $season_number, episode_number: $episode_number) }`,
        variables
    })
}
