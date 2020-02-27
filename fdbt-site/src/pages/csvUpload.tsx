import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPage } from 'next';
import Layout from '../layout/Layout';
import FileAttachment from '../components/FileAttachment';

const title = 'CSV Upload Method - Fares data build tool';
const description = 'CSV Upload page of the Fares data build tool';

const CsvUpload: NextPage = (): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                <h1 className="govuk-fieldset__heading" aria-describedby="changed-name-hint">
                    Please select your file to upload
                </h1>
            </legend>
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <form action="/api/csvUpload" method="post" encType="multipart/form-data">
                        <div className="govuk-form-group input-form">
                            <fieldset className="govuk-fieldset">
                                <label className="govuk-label" htmlFor="service">
                                    Upload a CSV file
                                </label>
                            </fieldset>
                            <div className="govuk-form-group">
                                <label className="govuk-label" htmlFor="file-upload-1">
                                    <input
                                        className="govuk-file-upload"
                                        id="file-upload-1"
                                        name="file-upload-1"
                                        type="file"
                                        accept=".csv"
                                    />
                                </label>
                            </div>
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
                        <h1 className="govuk-fieldset__heading">Documents</h1>
                    </legend>
                    <FileAttachment
                        displayName="Download Help File"
                        attachmentUrl="/assets/files/How-to-Upload-a-Fares-Triangle.pdf"
                        imageUrl="/assets/images/Guidance-doc-front-page.png"
                        size="1.3MB"
                    />
                    <FileAttachment
                        displayName="Download Fares Triangle CSV Example"
                        attachmentUrl="/assets/files/Fares-Triangle-Example.csv"
                        imageUrl="/assets/images/csv.png"
                        size="325B"
                    />
                </div>
            </div>
        </main>
    </Layout>
);

export default CsvUpload;
