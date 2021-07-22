import React, { ReactElement } from 'react';
import { BaseLayout } from '../layout/Layout';
import { NextPageContextWithSession, PremadeTimeRestriction } from '../interfaces';
import { getAndValidateNoc, sentenceCaseString } from '../utils';
import { getTimeRestrictionByNocCode } from '../data/auroradb';
import SubNavigation from '../layout/SubNavigation';

const title = 'Time restrictions';
const description = 'View and edit your time restrictions.';

const days = {
    monday: 'Mon',
    tuesday: 'Tue',
    wednesday: 'Wed',
    thursday: 'Thu',
    friday: 'Fri',
    saturday: 'Sat',
    sunday: 'Sun',
    bankHoliday: 'BH',
};

interface TimeRestrictionProps {
    timeRestrictions: PremadeTimeRestriction[];
}

const ViewTimeRestrictions = ({ timeRestrictions }: TimeRestrictionProps): ReactElement => (
    <BaseLayout title={title} description={description} showNavigation={true}>
        <div className="govuk-width-container">
            <main className="govuk-main-wrapper">
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-one-third">
                        <SubNavigation />
                    </div>

                    <div className="govuk-grid-column-two-thirds">
                        <h1 className="govuk-heading-xl">Time restrictions</h1>
                        <p className="govuk-body">Define ____ of your time restrictions</p>

                        {!timeRestrictions.length ? (
                            <NoTimeRestrictions />
                        ) : (
                            <TimeRestrictions timeRestrictions={timeRestrictions} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    </BaseLayout>
);

const NoTimeRestrictions = (): ReactElement => {
    return (
        <div className="govuk-heading-m">
            <h4>Individual</h4>
            <p className="govuk-body">You currently have no time restrictions saved.</p>
            <button className="govuk-button" data-module="govuk-button">
                Add a time restriction
            </button>
        </div>
    );
};

const TimeRestrictions = ({ timeRestrictions }: { timeRestrictions: PremadeTimeRestriction[] }): ReactElement => {
    timeRestrictions.map
    
    return (
        <div className="govuk-heading-m">
            <h3>Individual</h3>

            <div className="govuk-grid-row">
                {timeRestrictions.map((timeRestriction) => (
                    <div key={timeRestriction.name} className="govuk-grid-column-one-half govuk-!-margin-bottom-5">
                        <div className="card">
                            <div className="card__body">
                                <div className="card__actions">
                                    <ul className="actions__list">
                                        <li className="actions__item">
                                            <a
                                                className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular"
                                                href="/viewTimeRestrictions"
                                            >
                                                Edit
                                            </a>
                                        </li>

                                        <li className="actions__item">
                                            <a
                                                className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular actions__delete"
                                                href="/viewTimeRestrictions"
                                            >
                                                Delete
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <h4 className="govuk-!-padding-bottom-4">{sentenceCaseString(timeRestriction.name)}</h4>

                                <p className="govuk-body-s govuk-!-margin-bottom-2">
                                    <span className="govuk-!-font-weight-bold">Days</span>{' '}
                                    {timeRestriction ? timeRestriction.ageRangeMin : 'N/A'}
                                </p>

                                <p className="govuk-body-s govuk-!-margin-bottom-2">
                                    <span className="govuk-!-font-weight-bold">Maximum age:</span>{' '}
                                    {timeRestriction.ageRangeMax ? timeRestriction.ageRangeMax : 'N/A'}
                                </p>

                                <p className="govuk-body-s govuk-!-margin-bottom-2">
                                    <span className="govuk-!-font-weight-bold">Proof document(s):</span>{' '}
                                    {timeRestriction.proofDocuments
                                        ? timeRestriction.proofDocuments.map((pd) => sentenceCaseString(pd)).join(', ')
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="govuk-button" data-module="govuk-button">
                Add a time restriction
            </button>
        </div>
    );
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: TimeRestrictionProps }> => {
    const nationalOperatorCode = getAndValidateNoc(ctx);
    const timeRestrictions = await getTimeRestrictionByNocCode(nationalOperatorCode);
    console.log(timeRestrictions[0].contents[2]);

    return { props: { timeRestrictions } };
};

export default ViewTimeRestrictions;
