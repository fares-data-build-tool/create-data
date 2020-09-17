import React, { ReactElement } from 'react';
import FileAttachment from './FileAttachment';
import guidanceDocImage from '../assets/images/Guidance-doc-front-page.png';
import csvImage from '../assets/images/csv.png';
import { ErrorInfo, CustomAppProps } from '../interfaces';
import FormElementWrapper from './FormElementWrapper';
import ErrorSummary from './ErrorSummary';
import CsrfForm from './CsrfForm';

export interface UserDataUploadsProps {
    csvUploadApiRoute: string;
    csvUploadHintText: string;
    csvUploadTitle: string;
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
    csrfToken,
}: UserDataUploadsProps & CustomAppProps): ReactElement => (
    <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
            <ErrorSummary errors={errors} />
            <CsrfForm action={csvUploadApiRoute} method="post" encType="multipart/form-data" csrfToken={csrfToken}>
                <>
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <label htmlFor="csv-upload">
                            <h1 className="govuk-heading-l">{csvUploadTitle}</h1>
                        </label>
                        <span className="govuk-hint" id="csv-upload-hint">
                            {csvUploadHintText}
                        </span>
                        <div className="govuk-form-group input-form">
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
                                    aria-describedby="csv-upload-hint"
                                />
                            </FormElementWrapper>
                        </div>
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
