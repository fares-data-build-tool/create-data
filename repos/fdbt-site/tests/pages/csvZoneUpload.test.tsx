import * as React from 'react';
import { shallow } from 'enzyme';
import CsvZoneUpload from '../../src/pages/csvZoneUpload';

describe('pages', () => {
    describe('csvzoneupload', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <CsvZoneUpload
                    csvUploadApiRoute=""
                    csvUploadHintText=""
                    guidanceDocDisplayName=""
                    guidanceDocAttachmentUrl=""
                    guidanceDocSize=""
                    csvTemplateDisplayName=""
                    csvTemplateAttachmentUrl=""
                    csvTemplateSize=""
                    errors={[]}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
