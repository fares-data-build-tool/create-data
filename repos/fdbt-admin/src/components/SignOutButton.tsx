import { Button } from 'govuk-react';
import { signOut } from 'aws-amplify/auth';
import { ReactElement } from 'react';
import { useHistory } from 'react-router-dom';

interface SignOutButtonProps {
    className?: string;
}

const SignOutButton = ({ className }: SignOutButtonProps): ReactElement => {
    const history = useHistory();

    const signOutUser = async (): Promise<void> => {
        await signOut().then(
            () => history.go(0),
            () => history.push('/'),
        );
    };

    return (
        <Button className={className} onClick={async () => signOutUser()}>
            Sign Out
        </Button>
    );
};

SignOutButton.defaultProps = {
    className: '',
};

export default SignOutButton;
