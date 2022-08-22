export enum PhraseCategory {
    Landmarks,
    People,
    Music,
    VideoGames,
    TVShows
}

export const PhraseCategory2LabelMapping: Record<PhraseCategory, string> = {
    [PhraseCategory.Landmarks]: "Landmarks",
    [PhraseCategory.People]: "People",
    [PhraseCategory.Music]: "Music",
    [PhraseCategory.VideoGames]: "Video Games",
    [PhraseCategory.TVShows]: "TV Shows"
}