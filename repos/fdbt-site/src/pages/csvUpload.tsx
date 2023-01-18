import React, { ReactElement } from 'react';
import { BaseLayout } from '../layout/Layout';
import UserDataUploadComponent from '../components/UserDataUploads';
import {
    CSV_UPLOAD_ATTRIBUTE,
    MATCHING_JSON_ATTRIBUTE,
    MATCHING_JSON_META_DATA_ATTRIBUTE,
    MULTI_MODAL_ATTRIBUTE,
    SERVICE_LIST_ATTRIBUTE,
    TXC_SOURCE_ATTRIBUTE,
} from '../constants/attributes';
import FaresTriangleExampleCsv from '../assets/files/Fares-Triangle-Example.csv';
import HowToUploadFaresTriangle from '../assets/files/How-to-Upload-a-Fares-Triangle.pdf';
import {
    NextPageContextWithSession,
    ErrorInfo,
    UserDataUploadsProps,
    ServicesInfo,
    TxcSourceAttribute,
} from '../interfaces';
import { getSessionAttribute, updateSessionAttribute } from '../utils/sessions';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import FormElementWrapper from 'src/components/FormElementWrapper';
import {
    getAllServicesByNocCode,
    getServicesByNocCodeAndDataSource,
    getTndsServicesByNocAndModes,
} from 'src/data/auroradb';
import { redirectTo } from 'src/utils/apiUtils';
import { isServiceListAttributeWithErrors } from './serviceList';

const title = 'CSV Upload - Create Fares Data Service';
const description = 'CSV Upload page of the Create Fares Data Service';

const CsvUpload = ({ errors, ...props }: UserDataUploadsProps): ReactElement => {
    const seen: string[] = [];
    const uniqueServiceLists =
        props.serviceList?.filter((item) => (seen.includes(item.lineId) ? false : seen.push(item.lineId))) ?? [];
    return (
        <BaseLayout title={title} description={description} errors={errors}>
            <UserDataUploadComponent
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...props}
                errors={errors}
                detailBody={
                    <>
                        <p>Some common issues with fares triangle uploads include:</p>
                        <ul className="govuk-list govuk-list--bullet">
                            <li>Commas in fare stage names</li>
                            <li>Not filling in every fare stage on the diagonal row</li>
                        </ul>
                        <p>
                            Use the help file htmlFor a more detailed guide on constructing a fares triangle in the
                            required format or download the fares triangle template to create a new file.
                        </p>
                    </>
                }
            />
            <div className="govuk-warning-text">
                <span className="govuk-warning-text__icon" aria-hidden="true">
                    !
                </span>
                <strong className="govuk-warning-text__text">
                    <span className="govuk-warning-text__assistive">Warning</span>
                    If there are services exempt, you can omit them by selecting yes below and selecting the services
                    you want to omit.
                </strong>
            </div>
            <div className="govuk-form-group">
                <fieldset className="govuk-fieldset">
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                        <h2 className="govuk-fieldset__heading">Are there services exempt?</h2>
                    </legend>
                    <div className="govuk-radios" data-module="govuk-radios">
                        <div className="govuk-radios__item">
                            <input
                                className="govuk-radios__input"
                                id="yes"
                                name="exempt"
                                type="radio"
                                value="yes"
                                data-aria-controls="conditional-yes"
                            />
                            <label className="govuk-label govuk-radios__label" htmlFor="yes">
                                Yes
                            </label>
                        </div>
                        <div
                            className="govuk-radios__conditional govuk-radios__conditional--hidden"
                            id="conditional-yes"
                        >
                            <div className="govuk-form-group">
                                <fieldset className="govuk-fieldset">
                                    <input
                                        type="submit"
                                        name="selectAll"
                                        value={props.buttonText}
                                        id="select-all-button"
                                        className="govuk-button govuk-button--secondary"
                                    />
                                    <FormElementWrapper
                                        errors={errors}
                                        errorId="checkbox-0"
                                        errorClass=""
                                        addFormGroupError={false}
                                    >
                                        <div className="govuk-checkboxes">
                                            {uniqueServiceLists.map((service, index) => {
                                                const {
                                                    lineName,
                                                    lineId,
                                                    serviceCode,
                                                    description,
                                                    checked,
                                                    origin,
                                                    destination,
                                                } = service;

                                                const checkboxTitles =
                                                    props.dataSourceAttribute.source === 'tnds'
                                                        ? `${lineName} - ${description}`
                                                        : `${lineName} ${origin || 'N/A'} - ${destination || 'N/A'}`;

                                                const checkBoxValues = `${description}`;

                                                return (
                                                    <div
                                                        className="govuk-checkboxes__item"
                                                        key={`checkbox-item-${lineName}`}
                                                    >
                                                        <input
                                                            className="govuk-checkboxes__input"
                                                            id={`checkbox-${index}`}
                                                            name={`${lineName}#${lineId}#${serviceCode}`}
                                                            type="checkbox"
                                                            value={checkBoxValues}
                                                            defaultChecked={checked}
                                                        />
                                                        <label
                                                            className="govuk-label govuk-checkboxes__label"
                                                            htmlFor={`checkbox-${index}`}
                                                        >
                                                            {checkboxTitles}
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </FormElementWrapper>
                                </fieldset>
                            </div>
                        </div>
                        <div className="govuk-radios__item">
                            <input className="govuk-radios__input" id="no" name="exempt" type="radio" value="no" />
                            <label className="govuk-label govuk-radios__label" htmlFor="no">
                                No
                            </label>
                        </div>
                    </div>
                </fieldset>
            </div>
        </BaseLayout>
    );
};

export const getServerSideProps = async (ctx: NextPageContextWithSession): Promise<{ props: UserDataUploadsProps }> => {
    const csvUploadAttribute = getSessionAttribute(ctx.req, CSV_UPLOAD_ATTRIBUTE);

    const poundsOrPence = csvUploadAttribute?.poundsOrPence ?? null;

    const ticket = getSessionAttribute(ctx.req, MATCHING_JSON_ATTRIBUTE);
    const matchingJsonMetaData = getSessionAttribute(ctx.req, MATCHING_JSON_META_DATA_ATTRIBUTE);

    const backHref =
        ticket && matchingJsonMetaData
            ? `/products/productDetails?productId=${matchingJsonMetaData?.productId}${
                  matchingJsonMetaData.serviceId ? `&serviceId=${matchingJsonMetaData?.serviceId}` : ''
              }`
            : '';
    const nocCode = getAndValidateNoc(ctx);
    const serviceListAttribute = getSessionAttribute(ctx.req, SERVICE_LIST_ATTRIBUTE);
    let dataSourceAttribute = getSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE);
    const serviceListErrors =
        serviceListAttribute && isServiceListAttributeWithErrors(serviceListAttribute)
            ? serviceListAttribute.errors
            : [];
    const errors: ErrorInfo[] = csvUploadAttribute?.errors ?? [];
    const modesAttribute = getSessionAttribute(ctx.req, MULTI_MODAL_ATTRIBUTE);

    if (!dataSourceAttribute) {
        const services = await getAllServicesByNocCode(nocCode);
        const hasBodsServices = services.some((service) => service.dataSource && service.dataSource === 'bods');

        if (!hasBodsServices && !modesAttribute) {
            if (ctx.res) {
                redirectTo(ctx.res, '/noServices');
            } else {
                throw new Error(`No services found for NOC Code: ${nocCode}`);
            }
        }
        // removed as TNDS is being disabled until further notice
        // const hasTndsServices = services.some((service) => service.dataSource && service.dataSource === 'tnds');
        updateSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE, {
            source: hasBodsServices ? 'bods' : 'tnds',
            hasBods: true,
            hasTnds: false,
        });
        dataSourceAttribute = getSessionAttribute(ctx.req, TXC_SOURCE_ATTRIBUTE) as TxcSourceAttribute;
    }

    const { selectAll } = ctx.query;

    let chosenDataSourceServices;
    if (modesAttribute) {
        chosenDataSourceServices = await getTndsServicesByNocAndModes(nocCode, modesAttribute.modes);
    }
    chosenDataSourceServices = await getServicesByNocCodeAndDataSource(nocCode, dataSourceAttribute.source);

    const serviceList: ServicesInfo[] = chosenDataSourceServices.map((service) => {
        return {
            ...service,
            checked: !selectAll || (selectAll !== 'true' && selectAll !== 'false') ? false : selectAll !== 'false',
        };
    });

    return {
        props: {
            csvUploadApiRoute: '/api/csvUpload',
            csvUploadTitle: 'Upload fares triangle',
            csvUploadHintText:
                'Upload a fares triangle as a .csv or MS Excel file. Refer to the help documents section to download a help file or a fares triangle template.',
            guidanceDocDisplayName: 'Download Help File - File Type PDF - File Size 592KB',
            guidanceDocAttachmentUrl: HowToUploadFaresTriangle,
            guidanceDocSize: '1.2MB',
            csvTemplateDisplayName: 'Download fares triangle CSV template - File Type CSV - File Size 255B',
            csvTemplateAttachmentUrl: FaresTriangleExampleCsv,
            csvTemplateSize: '255B',
            errors: [...errors, ...serviceListErrors],
            detailSummary: "My fare triangle won't upload",
            showPriceOption: true,
            poundsOrPence,
            csrfToken: getCsrfToken(ctx),
            backHref,
            serviceList,
            buttonText: selectAll === 'true' ? 'Unselect All Services' : 'Select All Services',
            dataSourceAttribute,
        },
    };
};

export default CsvUpload;
