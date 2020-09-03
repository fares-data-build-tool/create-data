import * as React from 'react';
import { shallow } from 'enzyme';
import CreatedFiles, { getServerSideProps } from '../../src/pages/createdFiles';
import { S3NetexFile } from '../../src/interfaces';
import * as s3 from '../../src/data/s3';
import { getMockContext, expectedMatchingJsonSingle } from '../testData/mockData';

jest.mock('../../src/data/s3.ts');

const netexFiles: S3NetexFile[] = [
    {
        name: 'Test Name',
        fareType: 'single',
        noc: 'TEST',
        passengerType: 'adult',
        reference: 'TEST12345',
        date: 'Tue, 01 Sep 2020 14:46:58 GMT',
        signedUrl: 'https://test.example.com/dscsdcd',
        sopNames: 'Test SOP Name, Test SOP Name 2',
        lineName: 'X01',
    },
    {
        name: 'Test Name 2',
        fareType: 'flatFare',
        noc: 'TEST2',
        passengerType: 'child',
        reference: 'TEST54321',
        date: 'Wed, 02 Sep 2020 14:46:58 GMT',
        signedUrl: 'https://test.example.com/gfnhgddd',
        sopNames: 'Test SOP Name 2',
        serviceNames: '1, 56, X02',
        productNames: 'Product 1, Product 2',
    },
];

describe('pages', () => {
    describe('createdFiles', () => {
        const ctx = getMockContext();
        let retrieveNetexForNocsSpy: jest.SpyInstance;
        let getMatchingDataObjectSpy: jest.SpyInstance;
        let getNetexSignedUrlSpy: jest.SpyInstance;

        beforeEach(() => {
            retrieveNetexForNocsSpy = jest.spyOn(s3, 'retrieveNetexForNocs').mockImplementation(() =>
                Promise.resolve([
                    {
                        LastModified: new Date(new Date().setFullYear(2019)),
                        Key: 'testKey.xml',
                    },
                    {
                        LastModified: new Date(new Date().setFullYear(2020)),
                        Key: 'testKey2.xml',
                    },
                ]),
            );

            getMatchingDataObjectSpy = jest.spyOn(s3, 'getMatchingDataObject').mockImplementation(() =>
                Promise.resolve({
                    Body: JSON.stringify(expectedMatchingJsonSingle),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any),
            );

            getNetexSignedUrlSpy = jest
                .spyOn(s3, 'getNetexSignedUrl')
                .mockImplementation(() => Promise.resolve('https://test.example.com/gfnhgddd'));
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        it('should render correctly', () => {
            const tree = shallow(
                <CreatedFiles files={netexFiles} numberOfResults={10} currentPage={1} numberPerPage={5} />,
            );
            expect(tree).toMatchSnapshot();
        });

        it('should render pagination if number of results more than number per page', () => {
            const tree = shallow(
                <CreatedFiles files={netexFiles} numberOfResults={10} currentPage={1} numberPerPage={5} />,
            );
            expect(tree.find('Pagination')).toHaveLength(1);
        });

        it('should not render pagination if number of results less than number per page', () => {
            const tree = shallow(
                <CreatedFiles files={netexFiles} numberOfResults={2} currentPage={1} numberPerPage={5} />,
            );
            expect(tree.find('Pagination')).toHaveLength(0);
        });

        describe('getServerSideProps', () => {
            it('calls retrieveNetexForNocs on load', async () => {
                await getServerSideProps(ctx);

                expect(retrieveNetexForNocsSpy).toBeCalledTimes(1);
            });

            it('calls getMatchingDataObject for each netex file', async () => {
                await getServerSideProps(ctx);

                expect(getMatchingDataObjectSpy).toBeCalledTimes(2);
                expect(getMatchingDataObjectSpy).toBeCalledWith('testKey.json');
                expect(getMatchingDataObjectSpy).toBeCalledWith('testKey2.json');
            });

            it('calls getNetexSignedUrl for each netex file', async () => {
                await getServerSideProps(ctx);

                expect(getNetexSignedUrlSpy).toBeCalledTimes(2);
                expect(getMatchingDataObjectSpy).toBeCalledWith('testKey.json');
                expect(getMatchingDataObjectSpy).toBeCalledWith('testKey2.json');
            });

            it('sorts files by date', async () => {
                await getServerSideProps(ctx);

                expect(getMatchingDataObjectSpy.mock.calls[0][0]).toBe('testKey2.json');
                expect(getMatchingDataObjectSpy.mock.calls[1][0]).toBe('testKey.json');
            });

            it('returns correct file data', async () => {
                const result = await getServerSideProps(ctx);

                expect(result).toEqual({
                    props: {
                        currentPage: 1,
                        files: [
                            {
                                date: '',
                                fareType: 'single',
                                lineName: '215',
                                name: 'DCCL - Single - Adult - Line 215',
                                noc: 'DCCL',
                                passengerType: 'Adult',
                                productNames: '',
                                reference: '1e0459b3-082e-4e70-89db-96e8ae173e10',
                                serviceNames: '',
                                signedUrl: 'https://test.example.com/gfnhgddd',
                                sopNames: 'Adult - Weekly Rider - Cash, Card - OnBus, TicketMachine, Shop',
                                zoneName: '',
                            },
                            {
                                date: '',
                                fareType: 'single',
                                lineName: '215',
                                name: 'DCCL - Single - Adult - Line 215',
                                noc: 'DCCL',
                                passengerType: 'Adult',
                                productNames: '',
                                reference: '1e0459b3-082e-4e70-89db-96e8ae173e10',
                                serviceNames: '',
                                signedUrl: 'https://test.example.com/gfnhgddd',
                                sopNames: 'Adult - Weekly Rider - Cash, Card - OnBus, TicketMachine, Shop',
                                zoneName: '',
                            },
                        ],
                        numberOfResults: 2,
                        numberPerPage: 10,
                    },
                });
            });
        });
    });
});
