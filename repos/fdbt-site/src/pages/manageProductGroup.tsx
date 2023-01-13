import startCase from 'lodash/startCase';
import moment from 'moment';
import React, { ReactElement, useState } from 'react';
import ErrorSummary from '../components/ErrorSummary';
import FormElementWrapper from '../components/FormElementWrapper';
import InformationSummary from '../components/InformationSummary';
import { MANAGE_PRODUCT_GROUP_ERRORS_ATTRIBUTE, MULTI_MODAL_ATTRIBUTE } from '../constants/attributes';
import { getSessionAttribute } from '../utils/sessions';
import CsrfForm from '../components/CsrfForm';
import {
    getAllPassengerTypesByNoc,
    getAllProductsByNoc,
    getBodsOrTndsServicesByNoc,
    getProductGroupByNocAndId,
} from '../data/auroradb';
import { getProductsMatchingJson } from '../data/s3';
import {
    ErrorInfo,
    MyFaresService,
    NextPageContextWithSession,
    GroupOfProducts,
    ProductToDisplay,
    ServiceToDisplay,
} from '../interfaces';
import { BaseLayout } from '../layout/Layout';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import { getNonExpiredProducts, filterOutProductsWithNoActiveServices } from './api/exports';
import { isWithErrors } from '../interfaces/typeGuards';
import BackButton from '../components/BackButton';

const title = 'Manage Product Group';
const description = 'Manage product group page for the Create Fares Data Service';
const editingInformationText =
    'Editing and saving new changes will be applied to all capped fares using this product group.';

interface ManageProductGroupProps {
    csrf: string;
    productsToDisplay: ProductToDisplay[];
    servicesToDisplay: ServiceToDisplay[];
    errors: ErrorInfo[];
    editMode: boolean;
    inputs?: GroupOfProducts | undefined;
}

const buildOtherProductSection = (
    indexCounter: number,
    productsSelected: number[],
    setProductsSelected: React.Dispatch<React.SetStateAction<number[]>>,
    otherProducts: ProductToDisplay[],
) => {
    return (
        <>
            {otherProducts.map((product) => {
                indexCounter += 1;
                const productsIndex = indexCounter;

                return (
                    <div
                        className="govuk-checkboxes__item govuk-checkboxes--small govuk-!-margin-top-2 govuk-!-margin-left-4"
                        key={`checkbox-product-${productsIndex}`}
                    >
                        <input
                            className="govuk-checkboxes__input"
                            id={`checkbox-${productsIndex}`}
                            name="productsSelected"
                            type="checkbox"
                            value={product.id}
                            checked={
                                !!productsSelected.find((productSelected) => productSelected === Number(product.id))
                            }
                            onClick={() => {
                                if (
                                    productsSelected.find((productSelected) => productSelected === Number(product.id))
                                ) {
                                    const newSelected = [...productsSelected].filter(
                                        (valueSelected) => valueSelected !== Number(product.id),
                                    );
                                    setProductsSelected(newSelected);
                                } else {
                                    setProductsSelected([...productsSelected, Number(product.id)]);
                                }
                            }}
                            // This onChange is here because of how we're using the 'checked' prop
                            // eslint-disable-next-line @typescript-eslint/no-empty-function
                            onChange={() => {}}
                        />
                        <label
                            id={`product-${productsIndex}`}
                            className="govuk-label govuk-checkboxes__label"
                            // eslint-disable-next-line jsx-a11y/aria-role
                            role="input"
                            htmlFor={`checkbox-${productsIndex}`}
                        >
                            {`${product.productName}${
                                product.direction ? ` | ${startCase(product.direction)}` : ''
                            } | ${product.startDate}`}
                        </label>
                    </div>
                );
            })}
        </>
    );
};

const ManageProductGroup = ({
    productsToDisplay,
    servicesToDisplay,
    csrf,
    errors,
    editMode,
    inputs,
}: ManageProductGroupProps): ReactElement => {
    const id = inputs?.id;
    const selectedProductIds = !!inputs && inputs.productIds ? inputs.productIds : [];
    const [detailsAllOpen, setAllDetails] = useState(false);
    const [productsSelected, setProductsSelected] = useState<number[]>(
        selectedProductIds.map((productId) => Number(productId)),
    );
    let indexCounter = 0;

    const otherProducts = productsToDisplay.filter((product) => !product.serviceLineId);

    return (
        <>
            <BaseLayout title={title} description={description}>
                {editMode && errors.length === 0 ? (
                    <>
                        <BackButton href="/viewProductGroups" />
                        <InformationSummary informationText={editingInformationText} />
                    </>
                ) : null}
                <ErrorSummary errors={errors} />
                <CsrfForm csrfToken={csrf} method="post" action="/api/manageProductGroup">
                    <input type="hidden" name="id" value={id} />
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-full">
                            <div className="dft-flex dft-flex-justify-space-between">
                                <h1 className="govuk-heading-xl">Product group</h1>{' '}
                            </div>

                            <div className="govuk-grid-row">
                                <div className="dft-flex dft-flex-justify-space-between">
                                    <div className="govuk-grid-column-two-thirds">
                                        <div className="govuk-form-group">
                                            <h1 className="govuk-heading-s">Provide a name for your group</h1>

                                            <p className="govuk-hint" id="group-name-hint">
                                                2 characters minimum
                                            </p>
                                            <FormElementWrapper
                                                errors={errors}
                                                errorId="product-group-name"
                                                errorClass="govuk-input--error"
                                            >
                                                <input
                                                    className="govuk-input govuk-input--width-30 govuk-product-name-input__inner__input"
                                                    id="product-group-name"
                                                    name="productGroupName"
                                                    type="text"
                                                    maxLength={50}
                                                    defaultValue={inputs?.name || ''}
                                                />
                                            </FormElementWrapper>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                id="select-all"
                                className={`govuk-button govuk-button--secondary${
                                    productsToDisplay.length === 0 ? ' govuk-visually-hidden' : ''
                                }`}
                                data-module="govuk-button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const productsAreAllSelected = productsSelected.length === productsToDisplay.length;

                                    if (productsAreAllSelected) {
                                        setProductsSelected([]);
                                    } else {
                                        setProductsSelected([]);
                                        const arrayOfIndexs = [];
                                        for (let i = 0; i < productsToDisplay.length; i++) {
                                            arrayOfIndexs.push(Number(productsToDisplay[i].id));
                                        }
                                        setProductsSelected(arrayOfIndexs);
                                    }
                                }}
                            >
                                {productsSelected.length === productsToDisplay.length
                                    ? 'Unselect all products'
                                    : 'Select all products'}
                            </button>
                            {productsToDisplay.length === 0 ? (
                                <p className="govuk-body-m govuk-!-margin-top-5">
                                    <em>You currently have no products that can be added to product group.</em>
                                </p>
                            ) : (
                                <div>
                                    <strong
                                        id="products-selected"
                                        className="govuk-tag govuk-tag--blue govuk-!-margin-bottom-4"
                                    >
                                        {productsSelected.length} / {productsToDisplay.length} selected
                                    </strong>

                                    <div className="govuk-tabs" data-module="govuk-tabs">
                                        <h2 className="govuk-tabs__title">Products</h2>
                                        <ul className="govuk-tabs__list">
                                            <li className="govuk-tabs__list-item govuk-tabs__list-item--selected">
                                                <a className="govuk-tabs__tab" href="#services">
                                                    Services
                                                </a>
                                            </li>
                                            <li className="govuk-tabs__list-item">
                                                <a className="govuk-tabs__tab" href="#flat-fare-products">
                                                    Flat fare products
                                                </a>
                                            </li>
                                        </ul>
                                        <div className="govuk-tabs__panel" id="services">
                                            <h2 className="govuk-heading-m govuk-!-margin-bottom-6">Services</h2>
                                            {servicesToDisplay.length > 0 ? (
                                                <>
                                                    <button
                                                        id="open-all-services"
                                                        className="govuk-button govuk-button--secondary"
                                                        data-module="govuk-button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setAllDetails(detailsAllOpen ? false : true);
                                                        }}
                                                    >
                                                        {detailsAllOpen ? 'Close all' : 'Open all'}
                                                    </button>

                                                    {servicesToDisplay.map((service) => {
                                                        const productsForService = productsToDisplay.filter(
                                                            (product) => product.serviceLineId === service.lineId,
                                                        );
                                                        return (
                                                            <details
                                                                className="govuk-details margin-bottom-export"
                                                                data-module="govuk-details"
                                                                open={detailsAllOpen}
                                                                key={service.lineId}
                                                            >
                                                                <summary className="govuk-details__summary">
                                                                    <span className="govuk-details__summary-text">
                                                                        {service.lineName} - {service.origin} to{' '}
                                                                        {service.destination}
                                                                    </span>
                                                                </summary>
                                                                {productsForService.map((product) => {
                                                                    indexCounter += 1;
                                                                    const productsIndex = indexCounter;

                                                                    return (
                                                                        <div
                                                                            className="govuk-checkboxes__item govuk-checkboxes--small govuk-!-margin-top-2 govuk-!-margin-left-4"
                                                                            key={`checkbox-product-${productsIndex}`}
                                                                        >
                                                                            <input
                                                                                className="govuk-checkboxes__input"
                                                                                id={`checkbox-${productsIndex}`}
                                                                                name="productsSelected"
                                                                                type="checkbox"
                                                                                value={product.id}
                                                                                checked={
                                                                                    !!productsSelected.find(
                                                                                        (productSelected) =>
                                                                                            productSelected ===
                                                                                            Number(product.id),
                                                                                    )
                                                                                }
                                                                                onClick={() => {
                                                                                    if (
                                                                                        productsSelected.find(
                                                                                            (productSelected) =>
                                                                                                productSelected ===
                                                                                                Number(product.id),
                                                                                        )
                                                                                    ) {
                                                                                        const newSelected = [
                                                                                            ...productsSelected,
                                                                                        ].filter(
                                                                                            (valueSelected) =>
                                                                                                valueSelected !==
                                                                                                Number(product.id),
                                                                                        );
                                                                                        setProductsSelected(
                                                                                            newSelected,
                                                                                        );
                                                                                    } else {
                                                                                        setProductsSelected([
                                                                                            ...productsSelected,
                                                                                            Number(product.id),
                                                                                        ]);
                                                                                    }
                                                                                }}
                                                                                // This onChange is here because of how we're using the 'checked' prop
                                                                                // eslint-disable-next-line @typescript-eslint/no-empty-function
                                                                                onChange={() => {}}
                                                                            />
                                                                            <label
                                                                                id={`product-${productsIndex}`}
                                                                                className="govuk-label govuk-checkboxes__label"
                                                                                // eslint-disable-next-line jsx-a11y/aria-role
                                                                                role="input"
                                                                                htmlFor={`checkbox-${productsIndex}`}
                                                                            >
                                                                                {`${product.productName}${
                                                                                    product.direction
                                                                                        ? ` | ${startCase(
                                                                                              product.direction,
                                                                                          )}`
                                                                                        : ''
                                                                                } | ${product.startDate}`}
                                                                            </label>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </details>
                                                        );
                                                    })}
                                                </>
                                            ) : (
                                                <p className="govuk-body-m govuk-!-margin-top-5">
                                                    <em>
                                                        You currently have no single or return products that can be
                                                        added to product group.
                                                    </em>
                                                </p>
                                            )}
                                        </div>
                                        <div
                                            className="govuk-tabs__panel govuk-tabs__panel--hidden"
                                            id="flat-fare-products"
                                        >
                                            {otherProducts.length > 0 ? (
                                                <div>
                                                    <h2 className="govuk-heading-m govuk-!-margin-bottom-6">
                                                        Flat fare products
                                                    </h2>

                                                    {otherProducts.length > 0 ? (
                                                        buildOtherProductSection(
                                                            otherProducts.length,
                                                            productsSelected,
                                                            setProductsSelected,
                                                            otherProducts,
                                                        )
                                                    ) : (
                                                        <p className="govuk-body-m govuk-!-margin-top-5">
                                                            <em>
                                                                You currently have no flat fare products that can be
                                                                added to product group.
                                                            </em>
                                                        </p>
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                className={`govuk-button${
                                    productsToDisplay.length === 0 ? ' govuk-visually-hidden' : ''
                                }`}
                                id="continue-button"
                            >
                                {`${editMode ? 'Update' : 'Create'} Product Group`}
                            </button>
                        </div>
                    </div>
                </CsrfForm>
            </BaseLayout>
        </>
    );
};

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: ManageProductGroupProps }> => {
    const noc = getAndValidateNoc(ctx);
    const products = await getAllProductsByNoc(noc);
    const nonExpiredProducts = getNonExpiredProducts(products);
    const dataSource = !!getSessionAttribute(ctx.req, MULTI_MODAL_ATTRIBUTE) ? 'tnds' : 'bods';
    const nonExpiredProductsWithActiveServices = await filterOutProductsWithNoActiveServices(
        noc,
        nonExpiredProducts,
        dataSource,
    );
    const allPassengerTypes = await getAllPassengerTypesByNoc(noc);

    const allProductsToDisplay: ProductToDisplay[] = await Promise.all(
        nonExpiredProductsWithActiveServices.map(async (nonExpiredProduct) => {
            const s3Data = await getProductsMatchingJson(nonExpiredProduct.matchingJsonLink);
            const product = s3Data.products[0];
            const hasProductName = 'productName' in product;
            let passengerTypeName = '';

            if (!hasProductName) {
                const foundPassengerType = allPassengerTypes.find(
                    (passengerType) => passengerType.id === s3Data.passengerType.id,
                );

                if (!foundPassengerType) {
                    throw new Error('Could not find matching passenger type.');
                }

                passengerTypeName = foundPassengerType.name;
            }

            return {
                id: nonExpiredProduct.id,
                productName: hasProductName ? product.productName : `${passengerTypeName} - ${startCase(s3Data.type)}`,
                startDate: nonExpiredProduct.startDate,
                endDate: nonExpiredProduct.endDate || '',
                serviceLineId: 'lineId' in s3Data ? s3Data.lineId : null,
                direction: 'journeyDirection' in s3Data ? s3Data.journeyDirection : null,
                fareType: s3Data.type === 'schoolService' ? 'period' : s3Data.type,
                schoolTicket: 'termTime' in s3Data && !!s3Data.termTime,
            };
        }),
    );

    const productsToDisplay = allProductsToDisplay.filter(
        (product) => product.fareType === 'single' || product.fareType === 'return' || product.fareType === 'flatFare',
    );

    const servicesLineIds = productsToDisplay
        .map((product) => {
            return product.serviceLineId || '';
        })
        .filter((lineId) => lineId);

    const uniqueServiceLineIds = Array.from(new Set(servicesLineIds));

    const allServicesWithMatchingLineIds: MyFaresService[] = [];

    if (uniqueServiceLineIds.length > 0) {
        const dataSource = !!getSessionAttribute(ctx.req, MULTI_MODAL_ATTRIBUTE) ? 'tnds' : 'bods';
        const allBodsOrTndsServices: MyFaresService[] = await getBodsOrTndsServicesByNoc(noc, dataSource);

        uniqueServiceLineIds.forEach((uniqueServiceLineId) => {
            allServicesWithMatchingLineIds.push(
                allBodsOrTndsServices.find((service) => service.lineId === uniqueServiceLineId) as MyFaresService,
            );
        });
    }

    const servicesToDisplay: ServiceToDisplay[] = allServicesWithMatchingLineIds
        .map((service) => {
            const productsWithSameLineId = productsToDisplay.filter(
                (product) => !!product.serviceLineId && product.serviceLineId === service.lineId,
            );

            const matchingProducts = productsWithSameLineId.filter((product) => {
                const momentProductStartDate = moment(product.startDate, 'DD/MM/YYYY').valueOf();
                const momentProductEndDate = product.endDate && moment(product.endDate, 'DD/MM/YYYY').valueOf();
                const momentServiceStartDate = moment(service.startDate, 'DD/MM/YYYY').valueOf();
                const momentServiceEndDate = service.endDate
                    ? moment(service.endDate, 'DD/MM/YYYY').valueOf()
                    : undefined;

                const productMatchesService =
                    (!momentProductEndDate || momentProductEndDate >= momentServiceStartDate) &&
                    (!momentServiceEndDate || momentServiceEndDate >= momentProductStartDate);

                return productMatchesService;
            });

            if (matchingProducts.length > 0) {
                return {
                    lineId: service.lineId,
                    origin: service.origin,
                    destination: service.destination,
                    lineName: service.lineName,
                };
            } else {
                return undefined;
            }
        })
        .filter((service) => !!service) as ServiceToDisplay[];

    const seenLineIds: string[] = [];
    const uniqueServicesToDisplay =
        servicesToDisplay.filter((item) =>
            seenLineIds.includes(item.lineId) ? false : seenLineIds.push(item.lineId),
        ) ?? [];

    const editId = Number.isInteger(Number(ctx.query.id)) ? Number(ctx.query.id) : undefined;
    let inputs: GroupOfProducts | undefined;

    const productGroupAttribute = getSessionAttribute(ctx.req, MANAGE_PRODUCT_GROUP_ERRORS_ATTRIBUTE);

    if (editId) {
        inputs = await getProductGroupByNocAndId(noc, editId);
        if (!inputs) {
            throw new Error('No entity for this NOC matches the passed id');
        }
    }

    return {
        props: {
            csrf: getCsrfToken(ctx),
            productsToDisplay,
            servicesToDisplay: uniqueServicesToDisplay,
            errors: isWithErrors(productGroupAttribute) ? productGroupAttribute.errors : [],
            editMode: !!editId,
            ...(inputs && { inputs }),
        },
    };
};

export default ManageProductGroup;
