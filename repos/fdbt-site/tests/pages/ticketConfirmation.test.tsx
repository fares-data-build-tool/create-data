import * as React from 'react';
import { shallow } from 'enzyme';
import TicketConfirmation, { buildTicketConfirmationElements } from '../../src/pages/ticketConfirmation';

describe('pages', () => {
    describe('ticketConfirmation', () => {
        it('should render correctly for single tickets', () => {
            const tree = shallow(
                <TicketConfirmation
                    fareTypeProps={{
                        service: '3A',
                        journeyDirection: 'To London',
                        matchedFareStages: [
                            { fareStage: 'Bus station', stops: ['at station', 'outside station', 'near park'] },
                            { fareStage: 'Longly Church', stops: ['at church', 'outside corner shop', 'near pub'] },
                            {
                                fareStage: 'London',
                                stops: ['at london station', 'outside train station', 'near green park'],
                            },
                        ],
                    }}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
        it('should render correctly for return tickets', () => {
            const tree = shallow(
                <TicketConfirmation
                    fareTypeProps={{
                        service: '2B',
                        circular: true,
                        inboundMatchedFareStages: [
                            { fareStage: 'Bus station', stops: ['at station', 'outside station', 'near park'] },
                            { fareStage: 'Longly Church', stops: ['at church', 'outside corner shop', 'near pub'] },
                            {
                                fareStage: 'London',
                                stops: ['at london station', 'outside train station', 'near green park'],
                            },
                        ],
                        outboundMatchedFareStages: [
                            { fareStage: 'Another Bus station', stops: ['at station', 'outside station', 'near park'] },
                            { fareStage: 'Smally Church', stops: ['at church', 'outside corner shop', 'near pub'] },
                            {
                                fareStage: 'Liverpool',
                                stops: [
                                    'at Liverpool station',
                                    'outside Liverpool train station',
                                    'near Liverpool green park',
                                ],
                            },
                        ],
                        nonCircularMatchedFareStages: [],
                        validity: { amount: '2', typeOfDuration: 'days' },
                    }}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
        it('should render correctly for period tickets', () => {
            const tree = shallow(
                <TicketConfirmation
                    fareTypeProps={{
                        services: ['2A', '7F', '200'],
                        zone: true,
                        numberOfProducts: 2,
                        products: [
                            {
                                productName: 'Super ticket',
                                productPrice: '30',
                                productDuration: '2',
                                productValidity: '24hr',
                            },
                            {
                                productName: 'Best ticket',
                                productPrice: '10',
                                productDuration: '22',
                                productValidity: '24hr',
                            },
                            {
                                productName: 'Normal ticket',
                                productPrice: '3',
                                productDuration: '23',
                                productValidity: '24hr',
                            },
                        ],
                    }}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
        it('should render correctly for flat fare tickets', () => {
            const tree = shallow(
                <TicketConfirmation
                    fareTypeProps={{
                        services: ['2A', '7F', '200'],
                        productName: 'Flat fare ticket',
                        productPrice: '60',
                    }}
                    csrfToken=""
                    pageProps={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });
    describe('buildTicketConfirmationElements', () => {
        it('builds confirmation elements for single tickets', () => {
            const result = buildTicketConfirmationElements({
                service: '3A',
                journeyDirection: 'To London',
                matchedFareStages: [
                    { fareStage: 'Bus station', stops: ['at station', 'outside station', 'near park'] },
                    { fareStage: 'Longly Church', stops: ['at church', 'outside corner shop', 'near pub'] },
                    {
                        fareStage: 'London',
                        stops: ['at london station', 'outside train station', 'near green park'],
                    },
                ],
            });
            expect(result).toStrictEqual([
                { content: '3A', href: 'service', name: 'Service' },
                { content: 'To London', href: 'singleDirection', name: 'Journey Direction' },
                { content: 'You submitted or created a fare triangle', href: 'inputMethod', name: 'Fare Triangle' },
                {
                    content: 'Stops - At station, Outside station, Near park',
                    href: 'matching',
                    name: 'Fare Stage - Bus station',
                },
                {
                    content: 'Stops - At church, Outside corner shop, Near pub',
                    href: 'matching',
                    name: 'Fare Stage - Longly Church',
                },
                {
                    content: 'Stops - At london station, Outside train station, Near green park',
                    href: 'matching',
                    name: 'Fare Stage - London',
                },
            ]);
        });
        it('builds confirmation elements for return tickets', () => {
            const result = buildTicketConfirmationElements({
                service: '2B',
                circular: true,
                inboundMatchedFareStages: [
                    { fareStage: 'Bus station', stops: ['at station', 'outside station', 'near park'] },
                    { fareStage: 'Longly Church', stops: ['at church', 'outside corner shop', 'near pub'] },
                    {
                        fareStage: 'London',
                        stops: ['at london station', 'outside train station', 'near green park'],
                    },
                ],
                outboundMatchedFareStages: [
                    { fareStage: 'Another Bus station', stops: ['at station', 'outside station', 'near park'] },
                    { fareStage: 'Smally Church', stops: ['at church', 'outside corner shop', 'near pub'] },
                    {
                        fareStage: 'Liverpool',
                        stops: ['at Liverpool station', 'outside Liverpool train station', 'near Liverpool green park'],
                    },
                ],
                nonCircularMatchedFareStages: [],
                validity: { amount: '2', typeOfDuration: 'days' },
            });
            expect(result).toStrictEqual([
                { content: '2B', href: 'service', name: 'Service' },
                {
                    content: 'Stops - At station, Outside station, Near park',
                    href: 'outboundMatching',
                    name: 'Outbound Fare Stage - Another Bus station',
                },
                {
                    content: 'Stops - At church, Outside corner shop, Near pub',
                    href: 'outboundMatching',
                    name: 'Outbound Fare Stage - Smally Church',
                },
                {
                    content: 'Stops - At Liverpool station, Outside Liverpool train station, Near Liverpool green park',
                    href: 'outboundMatching',
                    name: 'Outbound Fare Stage - Liverpool',
                },
                {
                    content: 'Stops - At station, Outside station, Near park',
                    href: 'inboundMatching',
                    name: 'Inbound Fare Stage - Bus station',
                },
                {
                    content: 'Stops - At church, Outside corner shop, Near pub',
                    href: 'inboundMatching',
                    name: 'Inbound Fare Stage - Longly Church',
                },
                {
                    content: 'Stops - At london station, Outside train station, Near green park',
                    href: 'inboundMatching',
                    name: 'Inbound Fare Stage - London',
                },
                { content: '2 days', href: 'returnValidity', name: 'Return Validity' },
            ]);
        });
        it('builds confirmation elements for period tickets', () => {
            const result = buildTicketConfirmationElements({
                services: ['2A', '7F', '200'],
                zone: true,
                numberOfProducts: 2,
                products: [
                    {
                        productName: 'Super ticket',
                        productPrice: '30',
                        productDuration: '2',
                        productValidity: '24hr',
                    },
                    {
                        productName: 'Best ticket',
                        productPrice: '10',
                        productDuration: '22',
                        productValidity: '24hr',
                    },
                    {
                        productName: 'Normal ticket',
                        productPrice: '3',
                        productDuration: '23',
                        productValidity: '24hr',
                    },
                ],
            });
            expect(result).toStrictEqual([
                { content: 'You uploaded a Fare Zone CSV file', href: 'csvZoneUpload', name: 'Zone' },
                { content: 'Price - 30', href: 'multipleProducts', name: 'Product - Super ticket' },
                {
                    content: 'Duration - 2',
                    href: "fareTypeProps.numberOfProducts > 1 ? 'multipleProducts' : 'productDetails'",
                    name: 'Product - Super ticket',
                },
                { content: 'Validity - 24hr', href: 'periodValidity', name: 'Product - Super ticket' },
                { content: 'Price - 10', href: 'multipleProducts', name: 'Product - Best ticket' },
                {
                    content: 'Duration - 22',
                    href: "fareTypeProps.numberOfProducts > 1 ? 'multipleProducts' : 'productDetails'",
                    name: 'Product - Best ticket',
                },
                { content: 'Validity - 24hr', href: 'periodValidity', name: 'Product - Best ticket' },
                { content: 'Price - 3', href: 'multipleProducts', name: 'Product - Normal ticket' },
                {
                    content: 'Duration - 23',
                    href: "fareTypeProps.numberOfProducts > 1 ? 'multipleProducts' : 'productDetails'",
                    name: 'Product - Normal ticket',
                },
                { content: 'Validity - 24hr', href: 'periodValidity', name: 'Product - Normal ticket' },
            ]);
        });
        it('builds confirmation elements for flat fare tickets', () => {
            const result = buildTicketConfirmationElements({
                services: ['2A', '7F', '200'],
                productName: 'Flat fare ticket',
                productPrice: '60',
            });
            expect(result).toStrictEqual([
                { content: '2A, 7F, 200', href: 'serviceList', name: 'Services' },
                { content: 'Price - 60', href: 'productDetails', name: 'Product - Flat fare ticket' },
            ]);
        });
    });
});
