SET
    FOREIGN_KEY_CHECKS = 0;

TRUNCATE nocLine;

LOAD DATA
FROM
    S3 's3-eu-west-2://fdbt-noc-data-test/NOCLines.csv' REPLACE INTO TABLE nocLine FIELDS TERMINATED BY ',' ENCLOSED BY '"' ESCAPED BY '' LINES TERMINATED BY '\n' IGNORE 1 lines (
        nocLineNo,
        nocCode,
        pubNm,
        refNm,
        licence,
        mode,
        tlRegOwn,
        ebsrAgent,
        lo,
        sw,
        wm,
        wa,
        yo,
        nw,
        ne,
        sc,
        se,
        ea,
        em,
        ni,
        nx,
        megabus,
        newBharat,
        terravision,
        ncsd,
        easybus,
        yorksRt,
        travelEnq,
        comment,
        auditDate,
        auditEditor,
        auditComment,
        duplicate,
        dateCeased,
        cessationComment
    );

SET
    FOREIGN_KEY_CHECKS = 1;