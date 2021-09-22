import React, { ReactElement } from 'react';
import OtherProductsTable from '../../components/OtherProductsTable';
import { HackDayProduct, NextPageContextWithSession } from '../../interfaces/index';
import { MyFaresLayout } from '../../layout/Layout';

const title = 'Other Products - Create Fares Data Service';
const description = 'View and access your other products in one place.';

interface OtherProductsProps {
    otherProducts: HackDayProduct[];
}

const OtherProducts = ({ otherProducts }: OtherProductsProps): ReactElement => {
    return (
        <>
            <MyFaresLayout
                title={title}
                description={description}
                showNavigation
                referer={''}
                currentUrl={'otherProducts'}
            >
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h1 className="govuk-heading-xl govuk-!-margin-bottom-3">Other products</h1>
                            <a className="govuk-button govuk-button--secondary" href="/fareType">
                                Create new
                            </a>
                        </div>
                        <OtherProductsTable otherProducts={otherProducts} />
                    </div>
                </div>
            </MyFaresLayout>
        </>
    );
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: OtherProductsProps }> => {
    const otherProducts: HackDayProduct[] = [
        {
            productDescription: 'Day Saver',
            type: 'Period',
            duration: '1 Day',
            carnet: false,
            quantity: 1,
            passengerType: 'Adult',
            startDate: '2021-01-01',
            endDate: '2021-12-31',
        },
        {
            productDescription: 'Week Saver',
            type: 'Period',
            duration: '1 Week',
            carnet: false,
            quantity: 1,
            passengerType: 'Adult',
            startDate: '2021-01-01',
            endDate: '2021-12-31',
        },
        {
            productDescription: 'Day Saver',
            type: 'Period',
            duration: '1 Day',
            carnet: false,
            quantity: 1,
            passengerType: 'Cat',
            startDate: '2021-01-01',
            endDate: '2021-12-31',
        },
        {
            productDescription: 'Week Saver',
            type: 'Period',
            duration: '1 Week',
            carnet: false,
            quantity: 1,
            passengerType: 'Cat',
            startDate: '2021-01-01',
            endDate: '2021-12-31',
        },
        {
            productDescription: 'Day Saver',
            type: 'Period',
            duration: '1 Day',
            carnet: false,
            quantity: 1,
            passengerType: 'Adult',
            startDate: '2022-01-01',
            endDate: '2022-12-31',
        },
        {
            productDescription: 'Week Saver',
            type: 'Period',
            duration: '1 Week',
            carnet: false,
            quantity: 1,
            passengerType: 'Adult',
            startDate: '2022-01-01',
            endDate: '2022-12-31',
        },
        {
            productDescription: 'Cat Saver',
            type: 'Period',
            duration: '1 Day',
            carnet: false,
            quantity: 1,
            passengerType: 'Cat',
            startDate: '2021-01-01',
            endDate: '2021-12-31',
        },
        {
            productDescription: 'Cat Saver',
            type: 'Period',
            duration: '1 Week',
            carnet: false,
            quantity: 1,
            passengerType: 'Cat',
            startDate: '2022-01-01',
            endDate: '2022-12-31',
        },
        {
            productDescription: 'Flattie',
            type: 'Flat Fare',
            duration: '1 trip',
            carnet: false,
            quantity: 1,
            passengerType: 'Student',
            startDate: '2020-01-01',
            endDate: '2021-12-09',
        },
        {
            productDescription: 'Parrot Multi',
            type: 'Multiple Operator',
            duration: '1 Week',
            carnet: false,
            quantity: 1,
            passengerType: 'Parrot',
            startDate: '2021-01-01',
            endDate: '2021-12-31',
        },
        {
            productDescription: 'Zebra Express',
            type: 'Period',
            duration: '1 Day',
            carnet: true,
            quantity: 10,
            passengerType: 'Zebra Herd',
            startDate: '2021-01-01',
            endDate: '2021-06-31',
        },
    ];

    return { props: { otherProducts } };
};

export default OtherProducts;
