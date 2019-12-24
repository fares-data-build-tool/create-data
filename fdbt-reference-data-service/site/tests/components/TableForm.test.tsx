import * as React from 'react';
import { shallow } from 'enzyme';
import TableForm from "../../components/TableForm";

describe('TableForm', () => {

  it('should render correctly', () => {
    const tree = shallow(
      <TableForm offset={1} />
    );
    expect(tree).toMatchSnapshot();
  });
});