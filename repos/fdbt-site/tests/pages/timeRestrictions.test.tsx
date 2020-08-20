import * as React from 'react';
import { shallow } from 'enzyme';
import TimeRestrictions, { TimeRestrictionsProps, getServerSideProps } from '../../src/pages/timeRestrictions';
import { getMockContext } from '../testData/mockData';
import { TimeRestrictionsAttributeWithErrors } from '../../src/pages/api/timeRestrictions';
import { TIME_RESTRICTIONS_ATTRIBUTE } from '../../src/constants';

describe('pages', () => {
    describe('timeRestrictions', () => {
        it('should render correctly with no errors', () => {
            const tree = shallow(<TimeRestrictions errors={[]} csrfToken="" pageProps={[]} />);
            expect(tree).toMatchSnapshot();
        });

        it('should render correctly with errors', () => {
            const tree = shallow(
                <TimeRestrictions
                    errors={[
                        {
                            errorMessage: 'Error',
                            id: 'id',
                        },
                    ]}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });

    describe('getServerSideProps', () => {
        it('should return default props when there is no TIME_RESTRICTIONS_ATTRIBUTE', () => {
            const ctx = getMockContext();
            const expectedProps: { props: TimeRestrictionsProps } = {
                props: {
                    errors: [],
                },
            };
            const props = getServerSideProps(ctx);
            expect(props).toEqual(expectedProps);
        });

        it('should return props containing errors when the GROUP_SIZE_ATTRIBUTE contains errors', () => {
            const timeRestrictionsInfoWithErrors: TimeRestrictionsAttributeWithErrors = {
                timeRestrictions: false,
                errors: [
                    {
                        errorMessage: 'Enter a whole number between 1 and 30',
                        id: 'max-group-size',
                        userInput: 'wrong input',
                    },
                ],
            };
            const ctx = getMockContext({
                session: {
                    [TIME_RESTRICTIONS_ATTRIBUTE]: timeRestrictionsInfoWithErrors,
                },
            });
            const expectedProps: { props: TimeRestrictionsProps } = {
                props: {
                    errors: timeRestrictionsInfoWithErrors.errors,
                },
            };
            const props = getServerSideProps(ctx);
            expect(props).toEqual(expectedProps);
        });
    });
});
