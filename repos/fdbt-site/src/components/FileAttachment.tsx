import Link from 'next/link';
import React, { FC } from 'react';

interface FileAttachmentProps {
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
}: FileAttachmentProps) => {
    // eslint-disable-next-line no-console
    console.log(attachmentUrl);
    return (
        <section className="file-attachment">
            <div className="file-attachment-thumbnail">
                <Link href={attachmentUrl} download tabIndex={-1} aria-hidden>
                    <img alt="" src={imageUrl} tabIndex={-1} aria-hidden />
                </Link>
            </div>
            <div>
                <Link href={attachmentUrl} className="govuk-link govuk-!-font-size-14" download>
                    {displayName}
                </Link>
                <p className="file-attachment-metadata govuk-!-font-size-10">
                    <abbr title="File">
                        {attachmentUrl.substring(attachmentUrl.length - 3).toUpperCase()}, {size}
                    </abbr>
                </p>
            </div>
        </section>
    );
};

export default FileAttachment;
