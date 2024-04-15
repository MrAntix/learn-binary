import { parse } from '../utils';
import { IScoreCard } from './IScoreCard';
import { ScoreCardSchema } from './ScoreCardSchema';
import { ScoreState } from './ScoreState';

/**
 * Service for storing and retrieving score cards.
 */
export class ScoresService {

    static KEYS = 'keys';

    constructor() {

        this._state = new ScoreState(JSON.parse(
            (localStorage.getItem(ScoresService.KEYS) ?? '[]')
        )
            .map((key: string) => parse(localStorage.getItem(key), ScoreCardSchema))
            .filter((s: IScoreCard) => s != null)
        );
    }

    private _state: ScoreState;

    get count() { return this._state.count; }
    get averageTimeSeconds() { return this._state.averageTimeSeconds; }
    get averageErrors() { return this._state.averageErrors; }

    set(value: IScoreCard) {
        this._state = this._state.add(value);

        localStorage.setItem(ScoresService.KEYS,
            JSON.stringify(Object.keys(this._state.byDateKey))
        );

        const key = ScoreState.getDateKey(value.date);
        localStorage.setItem(key,
            JSON.stringify(value)
        );
    }

    getByDate(date: Date) {
        const key = ScoreState.getDateKey(date);

        return this._state.byDateKey[key];
    }

    getByName(name: string) {

        return this._state.byName[name];
    }
}
