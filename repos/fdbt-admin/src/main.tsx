import ReactDOM from 'react-dom';
import App from './App.tsx';
import './index.css';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import { StrictMode } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';

import '@aws-amplify/ui-react/styles.css';

Amplify.configure(awsconfig);

ReactDOM.render(
    <StrictMode>
        <Authenticator hideSignUp>
            <App />
        </Authenticator>
    </StrictMode>,
    document.getElementById('root'),
);
