import React, { FC, ReactElement } from 'react';
import FileAttachment from './FileAttachment';
import guidanceDocImage from '../assets/images/Guidance-doc-front-page.png';
import csvImage from '../assets/images/csv.png';
import { ErrorInfo } from '../types';
import FormElementWrapper from './FormElementWrapper';
import ErrorSummary from './ErrorSummary';

export interface UserDataUploadsProps {
    csvUploadApiRoute: string;
    csvUploadHintText: string;
    guidanceDocDisplayName: string;
    guidanceDocAttachmentUrl: string;
    guidanceDocSize: string;
    csvTemplateDisplayName: string;
    csvTemplateAttachmentUrl: string;
    csvTemplateSize: string;
    errors: ErrorInfo[];
    detailSummary?: string;
    detailBody?: ReactElement;
}

const UserDataUploadComponent: FC<UserDataUploadsProps> = ({
    csvUploadApiRoute,
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
}: UserDataUploadsProps) => (
    <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
            <ErrorSummary errors={errors} />
            <form action={csvUploadApiRoute} method="post" encType="multipart/form-data">
                <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                    <fieldset className="govuk-fieldset" aria-describedby="csv-upload-hint csv-upload-error">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading">Select a file to upload</h1>
                        </legend>
                        <span className="govuk-hint" id="csv-upload-hint">
                            {csvUploadHintText}
                        </span>
                        <div className="govuk-form-group input-form">
                            <label className="govuk-label" htmlFor="csv-upload">
                                Upload a CSV file
                            </label>
                            <FormElementWrapper
                                errorId={errors?.[0]?.id}
                                errorClass="govuk-file-upload--error"
                                errors={errors}
                            >
                                <input
                                    className="govuk-file-upload"
                                    id="csv-upload"
                                    name="csv-upload"
                                    type="file"
                                    accept=".csv"
                                />
                            </FormElementWrapper>
                        </div>
                    </fieldset>
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
            </form>
        </div>
        <div className="govuk-grid-column-one-third">
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                <h1 className="govuk-fieldset__heading">Help documents</h1>
            </legend>
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
