import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPage } from 'next';
import Layout from '../layout/Layout';

const title = 'CSV Upload Method - Fares data build tool';
const description = 'CSV Upload page of the Fares data build tool';

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
            <div>
                <p>
                    <a href="assets/files/How to Upload a Fares Triangle.pdf" className="govuk-link" download>
                        Download Help File
                    </a>
                </p>
                <p>
                    <a href="assets/files/Fares Triangle Example.csv" className="govuk-link" download>
                        Download Fares Triangle CSV Example
                    </a>
                </p>
            </div>
        </main>
    </Layout>
);

export default CsvUpload;
