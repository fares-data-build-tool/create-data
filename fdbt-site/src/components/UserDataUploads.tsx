import React, { FC } from 'react';
import FileAttachment from './FileAttachment';
import guidanceDocImage from '../assets/images/Guidance-doc-front-page.png';
import csvImage from '../assets/images/csv.png';
import { STATIC_FILES_PATH } from '../constants';

export type UserDataUploadsProps = {
    csvUploadApiRoute: string;
    csvUploadHintText: string;
    guidanceDocDisplayName: string;
    guidanceDocAttachmentUrl: string;
    guidanceDocSize: string;
    csvTemplateDisplayName: string;
    csvTemplateAttachmentUrl: string;
    csvTemplateSize: string;
    error: string;
};

const UserDataUploadComponent: FC<UserDataUploadsProps> = ({
    csvUploadApiRoute,
    csvUploadHintText,
    guidanceDocDisplayName,
    guidanceDocAttachmentUrl,
    guidanceDocSize,
    csvTemplateDisplayName,
    csvTemplateAttachmentUrl,
    csvTemplateSize,
    error,
}: UserDataUploadsProps) => (
    <>
        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
            <h1 className="govuk-fieldset__heading" aria-describedby="changed-name-hint">
                Please select your file to upload
            </h1>
        </legend>
        <span className="govuk-hint" id="csv-upload-hint">
            {csvUploadHintText}
        </span>
        <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
                <form action={csvUploadApiRoute} method="post" encType="multipart/form-data">
                    <div className={`govuk-form-group input-form ${error !== '' ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset">
                            <label className="govuk-label" htmlFor="csv-upload">
                                Upload a CSV file
                            </label>
                            <span id="csv-upload-error" className="govuk-error-message">
                                <span className={error !== '' ? '' : 'govuk-visually-hidden'} />
                                {error}
                            </span>
                            <input
                                className={`govuk-file-upload ${error !== '' ? 'govuk-file-upload--error' : ''}`}
                                id="csv-upload"
                                name="csv-upload"
                                type="file"
                                accept=".csv"
                                aria-describedby={error !== '' ? 'csv-upload-error' : ''}
                            />
                        </fieldset>
                    </div>
                    <input
                        type="submit"
                        value="Upload and continue"
                        id="submit-button"
                        className="govuk-button govuk-button--start"
                    />
                </form>
            </div>
            <div className="govuk-grid-column-one-third">
                <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
                <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                    <h1 className="govuk-fieldset__heading">Help documents</h1>
                </legend>
                <FileAttachment
                    displayName={guidanceDocDisplayName}
                    attachmentUrl={`${STATIC_FILES_PATH}${guidanceDocAttachmentUrl}`}
                    imageUrl={guidanceDocImage}
                    size={guidanceDocSize}
                />
                <FileAttachment
                    displayName={csvTemplateDisplayName}
                    attachmentUrl={`${STATIC_FILES_PATH}${csvTemplateAttachmentUrl}`}
                    imageUrl={csvImage}
                    size={csvTemplateSize}
                />
            </div>
        </div>
    </>
);

export default UserDataUploadComponent;
