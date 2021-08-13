import React, { ReactElement, useState } from 'react';
import { BaseLayout } from '../layout/Layout';
import { SinglePassengerType, NextPageContextWithSession, FullGroupPassengerType } from '../interfaces';
import { getCsrfToken, getAndValidateNoc, sentenceCaseString } from '../utils';
import { getGroupPassengerTypesFromGlobalSettings, getPassengerTypesByNocCode } from '../data/auroradb';
import SubNavigation from '../layout/SubNavigation';
import DeleteConfirmationPopup from '../components/DeleteConfirmationPopup';
import PassengerTypeCard from '../components/PassengerTypeCard';

const title = 'Passenger Types - Create Fares Data Service';
const description = 'View and edit your passenger types.';

interface PassengerTypeProps {
    csrfToken: string;
    singlePassengerTypes: SinglePassengerType[];
    groupPassengerTypes: FullGroupPassengerType[];
}

const ViewPassengerTypes = ({
    singlePassengerTypes,
    groupPassengerTypes,
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

                            {!groupPassengerTypes.length ? (
                                <NoPassengerTypeGroups passengerTypesExist={singlePassengerTypes.length > 0} />
                            ) : (
                                <PassengerTypeGroups
                                    deleteActionHandler={deleteActionHandler}
                                    passengerTypeGroups={groupPassengerTypes}
                                    passengerTypesExist={groupPassengerTypes.length > 0}
                                />
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
                    <PassengerTypeCard contents={singlePassengerType} deleteActionHandler={deleteActionHandler}/>
                ))}
            </div>

            <a className="govuk-button" data-module="govuk-button" href="/managePassengerTypes">
                Add a passenger type
            </a>
        </div>
    );
};

const NoPassengerTypeGroups = ({ passengerTypesExist }: { passengerTypesExist: boolean }): ReactElement => {
    return (
        <div className="govuk-heading-m">
            <h3>Groups</h3>

            <div className="govuk-inset-text">
                Individual passengers must be created before they can be added to a group.
            </div>

            <p className="govuk-body">You currently have no passenger groups saved.</p>

            {passengerTypesExist ? (
                <a className="govuk-button" data-module="govuk-button" href="/managePassengerGroup">
                    Add a passenger group
                </a>
            ) : (
                ''
            )}
        </div>
    );
};

interface PassengerTypeGroupProps {
    deleteActionHandler: (name: string, isGroup: boolean) => void;
    passengerTypesExist: boolean;
    passengerTypeGroups: FullGroupPassengerType[];
}

const PassengerTypeGroups = ({
    deleteActionHandler,
    passengerTypeGroups,
    passengerTypesExist,
}: PassengerTypeGroupProps): ReactElement => {
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
                                                href={`/managePassengerGroup?id=${passengerTypeGroup.id}`}
                                            >
                                                Edit
                                            </a>
                                        </li>

                                        <li className="actions__item">
                                            <button
                                                className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular actions__delete"
                                                onClick={() => deleteActionHandler(passengerTypeGroup.name, true)}
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                                <h4 className="govuk-!-padding-bottom-4">
                                    {sentenceCaseString(passengerTypeGroup.name)}
                                </h4>

                                <p className="govuk-body-s govuk-!-margin-bottom-2">
                                    <span className="govuk-!-font-weight-bold">Max size:</span>{' '}
                                    {passengerTypeGroup.groupPassengerType.maxGroupSize}
                                </p>

                                {passengerTypeGroup.groupPassengerType.companions.length
                                    ? passengerTypeGroup.groupPassengerType.companions.map((companion) => (
                                          <p key={companion.name} className="govuk-body-s govuk-!-margin-bottom-2">
                                              <span className="govuk-!-font-weight-bold">
                                                  {sentenceCaseString(companion.name || companion.passengerType)}:
                                              </span>{' '}
                                              {`Min: ${companion.minNumber ? companion.minNumber : '0'}`} -{' '}
                                              {`Max: ${companion.maxNumber}`}
                                          </p>
                                      ))
                                    : ''}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {passengerTypesExist ? (
                <a className="govuk-button" data-module="govuk-button" href="/managePassengerGroup">
                    Add a passenger group
                </a>
            ) : (
                ''
            )}
        </div>
    );
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: PassengerTypeProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const nationalOperatorCode = getAndValidateNoc(ctx);
    const singlePassengerTypes = await getPassengerTypesByNocCode(nationalOperatorCode, 'single');
    const groupPassengerTypes = await getGroupPassengerTypesFromGlobalSettings(nationalOperatorCode);

    return { props: { csrfToken, singlePassengerTypes: singlePassengerTypes, groupPassengerTypes } };
};

export default ViewPassengerTypes;
