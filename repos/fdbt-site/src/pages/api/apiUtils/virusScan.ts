import NodeClam from 'clamscan';

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

    return clamscan.is_infected(pathToFileToScan).is_infected;
};

export default containsViruses;
