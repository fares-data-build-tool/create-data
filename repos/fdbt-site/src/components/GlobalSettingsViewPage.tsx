import { capitalize } from 'lodash';
import React, { FunctionComponent, ReactElement, useState } from 'react';
import DeleteConfirmationPopup from '../components/DeleteConfirmationPopup';
import { BaseLayout } from '../layout/Layout';
import SubNavigation from '../layout/SubNavigation';

type Entity = { id: number; name: string };

interface GlobalSettingsViewPageProps<T extends Entity> {
    csrfToken: string;
    entities: T[];
    referer: string | null;
    title: string;
    description: string;
    entityDescription: string;
    CardBody: FunctionComponent<{ entity: T }>;
}

export const GlobalSettingsViewPage = <T extends Entity>({
    entities,
    referer,
    csrfToken,
    title,
    description,
    entityDescription,
    CardBody,
}: GlobalSettingsViewPageProps<T>): ReactElement => {
    const entityUrl = entityDescription
        .split(' ')
        .map((it) => capitalize(it))
        .join('');

    const [popUpState, setPopUpState] = useState<{ entityId: number; entityName: string }>();

    const deleteActionHandler = (id: number, name: string): void => {
        setPopUpState({ entityId: id, entityName: name });
    };

    const cancelActionHandler = (): void => {
        setPopUpState(undefined);
    };

    const buildDeleteUrl = (idToDelete: number, csrfToken: string): string => {
        return `/api/delete${entityUrl}?id=${idToDelete}&_csrf=${csrfToken}`;
    };

    const noEntities = () => (
        <div className="govuk-heading-m">
            <p className="govuk-body">
                <em>You currently have no {entityDescription}s saved.</em>
            </p>
            <a className="govuk-button" data-module="govuk-button" href={`/manage${entityUrl}`}>
                Add a {entityDescription}
            </a>
        </div>
    );

    const cards = () => (
        <>
            <div className="govuk-grid-row">
                {entities.map((entity) => (
                    <div key={entity.id} className="govuk-grid-column-one-half govuk-!-margin-bottom-5">
                        <div className="card">
                            <div className={'card__body ' + entityDescription.replace(/ /g, '-')}>
                                <div className="card__actions">
                                    <ul className="actions__list">
                                        <li className="actions__item">
                                            <a
                                                className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular"
                                                href={`/manage${entityUrl}?id=${entity.id}`}
                                            >
                                                Edit
                                            </a>
                                        </li>

                                        <li className="actions__item">
                                            <button
                                                className="govuk-link govuk-!-font-size-16 govuk-!-font-weight-regular actions__delete"
                                                onClick={() => {
                                                    deleteActionHandler(entity.id, entity.name);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                                {<CardBody entity={entity} />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <a className="govuk-button" data-module="govuk-button" href={`/manage${entityUrl}`}>
                Add a {entityDescription}
            </a>
        </>
    );

    return (
        <BaseLayout title={title} description={description} showNavigation referer={referer}>
            <div className="govuk-width-container">
                <main className="govuk-main-wrapper">
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-one-third">
                            <SubNavigation />
                        </div>

                        <div className="govuk-grid-column-two-thirds">
                            <h1 className="govuk-heading-xl">{title}</h1>
                            <p className="govuk-body">{description}</p>

                            {entities.length ? cards() : noEntities()}

                            {popUpState && (
                                <DeleteConfirmationPopup
                                    entityType={entityDescription}
                                    entityName={popUpState.entityName}
                                    deleteUrl={buildDeleteUrl(popUpState.entityId, csrfToken)}
                                    cancelActionHandler={cancelActionHandler}
                                />
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </BaseLayout>
    );
};
