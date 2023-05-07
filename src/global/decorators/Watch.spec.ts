import { Watch } from './Watch';

jest.mock('../../logger');

describe('Watch decorator', () => {

    class AClass {
        value = 0;

        @Watch('value') valueChange() {
            // Do something with the value
        }
    }

    let a: AClass;
    const valueChangeMock = jest.fn();

    beforeEach(() => {
        a = new AClass();

        jest.spyOn(a, 'valueChange').mockImplementation(valueChangeMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call the decorated function', () => {
        a.value = 99;

        expect(a.valueChange).toHaveBeenCalledTimes(1);
        expect(a.valueChange).toHaveBeenCalledWith(99);
    });

    it('should not call the decorated function or set a timeout', () => {
        a.value = 0;

        expect(a.valueChange).not.toHaveBeenCalled();
        expect(valueChangeMock).not.toHaveBeenCalled();
    });
});
