import React, { FunctionComponent, ReactElement, useState } from 'react';
import ErrorSummary from '../components/ErrorSummary';
import { BaseLayout } from '../layout/Layout';
import SubNavigation from '../layout/SubNavigation';
import { Cap, ErrorInfo, NextPageContextWithSession } from '../interfaces';
import { getAndValidateNoc, getCsrfToken, sentenceCaseString } from '../utils';
import { getCaps, getFareDayEnd } from '../data/auroradb';
import { FromDb } from '../interfaces/matchingJsonTypes';
import { getSessionAttribute, updateSessionAttribute } from '../utils/sessions';
import { CREATE_CAPS_ATTRIBUTE, VIEW_CAP_ERRORS } from '../constants/attributes';
import DeleteConfirmationPopup from '../components/DeleteConfirmationPopup';
import { extractGlobalSettingsReferer } from '../utils/globalSettings';

const title = 'Caps - Create Fares Data Service';
const description = 'View and edit your caps.';

export const expiryHintText: { [expiry: string]: string } = {
    endOfCalendarDay: 'The cap applies to journeys made before midnight',
    fareDayEnd: "The cap applies to journeys made during the 'fare day' as defined by your business rules",
};

interface CapProps {
    caps: FromDb<Cap>[];
    referer: string | null;
    fareDayEnd: string;
    viewCapErrors: ErrorInfo[];
    csrfToken: string;
}

interface CapCardProps {
    cap: FromDb<Cap>;
    index: Number;
    deleteActionHandler: (id: number, name: string) => void;
    fareDayEnd: string;
}

const ViewCaps = ({ caps, referer, fareDayEnd, viewCapErrors = [], csrfToken }: CapProps): ReactElement => {
    const [popUpState, setPopUpState] = useState<{
        capName: string;
        capId: number;
    }>();

    const deleteActionHandler = (id: number, name: string): void => {
        setPopUpState({
            ...popUpState,
            capName: name,
            capId: id,
        });
    };

    const cancelActionHandler = (): void => {
        setPopUpState(undefined);
    };

    const buildDeleteUrl = (idToDelete: number, csrfToken: string): string => {
        return `/api/deleteCap?id=${idToDelete}&_csrf=${csrfToken}`;
    };

    return (
        <BaseLayout title={title} description={description} showNavigation referer={referer}>
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
                        {caps.length === 0 ? (
                            <p className="govuk-body">
                                <em>You currently have no caps saved.</em>
                            </p>
                        ) : (
                            <div className="card-row">
                                {caps.map((cap, index) => (
                                    <CapCard
                                        cap={cap}
                                        index={index}
                                        key={cap.id.toString()}
                                        deleteActionHandler={deleteActionHandler}
                                        fareDayEnd={fareDayEnd}
                                    />
                                ))}
                            </div>
                        )}

                        <a className="govuk-button" data-module="govuk-button" href="/createCaps">
                            Add a cap
                        </a>
                    </div>
                </div>
            </div>

            {popUpState ? (
                <DeleteConfirmationPopup
                    entityName={popUpState.capName}
                    deleteUrl={buildDeleteUrl(popUpState.capId, csrfToken)}
                    cancelActionHandler={cancelActionHandler}
                />
            ) : null}
        </BaseLayout>
    );
};

const CapCard = ({ cap, index, deleteActionHandler, fareDayEnd }: CapCardProps): ReactElement => {
    return (
        <>
            <div className="card" id={`cap-${index}`}>
                <div className="card__body">
                    <div className="card__actions">
                        <ul className="actions__list">
                            <li className="actions__item">
                                <a
                                    className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular"
                                    href={`/createCaps?id=${cap.id}`}
                                >
                                    Edit
                                </a>
                            </li>
                            <li className="actions__item">
                                <button
                                    className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular actions__delete"
                                    onClick={() => deleteActionHandler(cap.id, cap.capDetails.name)}
                                >
                                    Delete
                                </button>
                            </li>
                        </ul>
                    </div>

                    <h4 className="govuk-heading-m govuk-!-padding-bottom-4">{cap.capDetails.name}</h4>

                    <p className="govuk-body-s govuk-!-margin-bottom-2">
                        <span className="govuk-!-font-weight-bold">Price:</span>{' '}
                        {sentenceCaseString(cap.capDetails.price)}
                    </p>

                    <p className="govuk-body-s govuk-!-margin-bottom-2">
                        <span className="govuk-!-font-weight-bold">Duration:</span> {cap.capDetails.durationAmount}{' '}
                        {cap.capDetails.durationUnits}
                    </p>

                    <p className="govuk-body-s govuk-!-margin-bottom-2">
                        <span className="govuk-!-font-weight-bold">Validity:</span>{' '}
                        {cap.capDetails.capExpiry.productValidity === 'endOfCalendarDay'
                            ? 'At the end of a calendar day'
                            : 'Fare day end'}
                    </p>

                    <p className="govuk-body-s govuk-!-margin-bottom-2">
                        {expiryHintText[cap.capDetails.capExpiry.productValidity]}
                    </p>

                    {cap.capDetails.capExpiry.productValidity === 'fareDayEnd' ? (
                        <p className="govuk-body-s govuk-!-margin-bottom-2">
                            <span className="govuk-!-font-weight-bold">End time:</span>

                            <p className="govuk-body-s govuk-!-margin-bottom-2">
                                {fareDayEnd.substring(0, 2)}:{fareDayEnd.substring(2, 4)}
                            </p>
                        </p>
                    ) : undefined}
                </div>
            </div>
        </>
    );
};

export const CapCardBody: FunctionComponent<{ cap: Cap; fareDayEnd?: string }> = ({
    cap,
    fareDayEnd,
}: {
    cap: Cap;
    fareDayEnd?: string;
}) => (
    <>
        <h4 className="govuk-heading-m govuk-!-padding-bottom-4">{cap.capDetails.name}</h4>

        <p className="govuk-body-s govuk-!-margin-bottom-2">
            <span className="govuk-!-font-weight-bold">Price:</span> {sentenceCaseString(cap.capDetails.price)}
        </p>

        <p className="govuk-body-s govuk-!-margin-bottom-2">
            <span className="govuk-!-font-weight-bold">Duration:</span> {cap.capDetails.durationAmount}{' '}
            {cap.capDetails.durationUnits}
        </p>

        <p className="govuk-body-s govuk-!-margin-bottom-2">
            <span className="govuk-!-font-weight-bold">Expiry:</span>{' '}
            {sentenceCaseString(cap.capDetails.capExpiry.productValidity)}
        </p>

        {cap.capDetails.capExpiry.productValidity === 'fareDayEnd' && fareDayEnd ? (
            <p className="govuk-body-s govuk-!-margin-bottom-2">
                <span className="govuk-!-font-weight-bold">Validity:</span> {fareDayEnd.substring(0, 2)}:
                {fareDayEnd.substring(2, 4)}
            </p>
        ) : undefined}
    </>
);

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: CapProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const noc = getAndValidateNoc(ctx);

    const dbFareDayEnd = await getFareDayEnd(noc);
    const fareDayEnd = dbFareDayEnd ? dbFareDayEnd : '';
    const viewCapErrors = getSessionAttribute(ctx.req, VIEW_CAP_ERRORS);

    const caps = await getCaps(noc);
    updateSessionAttribute(ctx.req, CREATE_CAPS_ATTRIBUTE, undefined);
    updateSessionAttribute(ctx.req, VIEW_CAP_ERRORS, undefined);

    return {
        props: {
            caps,
            referer: extractGlobalSettingsReferer(ctx),
            fareDayEnd,
            viewCapErrors: viewCapErrors || [],
            csrfToken,
        },
    };
};

export default ViewCaps;
