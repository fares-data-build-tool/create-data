import React, { ReactElement } from 'react';
import FileAttachment from './FileAttachment';
import guidanceDocImage from '../assets/images/Guidance-doc-front-page.png';
import csvImage from '../assets/images/csv.png';
import { UserDataUploadsProps } from '../interfaces';
import FormElementWrapper, { FormGroupWrapper } from './FormElementWrapper';
import ErrorSummary from './ErrorSummary';
import CsrfForm from './CsrfForm';
import BackButton from './BackButton';

const UserDataUploadComponent = ({
    csvUploadApiRoute,
    csvUploadTitle,
    csvUploadHintText,
    guidanceDocDisplayName,
    guidanceDocAttachmentUrl,
    guidanceDocSize,
    csvTemplateDisplayName,
    csvTemplateAttachmentUrl,
    csvTemplateSize,
    errors,
    detailSummary,
    detailBody,
    showPriceOption,
    poundsOrPence,
    csrfToken,
    backHref,
    buttonText,
    dataSourceAttribute,
    serviceList,
    isFareZone,
    clickedYes,
}: UserDataUploadsProps): ReactElement => {
    const seen: string[] = [];
    const uniqueServiceLists =
        serviceList?.filter((item) => (seen.includes(item.lineId) ? false : seen.push(item.lineId))) ?? [];
    return (
        <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
                {!!backHref && errors.length === 0 ? <BackButton href={backHref} /> : null}
                <ErrorSummary errors={errors} />
                <CsrfForm action={csvUploadApiRoute} method="post" encType="multipart/form-data" csrfToken={csrfToken}>
                    <>
                        <div
                            className={`govuk-form-group ${
                                errors.length > 0 && !showPriceOption ? 'govuk-form-group--error' : ''
                            }`}
                        >
                            <label htmlFor="csv-upload">
                                <h1 className="govuk-heading-l">{csvUploadTitle}</h1>
                            </label>

                            <span className="govuk-hint govuk-!-margin-bottom-7" id="csv-upload-hint">
                                {csvUploadHintText}
                            </span>

                            {showPriceOption && (
                                <FormGroupWrapper errors={errors} errorIds={['pounds']}>
                                    <fieldset className="govuk-fieldset">
                                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                                            <h2 className="govuk-fieldset__heading" id="passenger-type-page-heading">
                                                Are prices in pounds or pence?
                                            </h2>
                                        </legend>

                                        <FormElementWrapper
                                            errors={errors}
                                            errorId="pounds"
                                            errorClass="govuk-radios--error"
                                        >
                                            <div className="govuk-radios">
                                                <div className="govuk-radios__item">
                                                    <input
                                                        className="govuk-radios__input"
                                                        id="pounds"
                                                        name="poundsOrPence"
                                                        type="radio"
                                                        value="pounds"
                                                        defaultChecked={poundsOrPence === 'pounds'}
                                                    />

                                                    <label className="govuk-label govuk-radios__label" htmlFor="pounds">
                                                        Pounds, for example 2.50
                                                    </label>
                                                </div>

                                                <div className="govuk-radios__item">
                                                    <input
                                                        className="govuk-radios__input"
                                                        id="pence"
                                                        name="poundsOrPence"
                                                        type="radio"
                                                        value="pence"
                                                        defaultChecked={poundsOrPence === 'pence'}
                                                    />

                                                    <label className="govuk-label govuk-radios__label" htmlFor="pence">
                                                        Pence, for example 250
                                                    </label>
                                                </div>
                                            </div>
                                        </FormElementWrapper>
                                    </fieldset>
                                </FormGroupWrapper>
                            )}
                            <FormGroupWrapper errors={errors} errorIds={['csv-upload']}>
                                <fieldset className="govuk-fieldset">
                                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                                        <h2
                                            className={`govuk-fieldset__heading ${
                                                !showPriceOption && 'govuk-visually-hidden'
                                            }`}
                                            id="passenger-type-page-heading"
                                        >
                                            Upload file
                                        </h2>
                                    </legend>
                                    <FormElementWrapper
                                        errorId="csv-upload"
                                        errorClass="govuk-file-upload--error"
                                        errors={errors}
                                    >
                                        <input
                                            className="govuk-file-upload"
                                            id="csv-upload"
                                            name="csv-upload"
                                            type="file"
                                            accept=".csv,.xlsx,.xls"
                                            aria-describedby="csv-upload-hint"
                                        />
                                    </FormElementWrapper>
                                </fieldset>
                            </FormGroupWrapper>
                        </div>
                        {detailSummary && detailBody && (
                            <details className="govuk-details" data-module="govuk-details">
                                <summary className="govuk-details__summary">
                                    <span className="govuk-details__summary-text">{detailSummary}</span>
                                </summary>
                                <div className="govuk-details__text">{detailBody}</div>
                            </details>
                        )}

                        <input type="submit" value="Upload and continue" id="submit-button" className="govuk-button" />
                        {isFareZone ? (
                            <div>
                                <div className="govuk-warning-text">
                                    <span className="govuk-warning-text__icon" aria-hidden="true">
                                        !
                                    </span>
                                    <strong className="govuk-warning-text__text">
                                        <span className="govuk-warning-text__assistive">Warning</span>
                                        If there are services exempt, you can omit them by selecting yes below and
                                        selecting the services you want to omit.
                                    </strong>
                                </div>
                                <div className="govuk-form-group">
                                    <fieldset className="govuk-fieldset">
                                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                                            <h2 className="govuk-fieldset__heading">
                                                Are there services within this zone which are not included?
                                            </h2>
                                        </legend>
                                        <FormElementWrapper
                                            errorId="checkbox-0"
                                            errorClass="govuk-form-group--error"
                                            errors={errors}
                                        >
                                            <div className="govuk-radios" data-module="govuk-radios">
                                                <div className="govuk-radios__item">
                                                    <input
                                                        className="govuk-radios__input"
                                                        id="yes"
                                                        name="exempt"
                                                        type="radio"
                                                        value="yes"
                                                        data-aria-controls="conditional-yes"
                                                        defaultChecked={clickedYes}
                                                    />
                                                    <label className="govuk-label govuk-radios__label" htmlFor="yes">
                                                        Yes
                                                    </label>
                                                </div>
                                                <div
                                                    className="govuk-radios__conditional govuk-radios__conditional--hidden"
                                                    id="conditional-yes"
                                                >
                                                    <div className="govuk-form-group">
                                                        <fieldset className="govuk-fieldset">
                                                            <input
                                                                type="submit"
                                                                name="selectAll"
                                                                value={buttonText}
                                                                id="select-all-button"
                                                                className="govuk-button govuk-button--secondary"
                                                            />
                                                            <div className="govuk-checkboxes">
                                                                {uniqueServiceLists.map((service, index) => {
                                                                    const {
                                                                        lineName,
                                                                        lineId,
                                                                        serviceCode,
                                                                        description,
                                                                        checked,
                                                                        origin,
                                                                        destination,
                                                                    } = service;

                                                                    const checkboxTitles =
                                                                        dataSourceAttribute &&
                                                                        dataSourceAttribute.source === 'tnds'
                                                                            ? `${lineName} - ${description}`
                                                                            : `${lineName} ${origin || 'N/A'} - ${
                                                                                  destination || 'N/A'
                                                                              }`;

                                                                    const checkBoxValues = `${description}`;

                                                                    return (
                                                                        <div
                                                                            className="govuk-checkboxes__item"
                                                                            key={`checkbox-item-${lineName}`}
                                                                        >
                                                                            <input
                                                                                className="govuk-checkboxes__input"
                                                                                id={`checkbox-${index}`}
                                                                                name={`${lineName}#${lineId}#${serviceCode}`}
                                                                                type="checkbox"
                                                                                value={checkBoxValues}
                                                                                defaultChecked={checked}
                                                                            />
                                                                            <label
                                                                                className="govuk-label govuk-checkboxes__label"
                                                                                htmlFor={`checkbox-${index}`}
                                                                            >
                                                                                {checkboxTitles}
                                                                            </label>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </fieldset>
                                                    </div>
                                                </div>
                                                <div className="govuk-radios__item">
                                                    <input
                                                        className="govuk-radios__input"
                                                        id="no"
                                                        name="exempt"
                                                        type="radio"
                                                        value="no"
                                                        defaultChecked={!clickedYes}
                                                    />
                                                    <label className="govuk-label govuk-radios__label" htmlFor="no">
                                                        No
                                                    </label>
                                                </div>
                                            </div>
                                        </FormElementWrapper>
                                    </fieldset>
                                </div>
                            </div>
                        ) : (
                            ''
                        )}
                    </>
                </CsrfForm>
            </div>
            <div className="govuk-grid-column-one-third">
                <h2 className="govuk-heading-s">Help documents</h2>
                <FileAttachment
                    displayName={guidanceDocDisplayName}
                    attachmentUrl={`${guidanceDocAttachmentUrl}`}
                    imageUrl={guidanceDocImage}
                    size={guidanceDocSize}
                />
                <FileAttachment
                    displayName={csvTemplateDisplayName}
                    attachmentUrl={`${csvTemplateAttachmentUrl}`}
                    imageUrl={csvImage}
                    size={csvTemplateSize}
                />
            </div>
        </div>
    );
};

export default UserDataUploadComponent;
