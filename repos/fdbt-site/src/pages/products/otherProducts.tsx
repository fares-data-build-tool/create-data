import React, { ReactElement } from 'react';
import OtherProductsTable from '../../components/OtherProductsTable';
import { HackDayProduct, NextPageContextWithSession } from '../../interfaces/index';
import { BaseLayout, MyFaresLayout } from '../../layout/Layout';
import { myFaresEnabled } from '../../constants/featureFlag';


const title = 'Other Products - Create Fares Data Service';
const description = 'View and access your other products in one place.';

interface OtherProductsProps {
    otherProducts: HackDayProduct[];
    myFaresEnabled: boolean;
}

const OtherProducts = ({ otherProducts, myFaresEnabled }: OtherProductsProps): ReactElement => {
    return (
        <>
            <BaseLayout title={title} description={description} showNavigation myFaresEnabled={myFaresEnabled}>
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-full">
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h1 className="govuk-heading-xl govuk-!-margin-bottom-3">Other products</h1>
                        </div>
                        <OtherProductsTable otherProducts={otherProducts} />
                    </div>
                </div>
            </BaseLayout>
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

    return { props: { otherProducts, myFaresEnabled } };
};

export default OtherProducts;
