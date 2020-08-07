import React, { ReactElement } from 'react';

interface InsetTextProps {
    text: string;
}

const InsetText = ({ text }: InsetTextProps): ReactElement => {
    return <div className="govuk-inset-text">{text}</div>;
};

export default InsetText;
