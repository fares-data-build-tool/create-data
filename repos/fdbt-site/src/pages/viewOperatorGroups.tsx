import React, { ReactElement, useState } from 'react';
import DeleteConfirmationPopup from '../components/DeleteConfirmationPopup';
// import UnableToDeletePopup from '../components/UnableToDeletePopup';
import { getOperatorGroupsByNoc } from '../data/auroradb';
import { NextPageContextWithSession, OperatorGroup } from '../interfaces';
import { BaseLayout } from '../layout/Layout';
import SubNavigation from '../layout/SubNavigation';
import { getAndValidateNoc, getCsrfToken } from '../utils';
import { extractGlobalSettingsReferer } from '../utils/globalSettings';
import { updateSessionAttribute } from '../utils/sessions';
import { FromDb } from 'fdbt-types/matchingJsonTypes';
import { GS_OPERATOR_GROUP_ATTRIBUTE, MANAGE_OPERATOR_GROUP_ERRORS_ATTRIBUTE } from '../constants/attributes';
import OperatorGroupCard from '../components/OperatorGroupCard';

const title = 'Operator Groups - Create Fares Data Service';
const description = 'View and edit your operator groups.';

interface ViewOperatorGroupsProps {
    csrfToken: string;
    operatorGroups: FromDb<OperatorGroup>[];
    referer: string | null;
    isDevOrTest: boolean;
}

const ViewOperatorGroups = ({
    operatorGroups,
    csrfToken,
    referer,
    isDevOrTest,
}: ViewOperatorGroupsProps): ReactElement => {
    const [popUpState, setPopUpState] = useState<{
        operatorGroupName: string;
        operatorGroupId: number;
    }>();

    const deleteActionHandler = (id: number, name: string): void => {
        setPopUpState({
            ...popUpState,
            operatorGroupName: name,
            operatorGroupId: id,
        });
    };

    const cancelActionHandler = (): void => {
        setPopUpState(undefined);
    };

    const buildDeleteUrl = (idToDelete: number, csrfToken: string): string => {
        return `/api/deleteOperatorGroup?id=${idToDelete}&_csrf=${csrfToken}`;
    };

    return (
        <BaseLayout title={title} description={description} showNavigation referer={referer}>
            <div className="govuk-grid-row" data-card-count={operatorGroups.length}>
                <div className="govuk-grid-column-one-quarter">
                    <SubNavigation isDevOrTest={isDevOrTest} />
                </div>

                <div className="govuk-grid-column-three-quarters">
                    <h1 className="govuk-heading-xl">Operator Groups</h1>
                    <p className="govuk-body govuk-!-margin-bottom-8">
                        Define a group of operators for use in a multioperator product
                    </p>

                    <div>
                        {!operatorGroups.length ? (
                            <NoOperatorGroups />
                        ) : (
                            <div className="card-row">
                                {operatorGroups.map((operatorGroup, index) => (
                                    <>
                                        <OperatorGroupCard
                                            index={index}
                                            operatorGroup={operatorGroup}
                                            key={operatorGroup.id.toString()}
                                            defaultChecked={false}
                                            deleteActionHandler={deleteActionHandler}
                                        />

                                        {popUpState && (
                                            <DeleteConfirmationPopup
                                                entityName={popUpState.operatorGroupName}
                                                deleteUrl={buildDeleteUrl(popUpState.operatorGroupId, csrfToken)}
                                                cancelActionHandler={cancelActionHandler}
                                            />
                                        )}
                                    </>
                                ))}
                            </div>
                        )}

                        <a
                            className="govuk-button govuk-button"
                            data-module="govuk-button"
                            href="/searchOperators"
                            aria-disabled
                        >
                            Add a operator group
                        </a>
                    </div>
                </div>
            </div>
        </BaseLayout>
    );
};

const NoOperatorGroups = (): ReactElement => {
    return (
        <>
            <p className="govuk-body">
                <em>You currently have no operator groups saved.</em>
            </p>
        </>
    );
};

export const getServerSideProps = async (
    ctx: NextPageContextWithSession,
): Promise<{ props: ViewOperatorGroupsProps }> => {
    const csrfToken = getCsrfToken(ctx);
    const nationalOperatorCode = getAndValidateNoc(ctx);
    const operatorGroups = await getOperatorGroupsByNoc(nationalOperatorCode);
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isTest = process.env.STAGE === 'test';

    updateSessionAttribute(ctx.req, GS_OPERATOR_GROUP_ATTRIBUTE, undefined);
    updateSessionAttribute(ctx.req, MANAGE_OPERATOR_GROUP_ERRORS_ATTRIBUTE, undefined);

    return {
        props: {
            csrfToken,
            operatorGroups,
            referer: extractGlobalSettingsReferer(ctx),
            isDevOrTest: isDevelopment || isTest,
        },
    };
};

export default ViewOperatorGroups;
