import { NextApiRequestWithSession } from '../../interfaces';
import { NextApiResponse } from 'next';
import { getAttributeFromIdToken } from '../../utils/apiUtils';
import { updateUserAttributes } from '../../data/cognito';
import logger from '../../utils/logger';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const isLocal = req.headers?.host?.startsWith('localhost');

        if (isLocal) {
            return res.status(200).json({ success: true });
        }

        const email: string | null = getAttributeFromIdToken(req, res, 'email');
        const attributeName: string | undefined = req.body.attributeName;
        const attributeValue: string | undefined = req.body.attributeValue;

        if (!email || !attributeName || !attributeValue) {
            return res.status(400).json({ success: false });
        }

        await updateUserAttributes(email, [{ Name: attributeName, Value: attributeValue }]);

        logger.info('', {
            context: 'api.updateUserAttribute',
            message: 'update for user attribute successful',
        });
    } catch (error) {
        logger.error(error, {
            context: 'api.updateUserAttribute',
            message: 'update for user attribute failed',
        });
        return res.status(500).json({ success: false });
    }
};
