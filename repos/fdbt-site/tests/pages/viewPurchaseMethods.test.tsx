import { shallow } from 'enzyme';
import * as React from 'react';
import { FromDb, SalesOfferPackage } from '../../src/interfaces/matchingJsonTypes';
import ViewPurchaseMethods, { PurchaseMethodCardBody } from '../../src/pages/viewPurchaseMethods';
import { expectedSalesOfferPackageArray } from '../testData/mockData';

const purchaseMethods: FromDb<SalesOfferPackage>[] = expectedSalesOfferPackageArray.map((sop, index) => ({
    ...sop,
    id: index + 7,
}));

describe('pages', () => {
    describe('view purchase methods', () => {
        it('should render correctly with purchase methods', () => {
            const tree = shallow(
                <ViewPurchaseMethods
                    csrfToken={''}
                    purchaseMethods={purchaseMethods}
                    referer={'hello'}
                    isDevOrTest={false}
                    viewPurchaseMethodErrors={[]}
                />,
            );
            expect(tree).toMatchSnapshot();
        });
    });

    describe('purchase methods inner component', () => {
        it('renders normally when time restrictions are present', () => {
            const tree = shallow(<PurchaseMethodCardBody entity={purchaseMethods[0]} />);
            expect(tree).toMatchSnapshot();
        });
    });
});
