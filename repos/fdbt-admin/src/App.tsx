import { ReactElement, useEffect, useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { AmplifyAuthenticator, AmplifySignIn } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import Page from '@govuk-react/page';
import Nav from './components/Nav';
import AddUser from './pages/AddUser';
import DeleteUser from './pages/DeleteUser';
import DeleteExport from './pages/DeleteExport';
import EditUser from './pages/EditUser';
import Reporting from './pages/Reporting';
import ListUsers from './pages/ListUsers';
import ResendInvite from './pages/ResendInvite';

interface AuthDataAttributes {
    'custom:fullAdmin': number;
}

interface AuthData {
    attributes: AuthDataAttributes;
}

const App = (): ReactElement => {
    const [authState, setAuthState] = useState('');
    // eslint-disable-next-line @typescript-eslint/ban-types
    const [user, setUser] = useState<AuthData | undefined>(undefined);
    const [isFullAdmin, setIsFullAdmin] = useState<boolean>(false);

    useEffect(() => {
        onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setUser(authData as AuthData);
            setIsFullAdmin(Boolean(Number((authData as AuthData)?.attributes?.['custom:fullAdmin'])));
        });
    }, [user]);

    return authState === AuthState.SignedIn && user ? (
        <BrowserRouter>
            <Page header={<Nav isFullAdmin={isFullAdmin} />}>
                <Switch>
                    {/* Users */}
                    <Route path="/listUsers">
                        <ListUsers isFullAdmin={isFullAdmin} />
                    </Route>
                    <Route path="/addUser">
                        <AddUser />
                    </Route>
                    <Route path="/deleteUser/:username">
                        <DeleteUser isFullAdmin={isFullAdmin} />
                    </Route>
                    <Route path="/editUser/:username">
                        <EditUser isFullAdmin={isFullAdmin} />
                    </Route>
                    <Route path="/resendInvite/:username">
                        <ResendInvite isFullAdmin={isFullAdmin} />
                    </Route>
                    {/* Exports */}
                    <Route path="/reporting">
                        <Reporting isFullAdmin={isFullAdmin} />
                    </Route>
                    <Route path="/deleteExport/:exportName">
                        <DeleteExport isFullAdmin={isFullAdmin} />
                    </Route>
                    {/* Root */}
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
