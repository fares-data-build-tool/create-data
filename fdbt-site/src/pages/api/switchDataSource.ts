import { NextApiResponse } from 'next';
import { MULTI_OP_TXC_SOURCE_ATTRIBUTE, TXC_SOURCE_ATTRIBUTE } from '../../constants/attributes';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { redirectToError, redirectTo } from './apiUtils/index';
import { NextApiRequestWithSession } from '../../interfaces';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const { referer, attributeVersion } = req.body;
        const attributeToUse =
            attributeVersion === 'baseOperator' ? TXC_SOURCE_ATTRIBUTE : MULTI_OP_TXC_SOURCE_ATTRIBUTE;
        const dataSource = getSessionAttribute(req, attributeToUse);

        if (!dataSource) {
            throw new Error('Datasource has been incorrectly set and is neither TNDS nor BODS');
        }

        const newDataSource = dataSource.source === 'bods' ? 'tnds' : 'bods';
        updateSessionAttribute(req, attributeToUse, { ...dataSource, source: newDataSource });
        redirectTo(res, referer);
    } catch (error) {
        const message = 'There was a problem switching the TXC datasource:';
        redirectToError(res, message, 'api.switchDataSource', error);
    }
};
