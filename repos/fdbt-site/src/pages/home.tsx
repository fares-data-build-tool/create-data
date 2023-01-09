import React, { ReactElement } from 'react';
import { NextPageContextWithSession } from '../interfaces';
import { BaseLayout } from '../layout/Layout';
import { checkIfMultipleOperators } from '../utils';
import { getSessionAttribute, updateSessionAttribute } from '../utils/sessions';
import { MULTI_MODAL_ATTRIBUTE, OPERATOR_ATTRIBUTE } from '../constants/attributes';
import { redirectTo } from '../utils/apiUtils';
import { getAllServicesByNocCode, operatorHasFerryOrTramServices } from '../data/auroradb';

const title = 'Create Fares Data';
const description = 'Create Fares Data is a service that allows you to generate data in NeTEx format';

const Home = (): ReactElement => (
    <BaseLayout title={title} description={description}>
        <h1 className="govuk-heading-xl">Create fares data</h1>
        <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
                <div>
                    <h2 className="govuk-heading-s">Create fares data</h2>
                    <p className="govuk-body">
                        For bus operators running commercial bus services in England, and local authorities that need to
                        create NeTEx data for the services they operate.
                    </p>
                    <a href={'/fareType'} className="govuk-link govuk-!-font-size-19" id="faretype-link">
                        Create NeTEx data for your fares
                    </a>
                </div>

                <div className="govuk-!-margin-top-7">
                    <h2 className="govuk-heading-s">
                        <strong className="govuk-tag new-tag">new</strong>
                        Manage fares
                    </h2>
                    <p className="govuk-body">View and manage all of your products and services in one place.</p>

                    <a href={'/products/services'} className="govuk-link govuk-!-font-size-19" id="manage-fares-link">
                        {'View and manage fares'}
                    </a>
                </div>

                <div className="govuk-!-margin-top-7">
                    <h2 className="govuk-heading-s">Operator settings</h2>
                    <p className="govuk-body">
                        Operator settings is where operators can define and save settings specific to a National
                        Operator Code (NOC), such as passenger types, time restrictions and more. We recommend
                        completing this section before creating your fares data.
                    </p>

                    <a href={'/globalSettings'} className="govuk-link govuk-!-font-size-19" id="account-link">
                        {'Define and manage settings'}
                    </a>
                </div>

                <div className="govuk-!-margin-top-7 govuk-!-padding-bottom-7">
                    <h2 className="govuk-heading-s govuk-!-margin-top-3">Related services</h2>
                    <p className="govuk-body">
                        If your query relates to the use of the Bus Open Data Service go&nbsp;
                        <a href="https://publish.bus-data.dft.gov.uk/" aria-label="go to the bus open data service">
                            here
                        </a>
                        &nbsp;to view their contact details.
                    </p>
                </div>
            </div>

            <div className="govuk-grid-column-one-third">
                <h2 className="govuk-heading-s">Public information</h2>
                <a href="/contact" className="govuk-link govuk-!-font-size-19" id="contact-link">
                    Contact Us
                </a>
            </div>
        </div>
    </BaseLayout>
);

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{}> => {
    const multipleOperators = checkIfMultipleOperators(ctx);

    const operatorAttribute = getSessionAttribute(ctx.req, OPERATOR_ATTRIBUTE);
    const sessionNoc = operatorAttribute?.nocCode;

    if ((!sessionNoc || sessionNoc.includes('|')) && multipleOperators && ctx.res) {
        redirectTo(ctx.res, '/multipleOperators');
    }

    if (sessionNoc) {
        //console.log(`Checking for ${sessionNoc}`);
        const services = await getAllServicesByNocCode(sessionNoc);
        const hasBodsServices = services.some((service) => service.dataSource && service.dataSource === 'bods');
        const hasFerryOrTramServices = await operatorHasFerryOrTramServices(sessionNoc);

        if (!hasBodsServices && hasFerryOrTramServices) {
            updateSessionAttribute(ctx.req, MULTI_MODAL_ATTRIBUTE, 'mutli-mode');
        }
    }

    return {
        props: {},
    };
};

export default Home;
