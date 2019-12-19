import * as React from 'react';
import { shallow } from 'enzyme';
import Index from "../../pages/index";

describe('pages', () => {
  describe('operator', () => {
    
    it('should render correctly', () => {
      const tree = shallow(
        <Index />
      );
      expect(tree).toMatchSnapshot();
    });
  });
});