import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import Amplify from 'aws-amplify';
import App from './App';
import awsconfig from './aws-exports';

import './index.css';

Amplify.configure(awsconfig);

ReactDOM.render(
    <StrictMode>
        <App />
    </StrictMode>,
    document.getElementById('root'),
);
