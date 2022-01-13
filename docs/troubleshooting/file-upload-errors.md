# File upload errors

As part of a couple of journeys on the site, users are required to upload a CSV file for their fares triangle or fare zone, this file is processed and passed through a virus scanner. There are a few potential errors users could encounter.

## File contains a virus

- If a user mentions that they receive an error saying the file contains a virus, the logs should be checked first (see [Search logs](../how-to/search-logs.md))) to see what detail ClamAV provides.
- The file will not be uploaded to S3 in the case that there is a virus detected.
- If the user sends the file to you directly, gmail should perform a virus scan for you but still be cautious when opening a file sent from an unknown source
- Given the nature of the uploaded files, it is highly unlikely that ClamAV would report a false positive so any report of a virus is likely genuine and the user will need to check this themselves

## Other file upload error

In the case where the file does not contain a virus but is still failing it will most likely be due to an invalid file structure, we provide guidance on the site to help users but they may still get in touch.

- Check the logs for any errors around the file upload (see [Search logs](../how-to/search-logs.md)) and retrieve the S3 file name
- Use the filename to locate it in S3 and download it (see [Accessing data in S3](../how-to/access-data-in-s3.md))
- Analyse the file locally to find the issue and report it back to the user / service desk
