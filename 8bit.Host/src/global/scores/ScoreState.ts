import { IScoreCard } from './IScoreCard';


export class ScoreState {

    constructor(
        public all: IScoreCard[]
    ) {

        this.byDateKey = all.reduce((index, s) => { index[ScoreState.getDateKey(s.date)] = s; return index; }, {});
        this.byName = all.reduce((index, s) => { index[s.name] = s; return index; }, {});

        this.count = all.length;
        this.averageTimeSeconds = all.reduce((t, s) => t + s.timeSeconds, 0) / this.count;
        this.averageErrors = all.reduce((t, s) => t + s.errors, 0) / this.count;
    }

    readonly byDateKey: { [key: string]: IScoreCard; } = {};
    readonly byName: { [name: string]: IScoreCard; } = {};
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
