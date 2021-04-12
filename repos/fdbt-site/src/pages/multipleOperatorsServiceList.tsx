import React, { ReactElement } from 'react';
import { getSessionAttribute, updateSessionAttribute } from '../utils/sessions';
import {
    MULTIPLE_OPERATOR_ATTRIBUTE,
    MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
    MULTI_OP_TXC_SOURCE_ATTRIBUTE,
} from '../constants/attributes';
import { isMultiOperatorInfoWithErrors } from '../interfaces/typeGuards';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import { FullColumnLayout } from '../layout/Layout';
import { getServicesByNocCodeAndDataSource, getAllServicesByNocCode } from '../data/auroradb';
import {
    ErrorInfo,
    NextPageContextWithSession,
    MultiOperatorInfo,
    ServicesInfo,
    MultipleOperatorsAttribute,
    TxcSourceAttribute,
} from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import { getCsrfToken } from '../utils';
import { redirectTo } from './api/apiUtils';
import SwitchDataSource from '../components/SwitchDataSource';

const pageTitle = 'Multiple Operators Service List - Create Fares Data Service';
const pageDescription = 'Multiple Operators Service List selection page of the Create Fares Data Service';

interface MultipleOperatorsServiceListProps {
    serviceList: ServicesInfo[];
    buttonText: string;
    errors: ErrorInfo[];
    operatorName: string;
    nocCode: string;
    dataSourceAttribute: TxcSourceAttribute;
    csrfToken: string;
}

const MultipleOperatorsServiceList = ({
    serviceList,
    buttonText,
    csrfToken,
    errors,
    operatorName,
    nocCode,
    dataSourceAttribute,
}: MultipleOperatorsServiceListProps): ReactElement => (
    <FullColumnLayout title={pageTitle} description={pageDescription}>
        <SwitchDataSource
            dataSourceAttribute={dataSourceAttribute}
            pageUrl="/multipleOperatorsServiceList"
            attributeVersion="multiOperator"
            csrfToken={csrfToken}
        />
        <CsrfForm action="/api/multipleOperatorsServiceList" method="post" csrfToken={csrfToken}>
            <>
                <ErrorSummary errors={errors} />
                <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <fieldset className="govuk-fieldset">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                            <h1 className="govuk-heading-l" id="service-list-page-heading">
                                Which services on {operatorName} is the ticket valid for?
                            </h1>
                        </legend>

                        <span className="govuk-heading-s">Select all services that apply</span>

                        <input
                            type="submit"
                            name="selectAll"
                            value={buttonText}
                            id="select-all-button"
                            className="govuk-button govuk-button--secondary"
                        />
                        <span className="govuk-hint" id="txc-hint">
                            This data is taken from the{' '}
                            <b>
                                {dataSourceAttribute.source === 'tnds'
                                    ? 'Traveline National Dataset (TNDS)'
                                    : 'Bus Open Data Service (BODS)'}
                            </b>
                            . If the service you are looking for is not listed, contact the BODS help desk for advice{' '}
                            <a href="/contact">here</a>.
                        </span>
                        <FormElementWrapper
                            errors={errors}
                            errorId="checkbox-0"
                            errorClass=""
                            addFormGroupError={false}
                        >
                            <div className="govuk-checkboxes">
                                {serviceList.map((service, index) => {
                                    const { lineName, startDate, serviceCode, description, checked } = service;

                                    const checkboxTitles = `${lineName} - ${description} (Start Date ${startDate})`;
                                    const checkBoxValues = `${description}`;

                                    return (
                                        <div className="govuk-checkboxes__item" key={`checkbox-item-${lineName}`}>
                                            <input
                                                className="govuk-checkboxes__input"
                                                id={`checkbox-${index}`}
                                                name={`${nocCode}#${lineName}#${serviceCode}#${startDate}`}
                                                type="checkbox"
                                                value={checkBoxValues}
                                                defaultChecked={checked}
                                            />
                                            <label
                                                className="govuk-label govuk-checkboxes__label"
                                                htmlFor={`checkbox-${index}`}
                                            >
                                                {checkboxTitles}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </FormElementWrapper>
                    </fieldset>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </FullColumnLayout>
);

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: MultipleOperatorsServiceListProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const searchedOperators = (getSessionAttribute(ctx.req, MULTIPLE_OPERATOR_ATTRIBUTE) as MultipleOperatorsAttribute)
        .selectedOperators;

    const completedOperatorInfo = getSessionAttribute(ctx.req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE);

    let doneOperators: MultiOperatorInfo[] = [];

    if (isMultiOperatorInfoWithErrors(completedOperatorInfo)) {
        doneOperators = completedOperatorInfo.multiOperatorInfo;
    } else if (completedOperatorInfo) {
        doneOperators = completedOperatorInfo;
    }

    let [operatorToUse] = searchedOperators;
    if (doneOperators.length > 0) {
        const searchedOperatorsNocs = searchedOperators.map(operator => operator.nocCode);
        const doneOperatorsNocs = doneOperators.map(operator => operator.nocCode);
        const result = searchedOperatorsNocs.find(searchedNoc => !doneOperatorsNocs.includes(searchedNoc));

        if (!result) {
            updateSessionAttribute(ctx.req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE, undefined);
        }
        const foundOperator = searchedOperators.find(operator => operator.nocCode === result);
        if (!foundOperator) {
            updateSessionAttribute(ctx.req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE, undefined);
        } else {
            operatorToUse = foundOperator;
        }
    }

    if (!operatorToUse) {
        throw new Error('Necessary operator not found to show multipleOperatorsServiceList page');
    }

    let dataSourceAttribute = getSessionAttribute(ctx.req, MULTI_OP_TXC_SOURCE_ATTRIBUTE);

    if (!dataSourceAttribute) {
        const services = await getAllServicesByNocCode(operatorToUse.nocCode);
        if (services.length === 0) {
            if (ctx.res) {
                redirectTo(ctx.res, '/noServices');
            } else {
                throw new Error(`No services found for NOC Code: ${operatorToUse.nocCode}`);
            }
        }
        const hasBodsServices = services.some(service => service.dataSource && service.dataSource === 'bods');
        const hasTndsServices = services.some(service => service.dataSource && service.dataSource === 'tnds');
        updateSessionAttribute(ctx.req, MULTI_OP_TXC_SOURCE_ATTRIBUTE, {
            source: hasBodsServices && !hasTndsServices ? 'bods' : 'tnds',
            hasBods: hasBodsServices,
            hasTnds: hasTndsServices,
        });
        dataSourceAttribute = getSessionAttribute(ctx.req, MULTI_OP_TXC_SOURCE_ATTRIBUTE) as TxcSourceAttribute;
    }

    const chosenDataSourceServices = await getServicesByNocCodeAndDataSource(
        operatorToUse.nocCode,
        dataSourceAttribute.source,
    );

    if (!chosenDataSourceServices) {
        throw new Error(`No services found for ${operatorToUse.nocCode}`);
    }

    const { selectAll } = ctx.query;

    const serviceList: ServicesInfo[] = chosenDataSourceServices.map(service => {
        return {
            ...service,
            checked: !selectAll || (selectAll !== 'true' && selectAll !== 'false') ? false : selectAll !== 'false',
        };
    });

    return {
        props: {
            serviceList,
            buttonText: selectAll === 'true' ? 'Unselect All Services' : 'Select All Services',
            errors: isMultiOperatorInfoWithErrors(completedOperatorInfo) ? completedOperatorInfo.errors : [],
            operatorName: operatorToUse.name,
            nocCode: operatorToUse.nocCode,
            dataSourceAttribute,
            csrfToken,
        },
    };
};

export default MultipleOperatorsServiceList;
