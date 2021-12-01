/* eslint-disable camelcase */
import formidable from 'formidable';
import fs from 'fs';
import { NextApiRequest } from 'next';
import XLSX from 'xlsx';
import { ALLOWED_CSV_FILE_TYPES, ALLOWED_XLSX_FILE_TYPES } from '../../constants';
import logger from '../logger';
import { containsViruses } from './virusScan';

interface FileData {
    name: string;
    files: formidable.Files;
    fileContents: string;
    fields?: formidable.Fields;
}

interface FilesAndFields {
    files: formidable.Files;
    fields?: formidable.Fields;
}

interface FileUploadResponse {
    fileContents: string;
    fileError: string | null;
}

const MAX_FILE_SIZE = 5242880;

export const formParse = async (req: NextApiRequest): Promise<FilesAndFields> => {
    return new Promise<FilesAndFields>((resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            if (err) {
                return reject(err);
            }

            return resolve({
                files,
                fields,
            });
        });
    });
};

export const getFormData = async (req: NextApiRequest): Promise<FileData> => {
    const { files, fields } = await formParse(req);
    const { type, name } = files['csv-upload'];
    let fileContents = '';

    if (ALLOWED_CSV_FILE_TYPES.includes(type)) {
        fileContents = await fs.promises.readFile(files['csv-upload'].path, 'utf-8');
    } else if (ALLOWED_XLSX_FILE_TYPES.includes(type)) {
        const workBook = XLSX.readFile(files['csv-upload'].path);
        const sheetName = workBook.SheetNames[0];
        fileContents = XLSX.utils.sheet_to_csv(workBook.Sheets[sheetName]);
    }

    return {
        files,
        fileContents,
        fields,
        name,
    };
};

export const validateFile = (fileData: formidable.File, fileContents: string): string => {
    const { size, type, name } = fileData;

    if (!fileContents && name === '') {
        logger.warn('', { context: 'api.utils.validateFile', message: 'no file attached.' });

        return 'Select a CSV file to upload';
    }

    if (!fileContents && name !== '') {
        logger.warn('', { context: 'api.utils.validateFile', message: 'empty CSV Selected', fileName: name });

        return 'The selected file is empty';
    }

    if (size > MAX_FILE_SIZE) {
        logger.warn('', {
            context: 'api.utils.validateFile',
            message: 'file is too large',
            size,
            maxSize: MAX_FILE_SIZE,
        });

        return `The selected file must be smaller than 5MB`;
    }

    if (!ALLOWED_CSV_FILE_TYPES.includes(type) && !ALLOWED_XLSX_FILE_TYPES.includes(type)) {
        logger.warn('', { context: 'api.utils.validateFile', message: 'file not of allowed type', type });

        return 'The selected file must be a .csv or .xlsx';
    }

    return '';
};

export const processFileUpload = async (formData: FileData, inputName: string): Promise<FileUploadResponse> => {
    if (!formData.fileContents || formData.fileContents === '') {
        logger.warn('', { context: 'api.utils.processFileUpload', message: 'no file attached' });

        return {
            fileContents: '',
            fileError: 'Select a CSV file to upload',
        };
    }

    const fileData = formData.files[inputName];

    if (process.env.ENABLE_VIRUS_SCAN === '1') {
        if (await containsViruses(fileData.path)) {
            return {
                fileContents: '',
                fileError: 'The selected file contains a virus',
            };
        }
    }

    const { fileContents } = formData;

    const validationResult = validateFile(fileData, fileContents);

    return {
        fileContents,
        fileError: validationResult || null,
    };
};
