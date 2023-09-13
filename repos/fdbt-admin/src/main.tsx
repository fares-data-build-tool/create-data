import ReactDOM from 'react-dom'
import App from './App.tsx'
import './index.css'
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import { StrictMode } from 'react';

Amplify.configure(awsconfig);


ReactDOM.render(
  <StrictMode>
      <App />
  </StrictMode>,
  document.getElementById('root'),
);
