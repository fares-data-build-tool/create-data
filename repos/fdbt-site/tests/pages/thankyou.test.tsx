import * as React from 'react';
import { shallow } from 'enzyme';
import { NextPageContext } from 'next';
import { mockRequest, mockResponse } from 'mock-req-res';
import { OPERATOR_COOKIE } from '../../src/constants';
import Thankyou from '../../src/pages/thankyou';

describe('pages', () => {
    describe('thankyou', () => {
        it('should render correctly', () => {
            const tree = shallow(<Thankyou uuid="a1b2c3d4e5" />);
            expect(tree).toMatchSnapshot();
        });
    });
});

describe('getInitialProps', () => {
    it('retrieves the uuid correctly', () => {
        const req = mockRequest({
            connection: {
                encrypted: true,
            },
            body: {},
            cookies: {
                OPERATOR_COOKIE:
                    '%7B%22operator%22%3A%22Connexions%20Buses%22%2C%22uuid%22%3A%2284c7b1b4-e178-4849-bc49-bd32cdb2db39%22%2C%22nocCode%22%3A%22HCTY%22%7D',
            },
            headers: {
                host: 'localhost',
                cookie: `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22Connexions%20Buses%22%2C%22uuid%22%3A%2284c7b1b4-e178-4849-bc49-bd32cdb2db39%22%2C%22nocCode%22%3A%22HCTY%22%7D`,
            },
        });

        const res = mockResponse({});

        const expectedResults = {
            uuid: '84c7b1b4-e178-4849-bc49-bd32cdb2db39',
        };

        const props: NextPageContext = {
            pathname: '',
            query: {},
            req,
            res,
            AppTree: () => {
                return <div />;
            },
        };
        const results = Thankyou.getInitialProps(props);
        expect(results).toEqual(expectedResults);
    });
});
