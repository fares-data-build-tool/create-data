import * as React from 'react';
import { shallow } from 'enzyme';
import ManageOperatorDetails from '../../src/pages/manageOperatorDetails';

describe('pages', () => {
    describe('manage operator details', () => {
        const operatorDetails = {
            operatorName: 'Test Operator',
            contactNumber: '01234 567 890',
            email: 'test@example.com',
            url: 'www.example.com',
            street: 'Test Street',
            town: 'Test Town',
            county: 'Test County',
            postcode: 'AB1 2CD',
        };

        it('should render correctly', () => {
            const tree = shallow(
                <ManageOperatorDetails
                    csrfToken={''}
                    errors={[]}
                    operatorDetails={operatorDetails}
                    referer={null}
                    saved={false}
                    myFaresEnabled={true}
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render error state if error', () => {
            const errors = [
                { id: 'operatorName', errorMessage: 'All fields are mandatory' },
                { id: 'street', errorMessage: 'All fields are mandatory' },
                { id: 'town', errorMessage: 'All fields are mandatory' },
                { id: 'county', errorMessage: 'All fields are mandatory' },
                { id: 'contactNumber', errorMessage: 'Provide a valid phone number' },
                { id: 'email', errorMessage: 'Provide a valid email' },
                { id: 'url', errorMessage: 'Provide a valid URL' },
                { id: 'postcode', errorMessage: 'Provide a valid postcode' },
            ];

            const tree = shallow(
                <ManageOperatorDetails
                    csrfToken={''}
                    errors={errors}
                    operatorDetails={operatorDetails}
                    referer={null}
                    saved={false}
                    myFaresEnabled={false}
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render popup if saved', () => {
            const tree = shallow(
                <ManageOperatorDetails
                    csrfToken={''}
                    errors={[]}
                    operatorDetails={operatorDetails}
                    referer={null}
                    saved={true}
                    myFaresEnabled={false}
                />,
            );

            expect(tree).toMatchSnapshot();
        });
    });
});
