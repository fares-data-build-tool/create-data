import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import FormElementWrapper from '../../src/components/FormElementWrapper';

describe('FormElementWrapper', () => {
    describe('no errors', () => {
        it('does nothing if there are no errors', () => {
            const wrapper = shallow(
                <FormElementWrapper errors={[]} errorId="input-error" errorClass="input--error">
                    <input type="text" />
                </FormElementWrapper>,
            );

            expect(wrapper.html()).toBe('<div><input type="text"/></div>');
        });
    });

    describe('no matching errors', () => {
        it('does nothing', () => {
            const wrapper = shallow(
                <FormElementWrapper
                    errors={[{ errorMessage: 'Test error', id: 'input-error-1' }]}
                    errorId="input-error"
                    errorClass="input--error"
                >
                    <input type="text" />
                </FormElementWrapper>,
            );

            const errorSpan = wrapper.find('.govuk-error-message');

            expect(errorSpan).toHaveLength(0);
        });
    });

    describe('matching errors', () => {
        let wrapper: ShallowWrapper;

        beforeEach(() => {
            wrapper = shallow(
                <FormElementWrapper
                    errors={[
                        { errorMessage: 'Test error', id: 'input-error' },
                        { errorMessage: 'Test error', id: 'input-error-2' },
                    ]}
                    errorId="input-error"
                    errorClass="input--error"
                >
                    <input type="text" />
                </FormElementWrapper>,
            );
        });

        it('adds error message span if there is an error that matches the given errorId', () => {
            const errorSpan = wrapper.find('.govuk-error-message');

            expect(errorSpan).toHaveLength(1);
            expect(errorSpan.text()).toBe('Test error');
        });

        it('adds given class', () => {
            expect(wrapper.find('input').props().className).toBe('input--error');
        });

        it('adds aria describedby property', () => {
            expect(wrapper.find('input').props()['aria-describedby']).toBe('input-error');
        });

        it('appends class if child already has class names', () => {
            const wrapperWithClass = shallow(
                <FormElementWrapper
                    errors={[
                        { errorMessage: 'Test error', id: 'input-error' },
                        { errorMessage: 'Test error', id: 'input-error-2' },
                    ]}
                    errorId="input-error"
                    errorClass="input--error"
                >
                    <input type="text" className="existing-class" />
                </FormElementWrapper>,
            );

            expect(wrapperWithClass.find('input').props().className).toBe('existing-class input--error');
        });

        it('uses first matching error if there are multiple', () => {
            const wrapperWithMultipleMatching = shallow(
                <FormElementWrapper
                    errors={[
                        { errorMessage: 'Test error First', id: 'input-error' },
                        { errorMessage: 'Test error Second', id: 'input-error' },
                    ]}
                    errorId="input-error"
                    errorClass="input--error"
                >
                    <input type="text" className="existing-class" />
                </FormElementWrapper>,
            );

            expect(wrapperWithMultipleMatching.find('.govuk-error-message').text()).toBe('Test error First');
        });
    });
});
