import { ReactElement, useEffect, useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import Page from '@govuk-react/page';
import Nav from './components/Nav';
import AddUser from './pages/AddUser';
import DeleteUser from './pages/DeleteUser';
import EditUser from './pages/EditUser';
import ListUsers from './pages/ListUsers';

const App = (): ReactElement => {
    const [authState, setAuthState] = useState('');
    // eslint-disable-next-line @typescript-eslint/ban-types
    const [user, setUser] = useState<object | undefined>(undefined);

    useEffect(() => {
        onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setUser(authData);
        });
    }, [user]);

    return authState === AuthState.SignedIn && user ? (
        <BrowserRouter>
            <Page header={<Nav />}>
                <Switch>
                    <Route path="/addUser">
                        <AddUser />
                    </Route>
                    <Route path="/deleteUser/:username">
                        <DeleteUser />
                    </Route>
                    <Route path="/editUser/:username">
                        <EditUser />
                    </Route>
                    <Route path="/listUsers">
                        <ListUsers />
                    </Route>
                    <Route path="/">
                        <Redirect to="/listUsers" />
                    </Route>
                </Switch>
            </Page>
        </BrowserRouter>
    ) : (
        <AmplifyAuthenticator>
            <AmplifySignIn slot="sign-in" hideSignUp />
        </AmplifyAuthenticator>
    );
};

export default App;
