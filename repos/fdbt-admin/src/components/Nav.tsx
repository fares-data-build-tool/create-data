import TopNav, { asNavLinkAnchor } from '@govuk-react/top-nav';
import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SignOutButton from './SignOutButton';

interface NavProps {
    isFullAdmin: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const NavAnchor = asNavLinkAnchor('a');
const StyledSignOutButton = styled(SignOutButton)`
    position: absolute;
    right: 20px;
    top 20px;
`;

const Nav = ({ isFullAdmin }: NavProps): ReactElement => (
    <TopNav serviceTitle="Create Fares Data Admin">
        <NavAnchor to="/listUsers" as={Link}>
            User List
        </NavAnchor>
        <NavAnchor to="/addUser" as={Link}>
            Add New User
        </NavAnchor>
        {isFullAdmin && (
            <NavAnchor to="/listIncompleteExports" as={Link}>
                Incomplete Exports List
            </NavAnchor>
        )}
        <StyledSignOutButton className="" />
    </TopNav>
);
export default Nav;
