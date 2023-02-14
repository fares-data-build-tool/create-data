import React, { ReactElement } from 'react';
import { FullColumnLayout } from '../layout/Layout';
import ErrorSummary from '../components/ErrorSummary';
import { Cap, ErrorInfo, NextPageContextWithSession } from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import { CapCardBody } from './viewCaps';
import BackButton from '../components/BackButton';
import { getCaps } from 'src/data/auroradb';
import { getSessionAttribute } from 'src/utils/sessions';
import { CAPS_DEFINITION_ATTRIBUTE } from 'src/constants/attributes';

const title = 'Select Caps - Create Fares Data Service';
const description = 'Select Caps page of the Create Fares Data Service';

interface SelectCapsProps {
    csrfToken: string;
    errors: ErrorInfo[];
    capsFromDb: Cap[];
    backHref: string;
    selectedId: number | null;
}

const SelectCaps = ({ csrfToken, errors, capsFromDb, backHref, selectedId }: SelectCapsProps): ReactElement => {
    return (
        <FullColumnLayout title={title} description={description} errors={errors}>
            {!!backHref && errors.length === 0 ? <BackButton href={backHref} /> : null}
            <ErrorSummary errors={errors} />
            <CsrfForm action="/api/selectCaps" method="post" csrfToken={csrfToken}>
                <>
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="contact-hint">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading">Does a cap apply to this product?</h1>
                            </legend>

                            <div id="contact-hint" className="govuk-hint">
                                We need to know if your product will have any caps; select yes if your product has a
                                price cap. You can create these in operator settings.
                            </div>

                            <div className="govuk-warning-text">
                                <span className="govuk-warning-text__icon govuk-!-margin-top-1" aria-hidden="true">
                                    !
                                </span>
                                <strong className="govuk-warning-text__text">
                                    <span className="govuk-warning-text__assistive">Warning</span>
                                    You can create new caps in your <a href="/viewCaps">operator settings</a>.<br />{' '}
                                    Don&apos;t worry you can navigate back to this page when you are finished.
                                </strong>
                            </div>

                            <div className="govuk-radios govuk-radios--conditional" data-module="govuk-radios">
                                <div className="govuk-radios__item">
                                    <input
                                        className="govuk-radios__input"
                                        id="caps"
                                        name="capChoice"
                                        type="radio"
                                        value="yes"
                                        data-aria-controls="conditional-caps"
                                        defaultChecked={errors.some((error) => error.id === 'caps') || !!selectedId}
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor="yes-choice">
                                        Yes
                                    </label>
                                </div>

                                <div
                                    className="govuk-radios__conditional govuk-radios__conditional--hidden"
                                    id="conditional-caps"
                                >
                                    <div className="govuk-form-group card-row">
                                        {capsFromDb.length > 0 ? (
                                            capsFromDb.map((capFromDb) => (
                                                <CapsCard
                                                    key={capFromDb.capDetails.name}
                                                    cap={capFromDb}
                                                    selectedId={selectedId}
                                                />
                                            ))
                                        ) : (
                                            <p className="govuk-body govuk-error-message">
                                                <a href="/viewCaps">Create a cap in operator settings.</a>
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="govuk-radios__item">
                                    <input
                                        className="govuk-radios__input"
                                        id="no-caps"
                                        name="capChoice"
                                        type="radio"
                                        value="no"
                                        data-aria-controls="conditional-caps-2"
                                        defaultChecked={!selectedId && !errors.some((error) => error.id === 'caps')}
                                    />
                                    <label className="govuk-label govuk-radios__label" htmlFor="no-choice">
                                        No
                                    </label>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    <input
                        type="submit"
                        value="Continue"
                        id="continue-button"
                        className="govuk-button govuk-!-margin-right-2"
                    />

                    <a className="govuk-button govuk-button--secondary" href="/viewCaps">
                        Create new
                    </a>
                </>
            </CsrfForm>
        </FullColumnLayout>
    );
};

const CapsCard = ({ cap, selectedId }: { cap: Cap; selectedId: number | null }): ReactElement => {
    return (
        <div className="card">
            <div className="card__body caps">
                <div className="govuk-radios">
                    <div className="govuk-radios__item card__selector">
                        <input
                            className="govuk-radios__input"
                            id={`${cap.capDetails.name}-radio`}
                            name="cap"
                            type="radio"
                            value={cap.id}
                            aria-label={cap.capDetails.name}
                            defaultChecked={selectedId === cap.id}
                        />
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                        <label className="govuk-label govuk-radios__label" />
                    </div>
                </div>
                <CapCardBody cap={cap} />
            </div>
        </div>
    );
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: SelectCapsProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const capsDefinition = getSessionAttribute(ctx.req, CAPS_DEFINITION_ATTRIBUTE);
    const errors = !!capsDefinition && 'errors' in capsDefinition ? capsDefinition.errors : [];

    const capAttribute = getSessionAttribute(ctx.req, CAPS_DEFINITION_ATTRIBUTE);

    const backHref = '';

    const nationalOperatorCode = getAndValidateNoc(ctx);

    const capsFromDb: Cap[] = await getCaps(nationalOperatorCode);

    return {
        props: {
            csrfToken,
            errors,
            capsFromDb,
            backHref,
            selectedId: !!capAttribute && !('errors' in capAttribute) ? capAttribute.id : null,
        },
    };
};

export default SelectCaps;
