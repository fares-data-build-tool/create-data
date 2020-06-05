import React, { ReactElement } from 'react';
import { NextPage } from 'next';
import TwoThirdsLayout from '../layout/Layout';

const title = 'Fares Data Build Tool';
const description = 'Fares Data Build Tool is a service that allows you to generate data in NeTEx format';

const Home: NextPage = (): ReactElement => (
    <TwoThirdsLayout title={title} description={description}>
        <h1 className="govuk-heading-xl">Fares Data Build Tool</h1>
        <p className="govuk-body">Use this service to:</p>
        <ul className="govuk-list govuk-list--bullet">
            <li>Generate fares data in NeTEx format</li>
            <li>Update fares for an existing service</li>
            <li>Publish fares for a newly registered service</li>
        </ul>
        <p className="govuk-body">
            All service data is taken directly from the Traveline National Dataset and the NaPTAN database. To avoid
            data discrepancies, ensure that all service data is correct within these datasets before using this service.
        </p>

        <a
            href="/login"
            role="button"
            draggable="false"
            className="govuk-button govuk-button--start"
            data-module="govuk-button"
            id="start-now-button"
        >
            Start now
            <svg
                className="govuk-button__start-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="17.5"
                height="19"
                viewBox="0 0 33 40"
                role="presentation"
                focusable="false"
            >
                <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
            </svg>
        </a>
    </TwoThirdsLayout>
);

export const getServerSideProps = (): {} => {
    return { props: {} };
};

export default Home;
