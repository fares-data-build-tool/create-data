/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { ReactElement, useEffect, useState } from 'react';
import { getSessionAttribute, updateSessionAttribute } from '../utils/sessions';
import {
    MULTIPLE_OPERATOR_ATTRIBUTE,
    MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
    MULTI_OP_TXC_SOURCE_ATTRIBUTE,
} from '../constants/attributes';
import { isMultiOperatorInfoWithErrors } from '../interfaces/typeGuards';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import { FullColumnLayout } from '../layout/Layout';
import { BaseLayout } from '../layout/Layout';

import {
    getServicesByNocCodeAndDataSource,
    getAllServicesByNocCode,
    geServiceDataSource,
    updateTimeRestriction,
} from '../data/auroradb';
import {
    ErrorInfo,
    NextPageContextWithSession,
    MultiOperatorInfo,
    ServicesInfo,
    MultipleOperatorsAttribute,
    TxcSourceAttribute,
} from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import { getCsrfToken } from '../utils';
import { redirectTo } from '../utils/apiUtils';
import { SelectedService, SelectedServiceWithNocCode } from 'fdbt-types/matchingJsonTypes';
import Services from './products/services';
import service from './api/service';
import e from 'express';
import { conditionalRadioWithEmptyDateInput } from 'tests/testData/mockData';

const pageTitle = 'Multiple Operators Service List - Create Fares Data Service';
const pageDescription = 'Multiple Operators Service List selection page of the Create Fares Data Service';

interface MultipleOperatorsServiceListProps {
    preMultiOperatorData: MultiOperatorInfo[];
    // serviceList: ServicesInfo[];
    // buttonText: string;
    errors: ErrorInfo[];
    // operatorName: string;
    // nocCode: string;
    // dataSourceAttribute: TxcSourceAttribute;
    csrfToken: string;
}

export const showSelectedOperators = (
    multiOperatorData: MultiOperatorInfo[],
    setMultiOperatorData: React.Dispatch<React.SetStateAction<MultiOperatorInfo[]>>,
    activeOperator,
    setActiveOperator,
    removeServices,
): ReactElement => {
    const test = activeOperator.name === 'Blackpool Transport' ? true : false;
    console.log('!!!!!!!!!!!!!!!!!!!!!', test);

    // useEffect() => {

    // ,[]}
    console.log(multiOperatorData, typeof multiOperatorData);
    const operatorsList = multiOperatorData.map((operator) => operator.name);
    // addEventListener('toggle', (event) => {});
    const handleOperatorChange = (event, index: number) => {
        // event.preventDefault();
        // const details = document.querySelector(`#details-${activeOperator.nocCode}`);
        // console.log(details);
        // details?.setAttribute('open', '');
        setActiveOperator(multiOperatorData[index]);
    };
    return (
        <div className="">
            <table className="border-collapse govuk-!-width-full">
                <caption className={`govuk-table__caption govuk-table__caption--m `}>Selected Services(s)</caption>
                <thead className="selectedOperators-header-color">
                    <tr>
                        <th
                            scope="col"
                            className={`left-padding govuk-table__header govuk-table__caption--s govuk-!-font-size-16`}
                        >
                            {operatorsList.length} added
                        </th>
                        <th scope="cor" className="govuk-table__header text-align-right"></th>
                    </tr>
                </thead>
                <tbody className="govuk-table__body">
                    {multiOperatorData.map((operator, index) => (
                        <tr key={`selected-operator-${index}`}>
                            <td className="govuk-label govuk-!-font-size-16 govuk-!-padding-top-1" key={`td0-${index}`}>
                                <details
                                    id={`details-${operator.nocCode}`}
                                    className="govuk-details margin-bottom-0"
                                    data-module="govuk-details"
                                >
                                    <summary
                                        className="govuk-details__summary width-x"
                                        role="button"
                                        onClick={(event) => handleOperatorChange(event, index)}
                                    >
                                        <span className="govuk-details__summary-text"> {operator.name}</span>
                                    </summary>
                                    <div className="govuk-details__text">
                                        <button
                                            id="removeAll"
                                            className="selectedOperators-button button-link govuk-!-margin-left-2"
                                            onClick={(event) => removeServices(event, '0', operator.nocCode, true)}
                                            name="removeOperator"
                                        >
                                            Remove all
                                        </button>
                                        {operator.services?.map((service, index) => {
                                            const checkboxTitles =
                                                operator.dataSource === 'tnds'
                                                    ? `${service.lineName} - ${service.description}`
                                                    : `${service.lineName} ${service.origin || 'N/A'} - ${
                                                          service.destination || 'N/A'
                                                      }`;

                                            if (service.selected) {
                                                return (
                                                    <div className="govuk-grid-row" key={index}>
                                                        <div className="govuk-grid-column-three-quarters">
                                                            {checkboxTitles}
                                                        </div>
                                                        <div className="govuk-grid-column-one-quarter">
                                                            <button
                                                                id={`remove-${index}`}
                                                                className="govuk-link button-link"
                                                                onClick={(event) =>
                                                                    removeServices(
                                                                        event,
                                                                        service.lineId,
                                                                        operator.nocCode,
                                                                    )
                                                                }
                                                                name="removeOperator"
                                                                value="2C Zhaishi Miaozu Dongzuxiang - Bimbaletes Aguascalientes (El Ãlamo)"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            } else {
                                                return null;
                                            }
                                        })}
                                    </div>
                                </details>
                            </td>
                            <td className="govuk-link text-align-right" key={`td1-${index}`}></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const MultipleOperatorsServiceList = ({
    preMultiOperatorData,
    csrfToken,
    errors,
}: // dataSourceAttribute,
MultipleOperatorsServiceListProps): ReactElement => {
    const seen: string[] = [];
    const buttonText = 'value';
    const testobj = [
        {
            nocCode: 'B1',
            name: 'B1 name',
            dataSource: 'dataSource',
            services: [1, 3, 4],
            selectedServices: [],
        },
        {
            nocCode: 'c1',
            name: 'c1 name',
            dataSource: 'dataSource',
            services: [2, 4, 6],
            selectedServices: [],
        },
    ];
    const [testOB, setTest] = useState(testobj);

    testOB.find((item) => item.nocCode === 'c1');

    const operatorsList = preMultiOperatorData.map((item) => item.name);

    const [multiOperatorData, setMultiOperatorData] = useState(preMultiOperatorData);
    const [activeOperator, setActiveOperator] = useState(multiOperatorData[0]);
    const [updateOperator, setUpdateOperator] = useState(activeOperator);

    let index = testOB
        .map(function (e) {
            return e.name;
        })
        .indexOf('c1 name');

    const addServices = (event, lineId: string, all?) => {
        const newService: SelectedService = [];

        activeOperator.services.forEach((service) => {
            if (all) {
                const addOrRemoveAll = all == 'addAll' ? (service.selected = true) : (service.selected = false);
                console.log('REMOVE ALLLLLLL');
            } else {
                if (service.lineId === lineId) {
                    service.selected = !service.selected;
                }
            }
            newService.push(service);
        });

        const newActiveoperator = { ...activeOperator, services: newService };
        setActiveOperator(newActiveoperator);
        const activeOperatorIndex = multiOperatorData.findIndex(
            (newActiveoperator) => newActiveoperator.nocCode === activeOperator.nocCode,
        );

        const newSomething = multiOperatorData;
        newSomething[activeOperatorIndex] = newActiveoperator;
        setMultiOperatorData(multiOperatorData);
        event.preventDefault();
    };
    const removeServices = (event, lineId: string, nocCode: string, all = false) => {
        const newService: SelectedService = [];

        const operatorToRemoveServiceFromIndex = multiOperatorData.findIndex(
            (newActiveoperator) => newActiveoperator.nocCode === nocCode,
        );
        const operatorToRemoveServiceFrom = multiOperatorData[operatorToRemoveServiceFromIndex];
        operatorToRemoveServiceFrom.services.forEach((service) => {
            if (all) {
                service.selected = false;
            } else {
                if (service.lineId === lineId) {
                    service.selected = !service.selected;
                }
            }
            newService.push(service);
        });
        const newOperator = { ...operatorToRemoveServiceFrom, services: newService };
        setUpdateOperator(newOperator);
        const newSomething = multiOperatorData;
        newSomething[operatorToRemoveServiceFromIndex] = newOperator;
        setMultiOperatorData(newSomething);
        event.preventDefault();
    };

    return (
        <BaseLayout title={pageTitle} description={pageDescription}>
            {/* removed as TNDS is being disabled until further notice */}
            {/* <SwitchDataSource
            dataSourceAttribute={dataSourceAttribute}
            pageUrl="/multipleOperatorsServiceList"
            attributeVersion="multiOperator"
            csrfToken={csrfToken}
        /> */}

            <CsrfForm action="/api/multipleOperatorsServiceList" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={errors} />
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset">
                            <div>
                                <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                                    <h1 className="govuk-heading-l" id="service-list-page-heading">
                                        Which of your services is the ticket valid for?
                                    </h1>
                                </legend>

                                <span className="govuk-heading-s">{`Select all services that apply for ${activeOperator.name} `}</span>
                                <span className="govuk-hint" id="txc-hint">
                                    This data is taken from the{' '}
                                    <b>
                                        {activeOperator.dataSource === 'tnds'
                                            ? 'Traveline National Dataset (TNDS)'
                                            : 'Bus Open Data Service (BODS)'}
                                    </b>
                                    . If the service you are looking for is not listed, contact the BODS help desk for
                                    advice <a href="/contact">here</a>.
                                </span>
                            </div>
                            <div className="govuk-grid-row">
                                <div className="govuk-grid-column-two-thirds">
                                    <input
                                        type=""
                                        name="selectAll"
                                        value="Select All"
                                        onClick={(event) => addServices(event, '0', 'addAll')}
                                        id="select-all-button"
                                        className="govuk-button govuk-button--secondary"
                                    />
                                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                                        <h1 className="govuk-heading-s" id="service-list-page-heading">
                                            {`${activeOperator.name}`}
                                        </h1>
                                    </legend>

                                    <FormElementWrapper
                                        errors={errors}
                                        errorId="checkbox-0"
                                        errorClass=""
                                        addFormGroupError={false}
                                    >
                                        <div className="govuk-checkboxes">
                                            {activeOperator.services.map((service, index) => {
                                                const {
                                                    lineName,
                                                    lineId,
                                                    serviceCode,
                                                    description,
                                                    selected,
                                                    origin,
                                                    destination,
                                                } = service;
                                                const nocCode = activeOperator.nocCode;

                                                const checkboxTitles =
                                                    activeOperator.dataSource === 'tnds'
                                                        ? `${lineName} - ${description}`
                                                        : `${lineName} ${origin || 'N/A'} - ${destination || 'N/A'}`;
                                                const checkBoxValues = `${description}`;
                                                if (!selected) {
                                                    return (
                                                        <div
                                                            className="govuk-checkboxes__item"
                                                            key={`checkbox-item-${index}`}
                                                        >
                                                            <label
                                                                id={`operator-to-add-${index}`}
                                                                // eslint-disable-next-line jsx-a11y/aria-role
                                                                role="input"
                                                                className="govuk-label govuk-checkboxes__label"
                                                                htmlFor={`add-operator-checkbox-${index}`}
                                                                name={`${nocCode}#${lineName}#${lineId}#${serviceCode}`}
                                                                onClick={(event) => addServices(event, service.lineId)}
                                                            >
                                                                {checkboxTitles}
                                                            </label>
                                                        </div>
                                                    );
                                                } else {
                                                    return null;
                                                }
                                            })}
                                        </div>
                                    </FormElementWrapper>
                                </div>
                                <div className="govuk-grid-column-one-third ">
                                    {showSelectedOperators(
                                        multiOperatorData,
                                        setMultiOperatorData,
                                        activeOperator,
                                        setActiveOperator,
                                        removeServices,
                                    )}
                                    <input
                                        type="submit"
                                        value="Confirm services and continue"
                                        id="continue-button"
                                        className="govuk-button govuk-!-width-full"
                                    />
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </>
            </CsrfForm>
        </BaseLayout>
    );
};

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: MultipleOperatorsServiceListProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const searchedOperators = (getSessionAttribute(ctx.req, MULTIPLE_OPERATOR_ATTRIBUTE) as MultipleOperatorsAttribute)
        .selectedOperators;

    const completedOperatorInfo = getSessionAttribute(ctx.req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE);

    // {"searchedOperators":[{"nocCode":"BLAC","name":"Blackpool Transport"},{"nocCode":"LNUD","name":"Testing another compnay"}]}
    const dataSourceAttribute = async (nocCode) => {
        const services = await geServiceDataSource(nocCode);
        const hasBodsServices = services.some((service) => service.dataSource && service.dataSource === 'bods');

        return {
            source: hasBodsServices ? 'bods' : 'tnds',
            hasBods: hasBodsServices,
            hasTnds: false,
        };
    };

    const multiOperatorData = await Promise.all(
        searchedOperators.map(async (operator): Promise<MultiOperatorInfo> => {
            const dataSource = (await dataSourceAttribute(operator.nocCode)).source;
            const dbServices = await getServicesByNocCodeAndDataSource(operator.nocCode, dataSource);
            return {
                nocCode: operator.nocCode,
                name: operator.name,
                dataSource: dataSource,
                services: dbServices.map((obj) => ({ ...obj, selected: false })),
            };
        }),
    );

    return {
        props: {
            preMultiOperatorData: multiOperatorData,
            errors: isMultiOperatorInfoWithErrors(completedOperatorInfo) ? completedOperatorInfo.errors : [],
            csrfToken,
        },
    };
};

export default MultipleOperatorsServiceList;
