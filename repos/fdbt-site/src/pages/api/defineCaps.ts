import { NextApiResponse } from 'next';
import { CAPS_DEFINITION_ATTRIBUTE } from '../../constants/attributes';
import { getCapByNocAndId } from '../../data/auroradb';
import { getAndValidateNoc, redirectTo, redirectToError } from '../../utils/apiUtils/index';
import { CapInfo, CapSelection, CapsDefinitionWithErrors, NextApiRequestWithSession, PremadeCap } from 'src/interfaces';
import { updateSessionAttribute } from '../../../src/utils/sessions';

const getCapContent = async (
    cap: number | undefined,
    noc: string,
): Promise<
    | {
          dbCap: PremadeCap;
          caps: CapInfo;
      }
    | undefined
> => {
    if (!cap) {
        return undefined;
    }

    const result = await getCapByNocAndId(noc, cap);

    if (!result) {
        throw new Error('No premade caps saved under the provided name');
    }

    const dbCap = { id: result.id, contents: result } as PremadeCap;
    const caps = result;

    return {
        dbCap,
        caps,
    };
};

export default async (req: NextApiRequestWithSession, res: NextApiResponse): Promise<void> => {
    try {
        const { capChoice, cap } = req.body;

        if (!capChoice) {
            const capDefinitionWithErrors: CapsDefinitionWithErrors = {
                id: cap,
                capChoice,
                errors: [{ errorMessage: 'Choose one of the options below', id: 'no-caps' }],
            };

            updateSessionAttribute(req, CAPS_DEFINITION_ATTRIBUTE, capDefinitionWithErrors);
            redirectTo(res, '/selectCaps');
            return;
        }

        const noc = getAndValidateNoc(req, res);

        if (capChoice === 'yes' && !cap) {
            const capDefinitionWithErrors: CapsDefinitionWithErrors = {
                id: null,
                fullCaps: [],
                capChoice,
                errors: [{ errorMessage: 'Choose one of the premade caps', id: 'caps' }],
            };

            updateSessionAttribute(req, CAPS_DEFINITION_ATTRIBUTE, capDefinitionWithErrors);
            redirectTo(res, '/selectCaps');
            return;
        }

        const selectedCap = await getCapContent(cap, noc);

        if (capChoice === 'yes' && selectedCap) {
            updateSessionAttribute(req,  CAPS_DEFINITION_ATTRIBUTE, {
                fullCaps: [selectedCap.caps],
                errors: [],
                id: selectedCap.dbCap.id,
            });
            redirectTo(res, '/selectPurchaseMethods');
            return;
        }

        updateSessionAttribute(req, CAPS_DEFINITION_ATTRIBUTE, undefined);
        redirectTo(res, '/selectPurchaseMethods');
        return;
    } catch (error) {
        const message = 'There was a problem in the defineCaps API.';
        redirectToError(res, message, 'api.defineCaps', error);
    }
};
