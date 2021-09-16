import { shallow } from 'enzyme';
import Services from '../../../src/pages/products/services';
import * as React from 'react';
import { MyFaresService } from 'src/interfaces';

describe('myfares pages', () => {
    describe('services', () => {
        it('should render correctly when no services present', () => {
            const tree = shallow(<Services services={[]} myFaresEnabled={false} />);

            expect(tree).toMatchSnapshot();
        });

        it('should render correctly when services present', () => {
            const services = [
                {
                    serviceDescription: 'Awesome service',
                    lineName: '1',
                    startDate: '1/1/2021',
                    endDate: '16/9/2021',
                },
            ] as MyFaresService[];

            const tree = shallow(<Services services={services} myFaresEnabled={false} />);

            expect(tree).toMatchSnapshot();
        });
    });
});
