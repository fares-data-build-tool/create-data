import React, { ReactElement } from 'react';
import TwoThirdsLayout from '../layout/Layout';
import { CustomAppProps, NextPageContextWithSession } from '../interfaces';
import { checkIfMultipleOperators } from '../utils';

const title = 'Create Fares Data';
const description = 'Create Fares Data is a service that allows you to generate data in NeTEx format';

interface StartProps {
    multipleOperators: boolean;
}

const Start = ({ multipleOperators }: StartProps & CustomAppProps): ReactElement => (
    <TwoThirdsLayout title={title} description={description}>
        <h1 className="govuk-heading-xl">Create Fares Data</h1>

        <p className="govuk-body">
            This service is for creating or accessing NeTEx data for public transport services, excluding rail, in
            England. The service can be used by:
        </p>
        <ul className="govuk-list govuk-list--bullet">
            <li>Bus operators running commercial services in England</li>
            <li>Local transport authorities acting on behalf of bus operators</li>
            <li>Local transport authorities that operate their own services</li>
        </ul>

        <p className="govuk-body">Use this service to:</p>
        <ul className="govuk-list govuk-list--bullet">
            <li>Generate fares data in NeTEx format for a new or existing service</li>
            <li>Download your own fares data</li>
        </ul>
        <p className="govuk-body">
            All service data is taken directly from the Traveline National Data Set and the NaPTAN database. To avoid
            data discrepancies, ensure that all service data is correct within these datasets before using the service.
        </p>

        <a
            href={multipleOperators ? '/multipleOperators' : '/fareType'}
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

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: StartProps } => ({
    props: { multipleOperators: checkIfMultipleOperators(ctx) },
});

export default Start;
