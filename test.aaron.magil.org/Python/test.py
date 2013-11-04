#!/usr/bin/python
import cgitb##REMOVE
cgitb.enable()##REMOVE
import cgi
import MySQLdb
import datetime

print "Content-type: text/html;  charset=iso-8859-1\n\n"

try:
    conn = MySQLdb.connect (host="mysql.aaron.magil.org",
            user="workoutbuddy",
            passwd="workoutbuddy",
            db="workoutbuddy")
except MySQLdb.Error, e:
    print "<p>Error %d: %s</p>" % (e.args[0], e.args[1])
    sys.exit(1)
cursor = conn.cursor()



query = "INSERT IGNORE into Persons Values(Datetime.now().microsecond,'test');"
cursor.execute(query)

print "<H1>Success</H1>"
