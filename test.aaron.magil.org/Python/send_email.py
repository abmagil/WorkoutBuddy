#!/usr/bin/python
# Import smtplib for the actual sending function
import smtplib

# Import the email modules we'll need
from email.mime.text import MIMEText

## Open a plain text file for reading.  For this example, assume that
## the text file contains only ASCII characters.
fp = open("core", 'rb')
## Create a text/plain message
msg = MIMEText(fp.read())
fp.close()

me = "mail@aaron.magil.org"
you = "abmagil@gmail.com"
msg['Subject'] = 'The contents of test'
msg['From'] = me
msg['To'] = you

# Send the message via our own SMTP server, but don't include the
# envelope header.
s = smtplib.SMTP('mail.aaron.magil.org')
s.sendmail(me, [you], msg.as_string())
s.quit()