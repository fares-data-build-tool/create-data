import React, { ReactElement } from 'react';
import { MyFaresOtherFaresProduct } from '../interfaces';
import { sentenceCaseString } from '../utils';

interface OtherProductsTableProps {
    otherProducts: MyFaresOtherFaresProduct[];
}

const getTag = (startDate: string, endDate: string): JSX.Element | null => {
    const today = new Date().setHours(0, 0, 0, 0);
    if (Date.parse(startDate) <= today && Date.parse(endDate) >= today) {
        return <strong className="govuk-tag govuk-tag--turquoise">Active</strong>;
    } else if (Date.parse(startDate) >= today) {
        return <strong className="govuk-tag govuk-tag--blue">Pending</strong>;
    } else if (today > Date.parse(endDate)) {
        return <strong className="govuk-tag govuk-tag--red">Expired</strong>;
    }

    return null;
};

const ServicesTable = ({ otherProducts }: OtherProductsTableProps): ReactElement => {
    return (
        <table className="govuk-table">
            <thead className="govuk-table__head">
                <tr className="govuk-table__row">
                    <th scope="col" className="govuk-table__header">
                        Product description
                    </th>
                    <th scope="col" className="govuk-table__header">
                        Type
                    </th>
                    <th scope="col" className="govuk-table__header">
                        Duration
                    </th>
                    <th scope="col" className="govuk-table__header">
                        Quantity
                    </th>
                    <th scope="col" className="govuk-table__header">
                        Passenger type
                    </th>
                    <th scope="col" className="govuk-table__header">
                        Start date
                    </th>
                    <th scope="col" className="govuk-table__header">
                        End date
                    </th>
                    <th scope="col" className="govuk-table__header">
                        Product status
                    </th>
                </tr>
            </thead>
            <tbody className="govuk-table__body">
                {otherProducts.length > 0 ? (
                    otherProducts.map((product, index) => (
                        <tr className="govuk-table__row" key={`product-${index}`}>
                            <td className="govuk-table__cell">{product.productDescription}</td>
                            <td className="govuk-table__cell">{sentenceCaseString(product.type)}</td>
                            <td className="govuk-table__cell">{product.duration}</td>
                            <td className="govuk-table__cell">{product.quantity}</td>
                            <td className="govuk-table__cell">{sentenceCaseString(product.passengerType)}</td>
                            <td className="govuk-table__cell">{product.startDate}</td>
                            <td className="govuk-table__cell">{product.endDate}</td>
                            <td className="govuk-table__cell">{getTag(product.startDate, product.endDate)}</td>
                        </tr>
                    ))
                ) : (
                    <span className="govuk-body">
                        <i>You currently have no non-Point-to-Point products</i>
                    </span>
                )}
            </tbody>
        </table>
    );
};

export default ServicesTable;
