GRANT USAGE ON fdbt.* TO 'fdbt_ref_data'@'%' IDENTIFIED BY 'password';
DROP USER 'fdbt_ref_data'@'%';
CREATE USER 'fdbt_ref_data'@'%' IDENTIFIED BY '<INSERT PASSWORD>';
GRANT SELECT, INSERT, DELETE, DROP, REFERENCES ON fdbt.* TO 'fdbt_ref_data'@'%';
GRANT LOAD FROM S3 ON *.* TO 'fdbt_ref_data'@'%';

GRANT USAGE ON fdbt.* TO 'fdbt_site'@'%' IDENTIFIED BY 'password';
DROP USER 'fdbt_site'@'%';
CREATE USER 'fdbt_site'@'%' IDENTIFIED BY '<INSERT PASSWORD>';
GRANT SELECT ON fdbt.* TO 'fdbt_site'@'%';

GRANT USAGE ON fdbt.* TO 'fdbt_netex'@'%' IDENTIFIED BY 'password';
DROP USER 'fdbt_netex'@'%';
CREATE USER 'fdbt_netex'@'%' IDENTIFIED BY '<INSERT PASSWORD>';
GRANT SELECT ON fdbt.* TO 'fdbt_netex'@'%';