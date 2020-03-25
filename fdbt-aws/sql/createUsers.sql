CREATE USER 'fdbt_reference_data' @'%' IDENTIFIED BY '<INSERT PASSWORD>';

GRANT SELECT, INSERT, DELETE, DROP, REFERENCES, LOAD FROM S3 ON fdbt.* TO 'fdbt_reference_data' @'%';

CREATE USER 'fdbt_site' @'%' IDENTIFIED BY '<INSERT PASSWORD>';

GRANT SELECT ON fdbt.* TO 'fdbt_site' @'%';

CREATE USER 'fdbt_netex_output' @'%' IDENTIFIED BY '<INSERT PASSWORD>';

GRANT SELECT ON fdbt.* TO 'fdbt_netex_output' @'%';