# S3 Bucket Path & File path Structure

## User Data S3 Bucket Path & File path Structure

```
/<user_data_bucket_name>
    /fareStages
      /unvalidated
        /<NOCCODE>
          /unvalidated_<NOCCODE>_<LINENUMNER>_<date_time>.csv
          /unvalidated_<NOCCODE>_<LINENUMNER>_<date_time>.csv
          /unvalidated_<NOCCODE>_<LINENUMNER>_<date_time>.csv
      /validated
        /<NOCCODE>
         /validated_<NOCCODE>_<LINENUMNER>_<date_time>.csv
         /validated_<NOCCODE>_<LINENUMNER>_<date_time>.csv
    /matching
      /<NOCCODE>
        /matching_<NOCCODE>_<LINENUMNER>_<date_time>.json
        /matching_<NOCCODE>_<LINENUMNER>_<date_time>.json
```

Where:

- `<user_data_bucket_name>` is the chosen name of the bucket
- `<NOC_CODE>` is the noc code of the operator
- `<LINENUMBER>` is the chosen line number
- `<date_time>` is the UTC date and time

S3 event triggers:

- Files uploaded to the `matching` will trigger the netex convertor lambda via s3 event

# Reference data S3 Bucket Path & File path Structure

```
/<ref_data_bucket_name>
  /NOC
    /NOCLines.csv
    /NOCTables.csv
    /PublicName.csv
  /NaPTAN
    /stops.csv
  /TNDS
    /servicereport.csv
    /Y
      /<file_name>.xml
      /<file_name>.xml
      /<file_name>.xml
  /NTPG
    /Localities.csv
    /Districts.csv
```

Where:

- `<ref_data_bucket_name>` is the chosen name of the bucket
- `<file_name>` is the file name received from the FTP site.

S3 event triggers:

- Files uploaded to the `NOC` will trigger the NOC ref-data-uploader lambda via s3 event
- Files uploaded to the `NaPTAN` will trigger the NaPTAN ref-data-uploader lambda via s3 event
- Files uploaded to the `TNDS` will trigger the TNDS ref-data-uploader lambda via s3 event
- Files uploaded to the `NTPG` will trigger the NTPG ref-data-uploader lambda via s3 event
