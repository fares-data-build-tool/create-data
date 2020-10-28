import React, { ReactElement } from 'react';
import { parseCookies } from 'nookies';
import { getCsrfToken, getNocFromIdToken } from '../utils';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import { ErrorInfo, NextPageContextWithSession } from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import FormElementWrapper from '../components/FormElementWrapper';
import { batchGetOperatorNamesByNocCode, OperatorNameType } from '../data/auroradb';
import { OPERATOR_COOKIE } from '../constants';

const title = 'Multiple Operators - Create Fares Data Service';
const description = 'Multiple Operators page of the Create Fares Data Service';
const errorId = 'operators';

type MultipleOperatorsProps = {
    errors?: ErrorInfo[];
    operatorsAndNocs: OperatorNameType[];
    csrfToken: string;
};

const MultipleOperators = ({ operatorsAndNocs, errors = [], csrfToken }: MultipleOperatorsProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/multipleOperators" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <label htmlFor="operators">
                        <h1 className="govuk-heading-l" id="multiple-operators-page-heading">
                            Choose an operator name and National Operator Code
                        </h1>
                    </label>
                    <FormElementWrapper errors={errors} errorId={errorId} errorClass="govuk-select--error">
                        <select className="govuk-select" id="operators" name="operator" defaultValue="">
                            <option value="" disabled>
                                Select One
                            </option>
                            {operatorsAndNocs.map((operatorAndNoc: OperatorNameType) => (
                                <option
                                    key="operator"
                                    value={`${operatorAndNoc.operatorPublicName}|${operatorAndNoc.nocCode}`}
                                    className="service-option"
                                >
                                    {operatorAndNoc.operatorPublicName} - {operatorAndNoc.nocCode}
                                </option>
                            ))}
                        </select>
                    </FormElementWrapper>
                    <span className="govuk-hint hint-text" id="traveline-hint">
                        This data is taken from the NOC Dataset
                    </span>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </TwoThirdsLayout>
);

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{
    props: MultipleOperatorsProps;
}> => {
    const csrfToken = getCsrfToken(ctx);
    const idTokenNoc = getNocFromIdToken(ctx);
    let splitNocs: string[] = [];
    if (idTokenNoc) {
        splitNocs = idTokenNoc.split('|');
    }

    const operatorInfo: OperatorNameType[] = await batchGetOperatorNamesByNocCode(splitNocs);

    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];

    if (operatorCookie) {
        const operatorObject = JSON.parse(operatorCookie);
        if (operatorObject.errorMessage) {
            return {
                props: {
                    operatorsAndNocs: operatorInfo,
                    errors: [{ errorMessage: operatorObject.errorMessage, id: errorId }],
                    csrfToken,
                },
            };
        }
    }

    return { props: { operatorsAndNocs: operatorInfo, csrfToken } };
};

export default MultipleOperators;
