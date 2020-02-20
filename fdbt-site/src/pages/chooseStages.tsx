import '../design/Pages.scss';
import React, { ReactElement } from 'react';
import { NextPage } from 'next';
import Layout from '../layout/Layout';

const title = 'Choose Stages - Fares data build tool';
const description = 'Choose Stages page of the Fares data build tool';

const ChooseStages: NextPage = (): ReactElement => (
    <Layout title={title} description={description}>
        <main className="govuk-main-wrapper app-main-class" id="main-content" role="main">
            <div className="govuk-body-l">
                <h1 className="govuk-fieldset__heading" id="page-heading">
                    ChooseStages
                </h1>
            </div>

            <a
                href="/stageNames"
                role="button"
                draggable="false"
                className="govuk-button govuk-button--start"
                data-module="govuk-button"
                id="start-now-button"
            >
                Start now
                <svg
                    className="govuk-button__start-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="17.5"
                    height="19"
                    viewBox="0 0 33 40"
                    role="presentation"
                    focusable="false"
                >
                    <path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" />
                </svg>
            </a>
        </main>
    </Layout>
);

export default ChooseStages;
