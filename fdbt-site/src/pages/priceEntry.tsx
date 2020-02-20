import '../design/Pages.scss';
import React from 'react';
import { NextPage } from 'next';
import Layout from '../layout/Layout';
// import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from 'constants';

const title = 'Price Entry Fares Triangle - Fares Data Build Tool';
const description = 'Enter prices into fares triangle page of the Fares Data Build Tool';
const fareStages = [
    'Briggate',
    'Chapeltown',
    'Chapel Allerton',
    'Moortown',
    'Harrogate Road',
    'Harehills',
    'Gipton',
    'Armley',
    'Stanningley',
    'Pudsey',
];

const PriceEntry: NextPage = () => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <div className="govuk-form-group">
                <fieldset className="govuk-fieldset" aria-describedby="selection-hint">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                        <h1 className="govuk-fieldset__heading">Please enter prices for all fare stages in pence</h1>
                    </legend>
                    <span className="govuk-hint" id="selection-hint">
                        For example £1 would be 100 or £2.29 would be 229
                    </span>
                </fieldset>
            </div>
            <div className="fare-triangle">
                {fareStages.map((stageName, rowIndex) => (
                    <div id={`row-${rowIndex}`} className="fare-triangle-row">
                        {Array(rowIndex)
                            .fill({})
                            .map((_, columnIndex) => (
                                <input
                                    className="govuk-input govuk-input--width-4 fare-cell"
                                    id={`cell-${rowIndex}-${columnIndex}`}
                                    name={`cell-${rowIndex}-${columnIndex}`}
                                    type="text"
                                />
                            ))}
                        <div className="govuk-heading-s fare-triangle-cell">{stageName}</div>
                    </div>
                ))}
            </div>
            <input type="submit" value="Continue" id="continue-button" className="govuk-button govuk-button--start" />
        </main>
    </Layout>
);

export default PriceEntry;
