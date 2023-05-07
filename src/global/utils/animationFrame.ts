/**
 * wait for an animation frame
 *
 * @param interval time in ms
 */

export const animationFrame: () => Promise<void> = () => {

    return new Promise<void>(resolve => {
        requestAnimationFrame(() => resolve());
    });
};
