import { round } from '../utils';
import { IScoreCard } from './IScoreCard';

/**
 * State of the score.
 */
export class ScoreState {

    constructor(
        public all: IScoreCard[]
    ) {

        this.byDateKey = all.reduce((index, s) => { index[ScoreState.getDateKey(s.date)] = s; return index; }, {} as Record<string, IScoreCard>);
        this.byName = all.reduce((index, s) => { index[s.name] = s; return index; }, {} as Record<string, IScoreCard>);

        this.count = all.length;
        this.averageTimeSeconds = round(all.reduce((t, s) => t + s.timeSeconds, 0) / this.count, 2);
        this.averageErrors = round(all.reduce((t, s) => t + s.errors, 0) / this.count, 2);
    }

    readonly byDateKey: Record<string, IScoreCard> = {};
    readonly byName: Record<string, IScoreCard> = {};
    readonly count: number;
    readonly averageTimeSeconds: number;
    readonly averageErrors: number;

    add(value: IScoreCard) {

        return new ScoreState([...this.all, value]);
    }

    static getDateKey(d: Date) {
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }
}
