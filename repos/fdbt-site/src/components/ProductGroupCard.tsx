import React, { ReactElement } from 'react';
import { ProductGroup } from '../interfaces';

interface ProductGroupCardProps {
    productGroup: ProductGroup;
    index: number;
    deleteActionHandler?: (id: number, name: string) => void;
    defaultChecked: boolean;
}

const ProductGroupCard = ({
    productGroup,
    index,
    deleteActionHandler,
    defaultChecked,
}: ProductGroupCardProps): ReactElement => {
    const { name, id } = productGroup;

    return (
        <div className="card" id={`operator-group-${index}`}>
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
                                id={`operator-group-${index}-radio`}
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

                {productGroup.operators.map(
                    (operator, idx) =>
                        idx < 5 && (
                            <>
                                <p id={`operator-${idx}`} className="govuk-body-s govuk-!-margin-bottom-2">
                                    {operator.name} - {operator.nocCode}
                                </p>
                            </>
                        ),
                )}
                {productGroup.operators.length > 5 && (
                    <p className="govuk-body-s govuk-!-margin-bottom-2">
                        and {productGroup.operators.length - 5} other operators
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProductGroupCard;
