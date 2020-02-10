import '../design/Components.scss';
import React, { ReactElement, FC } from 'react';

export interface TableFormProps {
    offset: number;
}

const getRows = (offset: number): ReactElement[] => {
    const rows: ReactElement[] = [];
    for (let row = 1; row <= 10 + offset; row += 1) {
        const cols: ReactElement[] = [];
        for (let col = 1; col <= 10; col += 1) {
            cols.push(
                <td key={col}>
                    <input className="govuk-input" id={`row${row}col${col}`} name={`row${row}col${col}`} type="text" />
                </td>,
            );
        }
        rows.push(<tr key={row}>{cols}</tr>);
    }

    return rows;
};

const TableForm: FC<TableFormProps> = ({ offset }: TableFormProps) => (
    <form method="post" action="/api/stages" className="form-control ">
        <div className="govuk-form-group">
            <table className="govuk-table">
                <caption className="govuk-table__caption">Please fill out the table</caption>
                <thead className="govuk-table__head">
                    <tr className="govuk-table__row">
                        <th scope="col" className="govuk-table__header">
                            Header 1
                        </th>
                        <th scope="col" className="govuk-table__header">
                            Header 2
                        </th>
                        <th scope="col" className="govuk-table__header">
                            Header 3
                        </th>
                        <th scope="col" className="govuk-table__header">
                            Header 4
                        </th>
                        <th scope="col" className="govuk-table__header">
                            Header 5
                        </th>
                        <th scope="col" className="govuk-table__header">
                            Header 6
                        </th>
                        <th scope="col" className="govuk-table__header">
                            Header 7
                        </th>
                        <th scope="col" className="govuk-table__header">
                            Header 8
                        </th>
                        <th scope="col" className="govuk-table__header">
                            Header 9
                        </th>
                        <th scope="col" className="govuk-table__header">
                            Header 10
                        </th>
                    </tr>
                </thead>
                <tbody className="govuk-table__body" id="table_form_body">
                    {getRows(offset)}
                </tbody>
            </table>
        </div>
        <input type="submit" value="Submit" className="govuk-button govuk-button--start" />
    </form>
);

export default TableForm;
