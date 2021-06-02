import * as React from 'react';
import { shallow } from 'enzyme';
import HowManyProducts, { getServerSideProps } from '../../src/pages/howManyProducts';
import { ErrorInfo } from '../../src/interfaces';
import { getMockContext } from '../testData/mockData';
import { FARE_TYPE_ATTRIBUTE, TICKET_REPRESENTATION_ATTRIBUTE } from '../../src/constants/attributes';

describe('pages', () => {
    describe('howManyProducts', () => {
        const periodGeoZonePageHeading = 'How many period tickets do you have for this geographic zone?';
        const periodMultiServicePageHeading = 'How many period tickets do you have for the selected services?';
        const multiOpGeoZonePageHeading = 'How many multi operator tickets do you have for this geographic zone?';
        const multiOpMultiServicePageHeading = 'How many multi operator tickets do you have for the selected services?';

        const errorCases: ErrorInfo[][] = [
            [{ id: 'how-many-products-error', errorMessage: 'Enter a whole number between 1 and 10', userInput: '0' }],
            [{ id: 'how-many-products-error', errorMessage: 'Enter a whole number between 1 and 10', userInput: '11' }],
            [{ id: 'how-many-products-error', errorMessage: 'Enter a whole number between 1 and 10', userInput: '99' }],
            [
                {
                    id: 'how-many-products-error',
                    errorMessage: 'Enter a whole number between 1 and 10',
                    userInput: '4.65',
                },
            ],
            [
                {
                    id: 'how-many-products-error',
                    errorMessage: 'Enter a whole number between 1 and 10',
                    userInput: 'some strange thing a user would type',
                },
            ],
            [{ id: 'how-many-products-error', errorMessage: 'Enter a whole number between 1 and 10', userInput: '' }],
            [
                {
                    id: 'how-many-products-error',
                    errorMessage: 'Enter a whole number between 1 and 10',
                    userInput: '       ',
                },
            ],
        ];

        it('should render correctly for non multi op', () => {
            const wrapper = shallow(
                <HowManyProducts fareType="period" pageHeading={periodGeoZonePageHeading} errors={[]} csrfToken="" />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        it('should render correctly for multi op', () => {
            const wrapper = shallow(
                <HowManyProducts
                    fareType="multiOperator"
                    pageHeading={multiOpMultiServicePageHeading}
                    errors={[]}
                    csrfToken=""
                />,
            );
            expect(wrapper).toMatchSnapshot();
        });

        test.each(errorCases)(
            'should render correctly when a user is redirected to the page from itself when incorrect data is entered (non-multiOperator)',
            mockError => {
                const tree = shallow(
                    <HowManyProducts
                        fareType="period"
                        pageHeading={periodMultiServicePageHeading}
                        errors={[mockError]}
                        csrfToken=""
                    />,
                );
                expect(tree).toMatchSnapshot();
            },
        );
        test.each(errorCases)(
            'should render correctly when a user is redirected to the page from itself when incorrect data is entered (multiOperator)',
            mockError => {
                const tree = shallow(
                    <HowManyProducts
                        fareType="multiOperator"
                        pageHeading={multiOpGeoZonePageHeading}
                        errors={[mockError]}
                        csrfToken=""
                    />,
                );
                expect(tree).toMatchSnapshot();
            },
        );

        describe('getServerSideProps', () => {
            it.each([
                ['period', 'geoZone', periodGeoZonePageHeading],
                ['period', 'multipleServices', periodMultiServicePageHeading],
                ['multiOperator', 'geoZone', multiOpGeoZonePageHeading],
                ['multiOperator', 'multipleServices', multiOpMultiServicePageHeading],
            ])('should format the correct page heading for a %s %s ticket', (fareType, ticketType, heading) => {
                const ctx = getMockContext({
                    session: {
                        [FARE_TYPE_ATTRIBUTE]: { fareType },
                        [TICKET_REPRESENTATION_ATTRIBUTE]: { name: ticketType },
                    },
                });
                const actualProps = getServerSideProps(ctx);
                expect(actualProps.props.pageHeading).toBe(heading);
            });
        });
    });
});
