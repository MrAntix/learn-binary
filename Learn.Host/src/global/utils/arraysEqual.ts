export const arraysEqual: (a: unknown[], b: unknown[]) => boolean
    = (a, b) => {
        if (a === b) return true;
        if (!Array.isArray(a) || !Array.isArray(b)) return false;
        if (a?.length !== b?.length) return false;

        for (let i = 0; i < a.length; i++) {

            const ai = a[i];
            if (Array.isArray(ai)) {

                const bi = b[i];
                if (!Array.isArray(bi)
                    || !arraysEqual(ai, bi)) return false;
            }
            else if (ai !== b[i]) return false;
        }

        return true;
    };
