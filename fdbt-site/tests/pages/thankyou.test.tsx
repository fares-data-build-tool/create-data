import * as React from 'react';
import { shallow } from 'enzyme';
import Thankyou, { getServerSideProps } from '../../src/pages/thankyou';
import { getMockContext } from '../testData/mockData';

describe('pages', () => {
    describe('thankyou', () => {
        it('should render correctly', () => {
            const tree = shallow(<Thankyou uuid="a1b2c3d4e5" />);
            expect(tree).toMatchSnapshot();
        });
    });

    describe('getServerSideProps', () => {
        it('retrieves the uuid correctly', () => {
            const ctx = getMockContext({
                cookies: {},
                body: null,
                uuid: { operatorUuid: '84c7b1b4-e178-4849-bc49-bd32cdb2db39' },
            });

            const expectedResults = {
                props: {
                    uuid: '84c7b1b4-e178-4849-bc49-bd32cdb2db39',
                },
            };

            const results = getServerSideProps(ctx);
            expect(results).toEqual(expectedResults);
        });
    });
});
