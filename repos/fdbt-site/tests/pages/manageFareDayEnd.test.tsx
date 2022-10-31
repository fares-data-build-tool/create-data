import * as React from 'react';
import { shallow } from 'enzyme';
import ManageFareDayEnd, { fareDayEndInputId } from '../../src/pages/manageFareDayEnd';

describe('pages', () => {
    describe('manage passenger types', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <ManageFareDayEnd
                    csrfToken={''}
                    errors={[]}
                    fareDayEnd={'1234'}
                    referer={'hi'}
                    saved={false}
                    isDevOrTest={false}
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render error state if error', () => {
            const errors = [{ id: fareDayEndInputId, errorMessage: 'An error happened!' }];

            const tree = shallow(
                <ManageFareDayEnd
                    csrfToken={''}
                    errors={errors}
                    fareDayEnd={'Not a time'}
                    referer={null}
                    saved={false}
                    isDevOrTest={false}
                />,
            );

            expect(tree).toMatchSnapshot();
        });

        it('should render popup if saved', () => {
            const tree = shallow(
                <ManageFareDayEnd
                    csrfToken={''}
                    errors={[]}
                    fareDayEnd={'1254'}
                    referer={null}
                    saved={true}
                    isDevOrTest={false}
                />,
            );

            expect(tree).toMatchSnapshot();
        });
    });
});
