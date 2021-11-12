import * as React from 'react';
import { shallow } from 'enzyme';
import Exports from '../../../src/pages/products/exports';

describe('pages', () => {
    describe('confirmRegistration', () => {
        it('should render correctly without data', () => {
            const tree = shallow(
                <Exports
                    exports={[]}
                    csrf={''}
                    myFaresEnabled={true}
                    exportEnabled={true}
                    operatorHasProducts={true}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
        it('should render correctly with data', () => {
            const tree = shallow(
                <Exports
                    exports={[
                        {
                            matchingDataCount: 2,
                            name: 'TestExport',
                            netexCount: 2,
                            signedUrl:
                                'http://localhost:4572/fdbt-netex-data-dev/BLAC/zips/TestExport//TestExport.zip?AWSAccessKeyId=S3RVER&Expires=1636716236&Signature=sB9ssjS0bN72S6iydPuk43xkZZc%3D',
                            exportDate: '14 Sep 2021',
                            exportTime: '10:37',
                        },
                    ]}
                    csrf={'ip2IlrBL-d4B3lqI70d5y7f5GKMs2wvXRsVU'}
                    myFaresEnabled={true}
                    exportEnabled={true}
                    operatorHasProducts={true}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
});
