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
                    exportEnabled={false}
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render error state if error', () => {
            const errors = [
                { id: 'operatorName', errorMessage: 'Operator name is required' },
                { id: 'street', errorMessage: 'Street is required' },
                { id: 'town', errorMessage: 'Town is required' },
                { id: 'county', errorMessage: 'County is required' },
                { id: 'postcode', errorMessage: 'Postcode is required' },
                { id: 'contactNumber', errorMessage: 'At least one of contact number, email or URL are required' },
            ];

            const tree = shallow(
                <ManageOperatorDetails
                    csrfToken={''}
                    errors={errors}
                    operatorDetails={operatorDetails}
                    referer={null}
                    saved={false}
                    exportEnabled={false}
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
                    exportEnabled={false}
                />,
            );

            expect(tree).toMatchSnapshot();
        });
    });
});
