import * as React from 'react';
import { shallow } from 'enzyme';
import Stages from "../../pages/stages";
import { NextPageContext } from 'next';
import { mockRequest, mockResponse } from 'mock-req-res';
import { OPERATOR_COOKIE, SERVICE_COOKIE } from '../../constants';
import * as utils from '../../utils';


describe('pages', () => {
  describe('stages', () => {

    it('should render correctly', () => {
      const tree = shallow(
        <Stages operator={"Connexions Buses"} service={"X70"} />
      );
      expect(tree).toMatchSnapshot();
    });
  });

  describe('getInitialProps', () => {
    const spySet = jest
    .spyOn(utils, 'isSessionValid')
    .mockImplementation().mockReturnValue(Promise.resolve(true));

    it('return the op render correctly', async () => {
      const req = mockRequest({ 
        body: {},
        cookies: {
          OPERATOR_COOKIE: "%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22d177b8a0-44ed-4e67-9fd0-2d581b5fa91a%22%7D",
          SERVICE_COOKIE: "%7B%22service%22%3A%22N1%22%2C%22uuid%22%3A%22d177b8a0-44ed-4e67-9fd0-2d581b5fa91a%22%7D"
        },
        headers: {
          host: "localhost",
          cookie: `${OPERATOR_COOKIE}=%7B%22operator%22%3A%22FirstBus%22%2C%22uuid%22%3A%22cbc0111a-e763-48e7-982b-ac25ecbe625c%22%7D; ${SERVICE_COOKIE}=%7B%22service%22%3A%22N1%22%2C%22uuid%22%3A%22d177b8a0-44ed-4e67-9fd0-2d581b5fa91a%22%7D`
        }
      });

      const res = mockResponse({ 
        writeHead: jest.fn()
      });

      const expectedResults = {
       operator: "FirstBus",
       service: "N1"
      };

      const props: NextPageContext = {
        pathname: "",
        query: {},
        req: req,
        res: res,
        AppTree: null
      };

      const results = await Stages.getInitialProps(props)
      .then( response => {
        return response
      });
      expect(results).toEqual(expectedResults);
      expect(spySet).toHaveBeenCalled();      
    });
  });
});




