import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import Layout from '../layout/Layout';
import { PRICEENTRY_COOKIE, STAGENAMES_COOKIE } from '../constants';
import { deleteCookieOnServerSide } from '../utils';
import { redirectToError } from './api/apiUtils';

const title = 'Price Entry Fares Triangle - Fares Data Build Tool';
const description = 'Enter prices into fares triangle page of the Fares Data Build Tool';

// const fareStages = [
//     'Briggate',
//     'Chapeltown',
//     'Chapel Allerton',
//     'Moortown',
//     'Harrogate Road',
//     'Harehills',
//     'Gipton',
//     'Armley',
//     'Stanningley',
//     'Pudsey',
//     'Seacroft',
//     'Rothwell',
//     'Dewsbury',
//     'Wakefield',
// ];

type PriceEntryProps = {
    fareStages: string[];
};

const PriceEntry = ({ fareStages }: PriceEntryProps): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/priceEntry" method="post">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="selection-hint">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading">
                                Please enter prices for all fare stages in pence
                            </h1>
                        </legend>
                        <span className="govuk-hint" id="selection-hint">
                            For example £1 would be 100 or £2.29 would be 229
                        </span>
                    </fieldset>
                </div>
                <div className="fare-triangle">
                    {fareStages.map((rowStage, rowIndex) => (
                        <div id={`row-${rowIndex}`} className="fare-triangle-row">
                            {fareStages.slice(0, rowIndex).map((_, columnIndex) => (
                                <input
                                    className="govuk-input govuk-input--width-4 fare-triangle-input"
                                    id={`cell-${rowIndex}-${columnIndex}`}
                                    name={`cell-${rowIndex}-${columnIndex}`}
                                    type="number"
                                    min="1"
                                    max="10000"
                                    maxLength={5}
                                    required
                                    pattern="^[0-9]*$"
                                />
                            ))}
                            <div className="govuk-heading-s fare-triangle-label">{rowStage}</div>
                        </div>
                    ))}
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

PriceEntry.getInitialProps = (ctx: NextPageContext): {} => {
    deleteCookieOnServerSide(ctx, PRICEENTRY_COOKIE);

    const cookies = parseCookies(ctx);
    const stageNamesCookie = cookies[STAGENAMES_COOKIE];

    if (stageNamesCookie) {
        const stageNameObject = JSON.parse(stageNamesCookie);
        let stageNames: [] = [];

        try {
            if (ctx.req) {
                stageNames = stageNameObject.names;
            }

            if (stageNames.length === 0) {
                throw new Error('No stages found in cookie!');
            }

            return { stageNames };
        } catch (err) {
            console.error(err.message);
            throw new Error(err.message);
        }
    }

    if (ctx.res) {
        redirectToError(ctx.res);
    }

    return {};
};

export default PriceEntry;
