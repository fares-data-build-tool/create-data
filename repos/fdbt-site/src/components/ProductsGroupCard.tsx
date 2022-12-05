import React, { ReactElement } from 'react';
import { GroupOfProducts } from '../interfaces';

interface ProductsGroupCardProps {
    groupDetails: GroupOfProducts;
    index: number;
    deleteActionHandler?: (id: number, name: string) => void;
    defaultChecked: boolean;
}

const ProductsGroupCard = ({
    groupDetails,
    index,
    deleteActionHandler,
    defaultChecked,
}: ProductsGroupCardProps): ReactElement => {
    const { name, id } = groupDetails;

    return (
        <div className="card" id={`product-group-${index}`}>
            <div className="card__body">
                {deleteActionHandler ? (
                    <div className="card__actions">
                        <ul className="actions__list">
                            <li className="actions__item">
                                <a
                                    className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular"
                                    href={`/searchOperators?id=${id}`}
                                >
                                    Edit
                                </a>
                            </li>

                            <li className="actions__item">
                                <button
                                    className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular actions__delete"
                                    onClick={() => deleteActionHandler(id, name)}
                                >
                                    Delete
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <div className="govuk-radios">
                        <div className="govuk-radios__item card__selector">
                            <input
                                className="govuk-radios__input"
                                id={`product-group-${index}-radio`}
                                name="productGroupId"
                                type="radio"
                                value={id}
                                aria-label={name}
                                defaultChecked={defaultChecked}
                            />
                            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                            <label className="govuk-label govuk-radios__label" />
                        </div>
                    </div>
                )}

                <h4 className="govuk-heading-m govuk-!-padding-bottom-4">{name}</h4>

                <p className="govuk-body-s govuk-!-margin-bottom-2">{groupDetails.productIds.length} products</p>
            </div>
        </div>
    );
};

export default ProductsGroupCard;
