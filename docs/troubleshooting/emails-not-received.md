# Emails not received

The first thing to check would be if the recipient has simply got them locked up in a junk folder or similar, or if a firewall is stopping them receiving it, but if that is not the case, there are some steps that can be taken:

Check the logs in the site, to see if there is any stacktrace available to give a clue. Usually an error page would render on the site if this is the case, but not always.

If the email being sent is regarding a registration link, it is printed out by the script when it is ran, which means its always useful to copy this and put it in slack or similar.

If the email being sent is the users Netex, it can be found in S3 by using their NOC and/or UUID.
