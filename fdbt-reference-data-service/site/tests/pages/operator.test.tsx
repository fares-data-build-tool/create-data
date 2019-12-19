import * as React from 'react';
import { shallow } from 'enzyme';
import Operator from "../../pages/operator";

describe('pages', () => {
  describe('operator', () => {
    
    it('should render correctly', () => {
      const tree = shallow(
        <Operator />
      );
      expect(tree).toMatchSnapshot();
    });
  });
});