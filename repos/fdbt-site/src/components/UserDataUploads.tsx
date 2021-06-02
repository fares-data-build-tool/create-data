import React, { ReactElement } from 'react';
import FileAttachment from './FileAttachment';
import guidanceDocImage from '../assets/images/Guidance-doc-front-page.png';
import csvImage from '../assets/images/csv.png';
import { UserDataUploadsProps } from '../interfaces';
import FormElementWrapper, { FormGroupWrapper } from './FormElementWrapper';
import ErrorSummary from './ErrorSummary';
import CsrfForm from './CsrfForm';

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
}: UserDataUploadsProps): ReactElement => (
    <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
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
                        <span className="govuk-hint" id="csv-upload-hint">
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
                                        className={`govuk-fieldset__heading ${!showPriceOption &&
                                            'govuk-visually-hidden'}`}
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

export default UserDataUploadComponent;
