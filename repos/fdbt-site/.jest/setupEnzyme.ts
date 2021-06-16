import 'jsdom-global/register';
import 'react';
import { configure } from 'enzyme';

const Adapter = require('enzyme-adapter-react-16');

configure({ adapter: new Adapter() });
