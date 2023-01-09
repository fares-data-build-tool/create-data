import { NextApiResponse } from 'next';
import { NextApiRequestWithSession } from '../../interfaces';
import { redirectToError, redirectTo } from '../../utils/apiUtils';
import { MULTI_MODAL_ATTRIBUTE, OPERATOR_ATTRIBUTE } from '../../constants/attributes';
import { updateSessionAttribute, regenerateSession } from '../../utils/sessions';
import { getAllServicesByNocCode } from '../../data/auroradb';

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        if (req.body.operator) {
            const splitOperator = (req.body.operator as string).split('|');
            const noc = splitOperator.slice(-1)[0];

            regenerateSession(req);

            updateSessionAttribute(req, OPERATOR_ATTRIBUTE, {
                name: splitOperator[0],
                nocCode: noc,
            });

            let uniqueModes: string[] = [];
            const services = await getAllServicesByNocCode(noc);
            const hasBodsServices = services.some((service) => service.dataSource && service.dataSource === 'bods');
            const tndsServices = services.filter((service) => service.dataSource && service.dataSource === 'tnds');

            if (!hasBodsServices && tndsServices.length > 0) {
                const modes = tndsServices
                    .map((service) => {
                        return service.mode ? service.mode : '';
                    })
                    .filter((mode) => mode !== '');

                uniqueModes = Array.from(new Set(modes));
            }

            updateSessionAttribute(
                req,
                MULTI_MODAL_ATTRIBUTE,
                uniqueModes.length > 0 ? { modes: uniqueModes } : undefined,
            );

            redirectTo(res, '/home');
        } else {
            updateSessionAttribute(req, OPERATOR_ATTRIBUTE, {
                errors: [
                    {
                        id: 'operators',
                        errorMessage: 'Choose an operator name and NOC from the options',
                    },
                ],
            });
            redirectTo(res, '/multipleOperators');
        }
    } catch (error) {
        const message = 'There was a problem setting operator and/or noc';
        redirectToError(res, message, 'api.multipleOperators', error);
    }
};
