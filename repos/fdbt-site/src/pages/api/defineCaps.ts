import { NextApiResponse } from 'next';
import { FULL_CAPS_ATTRIBUTE, CAPS_DEFINITION_ATTRIBUTE } from '../../constants/attributes';
import { getCapByNocAndId } from '../../data/auroradb';
import { getAndValidateNoc, redirectTo, redirectToError } from '../../utils/apiUtils/index';
import { CapInfo, CapSelection, CapsDefinitionWithErrors, NextApiRequestWithSession, PremadeCap } from 'src/interfaces';
import { updateSessionAttribute } from 'src/utils/sessions';

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

    const dbCap = { id: result.id, contents: result };
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
                errors: [{ errorMessage: 'Choose one of the options below', id: 'is-cap' }],
            };

            updateSessionAttribute(req, CAPS_DEFINITION_ATTRIBUTE, capDefinitionWithErrors);
            redirectTo(res, '/selectCaps');
            return;
        }

        const noc = getAndValidateNoc(req, res);

        if (capChoice === 'Premade' && !cap) {
            const capDefinitionWithErrors: CapsDefinitionWithErrors = {
                id: cap,
                capChoice,
                errors: [{ errorMessage: 'Choose one of the premade caps', id: 'cap' }],
            };

            updateSessionAttribute(req, CAPS_DEFINITION_ATTRIBUTE, capDefinitionWithErrors);
            redirectTo(res, '/selectCaps');
            return;
        }

        const selectedCap = await getCapContent(cap, noc);

        if (capChoice === 'Premade' && selectedCap) {
            updateSessionAttribute(req, FULL_CAPS_ATTRIBUTE, {
                fullCaps: [selectedCap.caps],
                errors: [],
                id: selectedCap.dbCap.id,
            });

            updateSessionAttribute(req, CAPS_DEFINITION_ATTRIBUTE, undefined);
            redirectTo(res, '/selectPurchaseMethods');
            return;
        }

        const capsDefinition: CapSelection = {
            id: null,
        };

        updateSessionAttribute(req, FULL_CAPS_ATTRIBUTE, { fullCaps: [], errors: [] });
        updateSessionAttribute(req, CAPS_DEFINITION_ATTRIBUTE, capsDefinition);
        redirectTo(res, '/selectPurchaseMethods');
        return;
    } catch (error) {
        const message = 'There was a problem in the defineCaps API.';
        redirectToError(res, message, 'api.defineCaps', error);
    }
};
