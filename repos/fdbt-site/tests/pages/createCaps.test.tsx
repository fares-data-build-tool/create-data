import { shallow } from 'enzyme';
import * as React from 'react';
import { CapStart, ExpiryUnit } from '../../src/interfaces/matchingJsonTypes';
import CreateCaps from '../../src/pages/createCaps';

describe('pages', () => {
    describe('create caps', () => {
        it('should render correctly', () => {
            const tree = shallow(<CreateCaps errors={[]} csrfToken="" />);

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly on input errors', () => {
            const tree = shallow(
                <CreateCaps
                    errors={[{ errorMessage: 'C name cannot have less than 2 characters', id: 'cap-name' }]}
                    csrfToken=""
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly on edit mode', () => {
            const capInfo = {
                name: 'Cap 1',
                price: '2',
                durationAmount: '2',
                durationUnits: 'hour' as ExpiryUnit,
            };
            const tree = shallow(<CreateCaps errors={[]} userInput={{ cap: capInfo }} editId={1} csrfToken="" />);

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly on edit mode with cap start', () => {
            const capInfo = {
                cap: {
                    name: 'Cap 1',
                    price: '2',
                    durationAmount: '2',
                    durationUnits: 'hour' as ExpiryUnit,
                },
                capStart: {
                    type: 'rollingDays' as CapStart,
                },
            };
            const tree = shallow(<CreateCaps errors={[]} userInput={capInfo} editId={1} csrfToken="" />);

            expect(tree).toMatchSnapshot();
        });
    });
});
