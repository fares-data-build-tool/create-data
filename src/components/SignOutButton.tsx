import { Button } from 'govuk-react';
import { Auth } from 'aws-amplify';
import { ReactElement } from 'react';

const signOut = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return Auth.signOut() as Promise<void>;
};

interface SignOutButtonProps {
    className?: string;
}

const SignOutButton = ({ className }: SignOutButtonProps): ReactElement => (
    <Button className={className} onClick={async () => signOut()}>
        Sign Out
    </Button>
);

SignOutButton.defaultProps = {
    className: '',
};

export default SignOutButton;
