import * as React from 'react';
import { shallow } from 'enzyme';
import HowToUploadFaresTriangle from '../assets/files/How-to-Upload-a-Fares-Triangle.pdf';
import FaresTriangleExampleCsv from '../assets/files/Fares-Triangle-Example.csv';
import InputMethod from '../../src/pages/inputMethod';

describe('pages', () => {
    describe('inputMethod', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <InputMethod
                    errors={[]}
                    csrfToken=""
                    guidanceDocDisplayName="Download Help File - File Type PDF - File Size 592KB"
                    guidanceDocAttachmentUrl={HowToUploadFaresTriangle}
                    guidanceDocSize="1.2MB"
                    csvTemplateDisplayName="Download fares triangle CSV template - File Type CSV - File Size 255B"
                    csvTemplateAttachmentUrl={FaresTriangleExampleCsv}
                    csvTemplateSize="255B"
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
