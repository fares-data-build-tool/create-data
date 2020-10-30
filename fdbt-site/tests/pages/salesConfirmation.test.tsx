import * as React from 'react';
import { shallow } from 'enzyme';
import moment from 'moment';
import SalesConfirmation, { buildSalesConfirmationElements } from '../../src/pages/salesConfirmation';

describe('pages', () => {
    describe('confirmation', () => {
        it('should render correctly', () => {
            const tree = shallow(
                <SalesConfirmation
                    salesOfferPackages={[
                        {
                            name: 'A sales offer package',
                            description: 'my way of selling tickets',
                            purchaseLocations: ['at stop', 'website'],
                            paymentMethods: ['cash'],
                            ticketFormats: ['paper'],
                        },
                    ]}
                    ticketDating={{
                        productDates: {
                            startDate: '2017-03-13T18:00:00+00:00',
                            endDate: '2057-03-13T18:00:00+00:00',
                        },
                        endDefault: true,
                        startDefault: true,
                    }}
                    csrfToken=""
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
    describe('buildSalesConfirmationElements', () => {
        it('builds confirmation elements for the sales information', () => {
            const result = buildSalesConfirmationElements(
                [
                    {
                        name: 'A sales offer package',
                        description: 'my way of selling tickets',
                        purchaseLocations: ['at stop', 'website'],
                        paymentMethods: ['cash'],
                        ticketFormats: ['paper'],
                    },
                    {
                        name: 'Another sales offer package',
                        description: 'another way of selling tickets',
                        purchaseLocations: ['in station', 'phone'],
                        paymentMethods: ['mobileDevice'],
                        ticketFormats: ['phone'],
                    },
                ],
                {
                    productDates: {
                        startDate: moment().toISOString(),
                        endDate: moment()
                            .add(100, 'years')
                            .toISOString(),
                    },
                    endDefault: true,
                    startDefault: true,
                },
            );
            expect(result).toStrictEqual([
                { content: 'A sales offer package', href: 'selectSalesOfferPackages', name: 'Sales Offer Package' },
                {
                    content: 'Another sales offer package',
                    href: 'selectSalesOfferPackages',
                    name: 'Sales Offer Package',
                },
                {
                    content: moment().format('DD-MM-YYYY'),
                    href: 'productDateInformation',
                    name: 'Ticket Start Date (default)',
                },
                {
                    content: moment()
                        .add(100, 'years')
                        .format('DD-MM-YYYY'),
                    href: 'productDateInformation',
                    name: 'Ticket End Date (default)',
                },
            ]);
        });
    });
});
