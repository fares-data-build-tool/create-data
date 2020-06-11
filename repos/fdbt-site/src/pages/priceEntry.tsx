import React, { ReactElement } from 'react';
import { NextPageContext } from 'next';
import { parseCookies } from 'nookies';
import { FullColumnLayout } from '../layout/Layout';
import { STAGE_NAMES_COOKIE } from '../constants';
import CsrfForm from '../components/CsrfForm';
import { CustomAppProps } from '../interfaces';

const title = 'Price Entry Fares Triangle - Fares Data Build Tool';
const description = 'Price Entry page of the Fares Data Build Tool';

type PriceEntryProps = {
    stageNamesArray: string[];
};

const PriceEntry = ({ stageNamesArray, csrfToken }: PriceEntryProps & CustomAppProps): ReactElement => (
    <FullColumnLayout title={title} description={description}>
        <CsrfForm action="/api/priceEntry" method="post" csrfToken={csrfToken}>
            <>
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="price-entry-page-heading">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                            <h1 className="govuk-fieldset__heading" id="price-entry-page-heading">
                                Enter the prices for all fare stages in pence
                            </h1>
                        </legend>
                        <span className="govuk-hint" id="price-entry-hint">
                            Example: £2.40 would be 240
                        </span>
                    </fieldset>
                    <div className="fare-triangle-container">
                        <div className="fare-triangle-column">
                            {stageNamesArray.map((rowStage, rowIndex) => (
                                <div
                                    className="govuk-heading-s fare-triangle-label-left"
                                    key={stageNamesArray[rowIndex]}
                                >
                                    <span>{rowIndex > 0 ? rowStage : null}</span>
                                </div>
                            ))}
                        </div>
                        <div className="fare-triangle">
                            {stageNamesArray.map((rowStage, rowIndex) => (
                                <div
                                    id={`row-${rowIndex}`}
                                    className="fare-triangle-row"
                                    key={stageNamesArray[rowIndex]}
                                >
                                    {stageNamesArray.slice(0, rowIndex).map((columnStage, columnIndex) => (
                                        <input
                                            className={`govuk-input govuk-input--width-4 fare-triangle-input ${
                                                rowIndex % 2 === 0
                                                    ? 'fare-triangle-input-white'
                                                    : 'fare-triangle-input-light-grey'
                                            }`}
                                            id={`cell-${rowIndex}-${columnIndex}`}
                                            name={`${rowStage}-${columnStage}`}
                                            type="number"
                                            min="1"
                                            max="10000"
                                            maxLength={5}
                                            required
                                            pattern="^[0-9]*$"
                                            key={stageNamesArray[columnIndex]}
                                        />
                                    ))}
                                    <div className="govuk-heading-s fare-triangle-label-right">{rowStage}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
            </>
        </CsrfForm>
    </FullColumnLayout>
);

export const getServerSideProps = (ctx: NextPageContext): {} => {
    const cookies = parseCookies(ctx);
    const stageNamesCookie = cookies[STAGE_NAMES_COOKIE];

    if (!stageNamesCookie) {
        throw new Error('Necessary stage names cookies not found to show price entry page');
    }

    const stageNamesArray = JSON.parse(stageNamesCookie);

    if (stageNamesArray.length === 0 && ctx.res) {
        throw new Error('No stages in cookie data');
    }

    return { props: { stageNamesArray } };
};

export default PriceEntry;
