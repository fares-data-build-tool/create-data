import React, { ReactElement } from 'react';
import { BaseLayout } from '../layout/Layout';
import { PassengerType, NextPageContextWithSession, GroupPassengerType } from '../interfaces';
import { getAndValidateNoc, sentenceCaseString } from '../utils';
import { getPassengerTypesByNocCode } from '../data/auroradb';
import SubNavigation from '../layout/SubNavigation';

const title = 'Passenger types';
const description = 'View and edit your passenger types.';

interface PassengerTypeProps {
    passengerTypes: PassengerType[];
    passengerTypeGroups: GroupPassengerType[];
}

const ViewPassengerTypes = ({ passengerTypes, passengerTypeGroups }: PassengerTypeProps): ReactElement => (
    <BaseLayout title={title} description={description} showNavigation={true}>
        <div className="govuk-width-container">
            <main className="govuk-main-wrapper">
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-one-third">
                        <SubNavigation />
                    </div>

                    <div className="govuk-grid-column-two-thirds">
                        <h1 className="govuk-heading-xl">Passenger types</h1>
                        <p className="govuk-body">
                            Define age range and required proof documents of your passengers as well as passenger groups
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
                {passengerTypes.map((passengerType) => (
                    <div
                        key={passengerType.passengerType}
                        className="govuk-grid-column-one-half govuk-!-margin-bottom-5"
                    >
                        <div className="card">
                            <div className="card__body">
                                <div className="card__actions">
                                    <ul className="actions__list">
                                        <li className="actions__item">
                                            <a
                                                className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular"
                                                href="/viewPassengerTypes"
                                            >
                                                Edit
                                            </a>
                                        </li>

                                        <li className="actions__item">
                                            <a
                                                className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular actions__delete"
                                                href="/viewPassengerTypes"
                                            >
                                                Delete
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <h4 className="govuk-!-padding-bottom-4">
                                    {sentenceCaseString(passengerType.passengerType)}
                                </h4>

                                <p className="govuk-body-s govuk-!-margin-bottom-2">
                                    <span className="govuk-!-font-weight-bold">Minimum age:</span>{' '}
                                    {passengerType.ageRangeMin ? passengerType.ageRangeMin : 'N/A'}
                                </p>

                                <p className="govuk-body-s govuk-!-margin-bottom-2">
                                    <span className="govuk-!-font-weight-bold">Maximum age:</span>{' '}
                                    {passengerType.ageRangeMax ? passengerType.ageRangeMax : 'N/A'}
                                </p>

                                <p className="govuk-body-s govuk-!-margin-bottom-2">
                                    <span className="govuk-!-font-weight-bold">Proof document(s):</span>{' '}
                                    {passengerType.proofDocuments
                                        ? passengerType.proofDocuments.map((pd) => sentenceCaseString(pd)).join(', ')
                                        : 'N/A'}
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
                {passengerTypeGroups.map((passengerTypeGroup) => (
                    <div key={passengerTypeGroup.name} className="govuk-grid-column-one-half govuk-!-margin-bottom-5">
                        <div className="card">
                            <div className="card__body">
                                <div className="card__actions">
                                    <ul className="actions__list">
                                        <li className="actions__item">
                                            <a
                                                className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular"
                                                href="/viewPassengerTypes"
                                            >
                                                Edit
                                            </a>
                                        </li>

                                        <li className="actions__item">
                                            <a
                                                className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular actions__delete"
                                                href="/viewPassengerTypes"
                                            >
                                                Delete
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <h4 className="govuk-!-padding-bottom-4">
                                    {sentenceCaseString(passengerTypeGroup.name)}
                                </h4>

                                <p className="govuk-body-s govuk-!-margin-bottom-2">
                                    <span className="govuk-!-font-weight-bold">Max size:</span>{' '}
                                    {passengerTypeGroup.maxGroupSize}
                                </p>

                                {passengerTypeGroup.companions.length
                                    ? passengerTypeGroup.companions.map((companion) => (
                                          <p
                                              key={companion.passengerType}
                                              className="govuk-body-s govuk-!-margin-bottom-2"
                                          >
                                              <span className="govuk-!-font-weight-bold">
                                                  {sentenceCaseString(companion.passengerType)}:
                                              </span>{' '}
                                              {companion.minNumber ? companion.minNumber : '0'} - {companion.maxNumber}
                                          </p>
                                      ))
                                    : ''}
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

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: PassengerTypeProps }> => {
    const nationalOperatorCode = getAndValidateNoc(ctx);
    const passengerTypes = await getPassengerTypesByNocCode(nationalOperatorCode, 'single');
    const passengerTypeGroups = await getPassengerTypesByNocCode(nationalOperatorCode, 'group');

    return { props: { passengerTypes, passengerTypeGroups } };
};

export default ViewPassengerTypes;
