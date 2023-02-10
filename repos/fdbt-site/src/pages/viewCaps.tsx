import React, { FunctionComponent, ReactElement, useState } from 'react';
import ErrorSummary from '../components/ErrorSummary';
import { BaseLayout } from '../layout/Layout';
import SubNavigation from '../layout/SubNavigation';
import { CapInfo, ErrorInfo, NextPageContextWithSession } from '../interfaces';
import { getAndValidateNoc, getCsrfToken, sentenceCaseString } from '../utils';
import { getCapExpiry, getCaps, getFareDayEnd } from '../data/auroradb';
import { CapExpiry, FromDb } from '../interfaces/matchingJsonTypes';
import { updateSessionAttribute } from '../utils/sessions';
import { CAP_EXPIRY_ATTRIBUTE, CREATE_CAPS_ATTRIBUTE } from '../constants/attributes';
import { expiryHintText } from './selectCapExpiry';
import DeleteConfirmationPopup from '../components/DeleteConfirmationPopup';
import { extractGlobalSettingsReferer } from 'src/utils/globalSettings';

const title = 'Caps - Create Fares Data Service';
const description = 'View and edit your caps.';

interface CapProps {
    caps: FromDb<CapInfo>[];
    referer: string | null;
    capExpiry: string;
    fareDayEnd: string;
    viewCapErrors: ErrorInfo[];
    csrfToken: string;
}

interface CapCardProps {
    capInfo: FromDb<CapInfo>;
    index: Number;
    deleteActionHandler: (id: number, name: string) => void;
}

interface CapExpiryCardProps {
    capExpiry: string;
    fareDayEnd: string;
}

const ViewCaps = ({ caps, referer, capExpiry, fareDayEnd, viewCapErrors = [], csrfToken }: CapProps): ReactElement => {
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
                        <h2 className="govuk-heading-l">Cap expiry</h2>
                        {capExpiry ? (
                            <CapExpiryCard capExpiry={capExpiry} fareDayEnd={fareDayEnd} />
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

                    <div>
                        <h2 className="govuk-heading-l">Caps</h2>
                        {capExpiry ? (
                            <>
                                {caps.length === 0 ? (
                                    <p className="govuk-body">
                                        <em>You currently have no caps saved.</em>
                                    </p>
                                ) : (
                                    <div className="card-row">
                                        {caps.map((capInfo, index) => (
                                            <CapCard
                                                capInfo={capInfo}
                                                index={index}
                                                key={capInfo.id.toString()}
                                                deleteActionHandler={deleteActionHandler}
                                            />
                                        ))}
                                    </div>
                                )}

                                <a className="govuk-button" data-module="govuk-button" href="/createCaps">
                                    Add caps
                                </a>
                            </>
                        ) : (
                            <NoCapsCard />
                        )}
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

const NoCapsCard = (): ReactElement => {
    return (
        <>
            <div className="govuk-inset-text">Cap expiry must be created before caps can be created.</div>

            <p className="govuk-body">
                <em>You currently have no caps saved.</em>
            </p>
        </>
    );
};

const CapCard = ({ capInfo, index, deleteActionHandler }: CapCardProps): ReactElement => {
    return (
        <>
            <div className="card" id={`cap-${index}`}>
                <div className="card__body">
                    <div className="card__actions">
                        <ul className="actions__list">
                            <li className="actions__item">
                                <a
                                    className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular"
                                    href={`/createCaps?id=${capInfo.id}`}
                                >
                                    Edit
                                </a>
                            </li>
                            <li className="actions__item">
                                <button
                                    className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular actions__delete"
                                    onClick={() => deleteActionHandler(capInfo.id, capInfo.cap.name)}
                                >
                                    Delete
                                </button>
                            </li>
                        </ul>
                    </div>

                    <h4 className="govuk-heading-m govuk-!-padding-bottom-4">{capInfo.cap.name}</h4>

                    <p className="govuk-body-s govuk-!-margin-bottom-2">
                        <span className="govuk-!-font-weight-bold">Price:</span> {sentenceCaseString(capInfo.cap.price)}
                    </p>

                    <p className="govuk-body-s govuk-!-margin-bottom-2">
                        <span className="govuk-!-font-weight-bold">Duration:</span> {capInfo.cap.durationAmount}{' '}
                        {capInfo.cap.durationUnits}
                    </p>

                    {capInfo.capStart ? (
                        <>
                            <p className="govuk-body-s govuk-!-margin-bottom-2">
                                <span className="govuk-!-font-weight-bold">Cap start:</span>{' '}
                                {sentenceCaseString(capInfo.capStart.type)}
                            </p>
                            {capInfo.capStart.startDay ? (
                                <p className="govuk-body-s govuk-!-margin-bottom-2">
                                    <span className="govuk-!-font-weight-bold">Day:</span>{' '}
                                    {sentenceCaseString(capInfo.capStart.startDay)}
                                </p>
                            ) : null}
                        </>
                    ) : null}
                </div>
            </div>
        </>
    );
};

export const CapCardBody: FunctionComponent<{ entity: CapInfo }> = ({ entity }: { entity: CapInfo }) => (
    <>
        <h4 className="govuk-heading-m govuk-!-padding-bottom-4">{entity.cap.name}</h4>

        <p className="govuk-body-s govuk-!-margin-bottom-2">
            <span className="govuk-!-font-weight-bold">Price:</span> {sentenceCaseString(entity.cap.price)}
        </p>

        <p className="govuk-body-s govuk-!-margin-bottom-2">
            <span className="govuk-!-font-weight-bold">Duration:</span> {entity.cap.durationAmount}{' '}
            {entity.cap.durationUnits}
        </p>

        {entity.capStart ? (
            <>
                <p className="govuk-body-s govuk-!-margin-bottom-2">
                    <span className="govuk-!-font-weight-bold">Cap start:</span>{' '}
                    {sentenceCaseString(entity.capStart.type)}
                </p>
                {entity.capStart.startDay ? (
                    <p className="govuk-body-s govuk-!-margin-bottom-2">
                        <span className="govuk-!-font-weight-bold">Day:</span>{' '}
                        {sentenceCaseString(entity.capStart.startDay)}
                    </p>
                ) : null}
            </>
        ) : null}
    </>
);

const CapExpiryCard = ({ capExpiry: capExpiry, fareDayEnd }: CapExpiryCardProps): ReactElement => {
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
                            {capExpiry === 'endOfCalendarDay'
                                ? 'At the end of a calendar day'
                                : capExpiry === '24hr'
                                ? 'At the end of a 24 hour period'
                                : 'Fare day end'}
                        </h4>
                        <p className="govuk-body-s govuk-!-margin-bottom-2">{expiryHintText[capExpiry]}</p>

                        {capExpiry === 'fareDayEnd' ? (
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
    const csrfToken = getCsrfToken(ctx);
    const noc = getAndValidateNoc(ctx);
    const dbCapExpiry = await getCapExpiry(noc);
    const capExpiry = dbCapExpiry ? (JSON.parse(dbCapExpiry) as CapExpiry).productValidity : '';
    const dbFareDayEnd = await getFareDayEnd(noc);
    const fareDayEnd = dbFareDayEnd ? dbFareDayEnd : '';

    const caps = await getCaps(noc);
    updateSessionAttribute(ctx.req, CAP_EXPIRY_ATTRIBUTE, undefined);
    updateSessionAttribute(ctx.req, CREATE_CAPS_ATTRIBUTE, undefined);

    return {
        props: {
            caps,
            referer: extractGlobalSettingsReferer(ctx),
            capExpiry,
            fareDayEnd,
            viewCapErrors: [],
            csrfToken,
        },
    };
};

export default ViewCaps;
