import 'jsdom-global/register';
import 'react';
import { configure } from 'enzyme';

const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');

configure({ adapter: new Adapter() });
