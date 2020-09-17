import React, { ReactElement } from 'react';
import { FareStage, UserFareStages } from '../data/s3';
import { Stop } from '../data/auroradb';
import { formatStopName } from '../utils';

interface MatchingListProps {
    userFareStages: UserFareStages;
    stops: Stop[];
    selectedFareStages: string[];
}

const getStopItems = (userFareStages: UserFareStages, stops: Stop[], selectedFareStages: string[]): ReactElement[] => {
    const stopItems: ReactElement[] = stops.map((stop, index) => {
        let selectValue = '';

        userFareStages.fareStages.map((stage: FareStage) => {
            const currentValue = JSON.stringify({ stop, stage: stage.stageName });

            const isSelected = selectedFareStages.some(selectedObject => {
                return selectedObject === currentValue;
            });

            if (isSelected) {
                selectValue = currentValue;
            }

            return null;
        });

        return (
            <tr key={stop.atcoCode} className="govuk-table__row">
                <td className="govuk-table__cell stop-cell" id={`stop-${index}`}>
                    {formatStopName(stop)}
                </td>
                <td className="govuk-table__cell naptan-cell" id={`naptan-${index}`}>
                    {stop.naptanCode}
                </td>
                <td className="govuk-table__cell stage-cell">
                    <select
                        className="govuk-select farestage-select"
                        id={`option-${index}`}
                        name={`option-${index}`}
                        defaultValue={selectValue}
                        aria-labelledby={`stop-name-header stop-${index} naptan-code-header naptan-${index}`}
                    >
                        <option value="">Not Applicable</option>
                        {userFareStages.fareStages.map((stage: FareStage) => {
                            return (
                                <option key={stage.stageName} value={JSON.stringify({ stop, stage: stage.stageName })}>
                                    {stage.stageName}
                                </option>
                            );
                        })}
                    </select>
                </td>
            </tr>
        );
    });
    return stopItems;
};

const MatchingList = ({ userFareStages, stops, selectedFareStages }: MatchingListProps): ReactElement => (
    <table className="govuk-table">
        <thead className="govuk-table__head">
            <tr className="govuk-table__row">
                <th scope="col" className="govuk-table__header govuk-!-width-one-half" id="stop-name-header">
                    Stop name
                </th>
                <th scope="col" className="govuk-table__header govuk-!-width-one-quarter" id="naptan-code-header">
                    Naptan code
                </th>
                <th scope="col" className="govuk-table__header govuk-!-width-one-quarter" id="fare-stage-header">
                    Fare stage
                </th>
            </tr>
        </thead>
        <tbody className="govuk-table__body">{getStopItems(userFareStages, stops, selectedFareStages)}</tbody>
    </table>
);

export default MatchingList;
