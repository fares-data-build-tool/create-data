import { isArray } from 'lodash';
import React, { ReactElement } from 'react';
import { ConfirmationElement } from '../interfaces';

interface ConfirmationTableProps {
    confirmationElements: ConfirmationElement[];
    header: string;
}

const ConfirmationTable = ({ confirmationElements, header }: ConfirmationTableProps): ReactElement => {
    const builtElements = confirmationElements.map((element) => {
        const content = isArray(element.content) ? element.content : [element.content];
        return (
            <React.Fragment key={header}>
                <dl className="govuk-summary-list">
                    <div className="govuk-summary-list__row" key={element.name}>
                        <dt className="govuk-summary-list__key">{element.name}</dt>
                        <dd className="govuk-summary-list__value">
                            {content.map((item) => (
                                <div key={item}>{item}</div>
                            ))}
                        </dd>
                        <dd className="govuk-summary-list__actions">
                            {element.href !== '' ? (
                                <a className="govuk-link" href={element.href}>
                                    change<span className="govuk-visually-hidden">{element.name}</span>
                                </a>
                            ) : null}
                        </dd>
                    </div>
                </dl>
            </React.Fragment>
        );
    });

    return (
        <>
            <div className="govuk-warning-text">
                <span className="govuk-warning-text__icon" aria-hidden="true">
                    !
                </span>
                <strong className="govuk-warning-text__text">
                    <span className="govuk-visually-hidden">Warning</span>
                    You will not be shown these answers again, ensure they are correct.
                </strong>
            </div>
            {builtElements}
        </>
    );
};

export default ConfirmationTable;
