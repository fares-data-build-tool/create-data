import * as React from 'react';
import { shallow } from 'enzyme';
import { NextPageContext } from 'next';
import { mockRequest } from 'mock-req-res';
import MockRes from 'mock-res';

import StageNames from '../../src/pages/stageNames';
import { FARE_STAGES_COOKIE, OPERATOR_COOKIE } from '../../src/constants';

describe('pages', () => {
    describe('stageNames', () => {
        const mockNumberOfFareStages = '6';
        const mockValidationObject: any[] = [];
        const operator = 'HCTY';

        it('should render correctly', () => {
            const tree = shallow(
                <StageNames numberOfFareStages={mockNumberOfFareStages} validationObject={mockValidationObject} />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('displays a number of input fields which matches the number of fare stages in the fareStagesCookie ', () => {
            const res = new MockRes();
            const req = mockRequest({
                connection: {
                    encrypted: false,
                },
                headers: {
                    host: 'localhost:5000',
                    cookie: `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22${operator}%22%2C%22uuid%22%3A%221e0459b3-082e-4e70-89db-96e8ae173e10%22%2C%22nocCode%22%3A%22HCTY%22%7D; ${FARE_STAGES_COOKIE}=%7B%22fareStages%22%3A%22${mockNumberOfFareStages}%22%7D`,
                },
                cookies: {
                    FARE_STAGES_COOKIE: `%7B%22fareStages%22%3A%22${mockNumberOfFareStages}%22%7D`,
                    OPERATOR_COOKIE:
                        '%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22d177b8a0-44ed-4e67-9fd0-2d581b5fa91a%22%7D',
                },
            });
            const ctx: NextPageContext = {
                res,
                req,
                pathname: '',
                query: {},
                AppTree: () => <div />,
            };
            const result = StageNames.getInitialProps(ctx);
            expect(result).toEqual({
                numberOfFareStages: '6',
                validationObject: [],
            });
        });
    });
});
