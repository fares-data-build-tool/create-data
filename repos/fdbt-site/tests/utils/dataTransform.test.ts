import { formatStopPoint } from '../../src/utils/dataTransform';
import { Stop, StopPoint } from '../../src/interfaces';

describe('dataTransform', () => {
    describe('formatStopPoint', () => {
        const stopPoint: StopPoint = {
            stopPointRef: '12345678A',
            commonName: 'Test Stop',
        };

        it('should format stop point with locality name and common name if both are provided', () => {
            const expected = 'Test Town (Test Stop)';
            const allFieldsStop: Stop = {
                stopName: 'Stop 1',
                naptanCode: '12345',
                atcoCode: 'gvgvxgasvx',
                localityCode: 'GHS167',
                localityName: 'Test Town',
                indicator: 'SE',
                street: 'Test Street',
                parentLocalityName: 'Another town',
            };
            const stopPointDisplay: string = formatStopPoint(allFieldsStop, stopPoint);
            expect(stopPointDisplay).toEqual(expected);
        });

        it('should format stop point with common name only when locality name not provided', () => {
            const expected = 'Test Stop';
            const noLocalityNameStop: Stop = {
                stopName: 'Stop 1',
                naptanCode: '12345',
                atcoCode: 'gvgvxgasvx',
                localityCode: 'GHS167',
                localityName: '',
                indicator: 'SE',
                street: 'Test Street',
                parentLocalityName: 'Another town',
            };
            const stopPointDisplay: string = formatStopPoint(noLocalityNameStop, stopPoint);
            expect(stopPointDisplay).toEqual(expected);
        });
    });
});
