import * as React from 'react';
import { shallow } from 'enzyme';
import StageNamesConfirmation, {
    buildFareStageNamesConfirmationElements,
} from '../../src/pages/stageNamesConfirmation';

describe('pages', () => {
    describe('stageNamesConfirmation', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <StageNamesConfirmation fareStageNames={['leeds', 'manchester', 'bolton']} csrfToken="" />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
    describe('buildFareStageNamesConfirmationElements', () => {
        it('builds confirmation elements for an array of fare stages', () => {
            const result = buildFareStageNamesConfirmationElements(['leeds', 'manchester', 'bolton']);
            expect(result).toStrictEqual([
                { content: 'leeds', href: 'stageNames', name: 'Fare stage 1' },
                { content: 'manchester', href: 'stageNames', name: 'Fare stage 2' },
                { content: 'bolton', href: 'stageNames', name: 'Fare stage 3' },
            ]);
        });
    });
});
