import * as React from 'react';
import { shallow } from 'enzyme';
import CsvUpload from '../../src/pages/csvUpload';

describe('pages', () => {
    describe('csvUpload', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <CsvUpload
                    csvUploadApiRoute=""
                    csvUploadTitle="Upload fares triangle as CSV"
                    csvUploadHintText=""
                    guidanceDocDisplayName=""
                    guidanceDocAttachmentUrl=""
                    guidanceDocSize=""
                    csvTemplateDisplayName=""
                    csvTemplateAttachmentUrl=""
                    csvTemplateSize=""
                    errors={[]}
                    showPriceOption
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
