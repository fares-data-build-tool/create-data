import '../design/Components.scss';
import React, { FC } from 'react';

export interface FileAttachmentProps {
    displayName: string;
    attachmentUrl: string;
    imageUrl: string;
    size: string;
}

const FileAttachment: FC<FileAttachmentProps> = ({
    displayName,
    attachmentUrl,
    imageUrl,
    size,
}: FileAttachmentProps) => (
    <section className="file-attachment">
        <div className="file-attachment-thumbnail">
            <a aria-hidden="true" href={attachmentUrl}>
                <img alt="" src={imageUrl} />
            </a>
        </div>
        <div>
            <a href={attachmentUrl} className="govuk-link govuk-!-font-size-14">
                {displayName}
            </a>
            <p className="file-attachment-metadata govuk-!-font-size-10">
                <abbr title="File">
                    {attachmentUrl.substr(attachmentUrl.length - 3).toUpperCase()},{size}
                </abbr>
            </p>
        </div>
    </section>
);

export default FileAttachment;
