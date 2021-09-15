import { shallow } from 'enzyme';
import * as react from 'react';
import { singlepassengertype } from '../../src/interfaces';
import viewpassengertypes from '../../src/pages/viewpassengertypes';

describe('pages', () => {
    describe('services', () => {
        it('should render correctly when no individual or group passenger types', () => {
            const tree = shallow(
                <viewpassengertypes singlepassengertypes={[]} grouppassengertypes={[]} csrftoken={''} referer={null} />,
            );

            expect(tree).tomatchsnapshot();
        });
    });
});
