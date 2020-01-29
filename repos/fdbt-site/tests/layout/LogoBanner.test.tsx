import * as React from 'react';
import { shallow } from 'enzyme';
import LogoBanner from "../../layout/LogoBanner";

describe('LogoBanner', () => {

  it('should render correctly', () => {
    const tree = shallow(
      <LogoBanner />
    );
    expect(tree).toMatchSnapshot();
  });
});