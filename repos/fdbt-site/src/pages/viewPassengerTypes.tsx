import React, { ReactElement } from 'react';
import { BaseLayout } from '../layout/Layout';
import { PassengerType, NextPageContextWithSession, GroupPassengerType } from '../interfaces';
import { getAndValidateNoc, sentenceCaseString } from '../utils';
import { getPassengerTypesByNocCode } from '../data/auroradb';

const title = 'Passenger types';
const description = 'View and edit your passenger types.';

interface PassengerTypeProps {
    passengerTypes: PassengerType[];
    passengerTypeGroups: GroupPassengerType[];
}

const NoIndividualPassengerTypes = (): ReactElement => {
    return (
        <div className="govuk-heading-m">
            <h4>Individual</h4>
            <p className="govuk-body">You currently have no passenger types saved.</p>
            <button className="govuk-button" data-module="govuk-button">
                Add a passenger type
            </button>
        </div>
    );
};

const IndividualPassengerTypes = ({ passengerTypes }: { passengerTypes: PassengerType[] }): ReactElement => {
    return (
        <div className="govuk-heading-m">
            <h3>Individual</h3>

            <div className="govuk-grid-row">
                {passengerTypes.map((d) => (
                    <div key={d.passengerType} className="govuk-grid-column-one-half govuk-!-margin-bottom-5">
                        <div className="card">
                            <div className="card__body">
                                <div className="card__actions">
                                    <ul className="actions__list">
                                        <li className="actions__item">
                                            <a
                                                className="govuk-link govuk-!-font-size-19 govuk-!-font-weight-regular"
                                                href="#"
                                            >
                                                Edit
                                            </a>
                                        </li>

                                        <li className="actions__item">
                                            <a
                                                className="govuk-link govuk-!-font-size-19 govuk-!-font-weight-regular actions__delete"
                                                href="#"
                                            >
                                                Delete
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <h4 className="govuk-!-padding-bottom-4">{sentenceCaseString(d.passengerType)}</h4>

                                <p className="govuk-body-s govuk-!-margin-bottom-2">
                                    <span className="govuk-!-font-weight-bold">Minimum age:</span>{' '}
                                    {d.ageRangeMin ? d.ageRangeMin : 'N/A'}
                                </p>

                                <p className="govuk-body-s govuk-!-margin-bottom-2">
                                    <span className="govuk-!-font-weight-bold">Maximum age:</span>{' '}
                                    {d.ageRangeMax ? d.ageRangeMax : 'N/A'}
                                </p>

                                <p className="govuk-body-s govuk-!-margin-bottom-2">
                                    <span className="govuk-!-font-weight-bold">Proof document:</span>{' '}
                                    {d.proofDocuments ? d.proofDocuments : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="govuk-button" data-module="govuk-button">
                Add a passenger type
            </button>
        </div>
    );
};

const NoPassengerTypeGroups = (): ReactElement => {
    return (
        <div className="govuk-heading-m">
            <h3>Groups</h3>

            <div className="govuk-inset-text">
                Individual passengers must be created before they can be added to a group.
            </div>

            <p className="govuk-body">You currently have no passenger groups saved.</p>

            <button className="govuk-button" data-module="govuk-button">
                Add a passenger group
            </button>
        </div>
    );
};

const PassengerTypeGroups = ({ passengerTypeGroups }: { passengerTypeGroups: GroupPassengerType[] }): ReactElement => {
    return (
        <div className="govuk-heading-m">
            <h3>Groups</h3>

            <div className="govuk-grid-row">
                {passengerTypeGroups.map((d) => (
                    <div key={d.name} className="govuk-grid-column-one-half govuk-!-margin-bottom-5">
                        <div className="card">
                            <div className="card__body">
                                <div className="card__actions">
                                    <ul className="actions__list">
                                        <li className="actions__item">
                                            <a
                                                className="govuk-link govuk-!-font-size-19 govuk-!-font-weight-regular"
                                                href="#"
                                            >
                                                Edit
                                            </a>
                                        </li>

                                        <li className="actions__item">
                                            <a
                                                className="govuk-link govuk-!-font-size-19 govuk-!-font-weight-regular actions__delete"
                                                href="#"
                                            >
                                                Delete
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <h4 className="govuk-!-padding-bottom-4">{sentenceCaseString(d.name)}</h4>

                                <p className="govuk-body-s govuk-!-margin-bottom-2">
                                    <span className="govuk-!-font-weight-bold">Max size:</span> {d.maxGroupSize}
                                </p>

                                {d.companions.map((c) => (
                                    <p className="govuk-body-s govuk-!-margin-bottom-2">
                                        <span className="govuk-!-font-weight-bold">
                                            {sentenceCaseString(c.passengerType)}:
                                        </span>{' '}
                                        {c.minNumber ? c.minNumber : '0'} - {c.maxNumber}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="govuk-button" data-module="govuk-button">
                Add a passenger group
            </button>
        </div>
    );
};

const ViewPassengerTypes = ({ passengerTypes, passengerTypeGroups }: PassengerTypeProps): ReactElement => (
    <BaseLayout title={title} description={description} showNavigation={true}>
        <div className="govuk-width-container">
            <main className="govuk-main-wrapper">
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-one-third">
                        <div className="app-pane__subnav">
                            <nav className="app-subnav" aria-labelledby="app-subnav-heading">
                                <h2 className="govuk-visually-hidden" id="app-subnav-heading">
                                    Pages in this section
                                </h2>

                                <ul className="app-subnav__section">
                                    <li className="app-subnav__section-item">
                                        <a
                                            className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline"
                                            href="/globalSettings"
                                        >
                                            Settings overview
                                        </a>
                                    </li>

                                    <li className="app-subnav__section-item app-subnav__section-item--current">
                                        <a
                                            className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline"
                                            href="/globalSettings"
                                        >
                                            Passenger types
                                        </a>
                                    </li>

                                    <li className="app-subnav__section-item">
                                        <a
                                            className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline"
                                            href="/globalSettings"
                                        >
                                            Service day end
                                        </a>
                                    </li>

                                    <li className="app-subnav__section-item">
                                        <a
                                            className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline"
                                            href="/globalSettings"
                                        >
                                            Purchase methods
                                        </a>
                                    </li>

                                    <li className="app-subnav__section-item">
                                        <a
                                            className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline"
                                            href="/globalSettings"
                                        >
                                            Time restrictions
                                        </a>
                                    </li>

                                    <li className="app-subnav__section-item">
                                        <a
                                            className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline"
                                            href="/globalSettings"
                                        >
                                            Multi-operator groups
                                        </a>
                                    </li>

                                    <li className="app-subnav__section-item">
                                        <a
                                            className="app-subnav__link govuk-link govuk-link--no-visited-state govuk-link--no-underline"
                                            href="/globalSettings"
                                        >
                                            Travel Zones
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                    <div className="govuk-grid-column-two-thirds">
                        <h1 className="govuk-heading-xl">Passenger types</h1>
                        <p className="govuk-body">
                            Define age range and require proof documents of your passengers as well as passenger groups
                        </p>

                        {!passengerTypes.length ? (
                            <NoIndividualPassengerTypes />
                        ) : (
                            <IndividualPassengerTypes passengerTypes={passengerTypes} />
                        )}

                        {!passengerTypeGroups.length ? (
                            <NoPassengerTypeGroups />
                        ) : (
                            <PassengerTypeGroups passengerTypeGroups={passengerTypeGroups} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    </BaseLayout>
);

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: PassengerTypeProps }> => {
    const nationalOperatorCode = getAndValidateNoc(ctx);
    const passengerTypes = await getPassengerTypesByNocCode(nationalOperatorCode, 'single');
    const passengerTypeGroups = await getPassengerTypesByNocCode(nationalOperatorCode, 'group');

    console.log(passengerTypeGroups);

    return { props: { passengerTypes, passengerTypeGroups } };
};

export default ViewPassengerTypes;
