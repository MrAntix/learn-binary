import { BitmapTypes } from '../data/BitmapTypes';

/**
 * Interface for the score card
 */
export interface IScoreCard {
    date: Date;
    name: BitmapTypes;
    timeSeconds: number;
    errors: number;
}
