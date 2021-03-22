import { NextApiResponse } from 'next';
import { getSessionAttribute, updateSessionAttribute } from '../../utils/sessions';
import { TXC_SOURCE_ATTRIBUTE } from '../../constants/attributes';
import { redirectToError, redirectTo } from './apiUtils/index';
import { NextApiRequestWithSession } from '../../interfaces';

export default (req: NextApiRequestWithSession, res: NextApiResponse): void => {
    try {
        const { referer } = req.body;
        const dataSource = getSessionAttribute(req, TXC_SOURCE_ATTRIBUTE);

        if (!dataSource) {
            throw new Error('Datasource has been incorrectly set and is neither TNDS nor BODS');
        }

        const newDataSource = dataSource.source === 'bods' ? 'tnds' : 'bods';
        updateSessionAttribute(req, TXC_SOURCE_ATTRIBUTE, { ...dataSource, source: newDataSource });
        redirectTo(res, referer);
    } catch (error) {
        const message = 'There was a problem switching the TXC datasource:';
        redirectToError(res, message, 'api.switchDataSource', error);
    }
};
