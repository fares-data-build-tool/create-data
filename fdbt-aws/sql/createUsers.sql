CREATE USER 'fdbt_ref_data' @'%' IDENTIFIED BY '<INSERT PASSWORD>';

GRANT SELECT, INSERT, DELETE, DROP, REFERENCES, LOAD FROM S3 ON fdbt.* TO 'fdbt_ref_data' @'%';

CREATE USER 'fdbt_site' @'%' IDENTIFIED BY '<INSERT PASSWORD>';

GRANT SELECT ON fdbt.* TO 'fdbt_site' @'%';

CREATE USER 'fdbt_netex' @'%' IDENTIFIED BY '<INSERT PASSWORD>';

GRANT SELECT ON fdbt.* TO 'fdbt_netex' @'%';