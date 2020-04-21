import formidable, { Files } from 'formidable';
import { NextApiRequest } from 'next';
import fs from 'fs';
import { ALLOWED_CSV_FILE_TYPES } from '../../../constants';

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
        console.warn('No file attached.');

        return 'Select a CSV file to upload';
    }

    if (!fileContents && name !== '') {
        console.warn(`Empty CSV Selected, name: ${name}`);

        return 'The selected file is empty';
    }

    if (size > MAX_FILE_SIZE) {
        console.warn(`File is too large. Uploaded file is ${size} Bytes, max size is ${MAX_FILE_SIZE} Bytes`);

        return `The selected file must be smaller than 5MB`;
    }

    if (!ALLOWED_CSV_FILE_TYPES.includes(type)) {
        console.warn(`File not of allowed type, uploaded file is ${type}`);

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
