import React, { ReactElement } from 'react';
import { parseCookies } from 'nookies';
import { getNocFromIdToken } from '../utils';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import { CustomAppProps, ErrorInfo, NextPageContextWithSession } from '../interfaces';
import TwoThirdsLayout from '../layout/Layout';
import FormElementWrapper from '../components/FormElementWrapper';
import { batchGetOperatorNamesByNocCode, OperatorNameType } from '../data/auroradb';
import { OPERATOR_COOKIE } from '../constants';

const title = 'Multiple Operators - Fares Data Build Tool';
const description = 'Multiple Operators page of the Fares Data Build Tool';
const errorId = 'operator-error';

type MultipleOperatorsProps = {
    errors?: ErrorInfo[];
    operatorsAndNocs: OperatorNameType[];
};

const MultipleOperators = ({
    operatorsAndNocs,
    errors = [],
    csrfToken,
}: MultipleOperatorsProps & CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description} errors={errors}>
        <CsrfForm action="/api/multipleOperators" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <fieldset className="govuk-fieldset" aria-describedby="multiple-operators-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading" id="multiple-operators-page-heading">
                                Choose an operator name and National Operator Code
                            </h1>
                        </legend>
                        <label className="govuk-visually-hidden" htmlFor="operators">
                            Operator and NOC code list
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
                    </fieldset>
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
                },
            };
        }
    }

    return { props: { operatorsAndNocs: operatorInfo } };
};

export default MultipleOperators;
