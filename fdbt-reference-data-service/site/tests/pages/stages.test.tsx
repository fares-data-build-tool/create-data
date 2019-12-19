import * as React from 'react';
import { shallow } from 'enzyme';
import Stages from "../../pages/stages";

describe('pages', () => {
  describe('stages', () => {

    it('should render correctly', () => {
      const tree = shallow(
        <Stages operator={"Connexions Buses"} service={"X70"} />
      );
      expect(tree).toMatchSnapshot();
    });
  });
});