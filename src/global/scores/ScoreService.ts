import { parse } from '../utils';
import { IScoreCard } from './IScoreCard';
import { ScoreCardSchema } from './ScoreCardSchema';

/**
 * Service for storing and retrieving score cards.
 */
export class ScoresService {

    static KEYS = 'keys';

    constructor() {

        JSON.parse(
            localStorage.getItem(ScoresService.KEYS) || '[]'
        ).forEach((key: string) => {
            const data = localStorage.getItem(key);
            if (!data) return;

            this.scores[key] = parse(data, ScoreCardSchema);
        });
    }

    get count() { return Object.keys(this.scores).length; }
    private scores: { [key: string]: IScoreCard; } = {};

    set(value: IScoreCard) {
        const key = ScoresService.getKey(value.date);
        this.scores[key] = value;

        localStorage.setItem(ScoresService.KEYS,
            JSON.stringify(Object.keys(this.scores))
        );

        localStorage.setItem(key,
            JSON.stringify(value)
        );
    }

    getByDate(date: Date) {
        const key = ScoresService.getKey(date);

        return this.scores[key];
    }

    getByName(name: string) {
        return Object.values(this.scores)
            .find(s => s.name === name);
    }

    static getKey(d: Date) {
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }
}
