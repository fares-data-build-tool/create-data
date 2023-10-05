import { ReactElement, useEffect, useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';
import Page from '@govuk-react/page';
import Nav from './components/Nav';
import AddUser from './pages/AddUser';
import DeleteUser from './pages/DeleteUser';
import EditUser from './pages/EditUser';
import Reporting from './pages/Reporting';
import ListUsers from './pages/ListUsers';
import ResendInvite from './pages/ResendInvite';

const App = (): ReactElement | null => {
    const [isFullAdmin, setIsFullAdmin] = useState<boolean>(false);
    const { authStatus, user } = useAuthenticator((context) => [context.route]);

    useEffect(() => {
        setIsFullAdmin(Boolean(Number(user.attributes?.['custom:fullAdmin'])));
    }, [authStatus]);

    return authStatus === 'authenticated' && user ? (
        <BrowserRouter>
            <Page header={<Nav isFullAdmin={isFullAdmin} />}>
                <Switch>
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
                    <Route path="/reporting">
                        <Reporting isFullAdmin={isFullAdmin} />
                    </Route>
                    {/* Root */}
                    <Route path="/">
                        <Redirect to="/listUsers" />
                    </Route>
                </Switch>
            </Page>
        </BrowserRouter>
    ) : null;
};

export default App;
