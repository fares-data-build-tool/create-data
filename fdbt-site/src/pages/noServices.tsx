import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';

const title = 'No Services - Create Fares Data Service';
const description = 'No Services error page of the Create Fares Data Service';

const NoServices = (): ReactElement => (
    <TwoThirdsLayout title={title} description={description}>
        <h1 className="govuk-heading-l">
            Sorry, there is no service data available for your National Operator Code (NOC)
        </h1>
        <p className="govuk-body-m">
            This service utilises the Traveline National Dataset (TNDS) and the Bus Open Data Service (BODS) to obtain
            operators&apos; service data in order to help them create fares data.
        </p>
        <p className="govuk-body-m">
            It appears there is no service data for this operator in the Traveline National Dataset or in the Bus Open
            Data Service.
        </p>
        <p className="govuk-body-m">You will not be able to continue creating fares data without this.</p>
        <p className="govuk-body-m">
            <a href="/contact">Contact</a> us if you have further questions.
        </p>
        <a
            href="/home"
            role="button"
            draggable="false"
            className="govuk-button"
            data-module="govuk-button"
            id="home-button"
        >
            Home
        </a>
    </TwoThirdsLayout>
);

export const getServerSideProps = (): {} => {
    return { props: {} };
};

export default NoServices;
