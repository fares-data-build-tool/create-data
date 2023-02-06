import React, { ReactElement } from 'react';
import ErrorSummary from '../components/ErrorSummary';
import { BaseLayout } from '../layout/Layout';
import SubNavigation from '../layout/SubNavigation';
import { ErrorInfo, NextPageContextWithSession } from '../interfaces';
import { getAndValidateNoc } from '../utils';
import { getCapExpiry, getFareDayEnd } from '../data/auroradb';
import { CapExpiry } from '../interfaces/matchingJsonTypes';
import { updateSessionAttribute } from '../utils/sessions';
import { CAP_EXPIRY_ATTRIBUTE } from '../constants/attributes';
import { expiryHintText } from './selectCapExpiry';

const title = 'Caps - Create Fares Data Service';
const description = 'View and edit your caps.';

interface CapProps {
    capValidity: string;
    fareDayEnd: string;
    viewCapErrors: ErrorInfo[];
}

interface CapExpiryCardProps {
    capValidity: string;
    fareDayEnd: string;
}

const ViewCaps = ({ capValidity, fareDayEnd, viewCapErrors = [] }: CapProps): ReactElement => {
    return (
        <BaseLayout title={title} description={description} showNavigation>
            <div>
                <ErrorSummary errors={viewCapErrors} />
            </div>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-quarter">
                    <SubNavigation />
                </div>

                <div className="govuk-grid-column-three-quarters">
                    <h1 className="govuk-heading-xl">Caps</h1>
                    <p className="govuk-body govuk-!-margin-bottom-8">
                        Define your different types of caps and when they expire.
                    </p>

                    <div>
                        <h2 className="govuk-heading-l">Cap expiry</h2>
                        {capValidity ? (
                            <CapExpiryCard capValidity={capValidity} fareDayEnd={fareDayEnd} />
                        ) : (
                            <>
                                <p className="govuk-body">
                                    <em>You currently have no cap expiry saved.</em>
                                </p>
                                <a className="govuk-button" data-module="govuk-button" href="/selectCapExpiry">
                                    Add cap expiry
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </BaseLayout>
    );
};

const CapExpiryCard = ({ capValidity, fareDayEnd }: CapExpiryCardProps): ReactElement => {
    return (
        <>
            <div className="card-row">
                <div className="card" id="cap-expiry">
                    <div className="card__body">
                        <div className="card__actions">
                            <ul className="actions__list">
                                <li className="actions__item">
                                    <a
                                        className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular"
                                        href="/selectCapExpiry"
                                    >
                                        Edit
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <h4 className="govuk-heading-m govuk-!-padding-bottom-4">
                            {capValidity === 'endOfCalendarDay'
                                ? 'At the end of a calendar day'
                                : capValidity === '24hr'
                                ? 'At the end of a 24 hour period'
                                : 'Fare day end'}
                        </h4>
                        <p className="govuk-body-s govuk-!-margin-bottom-2">{expiryHintText[capValidity]}</p>

                        {capValidity === 'fareDayEnd' ? (
                            <p className="govuk-body-s govuk-!-margin-bottom-2">
                                {fareDayEnd.substring(0, 2)}:{fareDayEnd.substring(2, 4)}
                            </p>
                        ) : undefined}
                    </div>
                </div>
            </div>
        </>
    );
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: CapProps }> => {
    const noc = getAndValidateNoc(ctx);
    const dbCapExpiry = await getCapExpiry(noc);
    const capValidity = dbCapExpiry ? (JSON.parse(dbCapExpiry) as CapExpiry).productValidity : '';
    const dbFareDayEnd = await getFareDayEnd(noc);
    const fareDayEnd = dbFareDayEnd ? dbFareDayEnd : '';

    updateSessionAttribute(ctx.req, CAP_EXPIRY_ATTRIBUTE, undefined);

    return {
        props: {
            capValidity,
            fareDayEnd,
            viewCapErrors: [],
        },
    };
};

export default ViewCaps;
