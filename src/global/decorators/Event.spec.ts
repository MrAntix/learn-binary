import { Event } from './Event';

jest.mock('../../logger');

describe('Event decorator', () => {
    let target: HTMLElement;
    let propertyKey: string;

    beforeEach(() => {
        target = document.createElement('div');
        propertyKey = 'testEvent';
    });

    it('should create a function on the target with the same name as the property key', () => {
        Event()(target, propertyKey);

        expect(typeof target[propertyKey]).toBe('function');
    });

    it('should dispatch a custom event with the given options when the function is called', () => {
        const spy = jest.spyOn(target, 'dispatchEvent');

        Event({ type: 'customType' })(target, propertyKey);
        target[propertyKey]('some data');

        expect(spy).toHaveBeenCalledWith(expect.objectContaining({
            type: 'customType',
            detail: 'some data',
            bubbles: false,
            cancelable: false,
            composed: false
        }));
    });

    it('should return true if the event was successfully dispatched', () => {
        Event()(target, propertyKey);

        const result = target[propertyKey]('some data');
        expect(result).toBe(true);
    });

    it('should return true if the event was not cancellable', () => {
        target.addEventListener(propertyKey, e => e.preventDefault());

        Event({ cancelable: false })(target, propertyKey);

        const result = target[propertyKey]('some data');
        expect(result).toBe(true);
    });
    it('should return false if the event was cancelled', () => {
        target.addEventListener(propertyKey, e => e.preventDefault());

        Event({ cancelable: true })(target, propertyKey);

        const result = target[propertyKey]('some data');
        expect(result).toBe(false);
    });
});
