import * as React from 'react';
import { shallow } from 'enzyme';
import MyDocument from "../../pages/_document";
import { DocumentProps } from 'next/dist/pages/_document';

describe('_document', () => {

  const props: DocumentProps = {
    html: "",
    __NEXT_DATA__: {

      dataManager: "",
      props: {},
      page: "",
      query: {
        "": ""
      },
      buildId: "",
    },
    dangerousAsPath: "",
    ampPath: "",
    inAmpMode: false,
    hybridAmp: false,
    staticMarkup: false,
    isDevelopment: false,
    hasCssMode: false,
    devFiles: [""],
    files: [""],
    polyfillFiles: [""],
    dynamicImports: [
      {
        id: "",
        name: "",
        file: "",
        publicPath: ""
      }],
    canonicalBase: "",
    htmlProps: {},
    bodyTags: [{}],
    headTags: [{}],
  }

  it('should render correctly', () => {
    const tree = shallow(
      <MyDocument  {...props} />
    );
    expect(tree).toMatchSnapshot();
  });
});