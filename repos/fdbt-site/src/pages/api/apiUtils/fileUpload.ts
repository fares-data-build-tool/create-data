/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import formidable from 'formidable';
import { NextApiRequest } from 'next';
import fs from 'fs';
import NodeClam from 'clamscan';
import XLSX from 'xlsx';
import { ALLOWED_XLSX_FILE_TYPES, ALLOWED_CSV_FILE_TYPES } from '../../../constants/index';
import logger from '../../../utils/logger';

interface FileData {
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
    const { type } = files['csv-upload'];
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

export const containsViruses = async (pathToFileToScan: string): Promise<boolean> => {
    const ClamScan = new NodeClam().init({
        remove_infected: false,
        quarantine_infected: false,
        scan_log: null,
        debug_mode: true,
        file_list: null,
        scan_recursively: true,
        clamdscan: {
            timeout: 60000,
            local_fallback: false,
            path: process.env.NODE_ENV === 'development' ? '/usr/local/bin/clamdscan' : '/usr/bin/clamdscan',
            multiscan: true,
            reload_db: false,
            active: true,
            bypass_test: false,
        },
        preference: 'clamdscan',
    });

    const clamscan = await ClamScan;

    const { is_infected } = await clamscan.is_infected(pathToFileToScan);

    return is_infected;
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
