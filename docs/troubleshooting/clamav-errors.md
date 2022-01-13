# ClamAV errors

It is possible for ClamAV to error when a user attempts to upload a file, if this causes the site to show the error page rather than displaying a contextual error for the user then it means there is an issue with the clamd process, if it shows a contextual error message then it means there is an issue with the file, see [File upload errors](./file-upload-errors.md)

clamd is a daemon which checks the file against the virus database, if it crashes then it will cause all file uploads to fail and it will need to be restarted. [Supervisord](http://supervisord.org/) is used to manage the process and restart it if it falls over, in the case where this does not work, the fargate tasks will need to be cycled to get it running again, see [scale or cycle Fargate tasks](../how-to/scale-or-cycle-fargate-tasks.md) for details on how to do this.
