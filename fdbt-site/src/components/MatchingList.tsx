import React, { ReactElement } from 'react';
import { FareStage, UserFareStages } from '../data/s3';
import { Stop } from '../data/auroradb';
import { formatStopName } from '../utils';

interface MatchingListProps {
    userFareStages: UserFareStages;
    stops: Stop[];
}

const MatchingList = ({ userFareStages, stops }: MatchingListProps): ReactElement => {
    return (
        <div>
            <div className="matching-wrapper">
                <div className="govuk-heading-s matching-stop-header">Stop name</div>
                <div className="govuk-heading-s naptan-code-header">Naptan code</div>
                <div className="govuk-heading-s fare-stage-header">Fare stage</div>
            </div>
            {stops.map((stop, index) => (
                <fieldset key={stop.atcoCode} className="govuk-fieldset">
                    <div className="matching-wrapper">
                        <label className="govuk-label matching-stop-name" htmlFor={`option${index}`}>
                            {formatStopName(stop)}
                        </label>
                        <label className="govuk-label naptan-code" htmlFor={`option${index}`}>
                            {stop.naptanCode}
                        </label>
                        <div className="farestage-select-wrapper">
                            <select
                                className="govuk-select farestage-select"
                                id={`option${index}`}
                                name={`option${index}`}
                            >
                                <option value="">Not Applicable</option>

                                {userFareStages.fareStages.map((stage: FareStage) => (
                                    <option
                                        key={stage.stageName}
                                        value={JSON.stringify({ stop, stage: stage.stageName })}
                                    >
                                        {stage.stageName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>
            ))}
        </div>
    );
};

export default MatchingList;
