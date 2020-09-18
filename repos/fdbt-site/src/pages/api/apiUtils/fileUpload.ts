/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import formidable, { Files } from 'formidable';
import { NextApiRequest } from 'next';
import fs from 'fs';
import NodeClam from 'clamscan';
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

    if (!ALLOWED_CSV_FILE_TYPES.includes(type)) {
        logger.warn('', { context: 'api.utils.validateFile', message: 'file not of allowed type', type });

        return 'The selected file must be a CSV';
    }

    return '';
};

export const containsViruses = async (pathToFileToScan: string): Promise<boolean> => {
    const ClamScan = new NodeClam().init({
        remove_infected: false, // If true, removes infected files
        quarantine_infected: false, // False: Don't quarantine, Path: Moves files to this place.
        scan_log: null, // Path to a writeable log file to write scan results into
        debug_mode: false, // Whether or not to log info/debug/error msgs to the console
        file_list: null, // path to file containing list of files to scan (for scan_files method)
        scan_recursively: true, // If true, deep scan folders recursively
        clamscan: {
            path: '/usr/local/bin/clamscan', // Path to clamscan binary on your server
            db: null, // Path to a custom virus definition database
            scan_archives: true, // If true, scan archives (ex. zip, rar, tar, dmg, iso, etc...)
            active: true, // If true, this module will consider using the clamscan binary
        },
        clamdscan: {
            socket: false, // Socket file for connecting via TCP
            host: false, // IP of host to connect to TCP interface
            port: false, // Port of host to use when connecting via TCP interface
            timeout: 60000, // Timeout for scanning files
            local_fallback: false, // Do no fail over to binary-method of scanning
            path: process.env.NODE_ENV === 'development' ? 'usr/local/bin/clamdscan' : 'usr/bin/clamdscan', // Path to the clamdscan binary on your server
            config_file: null, // Specify config file if it's in an unusual place
            multiscan: true, // Scan using all available cores! Yay!
            reload_db: false, // If true, will re-load the DB on every call (slow)
            active: true, // If true, this module will consider using the clamdscan binary
            bypass_test: false, // Check to see if socket is available when applicable
        },
        preference: 'clamdscan', // If clamdscan is found and active, it will be used by default
    });

    const clamscan = await ClamScan;

    const { is_infected } = await clamscan.is_infected(pathToFileToScan);

    return is_infected;
};

export const processFileUpload = async (req: NextApiRequest, inputName: string): Promise<FileUploadResponse> => {
    const formData = await getFormData(req);

    if (!formData.fileContents || formData.fileContents === '') {
        logger.warn('', { context: 'api.utils.processFileUpload', message: 'no file attached' });
        return {
            fileContents: '',
            fileError: 'Select a CSV file to upload',
        };
    }

    const fileData = formData.files[inputName];

    if (process.env.NODE_ENV !== 'development') {
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
