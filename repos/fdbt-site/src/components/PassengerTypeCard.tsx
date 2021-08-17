import React, { ReactElement } from 'react';
import { FullGroupPassengerType, SinglePassengerType } from '../interfaces';
import { sentenceCaseString, getProofDocumentsString } from '../utils';

interface PassengerTypeCardProps {
    contents: FullGroupPassengerType | SinglePassengerType;
    deleteActionHandler?: (id: number, name: string, isGroup: boolean) => void;
}

const PassengerTypeCard = ({ contents, deleteActionHandler }: PassengerTypeCardProps): ReactElement => {
    const { name, id } = contents;
    const refinedName = name.length > 11 ? name.substring(0, 11).concat('…') : name;
    return (
        <div className="govuk-grid-column-one-half govuk-!-margin-bottom-5">
            <div className="card">
                <div className="card__body">
                    {deleteActionHandler ? (
                        <div className="card__actions">
                            <ul className="actions__list">
                                <li className="actions__item">
                                    <a
                                        className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular"
                                        href={`/managePassengerGroup?id=${id}`}
                                    >
                                        Edit
                                    </a>
                                </li>

                                <li className="actions__item">
                                    <button
                                        className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular actions__delete"
                                        onClick={() => deleteActionHandler(id, name, 'groupPassengerType' in contents)}
                                    >
                                        Delete
                                    </button>
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <div className="govuk-radios">
                            <div className="govuk-radios__item card__radio">
                                <input
                                    className="govuk-radios__input"
                                    id={`${name}-radio`}
                                    name="passengerTypeId"
                                    type="radio"
                                    value={id}
                                    aria-label={name}
                                />
                                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                                <label className="govuk-label govuk-radios__label" />
                            </div>
                        </div>
                    )}

                    {'groupPassengerType' in contents ? (
                        <>
                            <h4 className="govuk-heading-m govuk-!-padding-bottom-4">{refinedName}</h4>

                            <p className="govuk-body-s govuk-!-margin-bottom-2">
                                <span className="govuk-!-font-weight-bold">Max size:</span>{' '}
                                {contents.groupPassengerType.maxGroupSize}
                            </p>

                            {contents.groupPassengerType.companions.length
                                ? contents.groupPassengerType.companions.map((companion) => (
                                      <p key={companion.name} className="govuk-body-s govuk-!-margin-bottom-2">
                                          <span className="govuk-!-font-weight-bold">
                                              {companion.name || companion.passengerType}:
                                          </span>{' '}
                                          {`Min: ${companion.minNumber ? companion.minNumber : '0'}`} -{' '}
                                          {`Max: ${companion.maxNumber}`}
                                      </p>
                                  ))
                                : ''}
                        </>
                    ) : (
                        <>
                            <h4 className="govuk-heading-m govuk-!-padding-bottom-4">{refinedName}</h4>

                            <p className="govuk-body-s govuk-!-margin-bottom-2">
                                <span className="govuk-!-font-weight-bold">Passenger type:</span>{' '}
                                {sentenceCaseString(contents.passengerType.passengerType)}
                            </p>

                            <p className="govuk-body-s govuk-!-margin-bottom-2">
                                <span className="govuk-!-font-weight-bold">Minimum age:</span>{' '}
                                {contents.passengerType.ageRangeMin ? contents.passengerType.ageRangeMin : 'N/A'}
                            </p>

                            <p className="govuk-body-s govuk-!-margin-bottom-2">
                                <span className="govuk-!-font-weight-bold">Maximum age:</span>{' '}
                                {contents.passengerType.ageRangeMax ? contents.passengerType.ageRangeMax : 'N/A'}
                            </p>

                            <p className="govuk-body-s govuk-!-margin-bottom-2">
                                <span className="govuk-!-font-weight-bold">Proof document(s):</span>{' '}
                                {contents.passengerType.proofDocuments
                                    ? getProofDocumentsString(contents.passengerType.proofDocuments)
                                    : 'N/A'}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PassengerTypeCard;
