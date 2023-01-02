import React, { ReactElement, useState } from 'react';
import BackButton from '../components/BackButton';
import { StopItem } from '../components/MatchingBase';
import { batchGetStopsByAtcoCode, getServiceByIdAndDataSource } from '../data/auroradb';
import {
    removeDuplicateAdjacentStops,
    sortingWithoutSequenceNumbers,
    validateSequenceNumbers,
} from '../utils/apiUtils/matching';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import { MATCHING_JSON_ATTRIBUTE, MATCHING_JSON_META_DATA_ATTRIBUTE } from '../constants/attributes';
import { ErrorInfo, NextPageContextWithSession } from '../interfaces';
import { ReturnTicket, SingleTicket, Stop, WithIds } from '../interfaces/matchingJsonTypes';
import { FullColumnLayout } from '../layout/Layout';
import { formatStopName, getAndValidateNoc, getCsrfToken, isReturnTicket } from '../utils';
import { getSessionAttribute } from '../utils/sessions';

const title = 'Edit fare stages - Create Fares Data Service ';
const description = 'Edit fare stages page of the Create Fares Data Service';
const errorId = 'radio-option-single';

interface EditStagesProps {
    fareStages: string[];
    errors: ErrorInfo[];
    csrfToken: string;
    stops: Stop[];
    backHref: string;
    selectedFareStages: {};
}

const getFareStagesFromTicket = (ticket: WithIds<SingleTicket> | WithIds<ReturnTicket>): string[] => {
    if (isReturnTicket(ticket)) {
        return ticket.outboundFareZones.map((fareZone) => fareZone.name);
    }

    return (ticket as WithIds<SingleTicket>).fareZones.map((fareZone) => fareZone.name);
};

const getSelectedFareStagesFromTicket = (
    ticket: WithIds<SingleTicket> | WithIds<ReturnTicket>,
): { [key: string]: string } => {
    const obj: { [key: string]: string } = {};

    if (isReturnTicket(ticket)) {
        ticket.outboundFareZones.forEach((fareZone) => {
            fareZone.stops.forEach((stop) => {
                obj[stop.atcoCode] = fareZone.name;
            });
        });
    } else {
        (ticket as WithIds<SingleTicket>).fareZones.forEach((fareZone) => {
            fareZone.stops.forEach((stop) => {
                obj[stop.atcoCode] = fareZone.name;
            });
        });
    }
    return obj;
};

const getStopItems = (
    fareStages: string[],
    stops: Stop[],
    selectedFareStages: { [key: string]: string },
): Set<StopItem> => {
    const items = new Set(
        stops.map((stop, index) => {
            let dropdownValue = '';

            if (stop.atcoCode in selectedFareStages) {
                dropdownValue = selectedFareStages[stop.atcoCode];
            }
            return {
                index,
                stopName: formatStopName(stop),
                atcoCode: stop.atcoCode,
                naptanCode: stop.naptanCode,
                dropdownValue,
                stopData: JSON.stringify(stop),
                dropdownOptions: fareStages,
            };
        }),
    );
    return items;
};

const EditFareStageMatching = ({
    fareStages,
    stops,
    errors = [],
    csrfToken,
    backHref,
    selectedFareStages,
}: EditStagesProps): ReactElement => {
    const [selections, updateSelections] = useState<StopItem[]>([]);
    const [stopItems, updateStopItems] = useState(getStopItems(fareStages, stops, selectedFareStages));

    const handleDropdownSelection = (dropdownIndex: number, dropdownValue: string): void => {
        const updatedItems = new Set(
            [...stopItems].map((item) => {
                if (item.index === dropdownIndex) {
                    const updatedItem = { ...item, dropdownValue };

                    if (updatedItem.dropdownValue !== '') {
                        updateSelections([...selections, updatedItem].sort((a, b) => a.index - b.index));
                    }

                    return updatedItem;
                }
                return item;
            }),
        );
        updateStopItems(updatedItems);
    };

    return (
        <FullColumnLayout title={title} description={description} errors={errors}>
            {!!backHref && errors.length === 0 ? <BackButton href={backHref} /> : null}
            <CsrfForm action="/api/editFareStageMatching" method="post" csrfToken={csrfToken} className="matching-page">
                <>
                    <ErrorSummary errors={errors} />
                    <div className={`govuk-form-group ${errors.length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="fare-type-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading" id="fare-type-page-heading">
                                    Match stops to fares stages
                                </h1>
                            </legend>
                            <span className="govuk-hint" id="fare-type-operator-hint">
                                Select a fare stage for each stop.
                            </span>
                            <span className="govuk-hint" id="auto-populate-hint">
                                To assist you with completing this section we have included an auto-complete feature.
                                Assign <b>each</b> fare stage to the <b>first</b> bus stop in the stage and then select
                                the auto-complete button to fill in the gaps. You can also manually match individual
                                stops to fare stages at any point.
                            </span>
                            <span className="govuk-hint" id="traveline-hint">
                                This data has been taken from the Traveline National Dataset and NaPTAN database.
                            </span>
                            <FormElementWrapper errors={errors} errorId={errorId} errorClass="govuk-radios--error">
                                <table className="govuk-table">
                                    <thead className="govuk-table__head">
                                        <tr className="govuk-table__row">
                                            <th
                                                scope="col"
                                                className="govuk-table__header govuk-!-width-one-half"
                                                id="stop-name-header"
                                            >
                                                Stop name
                                            </th>
                                            <th
                                                scope="col"
                                                className="govuk-table__header govuk-!-width-one-quarter"
                                                id="naptan-code-header"
                                            >
                                                Naptan code
                                            </th>
                                            <th
                                                scope="col"
                                                className="govuk-table__header govuk-!-width-one-quarter"
                                                id="fare-stage-header"
                                            >
                                                Fare stage
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="govuk-table__body">
                                        {[...stopItems].map((item) => (
                                            <tr key={item.atcoCode} className="govuk-table__row">
                                                <td className="govuk-table__cell stop-cell" id={`stop-${item.index}`}>
                                                    {item.stopName}
                                                </td>
                                                <td
                                                    className="govuk-table__cell naptan-cell"
                                                    id={`naptan-${item.index}`}
                                                >
                                                    {item.naptanCode}
                                                </td>
                                                <td className="govuk-table__cell stage-cell">
                                                    <select
                                                        className="govuk-select farestage-select"
                                                        id={`option-${item.index}`}
                                                        name={`option-${item.index}`}
                                                        value={item.dropdownValue}
                                                        aria-labelledby={`stop-name-header stop-${item.index} naptan-code-header naptan-${item.index}`}
                                                        onBlur={(e): void =>
                                                            handleDropdownSelection(item.index, e.target.value)
                                                        }
                                                    >
                                                        <option value="" disabled>
                                                            Select a Fare Stage
                                                        </option>
                                                        {item.dropdownOptions.map((option) => {
                                                            return (
                                                                <option key={option} value={option}>
                                                                    {option}
                                                                </option>
                                                            );
                                                        })}
                                                        <option value="notApplicable">Not Applicable</option>
                                                    </select>
                                                    <input
                                                        type="hidden"
                                                        name={`option-${item.index}`}
                                                        value={item.stopData}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </FormElementWrapper>
                        </fieldset>
                    </div>
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </>
            </CsrfForm>
        </FullColumnLayout>
    );
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: EditStagesProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const ticket = getSessionAttribute(ctx.req, MATCHING_JSON_ATTRIBUTE) as
        | WithIds<SingleTicket>
        | WithIds<ReturnTicket>
        | undefined;

    const matchingJsonMetaData = getSessionAttribute(ctx.req, MATCHING_JSON_META_DATA_ATTRIBUTE);

    if (!ticket || !matchingJsonMetaData) {
        throw new Error('Ticket not found in session.');
    }
    const fareStages = getFareStagesFromTicket(ticket);
    const nocCode = getAndValidateNoc(ctx);

    const dataSource = 'bods';
    const serviceId = matchingJsonMetaData.serviceId;
    const service = await getServiceByIdAndDataSource(nocCode, Number(serviceId), dataSource);
    const lineName = service.lineName;

    let direction = 'inbound';

    if (!isReturnTicket(ticket)) {
        direction = (ticket as WithIds<SingleTicket>).journeyDirection;
    } else {
        direction = ticket.outboundFareZones.length > 0 ? 'outbound' : 'inbound';
    }

    // find journey patterns for direction (inbound or outbound)
    const journeyPatterns = service.journeyPatterns.filter((it) => it.direction === direction);

    // get an unordered list of stop points from journey patterns, then removing any duplicates on stopPointRef and sequence number
    const stops = journeyPatterns
        .flatMap((it) => it.orderedStopPoints)
        .filter(
            (stop, index, self) =>
                self.findIndex(
                    (other) => stop.stopPointRef === other.stopPointRef && stop.sequenceNumber === other.sequenceNumber,
                ) === index,
        );

    // building a sorted master stop list according to sequence numbers if they're there and valid
    const sortedStopList = validateSequenceNumbers(stops)
        ? stops.sort((stop, other) => stop.sequenceNumber - other.sequenceNumber).map((it) => it.stopPointRef)
        : sortingWithoutSequenceNumbers(journeyPatterns);

    const masterStopList = removeDuplicateAdjacentStops(sortedStopList);

    if (masterStopList.length === 0) {
        throw new Error(
            `No stops found for journey: nocCode ${nocCode}, lineName: ${lineName}, direction: ${direction}`,
        );
    }

    // filling out stop information from DB
    const naptanInfo = await batchGetStopsByAtcoCode(
        masterStopList.filter((stop, index, self) => self.indexOf(stop) === index),
    );

    // removing any stops that aren't fully fleshed out
    const orderedStops = masterStopList
        .map((atco) => naptanInfo.find((s) => s.atcoCode === atco))
        .filter((stop: Stop | undefined): stop is Stop => stop !== undefined);

    return {
        props: {
            stops: orderedStops,
            fareStages,
            errors: [],
            csrfToken,
            backHref: `/products/productDetails?productId=${matchingJsonMetaData?.productId}${
                matchingJsonMetaData.serviceId ? `&serviceId=${matchingJsonMetaData?.serviceId}` : ''
            }`,
            selectedFareStages: getSelectedFareStagesFromTicket(ticket),
        },
    };
};

export default EditFareStageMatching;
