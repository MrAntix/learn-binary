/**
 * wait for the given interval
 *
 * @param interval time in ms
 */
export const wait: (interval: number) => Promise<void> = interval => {

    return new Promise<void>(resolve => {
        setTimeout(() => resolve(), interval);
    });
};


