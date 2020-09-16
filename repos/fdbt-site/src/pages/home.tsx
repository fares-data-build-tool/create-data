import React, { ReactElement } from 'react';
import { NextPageContextWithSession, CustomAppProps } from '../interfaces';
import { BaseLayout } from '../layout/Layout';
import { checkIfMultipleOperators } from '../utils';

const title = 'Fares Data Build Tool';
const description = 'Fares Data Build Tool is a service that allows you to generate data in NeTEx format';

interface HomeProps {
    multipleOperators: boolean;
}

const Home = ({ multipleOperators }: HomeProps & CustomAppProps): ReactElement => (
    <BaseLayout title={title} description={description}>
        <h1 className="govuk-heading-xl">Fares Data Build Tool</h1>
        <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
                <div>
                    <h2 className="govuk-heading-s">Create & download fares data</h2>
                    <p className="govuk-body">
                        For bus operators running commercial bus services in England, and local authorities that need to
                        create or access NeTEx data for the services they operate.
                    </p>
                    <a
                        href={multipleOperators ? '/multipleOperators' : '/fareType'}
                        className="govuk-link govuk-!-font-size-19"
                        id="faretype-link"
                    >
                        Create NeTEx data for your fares
                    </a>
                    <br />
                    <br />
                    <a href="/createdFiles" className="govuk-link govuk-!-font-size-19" id="created-link">
                        Download previously created NeTEx data
                    </a>
                </div>
                <div className="govuk-!-margin-top-7 govuk-!-padding-bottom-7">
                    <h2 className="govuk-heading-s">Operator settings</h2>
                    <p className="govuk-body">
                        For updating the information we use about your services when creating NeTEx data.
                    </p>

                    <a href="/account" className="govuk-link govuk-!-font-size-19" id="account-link">
                        My account settings
                    </a>
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

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: HomeProps } => ({
    props: { multipleOperators: checkIfMultipleOperators(ctx) },
});

export default Home;
