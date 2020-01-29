import * as React from 'react';
import { shallow } from 'enzyme';
import Layout from "../../layout/Layout";

describe('Layout', () => {
  it('should render correctly', () => {
    const tree = shallow(
      <Layout title={"title"} description={"description"} />
    );
    expect(tree).toMatchSnapshot();
  });
});