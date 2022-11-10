/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { ReactElement, useState } from 'react';
import { getSessionAttribute } from '../utils/sessions';
import {
    MULTIPLE_OPERATOR_ATTRIBUTE,
    MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE,
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
} from '../constants/attributes';
import { isMultiOperatorInfoWithErrors, isMultiOperatorMultipleServicesTicket } from '../interfaces/typeGuards';
import ErrorSummary from '../components/ErrorSummary';
import { BaseLayout } from '../layout/Layout';
import { getOperatorGroupByNocAndId, getServicesByNocCodeAndDataSourceWithGrouping } from '../data/auroradb';
import { ErrorInfo, NextPageContextWithSession, MultiOperatorInfo, Operator } from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import { getAndValidateNoc, getCsrfToken } from '../utils';
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
        (lineId: string, nocCode: string, removeAll: boolean): void;
    },
): ReactElement => {
    const operatorsList = multiOperatorData.map((operator) => operator.name);

    return (
        <div>
            <table className="border-collapse govuk-!-width-full">
                <caption className={`govuk-table__caption govuk-table__caption--m `}>Selected Services(s)</caption>
                <thead className="selectedOperators-header-color">
                    <tr>
                        <th
                            scope="col"
                            className="govuk-!-padding-left-2 govuk-table__header govuk-table__caption--s govuk-!-font-size-16"
                        >
                            {operatorsList.length} added
                        </th>
                        <th scope="col" className="govuk-table__header text-align-right"></th>
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
                                    open={activeOperator.nocCode === operator.nocCode}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveOperator(operator);
                                    }}
                                >
                                    <summary
                                        className="govuk-details__summary width-x"
                                        role="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveOperator(operator);
                                        }}
                                    >
                                        <span className="govuk-details__summary-text">{operator.name}</span>
                                    </summary>
                                    <div className="govuk-details__text">
                                        <button
                                            id="removeAll"
                                            className="govuk-!-margin-right-2 button-link"
                                            onClick={() => removeServices('0', operator.nocCode, true)}
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
                                                    <>
                                                        <div
                                                            className="govuk-grid-row govuk-!-margin-bottom-2"
                                                            key={index}
                                                        >
                                                            <div className="govuk-grid-column-three-quarters govuk-!-margin-top-2">
                                                                {checkboxTitles}
                                                            </div>
                                                            <div className="govuk-grid-column-one-quarter govuk-!-margin-top-2">
                                                                <button
                                                                    id={`remove-from-${operator.nocCode}-${index}`}
                                                                    className="govuk-link button-link"
                                                                    onClick={() =>
                                                                        removeServices(
                                                                            service.lineId,
                                                                            operator.nocCode,
                                                                            false,
                                                                        )
                                                                    }
                                                                    name="removeOperator"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <hr className="govuk-section-break govuk-section-break--visible" />
                                                    </>
                                                );
                                            } else {
                                                return null;
                                            }
                                        })}
                                    </div>
                                </details>
                            </td>
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
    const [updatedOperator, setUpdatedOperator] = useState(activeOperator);

    const addServices = (lineId: string, addAll: boolean) => {
        const newServices: ServiceWithNocCode[] = [];

        activeOperator.services.forEach((service: ServiceWithNocCode) => {
            if (addAll) {
                service.selected = true;
            } else {
                if (service.lineId === lineId) {
                    service.selected = !service.selected;
                }
            }
            newServices.push(service);
        });

        const newActiveoperator = { ...activeOperator, services: newServices };
        setActiveOperator(newActiveoperator);
        const activeOperatorIndex = multiOperatorData.findIndex(
            (newActiveoperator) => newActiveoperator.nocCode === activeOperator.nocCode,
        );

        multiOperatorData[activeOperatorIndex] = newActiveoperator;
        setMultiOperatorData(multiOperatorData);
    };

    const removeServices = (lineId: string, nocCode: string, removeAll: boolean) => {
        const newService: ServiceWithNocCode[] = [];

        const operatorToRemoveServiceFromIndex = multiOperatorData.findIndex(
            (newActiveoperator) => newActiveoperator.nocCode === nocCode,
        );
        const operatorToRemoveServiceFrom = multiOperatorData[operatorToRemoveServiceFromIndex];
        operatorToRemoveServiceFrom.services.forEach((service) => {
            if (removeAll) {
                service.selected = false;
            } else {
                if (service.lineId === lineId) {
                    service.selected = false;
                }
            }
            newService.push(service);
        });
        let newOperator = updatedOperator;
        newOperator = { ...operatorToRemoveServiceFrom, services: newService };
        setUpdatedOperator(newOperator);

        multiOperatorData[operatorToRemoveServiceFromIndex] = newOperator;
        setMultiOperatorData(multiOperatorData);
    };

    return (
        <BaseLayout title={pageTitle} description={pageDescription}>
            <ErrorSummary errors={errors} />
            <div className={errors.length > 0 ? 'govuk-form-group--error' : ''}>
                <div>
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
                        <h1 className="govuk-heading-l" id="service-list-page-heading">
                            Which of your services is the ticket valid for?
                        </h1>
                    </legend>

                    <span className="govuk-heading-s">{`Select all services that apply for ${activeOperator.name} `}</span>
                    <span className="govuk-hint" id="txc-hint">
                        This data is taken from the <b>Bus Open Data Service (BODS)</b>. If the service you are looking
                        for is not listed, contact the BODS help desk for advice <a href="/contact">here</a>.
                    </span>
                </div>
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-two-thirds">
                        <button
                            onClick={() => addServices('0', true)}
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
                                                onClick={() => addServices(service.lineId, false)}
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
                                            return <></>;
                                        }
                                    });
                                    return selectedServices;
                                })}

                                <input
                                    id="operator-count"
                                    name="operatorCount"
                                    type="hidden"
                                    value={`${multiOperatorData.length}`}
                                />

                                <input
                                    type="submit"
                                    value="Confirm services and continue"
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
    const noc = getAndValidateNoc(ctx);
    const searchedOperatorsAttribute = getSessionAttribute(ctx.req, MULTIPLE_OPERATOR_ATTRIBUTE);
    let selectedOperators: Operator[] = [];
    const ticket = getSessionAttribute(ctx.req, MATCHING_JSON_ATTRIBUTE);
    const matchingJsonMetaData = getSessionAttribute(ctx.req, MATCHING_JSON_META_DATA_ATTRIBUTE);

    const editMode = ticket && matchingJsonMetaData;

    if (!searchedOperatorsAttribute) {
        if (!editMode || !isMultiOperatorMultipleServicesTicket(ticket)) {
            throw new Error('In edit mode but missing data.');
        }

        const operatorGroupFromDb = await getOperatorGroupByNocAndId(Number(ticket.operatorGroupId), noc);

        if (!operatorGroupFromDb) {
            throw new Error('Group of operators not found in database');
        }

        selectedOperators = operatorGroupFromDb.operators;
    } else {
        selectedOperators = searchedOperatorsAttribute.selectedOperators;
    }

    const completedOperatorInfo = getSessionAttribute(ctx.req, MULTIPLE_OPERATORS_SERVICES_ATTRIBUTE);

    let multiOperatorData = await Promise.all(
        selectedOperators.map(async (operator): Promise<MultiOperatorInfo> => {
            const dbServices = await getServicesByNocCodeAndDataSourceWithGrouping(operator.nocCode, 'bods');

            return {
                nocCode: operator.nocCode,
                name: operator.name,
                services: dbServices.map((service) => ({ ...service, selected: false })),
            };
        }),
    );
    const updateMultiOperatorDataWithSelectedServices = (
        multiOperatorDataToUpdate: MultiOperatorInfo[],
        multiOperatorDataWithSelectedServices: MultiOperatorInfo[],
    ) => {
        multiOperatorDataWithSelectedServices.forEach((operator) => {
            const findMatchingOperatorIndex = multiOperatorDataToUpdate.findIndex(
                (operatorInfo) => operatorInfo.nocCode === operator.nocCode,
            );
            let newServices: ServiceWithNocCode[] = [];
            multiOperatorDataToUpdate[findMatchingOperatorIndex].services.forEach((el) => {
                operator.services.forEach((el2) => {
                    if (el.lineId === el2.lineId) {
                        el.selected = true;
                    }
                    newServices.push(el);
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

    if (completedOperatorInfo && !isMultiOperatorInfoWithErrors(completedOperatorInfo)) {
        const selectedServicesFromSession = Object.values(completedOperatorInfo);
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
