import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { OPERATOR_COOKIE, PERIOD_SINGLE_OPERATOR_SERVICES } from '../constants';
import { getServicesByNocCode } from '../data/dynamodb';
import { ServiceLists } from '../interfaces';

const title = 'Which service(s) is the ticket valid for';
const description = 'Single Operator selection page of the Fares data build tool';

const SingleOperator = ({ error, selectedServices }: ServiceLists): ReactElement => {
    console.log('error', selectedServices);
    return (
        <Layout title={title} description={description}>
            <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
                <form action="/api/singleOperator" method="post">
                    <div className="govuk-form-group">
                        <fieldset className="govuk-fieldset" aria-describedby="periodtype-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                                <h1 className="govuk-fieldset__heading" id="periodtype-page-heading">
                                    Which services(s)?
                                </h1>
                            </legend>
                            <span id="radio-error" className="govuk-error-message">
                                <span className={error ? '' : 'govuk-visually-hidden'}>Please select an option</span>
                            </span>
                        </fieldset>
                        <fieldset className="govuk-fieldset" aria-describedby="waste-hint">
                            <span id="waste-hint" className="govuk-hint">
                                Select all service that apply
                            </span>
                            <div className="govuk-checkboxes">
                                {selectedServices.map((service, index) => (
                                    <div className="govuk-checkboxes__item">
                                        <input
                                            className="govuk-checkboxes__input"
                                            id={`checkbox-${index}`}
                                            name={service.lineName}
                                            type="checkbox"
                                            value={service.startDate}
                                        />
                                        <label
                                            className="govuk-label govuk-checkboxes__label"
                                            htmlFor={service.lineName}
                                        >
                                            {service.lineName}-{service.startDate}
                                        </label>
                                    </div>
                                ))}
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

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async (ctx: NextPageContext): Promise<{ props: ServiceLists }> => {
    const cookies = parseCookies(ctx);
    const operatorCookie = cookies[OPERATOR_COOKIE];
    const periodSingleOperatorCookie = cookies[PERIOD_SINGLE_OPERATOR_SERVICES];

    if (!operatorCookie) {
        throw new Error('Failed to retrieve operator cookie for single operator page');
    }

    const operatorObject = JSON.parse(operatorCookie);

    const { nocCode } = operatorObject;
    const servicesList = await getServicesByNocCode(nocCode);

    if (!periodSingleOperatorCookie) {
        return {
            props: {
                error: false,
                selectedServices: servicesList,
            },
        };
    }

    const periodSingleOperatorObject = JSON.parse(periodSingleOperatorCookie);

    const { error } = periodSingleOperatorObject;

    return {
        props: {
            error,
            selectedServices: servicesList,
        },
    };
};

export default SingleOperator;
