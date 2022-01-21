import { shallow } from 'enzyme';
import * as React from 'react';
import { GlobalSettingsViewPage } from '../../src/components/GlobalSettingsViewPage';

const CardBody = ({ entity: { id, name } }: { entity: { id: number; name: string } }) => (
    <h1>
        This is my card body {id} {name}
    </h1>
);

describe('GlobalSettingsViewPage', () => {
    it('should render correctly when no entities', () => {
        const tree = shallow(
            <GlobalSettingsViewPage
                csrfToken={''}
                entities={[]}
                referer={null}
                title="my title"
                description="my description"
                entityDescription="my entity description"
                CardBody={CardBody}
                deleteEnabled={false}
                exportEnabled={false}
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should render correctly when entities exist', () => {
        const tree = shallow(
            <GlobalSettingsViewPage
                csrfToken={''}
                entities={[
                    { id: 7, name: 'name seven' },
                    { id: 17, name: 'name seventeen' },
                    { id: 1, name: 'another one' },
                ]}
                referer={null}
                title="my title"
                description="my description"
                entityDescription="my entity description"
                CardBody={CardBody}
                deleteEnabled={false}
                exportEnabled={false}
            />,
        );
        expect(tree).toMatchSnapshot();
    });

    it('should render correctly when entities exist and delete is enabled', () => {
        const tree = shallow(
            <GlobalSettingsViewPage
                csrfToken={''}
                entities={[
                    { id: 7, name: 'name seven' },
                    { id: 17, name: 'name seventeen' },
                    { id: 1, name: 'another one' },
                ]}
                referer={null}
                title="my title"
                description="my description"
                entityDescription="my entity description"
                CardBody={CardBody}
                deleteEnabled={true}
                exportEnabled={false}
            />,
        );

        expect(tree).toMatchSnapshot();
    });
});
