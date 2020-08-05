import * as React from 'react';
import { shallow } from 'enzyme';
import GroupSize, { getServerSideProps, GroupSizeProps } from '../../src/pages/groupSize';
import { getMockContext } from '../testData/mockData';
import { GroupTicketAttributeWithErrors } from '../../src/pages/api/groupSize';
import { GROUP_SIZE } from '../../src/constants';

describe('pages', () => {
    describe('groupSize', () => {
        it('should render correctly', () => {
            const tree = shallow(<GroupSize groupTicketInfo={{ maxGroupSize: '' }} csrfToken="" pageProps={[]} />);
            expect(tree).toMatchSnapshot();
        });

        it('should render error messaging when errors are passed', () => {
            const tree = shallow(
                <GroupSize
                    groupTicketInfo={{
                        maxGroupSize: 'not a number',
                        errors: [
                            {
                                errorMessage: 'Enter a whole number between 1 and 30',
                                id: 'max-group-size',
                                userInput: 'not a number',
                            },
                        ],
                    }}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });

    describe('getServerSideProps', () => {
        it('should return default props when there is no GROUP_SIZE', () => {
            const ctx = getMockContext();
            const expectedProps: { props: GroupSizeProps } = {
                props: {
                    groupTicketInfo: {
                        maxGroupSize: '',
                    },
                },
            };
            const props = getServerSideProps(ctx);
            expect(props).toEqual(expectedProps);
        });

        it('should return props containing errors when the GROUP_SIZE contains errors', () => {
            const groupTicketInfoWithErrors: GroupTicketAttributeWithErrors = {
                maxGroupSize: 'wrong input',
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
                    [GROUP_SIZE]: groupTicketInfoWithErrors,
                },
            });
            const expectedProps: { props: GroupSizeProps } = {
                props: {
                    groupTicketInfo: groupTicketInfoWithErrors,
                },
            };
            const props = getServerSideProps(ctx);
            expect(props).toEqual(expectedProps);
        });
    });
});
