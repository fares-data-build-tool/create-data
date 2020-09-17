import React, { ReactElement } from 'react';

interface ConfirmationTableProps {
    confirmationElements: ConfirmationElement[];
}

interface ConfirmationElement {
    header: string;
    innerElements: InnerElement[];
}

interface InnerElement {
    name: string;
    content: string;
    href: string;
}

const ConfirmationTable = ({ confirmationElements }: ConfirmationTableProps): ReactElement => {
    const builtElements = confirmationElements.map(element => (
        <React.Fragment key={element.header}>
            <h2 className="govuk-heading-m">{element.header}</h2>
            <dl className="govuk-summary-list govuk-!-margin-bottom-9">
                {element.innerElements.map(innerElement => (
                    <div className="govuk-summary-list__row" key={innerElement.name}>
                        <dt className="govuk-summary-list__key">{innerElement.name}</dt>
                        <dd className="govuk-summary-list__value">{innerElement.content}</dd>
                        <dd className="govuk-summary-list__actions">
                            <a className="govuk-link" href={innerElement.href}>
                                Change<span className="govuk-visually-hidden">{innerElement.name}</span>
                            </a>
                        </dd>
                    </div>
                ))}
            </dl>
        </React.Fragment>
    ));

    return <>{builtElements}</>;
};

export default ConfirmationTable;
