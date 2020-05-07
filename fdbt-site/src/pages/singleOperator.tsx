import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { OPERATOR_COOKIE, PERIOD_SINGLE_OPERATOR_SERVICES_COOKIE } from '../constants';
import { getServicesByNocCode } from '../data/auroradb';
import { ServiceLists, ServicesInfo } from '../interfaces';

const title = 'Single Operator - Fares data build tool';
const description = 'Single Operator selection page of the Fares data build tool';

const buttonSelectedText = 'Select All';
const buttonUnselectedText = 'Unselect All';

export type SelectedServiceProps = {
    service: ServiceLists;
    buttonText: string;
};

const SingleOperator = (serviceProps: SelectedServiceProps): ReactElement => {
    const {
        service: { error, selectedServices },
        buttonText,
    } = serviceProps;

    return (
        <Layout title={title} description={description}>
            <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
                <form action="/api/singleOperator" method="post">
                    <div className={`govuk-form-group ${error ? ' govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="periodtype-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                                <h1 className="govuk-fieldset__heading" id="periodtype-page-heading">
                                    Which service(s) is the ticket valid for?
                                </h1>
                            </legend>
                            <span id="radio-error" className="govuk-error-message">
                                <span className={error ? '' : 'govuk-visually-hidden'}>
                                    Select one or more service(s)
                                </span>
                            </span>
                        </fieldset>
                        <fieldset className="govuk-fieldset" aria-describedby="waste-hint">
                            <span id="waste-hint" className="govuk-hint">
                                Select all services that apply
                            </span>
                            <input
                                type="submit"
                                name="selectAll"
                                value={buttonText}
                                id="select-all-button"
                                className="govuk-button govuk-button--secondary"
                            />
                            <span className="govuk-hint" id="traveline-hint">
                                This data is taken from the Traveline National Dataset.
                            </span>
                            <div className="govuk-checkboxes">
                                {selectedServices.map((service, index) => {
                                    const { lineName, startDate, serviceDescription, checked } = service;

                                    let checkboxTitles = `${lineName} - ${serviceDescription} (Start Date ${startDate})`;

                                    if (checkboxTitles.length > 110) {
                                        checkboxTitles = `${checkboxTitles.substr(0, checkboxTitles.length - 10)}...`;
                                    }
                                    const checkBoxValues = `${serviceDescription}#${startDate}`;

                                    return (
                                        <div className="govuk-checkboxes__item" key={`checkbox-item-${lineName}`}>
                                            <input
                                                className="govuk-checkboxes__input"
                                                id={`checkbox-${index}`}
                                                name={lineName}
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
                        </fieldset>
                    </div>
                    <input
                        type="submit"
                        value="Continue"
                        id="continue-button"
                        className="govuk-button govuk-button--start"
                    />
                </form>
            </main>
        </Layout>
    );
};

export const getServerSideProps = async (
    ctx: NextPageContext,
): Promise<{ props: { service: ServiceLists; buttonText: string } }> => {
    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    const periodSingleOperatorCookie = cookies[PERIOD_SINGLE_OPERATOR_SERVICES_COOKIE];

    if (!operatorCookie) {
        throw new Error('Failed to retrieve operator cookie for single operator page');
    }

    const operatorInfo = JSON.parse(operatorCookie);

    const { nocCode } = operatorInfo;
    const servicesList = await getServicesByNocCode(nocCode);

    const { selectAll } = ctx.query;

    const buttonText = selectAll === 'true' ? buttonUnselectedText : buttonSelectedText;

    const checkedServiceList: ServicesInfo[] = servicesList.map(service => {
        return {
            ...service,
            serviceDescription: service.description,
            checked: !selectAll || (selectAll !== 'true' && selectAll !== 'false') ? false : selectAll !== 'false',
        };
    });

    if (!periodSingleOperatorCookie) {
        return {
            props: {
                service: {
                    error: false,
                    selectedServices: checkedServiceList,
                },
                buttonText,
            },
        };
    }

    const periodSingleOperatorObject = JSON.parse(periodSingleOperatorCookie);

    const { error } = periodSingleOperatorObject;

    return {
        props: {
            service: {
                error,
                selectedServices: checkedServiceList,
            },
            buttonText,
        },
    };
};

export default SingleOperator;
