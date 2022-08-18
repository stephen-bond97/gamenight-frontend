import { Category } from "./category.enum";

export interface GameInformation {
    NumberOfRounds: number;
    RoundsCompleted: number;
    SelectedCategory: string;
}