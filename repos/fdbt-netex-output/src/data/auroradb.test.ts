import { removeDuplicateOperators } from './auroradb';
import { Operator } from '../types';

describe('removeDuplicateOperators', () => {
    it('returns operators that are not duplicates and for those that are duplicates chooses the element with the mode Bus', () => {
        const operators: Operator[] = [
            {
                nocCode: '1CTL',
                opId: '135427',
                vosaPsvLicenseName: '1St Choice Transport Ltd',
                operatorName: '1st Choice Transport Ltd',
                url: 'www.1stchoiceltdcoachhire.co.uk#http://www.1stchoiceltdcoachhire.co.uk#',
                email: 'info@1stchoiceltd.co.uk',
                contactNumber: '01554759888',
                street: 'The Transport Depot, Sandy Road, Llanelli SA15 4DP',
                mode: 'Bus',
            },
            {
                nocCode: 'KCAB',
                opId: '136871',
                vosaPsvLicenseName: 'K Cabs (North Yorkshire)',
                operatorName: 'K Cabs (North Yorkshire)',
                url: '',
                email: '',
                contactNumber: '',
                street: '',
                mode: 'Taxi',
            },
            {
                nocCode: 'KEVS',
                opId: '138238',
                vosaPsvLicenseName: '',
                operatorName: 'Kevs Cars and Coaches',
                url: '#http://www.kevscarsandcoaches.co.uk/#',
                email: 'info@kevscarsandcoaches.co.uk',
                contactNumber: '0121 457 9168',
                street: '39 Orchard Road, Bromsgrove, Worcestershire B61 8HZ',
                mode: 'Coach',
            },
            {
                nocCode: 'KEVS',
                opId: '138238',
                vosaPsvLicenseName: '',
                operatorName: 'Kevs Cars and Coaches',
                url: '#http://www.kevscarsandcoaches.co.uk/#',
                email: 'info@kevscarsandcoaches.co.uk',
                contactNumber: '0121 457 9168',
                street: '39 Orchard Road, Bromsgrove, Worcestershire B61 8HZ',
                mode: 'Bus',
            },
            {
                nocCode: 'ZX',
                opId: '138130',
                vosaPsvLicenseName: 'Zoom Airlines Inc',
                operatorName: 'Zoom Airlines',
                url: '',
                email: '',
                contactNumber: '',
                street: '',
                mode: 'Airline',
            },
        ];

        const result = removeDuplicateOperators(operators);
        expect(result).toEqual([
            {
                nocCode: '1CTL',
                opId: '135427',
                vosaPsvLicenseName: '1St Choice Transport Ltd',
                operatorName: '1st Choice Transport Ltd',
                url: 'www.1stchoiceltdcoachhire.co.uk#http://www.1stchoiceltdcoachhire.co.uk#',
                email: 'info@1stchoiceltd.co.uk',
                contactNumber: '01554759888',
                street: 'The Transport Depot, Sandy Road, Llanelli SA15 4DP',
                mode: 'Bus',
            },
            {
                nocCode: 'KCAB',
                opId: '136871',
                vosaPsvLicenseName: 'K Cabs (North Yorkshire)',
                operatorName: 'K Cabs (North Yorkshire)',
                url: '',
                email: '',
                contactNumber: '',
                street: '',
                mode: 'Taxi',
            },
            {
                nocCode: 'KEVS',
                opId: '138238',
                vosaPsvLicenseName: '',
                operatorName: 'Kevs Cars and Coaches',
                url: '#http://www.kevscarsandcoaches.co.uk/#',
                email: 'info@kevscarsandcoaches.co.uk',
                contactNumber: '0121 457 9168',
                street: '39 Orchard Road, Bromsgrove, Worcestershire B61 8HZ',
                mode: 'Bus',
            },
            {
                nocCode: 'ZX',
                opId: '138130',
                vosaPsvLicenseName: 'Zoom Airlines Inc',
                operatorName: 'Zoom Airlines',
                url: '',
                email: '',
                contactNumber: '',
                street: '',
                mode: 'Airline',
            },
        ]);
    });
    it('returns operators that are not duplicates', () => {
        const operators: Operator[] = [
            {
                nocCode: '1CTL',
                opId: '135427',
                vosaPsvLicenseName: '1St Choice Transport Ltd',
                operatorName: '1st Choice Transport Ltd',
                url: 'www.1stchoiceltdcoachhire.co.uk#http://www.1stchoiceltdcoachhire.co.uk#',
                email: 'info@1stchoiceltd.co.uk',
                contactNumber: '01554759888',
                street: 'The Transport Depot, Sandy Road, Llanelli SA15 4DP',
                mode: 'Bus',
            },
            {
                nocCode: 'KBMT',
                opId: '136879',
                vosaPsvLicenseName: 'Keighley Bus Museum Trust Ltd',
                operatorName: 'Keighley Bus Museum Trust',
                url: '#http://www.kbmt.org.uk/#',
                email: 'enquiries@kbmt.org.uk',
                contactNumber: '07546704558',
                street: 'Unit 5, River Technology Park, Dalton Lane BD21 4JP',
                mode: 'Bus',
            },
            {
                nocCode: 'KBUS',
                opId: '136923',
                vosaPsvLicenseName: 'Kinchbus Ltd',
                operatorName: 'Kinchbus',
                url: 'www.kinchbus.co.uk#http://www.kinchbus.co.uk#',
                email: 'customer.services@kinchbus.co.uk',
                contactNumber: '01509 815637',
                street: 'Sullivan Way, Swingbridge Road, Loughborough LE11 5QS',
                mode: 'Bus',
            },
        ];

        const result = removeDuplicateOperators(operators);
        expect(result).toEqual([
            {
                nocCode: '1CTL',
                opId: '135427',
                vosaPsvLicenseName: '1St Choice Transport Ltd',
                operatorName: '1st Choice Transport Ltd',
                url: 'www.1stchoiceltdcoachhire.co.uk#http://www.1stchoiceltdcoachhire.co.uk#',
                email: 'info@1stchoiceltd.co.uk',
                contactNumber: '01554759888',
                street: 'The Transport Depot, Sandy Road, Llanelli SA15 4DP',
                mode: 'Bus',
            },
            {
                nocCode: 'KBMT',
                opId: '136879',
                vosaPsvLicenseName: 'Keighley Bus Museum Trust Ltd',
                operatorName: 'Keighley Bus Museum Trust',
                url: '#http://www.kbmt.org.uk/#',
                email: 'enquiries@kbmt.org.uk',
                contactNumber: '07546704558',
                street: 'Unit 5, River Technology Park, Dalton Lane BD21 4JP',
                mode: 'Bus',
            },
            {
                nocCode: 'KBUS',
                opId: '136923',
                vosaPsvLicenseName: 'Kinchbus Ltd',
                operatorName: 'Kinchbus',
                url: 'www.kinchbus.co.uk#http://www.kinchbus.co.uk#',
                email: 'customer.services@kinchbus.co.uk',
                contactNumber: '01509 815637',
                street: 'Sullivan Way, Swingbridge Road, Loughborough LE11 5QS',
                mode: 'Bus',
            },
        ]);
    });
    it('returns an empty array when there are no operators', () => {
        const operators: Operator[] = [];
        const result = removeDuplicateOperators(operators);
        expect(result).toEqual([]);
    });
});
