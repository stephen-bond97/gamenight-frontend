export enum Category {
    generalknowledge = "generalknowledge",
    books = "books",
    cinema = "cinema",
    music = "music",
    musicalsandtheatre = "musicalsandtheatre",
    television = "television",
    videogames = "videogames",
    boardgames = "boardgames",
    scienceandnature = "scienceandnature",
    computing = "computing",
    mathematics = "mathematics",
    mythology = "mythology",
    sports = "sports",
    geography = "geography",
    history = "history",
    politics = "politics",
    art = "art",
    celebrities = "celebrities",
    animals = "animals",
    vehicles = "vehicles",
    comics = "comics",
    gadgets = "gadgets",
    anime = "anime",
    animation = "animation"
}

export const Category2LabelMapping: Record<Category, string> = {
    [Category.generalknowledge]: "General Knowledge",
    [Category.books]: "Books",
    [Category.cinema]: "Cinema",
    [Category.music]: "Music",
    [Category.musicalsandtheatre]: "Musicals and Theatre",
    [Category.television]: "Television",
    [Category.videogames]: "Videogames",
    [Category.boardgames]: "Boardgames",
    [Category.scienceandnature]: "Science and Nature",
    [Category.computing]: "Computing",
    [Category.mathematics]: "Mathematics",
    [Category.mythology]: "Mythology",
    [Category.sports]: "Sports",
    [Category.geography]: "Geography",
    [Category.history]: "History",
    [Category.politics]: "Politics",
    [Category.art]: "Art",
    [Category.celebrities]: "Celebrities",
    [Category.animals]: "Animals",
    [Category.vehicles]: "Vehicles",
    [Category.comics]: "Comics",
    [Category.gadgets]: "Gadgets",
    [Category.anime]: "Anime",
    [Category.animation]: "Animation"
};