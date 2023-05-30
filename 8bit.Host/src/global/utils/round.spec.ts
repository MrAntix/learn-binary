import { round } from "./round";

// unit test for round
describe('round', () => {
    it('rounds to 2 places', () => {

        expect(round(1.2345, 2)).toBe(1.23);
    });

    it('rounds to 3 places', () => {
        expect(round(1.2345, 3)).toBe(1.235);
    });
});