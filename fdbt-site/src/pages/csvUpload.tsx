import '../design/Pages.scss';
import React from 'react';
import { NextPage } from 'next';
import Layout from '../layout/Layout';

const title = 'CSV Upload Method - Fares data build tool';
const description = 'CSV Upload page of the Fares data build tool';

const CsvUpload: NextPage = () => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <form action="/api/csvUpload" method="post">
                <div className="govuk-form-group">
                    <fieldset className="govuk-fieldset" aria-describedby="changed-name-hint">
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--xl">
                            <h1 className="govuk-fieldset__heading">CSV Upload page</h1>
                        </legend>
                    </fieldset>
                    <div className="govuk-form-group">
                        <label className="govuk-label" htmlFor="file-upload-1">
                            Upload a CSV file
                        </label>
                        <input className="govuk-file-upload" id="file-upload-1" name="file-upload-1" type="file" />
                    </div>
                </div>
                <input
                    type="submit"
                    value="Continue"
                    id="continue-button"
                    className="govuk-button govuk-button--start"
                />
            </form>
        </main>
    </Layout>
);

CsvUpload.getInitialProps = async () => {
    return {};
};

export default CsvUpload;
