import React, { ReactElement, useState } from 'react';
import { BaseLayout } from '../layout/Layout';
import { SinglePassengerType, NextPageContextWithSession, GroupPassengerType } from '../interfaces';
import { getCsrfToken, getAndValidateNoc, sentenceCaseString } from '../utils';
import { getPassengerTypesByNocCode } from '../data/auroradb';
import SubNavigation from '../layout/SubNavigation';
import DeleteConfirmationPopup from '../components/DeleteConfirmationPopup';

const title = 'Passenger Types - Create Fares Data Service';
const description = 'View and edit your passenger types.';

interface PassengerTypeProps {
    csrfToken: string;
    singlePassengerTypes: SinglePassengerType[];
    groupPrssengerTypes: GroupPassengerType[];
}

const ViewPassengerTypes = ({
    singlePassengerTypes,
    groupPrssengerTypes,
    csrfToken,
}: PassengerTypeProps): ReactElement => {
    const [popUpState, setPopUpState] = useState({
        isVisible: false,
        passengerTypeName: '',
        isGroup: false,
    });

    const deleteActionHandler = (name: string, isGroup: boolean): void => {
        setPopUpState({ ...popUpState, isVisible: true, passengerTypeName: name, isGroup: isGroup });
    };

    const cancelActionHandler = (): void => {
        setPopUpState({ ...popUpState, isVisible: false, passengerTypeName: '', isGroup: false });
    };

    return (
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
                                Define age range and required proof documents of your passengers as well as passenger
                                groups
                            </p>

                            {!singlePassengerTypes.length ? (
                                <NoIndividualPassengerTypes />
                            ) : (
                                <IndividualPassengerTypes
                                    singlePassengerTypes={singlePassengerTypes}
                                    deleteActionHandler={deleteActionHandler}
                                />
                            )}

                            {!groupPrssengerTypes.length ? (
                                <NoPassengerTypeGroups />
                            ) : (
                                <PassengerTypeGroups passengerTypeGroups={groupPrssengerTypes} />
                            )}

                            <DeleteConfirmationPopup
                                isVisible={popUpState.isVisible}
                                csrfToken={csrfToken}
                                isGroup={popUpState.isGroup}
                                passengerTypeName={popUpState.passengerTypeName}
                                cancelActionHandler={cancelActionHandler}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </BaseLayout>
    );
};

const NoIndividualPassengerTypes = (): ReactElement => {
    return (
        <div className="govuk-heading-m">
            <h4>Individual</h4>
            <p className="govuk-body">You currently have no passenger types saved.</p>
            <a className="govuk-button" data-module="govuk-button" href="/managePassengerTypes">
                Add a passenger type
            </a>
        </div>
    );
};

interface IndividualPassengerTypesProps {
    singlePassengerTypes: SinglePassengerType[];
    deleteActionHandler: (name: string, isGroup: boolean) => void;
}

const IndividualPassengerTypes = ({
    singlePassengerTypes,
    deleteActionHandler,
}: IndividualPassengerTypesProps): ReactElement => {
    return (
        <div className="govuk-heading-m">
            <h3>Individual</h3>

            <div className="govuk-grid-row">
                {singlePassengerTypes.map((singlePassengerType) => (
                    <div key={singlePassengerType.name} className="govuk-grid-column-one-half govuk-!-margin-bottom-5">
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
                                            <button
                                                className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular actions__delete"
                                                onClick={() => deleteActionHandler(singlePassengerType.name, false)}
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                                <h4 className="govuk-!-padding-bottom-4">
                                    {sentenceCaseString(singlePassengerType.name)}
                                </h4>

                                <p className="govuk-body-s govuk-!-margin-bottom-2">
                                    <span className="govuk-!-font-weight-bold">Passenger type:</span>{' '}
                                    {sentenceCaseString(singlePassengerType.passengerType.passengerType)}
                                </p>

                                <p className="govuk-body-s govuk-!-margin-bottom-2">
                                    <span className="govuk-!-font-weight-bold">Minimum age:</span>{' '}
                                    {singlePassengerType.passengerType.ageRangeMin
                                        ? singlePassengerType.passengerType.ageRangeMin
                                        : 'N/A'}
                                </p>

                                <p className="govuk-body-s govuk-!-margin-bottom-2">
                                    <span className="govuk-!-font-weight-bold">Maximum age:</span>{' '}
                                    {singlePassengerType.passengerType.ageRangeMax
                                        ? singlePassengerType.passengerType.ageRangeMax
                                        : 'N/A'}
                                </p>

                                <p className="govuk-body-s govuk-!-margin-bottom-2">
                                    <span className="govuk-!-font-weight-bold">Proof document(s):</span>{' '}
                                    {singlePassengerType.passengerType.proofDocuments
                                        ? getProofOfDocumentsString(singlePassengerType.passengerType.proofDocuments)
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <a className="govuk-button" data-module="govuk-button" href="/managePassengerTypes">
                Add a passenger type
            </a>
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
    const csrfToken = getCsrfToken(ctx);
    const nationalOperatorCode = getAndValidateNoc(ctx);
    const singlePassengerTypes = await getPassengerTypesByNocCode(nationalOperatorCode, 'single');
    const groupPrssengerTypes = await getPassengerTypesByNocCode(nationalOperatorCode, 'group');

    return { props: { csrfToken, singlePassengerTypes: singlePassengerTypes, groupPrssengerTypes } };
};

const getProofOfDocumentsString = (documents: string[]) => {
    let proofOfDocumentsString = documents.map((document) => sentenceCaseString(document)).join(', ');

    proofOfDocumentsString =
        proofOfDocumentsString.length > 44
            ? proofOfDocumentsString.substring(0, 44).concat('…')
            : proofOfDocumentsString;

    return proofOfDocumentsString;
};

export default ViewPassengerTypes;
