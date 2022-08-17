import { Category } from "./category.enum";

export interface GameInformation {
    TotalRounds: number;
    RoundsRemaining: number;
    CurrentCategory: string;
}