import React, { ReactElement } from 'react';
import { NextPageContextWithSession } from '../interfaces';
import { BaseLayout } from '../layout/Layout';
import { checkIfMultipleOperators } from '../utils';
import { getSessionAttribute } from '../utils/sessions';
import { OPERATOR_ATTRIBUTE } from '../constants/attributes';
import { redirectTo } from '../utils/apiUtils';
import { myFaresEnabled } from '../constants/featureFlag';

const title = 'Create Fares Data';
const description = 'Create Fares Data is a service that allows you to generate data in NeTEx format';

interface HomeProps {
    myFaresEnabled: boolean;
}

const Home = ({ myFaresEnabled }: HomeProps): ReactElement => (
    <BaseLayout title={title} description={description}>
        <h1 className="govuk-heading-xl">Create fares data</h1>
        <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
                <div>
                    <h2 className="govuk-heading-s">Create & download fares data</h2>
                    <p className="govuk-body">
                        For bus operators running commercial bus services in England, and local authorities that need to
                        create or access NeTEx data for the services they operate.
                    </p>
                    <a href={'/fareType'} className="govuk-link govuk-!-font-size-19" id="faretype-link">
                        Create NeTEx data for your fares
                    </a>
                    <br />
                    <br />
                    <a href="/createdFiles" className="govuk-link govuk-!-font-size-19" id="created-link">
                        Download previously created NeTEx data
                    </a>
                </div>
                {!!myFaresEnabled ? (
                    <div className="govuk-!-margin-top-7">
                        <h2 className="govuk-heading-s">
                            <strong className="govuk-tag new-tag">new</strong>
                            Manage fares
                        </h2>
                        <p className="govuk-body">View and manage all of your products and services in one place.</p>

                        <a
                            href={'/products/services'}
                            className="govuk-link govuk-!-font-size-19"
                            id="manage-fares-link"
                        >
                            {'View and manage fares'}
                        </a>
                    </div>
                ) : null}

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

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: HomeProps } => {
    const multipleOperators = checkIfMultipleOperators(ctx);

    const operatorAttribute = getSessionAttribute(ctx.req, OPERATOR_ATTRIBUTE);
    const sessionNoc = operatorAttribute?.nocCode;

    if ((!sessionNoc || sessionNoc.includes('|')) && multipleOperators && ctx.res) {
        redirectTo(ctx.res, '/multipleOperators');
    }

    return {
        props: { myFaresEnabled },
    };
};

export default Home;
