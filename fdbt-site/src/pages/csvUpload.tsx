import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPage } from 'next';
import Layout from '../layout/Layout';

const title = 'CSV Upload Method - Fares data build tool';
const description = 'CSV Upload page of the Fares data build tool';
const image = require('../../public/assets/images/Guidance-doc-front-page-3.png');

const CsvUpload: NextPage = (): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/csvUpload" method="post" encType="multipart/form-data">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading" aria-describedby="changed-name-hint">
                                Please select your file to upload
                            </h1>
                        </legend>
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
            <section className="file-attachment">
                <div className="file-attachment-thumbnail">
                    <a aria-hidden="true" href="assets/files/How to Upload a Fares Triangle.pdf"><img alt="" src={image} /></a>
                </div>
                <div>
                    <a href="assets/files/How to Upload a Fares Triangle.pdf" className="govuk-link govuk-!-font-size-27">Download Help File</a>
                    <p className="file-attachment-metadata">
                        <abbr title="Portable Document Format">PDF</abbr>
                    </p>
                </div>
            </section>
            <section className="file-attachment">
                <div className="file-attachment-thumbnail">
                    <a aria-hidden="true" href="assets/files/How to Upload a Fares Triangle.pdf"><img alt="" src={image} /></a>
                </div>
                <div>
                    <a href="assets/files/How to Upload a Fares Triangle.pdf" className="govuk-link govuk-!-font-size-27">Download Fares Triangle CSV Example</a>
                    <p className="file-attachment-metadata">
                        <abbr title="Portable Document Format">PDF</abbr>
                    </p>
                </div>
            </section>
        </main>
    </Layout>
);

export default CsvUpload;
