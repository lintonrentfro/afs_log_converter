afs_log_converter
=================

Converts an AFS log file into a readable report showing which user closed each batch.

afs_log_converter is designed to work with an old version of AFS that has no built-in report of this type.

The log files are located in X:\vision\logs.  If afs_log_converter doesn't work on your particular AFS logs, consider
branching the project and modifying the regex to suit the format of the logs you're working with.
