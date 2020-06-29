import React, { ReactElement } from 'react';
import { Breadcrumb } from '../interfaces';

interface BreadcrumbsProps {
    breadcrumbs: Breadcrumb[];
}

const Breadcrumbs = ({ breadcrumbs }: BreadcrumbsProps): ReactElement => (
    <div className="govuk-breadcrumbs">
        <ol className="govuk-breadcrumbs__list">
            {breadcrumbs.map(breadcrumb => (
                <li className="govuk-breadcrumbs__list-item">
                    <a className="govuk-breadcrumbs__link" href={breadcrumb.link}>
                        {breadcrumb.name}
                    </a>
                </li>
            ))}
        </ol>
    </div>
);

export default Breadcrumbs;
