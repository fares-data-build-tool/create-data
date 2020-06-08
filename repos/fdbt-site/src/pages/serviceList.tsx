import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import { FullColumnLayout } from '../layout/Layout';
import { SERVICE_LIST_COOKIE } from '../constants';
import { getServicesByNocCode } from '../data/auroradb';
import { ServicesInfo } from '../interfaces';
import { getNocFromIdToken } from '../utils';

const title = 'Service List - Fares Data Build Tool';
const description = 'Service List selection page of the Fares Data Build Tool';

interface ServiceList {
    selectedServices: ServicesInfo[];
    error: boolean;
}

export interface ServiceListProps {
    service: ServiceList;
    buttonText: string;
}

const ServiceList = (serviceProps: ServiceListProps): ReactElement => {
    const {
        service: { error, selectedServices },
        buttonText,
    } = serviceProps;

    return (
        <FullColumnLayout title={title} description={description}>
            <form action="/api/serviceList" method="post">
                <div className={`govuk-form-group ${error ? ' govuk-form-group--error' : ''}`}>
                    <fieldset className="govuk-fieldset" aria-describedby="service-list-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading" id="service-list-page-heading">
                                Which service(s) is the ticket valid for?
                            </h1>
                        </legend>
                        <span id="radio-error" className="govuk-error-message">
                            <span className={error ? '' : 'govuk-visually-hidden'}>Select one or more service(s)</span>
                        </span>
                    </fieldset>
                    <fieldset className="govuk-fieldset" aria-describedby="service-list-hint">
                        <span id="service-list-hint" className="govuk-hint">
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
                                const checkBoxValues = `${serviceDescription}`;

                                return (
                                    <div className="govuk-checkboxes__item" key={`checkbox-item-${lineName}`}>
                                        <input
                                            className="govuk-checkboxes__input"
                                            id={`checkbox-${index}`}
                                            name={`${lineName}#${startDate}`}
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
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </form>
        </FullColumnLayout>
    );
};

export const getServerSideProps = async (ctx: NextPageContext): Promise<{ props: ServiceListProps }> => {
    const cookies = parseCookies(ctx);
    const serviceListCookie = cookies[SERVICE_LIST_COOKIE];
    const nocCode = getNocFromIdToken(ctx);

    if (!nocCode) {
        throw new Error('Necessary cookies not found to show serviceList page');
    }

    const servicesList = await getServicesByNocCode(nocCode);

    const { selectAll } = ctx.query;

    const buttonText = selectAll === 'true' ? 'Unselect All' : 'Select All';

    const checkedServiceList: ServicesInfo[] = servicesList.map(service => {
        return {
            ...service,
            serviceDescription: service.description,
            checked: !selectAll || (selectAll !== 'true' && selectAll !== 'false') ? false : selectAll !== 'false',
        };
    });

    return {
        props: {
            service: {
                error: !serviceListCookie ? false : JSON.parse(serviceListCookie).error,
                selectedServices: checkedServiceList,
            },
            buttonText,
        },
    };
};

export default ServiceList;
