import * as React from 'react';
import { shallow } from 'enzyme';
import TimeRestrictions from '../../src/pages/timeRestrictions';

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
});
