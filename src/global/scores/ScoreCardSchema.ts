import { ISchema } from '../utils';
import { IScoreCard } from './IScoreCard';

/**
 * Schema for the score card
 * 
 * makes sure that the date is a Date object
 */
export const ScoreCardSchema: ISchema<IScoreCard> = {
    'date': (v: string) => new Date(v)
};
