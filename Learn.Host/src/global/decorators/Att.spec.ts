import { Att } from './Att';

jest.mock('../../logger');

describe('Att decorator', () => {

    describe('should handle string values correctly', () => {
        class Component extends HTMLElement {
            @Att() value: string;
        }
        customElements.define('string-component', Component);

        let component: Component;

        beforeEach(() => {
            component = new Component();
        });

        describe('set property', () => {

            it('to a value, expect the attribute to be set', () => {
                component.value = 'test';

                expect(component.getAttribute('value')).toEqual('test');

            });
        });

        describe('set the attribute to a value', () => {
            beforeEach(() => {
                component.setAttribute('value', 'test');
            });

            it('expect the property to be set', () => {
                expect(component.value).toEqual('test');
            });

            describe('remove the attribute', () => {
                beforeEach(() => {
                    component.removeAttribute('value');
                });

                it('Expect the property to be null', () => {
                    expect(component.value).toBeNull();
                });
            });
        });
    });

    describe('should handle boolean values correctly', () => {
        class Component extends HTMLElement {
            @Att() flag: boolean;
        }
        customElements.define('boolean-component', Component);

        let component: Component;

        beforeEach(() => {

            component = new Component();
        });

        describe('set property', () => {

            it('to true, expect the attribute to be an empty string', () => {
                component.flag = true;

                expect(component.getAttribute('flag')).toEqual('');
            });

            it('to false, expect the attribute to be null', () => {
                component.flag = false;

                expect(component.getAttribute('flag')).toBeNull();
            });
        });

        describe('set the attribute to an empty string', () => {
            beforeEach(() => {
                component.setAttribute('flag', '');
            });

            it('expect the property to be true', () => {

                expect(component.flag).toBe(true);
            });

            describe('remove the attribute', () => {
                beforeEach(() => {
                    component.removeAttribute('flag');
                });

                it('Expect the property to be false', () => {
                    expect(component.flag).toBe(false);
                });
            });
        });
    });

    describe('handles read only', () => {

        const UPDATE_VALUE = 'UPDATE_VALUE';
        class Component extends HTMLElement {
            @Att({ access: 'read-only' }) value: string;
        }
        customElements.define('read-only-component', Component);

        let component: Component;

        beforeEach(() => {

            component = new Component();
        });

        it('initial attribute', () => {

            expect(component.getAttribute('value')).toBe(null);
        });

        it('updated attribute is assigned to property', () => {

            component.setAttribute('value', UPDATE_VALUE);

            expect(component.value).toBe(UPDATE_VALUE);
        });

        it('updated property does not update attribute', () => {

            component.value = UPDATE_VALUE;

            expect(component.getAttribute('value')).toBe(null);
        });
    });

    describe('handles write only', () => {

        const ORIGINAL_VALUE = 'ORIGINAL_VALUE';
        const UPDATE_VALUE = 'UPDATE_VALUE';
        class Component extends HTMLElement {
            @Att({ access: 'write-only' }) value: string = ORIGINAL_VALUE;
        }
        customElements.define('write-only-component', Component);

        let component: Component;

        beforeEach(() => {

            component = new Component();
        });

        it('initial attribute', () => {

            expect(component.getAttribute('value')).toBe(ORIGINAL_VALUE);
        });

        it('updated property writes to attribute', () => {

            component.value = UPDATE_VALUE;

            expect(component.getAttribute('value')).toBe(UPDATE_VALUE);
        });

        it('updated attribute does not update property', () => {

            component.setAttribute('value', UPDATE_VALUE);

            expect(component.value).toBe(ORIGINAL_VALUE);
        });
    });

});
