import React, { ReactElement } from 'react';

export const SalesOfferPackageExplanation = (): ReactElement => (
    <>
        <h1 className="govuk-heading-s">What is a Sales Offer Package?</h1>
        <p className="govuk-body">To create NeTEx for your fares, you need to provide the following:</p>
        <ol className="govuk-body">
            <li>Where a ticket can be bought</li>
            <li>What payment methods can be used to buy a ticket</li>
            <li>In what format a ticket will be used by passengers</li>
        </ol>
        <p className="govuk-body">
            This combination of information is known as a <b>sales offer package</b>.
        </p>
    </>
);

export default SalesOfferPackageExplanation;
