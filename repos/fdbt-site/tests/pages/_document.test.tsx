/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { shallow } from 'enzyme';
import { DocumentProps } from 'next/dist/pages/_document';
import MyDocument from '../../src/pages/_document';

describe('_document', () => {
    const props: DocumentProps = {
        html: '',
        __NEXT_DATA__: {
            props: {},
            page: '',
            query: {
                '': '',
            },
            buildId: '',
        },
        dangerousAsPath: '',
        ampPath: '',
        inAmpMode: false,
        hybridAmp: false,
        staticMarkup: false,
        isDevelopment: false,
        devFiles: [''],
        files: [''],
        polyfillFiles: [''],
        dynamicImports: [
            {
                id: '',
                name: '',
                file: '',
                publicPath: '',
            },
        ],
        canonicalBase: '',
        htmlProps: {},
        bodyTags: [{}],
        headTags: [{}],
        lowPriorityFiles: [],
    };

    it('should render correctly', () => {
        const tree = shallow(
            <MyDocument
                {...props}
                nonce=""
                isAuthed
                csrfToken=""
                breadcrumbs={[]}
                url=""
                showCookieBanner
                allowTracking
            />,
        );

        expect(tree).toMatchSnapshot();
    });

    it('should not show the cookie banner when the showCookieBanner attribute is false', () => {
        const tree = shallow(
            <MyDocument
                {...props}
                nonce=""
                isAuthed
                csrfToken=""
                breadcrumbs={[]}
                url=""
                showCookieBanner={false}
                allowTracking
            />,
        );

        expect(tree).toMatchSnapshot();
    });
});
