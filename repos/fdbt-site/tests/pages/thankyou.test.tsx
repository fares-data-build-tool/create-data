import * as React from 'react';
import { shallow } from 'enzyme';
import { NextPageContext } from 'next';
import { mockRequest, mockResponse } from 'mock-req-res';
import { SERVICE_COOKIE } from '../../src/constants';
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
            body: {},
            cookies: {
                SERVICE_COOKIE:
                    '%7B%22service%22%3A%22N1%22%2C%22uuid%22%3A%22d177b8a0-44ed-4e67-9fd0-2d581b5fa91a%22%7D',
            },
            headers: {
                host: 'localhost',
                cookie: `${SERVICE_COOKIE}=%7B%22service%22%3A%22N1%22%2C%22uuid%22%3A%22d177b8a0-44ed-4e67-9fd0-2d581b5fa91a%22%7D`,
            },
        });

        const res = mockResponse({});

        const expectedResults = {
            uuid: 'd177b8a0-44ed-4e67-9fd0-2d581b5fa91a',
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
