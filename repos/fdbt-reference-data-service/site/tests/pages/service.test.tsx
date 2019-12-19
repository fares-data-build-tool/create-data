import * as React from 'react';
import { shallow } from 'enzyme';
import Service from "../../pages/service";

describe('pages', () => {
  describe('service', () => {
    
    it('should render correctly', () => {
      const tree = shallow(
        <Service operator={"Connexions Buses"} />
      );
      expect(tree).toMatchSnapshot();
    });
  });
});