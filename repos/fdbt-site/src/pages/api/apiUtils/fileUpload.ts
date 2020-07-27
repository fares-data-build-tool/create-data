import formidable, { Files } from 'formidable';
import { NextApiRequest } from 'next';
import fs from 'fs';
import { ALLOWED_CSV_FILE_TYPES } from '../../../constants';
import logger from '../../../utils/logger';

interface FileData {
    files: formidable.Files;
    fileContents: string;
}

interface FileUploadResponse {
    fileContents: string;
    fileError: string | null;
}

const MAX_FILE_SIZE = 5242880;

export const formParse = async (req: NextApiRequest): Promise<Files> => {
    return new Promise<Files>((resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, _fields, file) => {
            if (err) {
                return reject(err);
            }
            return resolve(file);
        });
    });
};

export const getFormData = async (req: NextApiRequest): Promise<FileData> => {
    const files = await formParse(req);
    const fileContents = await fs.promises.readFile(files['csv-upload'].path, 'utf-8');

    return {
        files,
        fileContents,
    };
};

export const validateFile = (fileData: formidable.File, fileContents: string): string => {
    const { size, type, name } = fileData;

    if (!fileContents && name === '') {
        logger.warn({ context: 'api.utils.validateFile', message: 'no file attached.' });

        return 'Select a CSV file to upload';
    }

    if (!fileContents && name !== '') {
        logger.warn({ context: 'api.utils.validateFile', message: 'empty CSV Selected', fileName: name });

        return 'The selected file is empty';
    }

    if (size > MAX_FILE_SIZE) {
        logger.warn({ context: 'api.utils.validateFile', message: 'file is too large', size, maxSize: MAX_FILE_SIZE });

        return `The selected file must be smaller than 5MB`;
    }

    if (!ALLOWED_CSV_FILE_TYPES.includes(type)) {
        logger.warn({ context: 'api.utils.validateFile', message: 'file not of allowed type', type });

        return 'The selected file must be a CSV';
    }

    return '';
};

export const processFileUpload = async (req: NextApiRequest, inputName: string): Promise<FileUploadResponse> => {
    const formData = await getFormData(req);

    const fileData = formData.files[inputName];
    const { fileContents } = formData;

    const validationResult = validateFile(fileData, fileContents);

    return {
        fileContents,
        fileError: validationResult || null,
    };
};
