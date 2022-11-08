/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { ReactElement, useState } from 'react';
import { getSessionAttribute } from '../utils/sessions';
import { MULTIPLE_OPERATOR_ATTRIBUTE, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE } from '../constants/attributes';
import { isMultiOperatorInfoWithErrors } from '../interfaces/typeGuards';
import ErrorSummary from '../components/ErrorSummary';
import { BaseLayout } from '../layout/Layout';

import { geServiceDataSource, getServicesByNocCodeAndDataSourceAndDescription } from '../data/auroradb';
import {
    ErrorInfo,
    NextPageContextWithSession,
    MultiOperatorInfo,
    MultipleOperatorsAttribute,
    MultiOperatorInfoWithErrors,
} from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import { getCsrfToken } from '../utils';
import { ServiceWithNocCode } from 'fdbt-types/matchingJsonTypes';

const pageTitle = 'Multiple Operators Service List - Create Fares Data Service';
const pageDescription = 'Multiple Operators Service List selection page of the Create Fares Data Service';

interface MultipleOperatorsServiceListProps {
    preMultiOperatorData: MultiOperatorInfo[];
    errors: ErrorInfo[];
    csrfToken: string;
}

export const showSelectedOperators = (
    multiOperatorData: MultiOperatorInfo[],
    activeOperator: MultiOperatorInfo,
    setActiveOperator: React.Dispatch<React.SetStateAction<MultiOperatorInfo>>,
    removeServices: {
        (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, lineId: string, nocCode: string, all?: boolean): void;
    },
): ReactElement => {
    const operatorsList = multiOperatorData.map((operator) => operator.name);
    const handleOperatorChange = (_event: React.MouseEvent<HTMLElement, MouseEvent>, index: number) => {
        setActiveOperator(multiOperatorData[index]);
    };
    const shouldBeOpen = (operator: MultiOperatorInfo) => {
        if (operator.name === activeOperator.name) {
            operator.open = true;
        } else if (operator.open == true) {
            operator.open = !operator.open;
        } else {
            operator.open = false;
        }
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
                                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                                    role="button"
                                    id={`details-${operator.nocCode}`}
                                    className="govuk-details margin-bottom-0"
                                    data-module="govuk-details"
                                    open={operator.open}
                                    onClick={() => shouldBeOpen(operator)}
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
                                                    ? `${service.lineName} - ${service.serviceDescription}`
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
                                                                id={`remove-from-${operator.nocCode}-${index}`}
                                                                className="govuk-link button-link"
                                                                onClick={(event) =>
                                                                    removeServices(
                                                                        event,
                                                                        service.lineId,
                                                                        operator.nocCode,
                                                                    )
                                                                }
                                                                name="removeOperator"
                                                                // value="2C Zhaishi Miaozu Dongzuxiang - Bimbaletes Aguascalientes (El Ãlamo)"
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
}: MultipleOperatorsServiceListProps): ReactElement => {
    const [multiOperatorData, setMultiOperatorData] = useState(preMultiOperatorData);
    const [activeOperator, setActiveOperator] = useState(multiOperatorData[0]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [updateOperator, setUpdateOperator] = useState(activeOperator);
    // console.log(updateOperator);

    const addServices = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.MouseEvent<HTMLLabelElement, MouseEvent>,
        lineId: string,
        all?: string,
    ) => {
        const newService: ServiceWithNocCode[] = [];

        activeOperator.services.forEach((service: ServiceWithNocCode) => {
            if (all && all === 'addAll') {
                service.selected = true;
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
    const removeServices = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        lineId: string,
        nocCode: string,
        all = false,
    ) => {
        const newService: ServiceWithNocCode[] = [];

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
        let newOperator = updateOperator;
        newOperator = { ...operatorToRemoveServiceFrom, services: newService };
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

            <ErrorSummary errors={errors} />
            <div className={` ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
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
                        . If the service you are looking for is not listed, contact the BODS help desk for advice{' '}
                        <a href="/contact">here</a>.
                    </span>
                </div>
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-two-thirds">
                        <button
                            onClick={(event) => addServices(event, '0', 'addAll')}
                            id="select-all-button"
                            className="govuk-button govuk-button--secondary"
                        >
                            Select All
                        </button>
                        <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                            <h1 className="govuk-heading-s" id="service-list-page-heading">
                                {`${activeOperator.name}`}
                            </h1>
                        </legend>

                        <div className="govuk-checkboxes">
                            {activeOperator.services.map((service, index) => {
                                const { lineName, serviceDescription, selected, origin, destination } = service;
                                const checkboxTitles =
                                    activeOperator.dataSource === 'tnds'
                                        ? `${lineName} - ${serviceDescription}`
                                        : `${lineName} ${origin || 'N/A'} - ${destination || 'N/A'}`;
                                if (!selected) {
                                    return (
                                        <div className="govuk-checkboxes__item" key={`checkbox-item-${index}`}>
                                            <label
                                                id={`service-to-add-${index}`}
                                                // eslint-disable-next-line jsx-a11y/aria-role, jsx-a11y/no-noninteractive-element-to-interactive-role
                                                role="button"
                                                className="govuk-label govuk-checkboxes__label"
                                                htmlFor={`add-operator-checkbox-${index}`}
                                                // name={`${nocCode}#${lineName}#${lineId}#${serviceCode}`}
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
                    </div>
                    <div className="govuk-grid-column-one-third ">
                        {showSelectedOperators(multiOperatorData, activeOperator, setActiveOperator, removeServices)}
                        <CsrfForm action="/api/multipleOperatorsServiceList" method="post" csrfToken={csrfToken}>
                            <div>
                                {multiOperatorData.map((operator, index) => {
                                    const { nocCode, services } = operator;
                                    const selectedServices = services.map((service, index2) => {
                                        const {
                                            lineName,
                                            lineId,
                                            serviceCode,
                                            serviceDescription,
                                            selected,
                                            startDate,
                                        } = service;
                                        if (selected) {
                                            return (
                                                <input
                                                    key={`service-to-add-${index}-${index2}`}
                                                    id={`add-OP${index}`}
                                                    name={`${nocCode}#${lineName}#${lineId}#${serviceCode}#${serviceCode}#${startDate}`}
                                                    type="hidden"
                                                    value={`${serviceDescription}`}
                                                />
                                            );
                                        } else {
                                            return '';
                                        }
                                    });
                                    return selectedServices;
                                })}
                                {
                                    <input
                                        id="Operator-Count"
                                        name="OperatorCount"
                                        type="hidden"
                                        value={`${multiOperatorData.length}`}
                                    />
                                }
                                <input
                                    type="submit"
                                    value="Confirm services and continue"
                                    name="confirm"
                                    id="continue-button"
                                    className="govuk-button govuk-!-width-full"
                                />
                            </div>
                        </CsrfForm>
                    </div>
                </div>
            </div>
        </BaseLayout>
    );
};

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: MultipleOperatorsServiceListProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const searchedOperators = (getSessionAttribute(ctx.req, MULTIPLE_OPERATOR_ATTRIBUTE) as MultipleOperatorsAttribute)
        .selectedOperators;

    const completedOperatorInfo = getSessionAttribute(
        ctx.req,
        MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
    ) as MultiOperatorInfoWithErrors;
    const dataSourceAttribute = async (nocCode: string) => {
        const services = await geServiceDataSource(nocCode);
        const hasBodsServices = services.some((service) => service.dataSource && service.dataSource === 'bods');

        return {
            source: hasBodsServices ? 'bods' : 'tnds',
            hasBods: hasBodsServices,
            hasTnds: false,
        };
    };

    let multiOperatorData = await Promise.all(
        searchedOperators.map(async (operator): Promise<MultiOperatorInfo> => {
            const dataSource = (await dataSourceAttribute(operator.nocCode)).source;
            const dbServices = await getServicesByNocCodeAndDataSourceAndDescription(operator.nocCode, dataSource);

            return {
                nocCode: operator.nocCode,
                name: operator.name,
                dataSource: dataSource,
                services: dbServices.map((obj) => ({ ...obj, selected: false })) as ServiceWithNocCode[],
            };
        }),
    );
    const updateMultiOperatorDataWithSelectedServices = (
        multiOperatorDataToUpdate: MultiOperatorInfo[],
        MultiOperatorDataWithSelectedServices: MultiOperatorInfo[],
    ) => {
        MultiOperatorDataWithSelectedServices.forEach((operator) => {
            const findMatchingOperatorIndex = multiOperatorDataToUpdate.findIndex(
                (operatorInfo) => operatorInfo.nocCode === operator.nocCode,
            );
            let newServices: ServiceWithNocCode[] = [];
            multiOperatorDataToUpdate[findMatchingOperatorIndex].services.forEach((el) => {
                operator.services.forEach((el2) => {
                    if (el.lineId === el2.lineId) {
                        el.selected = true;
                        newServices.push(el);
                    } else {
                        newServices.push(el);
                    }
                });
            });
            newServices = newServices.filter(
                (value, index, self) =>
                    index === self.findIndex((t) => t.lineId === value.lineId && t.lineName === value.lineName),
            );
            multiOperatorDataToUpdate[findMatchingOperatorIndex].services = newServices;
        });
        return multiOperatorDataToUpdate;
    };

    const previouslySelectedServices = isMultiOperatorInfoWithErrors(completedOperatorInfo)
        ? completedOperatorInfo.multiOperatorInfo
        : [];
    if (previouslySelectedServices.length > 0) {
        multiOperatorData = updateMultiOperatorDataWithSelectedServices(multiOperatorData, previouslySelectedServices);
    }

    const multiOperatorDataSessionData =
        getSessionAttribute(ctx.req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE) || undefined;
    if (multiOperatorDataSessionData && completedOperatorInfo?.errors === undefined) {
        const selectedServicesFromSession = Object.values(multiOperatorDataSessionData);
        multiOperatorData = updateMultiOperatorDataWithSelectedServices(multiOperatorData, selectedServicesFromSession);
    }
    multiOperatorData[0].open = true;
    return {
        props: {
            preMultiOperatorData: multiOperatorData,
            errors: isMultiOperatorInfoWithErrors(completedOperatorInfo) ? completedOperatorInfo.errors : [],
            csrfToken,
        },
    };
};

export default MultipleOperatorsServiceList;
