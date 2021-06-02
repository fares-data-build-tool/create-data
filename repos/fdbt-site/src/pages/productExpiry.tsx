import React, { ReactElement } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TwoThirdsLayout from '../layout/Layout';
import { NextPageContextWithSession } from '../interfaces';
import CsrfForm from '../components/CsrfForm';
import ErrorSummary from '../components/ErrorSummary';
import { getCsrfToken } from '../utils/index';

const title = 'test title ';
const description = 'test desc';

// const errorId = 'fare-type-single';

interface FareTypeProps {
    csrfToken: string;
}

export const buildUuid = (noc: string): string => {
    const uuid = uuidv4();

    return noc + uuid.substring(0, 8);
};

// const buildRadioProps = (): FareTypeRadio[] => {
//     const radios = [
//         {
//             fareType: 'single',
//             label: 'Single ticket',
//             hint: 'A ticket for a point to point journey',
//         },
//         {
//             fareType: 'return',
//             label: 'Return ticket',
//             hint: 'An inbound and outbound ticket for the same service',
//         },
//         {
//             fareType: 'flatFare',
//             label: 'Flat fare ticket',
//             hint: 'A fixed fee ticket for a single journey',
//         },
//         {
//             fareType: 'period',
//             label: 'Period ticket',
//             hint: 'A ticket valid for a number of days, weeks, months or years',
//         },
//         {
//             fareType: 'multiOperator',
//             label: 'Multi-operator',
//             hint: 'A ticket that covers more than one operator',
//         },
//         {
//             fareType: 'schoolService',
//             label: 'School service',
//             hint: 'A ticket available to pupils in full-time education',
//         },
//     ];

//     return radios;
// };

const ProductExpiry = ({ csrfToken }: FareTypeProps): ReactElement => {
    return (
        <TwoThirdsLayout title={title} description={description} errors={[]}>
            <CsrfForm action="/api/fareType" method="post" csrfToken={csrfToken}>
                <>
                    <ErrorSummary errors={[]} />
                    <div className={`govuk-form-group ${[].length > 0 ? 'govuk-form-group--error' : ''}`}>
                        <fieldset className="govuk-fieldset" aria-describedby="fare-type-page-heading">
                            <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                                <h1 className="govuk-fieldset__heading" id="fare-type-page-heading">
                                    Select a fare type
                                </h1>
                            </legend>
                            <span className="govuk-hint" id="fare-type-operator-hint">
                                Hello
                            </span>
                        </fieldset>
                    </div>
                    <input type="submit" value="Continue" id="continue-button" className="govuk-button" />
                </>
            </CsrfForm>
        </TwoThirdsLayout>
    );
};

export const getServerSideProps = (ctx: NextPageContextWithSession): { props: FareTypeProps } => {
    const csrfToken = getCsrfToken(ctx);
    console.log('hello');
    return { props: { csrfToken } };
};

export default ProductExpiry;
