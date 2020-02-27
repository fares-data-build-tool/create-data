import * as React from 'react';
import { shallow } from 'enzyme';
// import MockRes from 'mock-res';
// import { mockRequest } from 'mock-req-res';
// import { NextPageContext } from 'next';
// import StageNames from '../../src/pages/stageNames';
import PriceEntry from '../../src/pages/priceEntry';

const mockFareStages: string[] = [
    'Briggate',
    'Chapeltown',
    'Chapel Allerton',
    'Moortown',
    'Harrogate Road',
    'Harehills',
    'Gipton',
    'Armley',
    'Stanningley',
    'Pudsey',
    'Seacroft',
    'Rothwell',
    'Dewsbury',
    'Wakefield',
];

describe('pages', () => {
    describe('inputMethod', () => {
        it('should render correctly', () => {
            const tree = shallow(<PriceEntry fareStages={mockFareStages} />);
            expect(tree).toMatchSnapshot();
        });

        // it('should throw an error if there are no stages in the cookie', () => {

        //     const mockWriteHeadFn = jest.fn();
        //     const mockEndFn = jest.fn();
        //     const res = new MockRes();
        //     res.writeHead = mockWriteHeadFn;
        //     res.end = mockEndFn;

        //     const req = mockRequest({
        //         connection: {
        //             encrypted: true,
        //         },
        //         headers: {
        //             host: 'localhost:5000',
        //             cookie: ,
        //         },
        //         cookies: {
        //             STAGE_NAMES_COOKIE: stageNames,
        //         },
        //     });

        //     const ctx: NextPageContext = {
        //         res,
        //         req,
        //         pathname: '',
        //         query: {},
        //         AppTree: () => <div />,
        //     };

        //     const result = PriceEntry.getInitialProps(ctx);

        //     expect(mockWriteHeadFn).toHaveBeenCalledWith(302, {
        //         Location: '/error',
        //     });
        //     expect(mockEndFn).toHaveBeenCalled();
        //     expect(result).toEqual({});
        // });

        // it('should throw an error if there is no stageNames cookie', () => {
        //     const mockWriteHeadFn = jest.fn();
        //     const mockEndFn = jest.fn();
        //     const res = new MockRes();
        //     res.writeHead = mockWriteHeadFn;
        //     res.end = mockEndFn;

        //     const req = mockRequest({
        //         connection: {
        //             encrypted: true,
        //         },
        //         headers: {
        //             host: 'localhost:5000',
        //             cookie: `othername=%7B%22operator%22%3A%22MCT%22%2C%22uuid%22%3A%223f8d5a32-b480-4370-be9a-60d366422a87%22%7D`,
        //         },
        //         cookies: {
        //             STAGE_NAMES_COOKIE: StageNames,
        //         },
        //     });
        //     const ctx: NextPageContext = {
        //         res,
        //         req,
        //         pathname: '',
        //         query: {},
        //         AppTree: () => <div />,
        //     };

        //     const result = PriceEntry.getInitialProps(ctx);

        //     expect(mockWriteHeadFn).toHaveBeenCalledWith(302, {
        //         Location: '/error',

        //     });
        //     expect(mockEndFn).toHaveBeenCalled();
        //     expect(result).toEqual({});
        // });
    });
});
