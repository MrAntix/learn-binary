// round to a number of places
export const round: (value: number, places: number) => number
    = (value, places) => {
        const factor = Math.pow(10, places);

        return Math.round(value * factor) / factor;
    };
