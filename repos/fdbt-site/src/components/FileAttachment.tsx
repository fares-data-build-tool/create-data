import '../design/Components.scss';
import React, { FC } from 'react';

export interface FileAttachmentProps {
    displayName: string;
    attachmentUrl: string;
    imageUrl: string;
}

const FileAttachment: FC<FileAttachmentProps> = ({ displayName, attachmentUrl, imageUrl }: FileAttachmentProps) => (
    <section className="file-attachment">
        <div className="file-attachment-thumbnail">
            <a aria-hidden="true" href={attachmentUrl}>
                <img alt="" src={imageUrl} />
            </a>
        </div>
        <div>
            <a href={attachmentUrl} className="govuk-link govuk-!-font-size-27">
                {displayName}
            </a>
            <p className="file-attachment-metadata">
                <abbr title="Portable Document Format">PDF</abbr>
            </p>
        </div>
    </section>
);

export default FileAttachment;
