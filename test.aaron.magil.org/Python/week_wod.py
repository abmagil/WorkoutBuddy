#!/usr/bin/python
import cgitb##REMOVE
cgitb.enable()##REMOVE
import cgi
import urllib2
import MySQLdb
import re
from datetime import datetime
import bs4
from bs4 import BeautifulSoup

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


##TODO Need to validate data, turning off until then
##URL -> HTML document -> Beautiful Soup object
#try:
    #url = cgi.FieldStorage()["user"].value
#except KeyError:
url = "http://www.crossfit.com/pdawod.html"
r = urllib2.urlopen(url)
t= r.read()
soup = BeautifulSoup(t)

num_name_dict = {re.compile('one',re.I):"1",re.compile('two',re.I):"2",re.compile('three',re.I):"3",re.compile('four',re.I):"4",re.compile('five',re.I):"5",re.compile('six',re.I):"6",re.compile('seven',re.I):"7",re.compile('eight',re.I):"8",re.compile('nine',re.I):"9",re.compile('ten',re.I):"10",re.compile('twenty',re.I):"20"} ##for later
##Create RE objects
AMRAP = re.compile('as many (rounds|reps).*?(?=(\d+) minute[s]?)',re.I)
Hyphen_Search = re.compile('(\D+ )?((\d?\d-)+(\d?\d))')
X_For_Y = re.compile('(\w+) (round[s]?|rep[s]?) for .*(reps|rounds|time)',re.I)
One_Round = re.compile('(For Time:)',re.I)
Rest_Day = re.compile('Rest Day',re.I)
EMOTM = re.compile('on the minute .*? (\d+) minutes',re.I)
Comments = re.compile('Post .+ to comments',re.I)
Named = re.compile('"(.*?)"',re.I) ##if it has quotation marks

re_list = [Hyphen_Search,X_For_Y,One_Round,AMRAP,Rest_Day,EMOTM,Named,Comments]

##Test that all members of iterable 'items' are equal to value 'match'
def all_are(items,match):
    return all(x == match for x in items)

##Convert 'one' to '1', and so on.  To help identify workout type.
def numberize(text):
    for re_obj in num_name_dict.keys():
        text = re.sub(re_obj,num_name_dict[re_obj],text)
    return text

##TODO: Figure out how to handle straight workouts.  I.E. relevant tag is just a list of exercises.  Maybe start using the seeded DB?
##Determine the type of the workout based on the text of a tag
##	Then print out and, eventually, insert into DB
def find_exercise_type(div):
    p_tag = div.p
    text = numberize(p_tag.get_text())
    found_match = False
    while True:
        for regex in re_list:
            match = regex.search(text)
            if match:
                if regex == Named:
                   print "<h2>",match.group(1),"</h2>"
                   ##need to continue to next p_tag to get the actual workout
                elif regex == Hyphen_Search:
                   set_list = match.group(2).split("-")
                   if all_are(set_list,"1"): #1RM check
                           print "<h2>1RM workout</h2>"
                   #print "<h3>",len(set_list),"rounds of</h3>"
                   p_tag = pre_split(p_tag) #Rewrite the tag
                   return print_exercises(p_tag)
                elif regex == X_For_Y:
                   print "<h3>",match.group(1),match.group(2),"for ",match.group(3)," of</h3>"
                   return print_exercises(p_tag)
                elif regex == One_Round:
                   print "<h3>1 Round for time:</h3>"
                   return print_exercises(p_tag)
                elif regex == AMRAP:
                   print "<h3>As many ",match.group(1)," as possible in ",match.group(2)," minutes</h3>"
                   return print_exercises(p_tag)
                elif regex == Rest_Day:
                   print "<h2>Rest Day</h2>"
                   return True
                elif regex == Comments:
                   print '<p><font color="DC143C">hit comment</font></p>' #debug
                   check_db(p_tag.previous_sibling.previous_element) ##intended to see if there's something in there already?
                   return False
        else:
            p_tag = p_tag.next_sibling.next_element
            text = numberize(p_tag.get_text())
   
def check_db(p):
    #p is a navigable string.  treat it like "text" from find_exercise_type
    return True
     
def print_exercises(p):
    number_find = re.compile('(?P<number>\d+) (?P<word>[a-z]+)',re.I)
    difficulty_list = ['pound ball','pounds','pound','inch','pood']
    distance_list = ['feet','foot','ft','meters','meter','yard','yards','mile','miles','K']
    time_list = ['second','seconds','minute','minutes']
    repetitions_list = ['rep','reps','rounds','round','ascents']
    time=''
    difficulty =''
    
    p = p.get_text("<br/>")
    exercises = str.split(str(p).strip(', '),"<br/>")[1:] ##to remove first line, causes problems
    for exercise in exercises: ##exercise is now the whole exercise string, pull out more info
        reps,difficulty,time = '','',''
        match_list = number_find.finditer(exercise) ##TODO solve for wall ball
        for match in match_list:
            if match:
                if match.group('word') in repetitions_list:
                    reps = match.group()
                    exercise = exercise.replace(match.group(0),'')
                    type = "rep"
                elif match.group('word') in distance_list:
                    difficulty = match.group()
                    exercise = exercise.replace(match.group(0),"")
                elif match.group("word") in difficulty_list:
                    difficulty = match.group()
                    exercise = exercise.replace(match.group(0),'')
                    type = "difficulty"
                elif match.group('word') in time_list:
                    time = match.group()
                    exercise = exercise.replace(match.group(0),'')
                    type = "time"
                else:
                    reps = match.group('number')
                    exercise = exercise.replace(match.group('number'),'')
                    type = "rep"
        exercise = exercise.split(",")[0]
        exercise = exercise.strip()
        exercise_date = str(datetime.strptime(day.get_text(),'%A, %B %d, %Y'))
        exer_tag = '<span class="exercise">'+ exercise
        #query = "INSERT into Exercise_List(exercise_name,date_added) VALUES('"+ exercise +"','"+ exercise_date +") ON DUPLICATE KEY UPDATE exercise_name='"+exercise+"';"
        #print "query: ",query,"<br />"
        #cursor.execute(query)
        #conn.commit()
        for feature in ['reps','time','difficulty']:
            value = str(eval(feature)).strip()
            if value != "":
                exer_tag += "<span class="+feature+"> "+ value +"</span>"
        exer_tag += "</span><br/>"
        print exer_tag
    return True

def pre_split(p):
    exercise_list = []
    output_str = '<p>remove<br/>' ##to match formatting of every other tag, we need a first line to remove.  This text is filler
    match = re.search('(\D+ )?((\d?\d-)+(\d?\d))',p.get_text("<br/>"))
    set_list = match.group(2).split("-")
    leading_exer = match.group(1)
    if leading_exer:
        leading_exer = leading_exer.split("<br/>")
        exercise_list += leading_exer
    else:
        following_exercise = p.get_text("<br/>").split("<br/>")[1:]
        exercise_list += following_exercise
    while '' in exercise_list:      ##REMOVE NULLS
        exercise_list.remove('')
    for num in set_list:
        for exercise in exercise_list:
            output_str += str(num) + " reps " + str(exercise).strip() + "<br/>"
    return BeautifulSoup(output_str + "<p>")

content_list = soup.find_all('div',"content") ##to just do today's, change to soup.find_all()
date_list = soup.find_all('div','dateheader') ##to just do today's, change to soup.find_all()
div_dict = dict(zip(date_list,content_list))
for day in date_list:
    print day
    if not find_exercise_type(div_dict[day]):
        print '<script type="text/javascript">//alert("bad parse");</script>'
	##TODO: If bad parse, try to figure out what's going on from Exercise list.
        ##TODO: If there is a "compare to XXXXXX", try to find that in the database and display it to the user            
cursor.close()
conn.close()
            
    
##    some explanation of the query here: we're going to have to treat rest days special, but crossfit passes an annoying string
##    here's how that monster breaks down:
##        datetime.strptime- converts from string to a date object.
##        the string sometimes has whitespace characters within it, so we strip them out with re.sub('\s'
##        day.get_text() pulls just the text out of a tag (day is the <h1> tag holding the day string in the RSS)
##        the %A, %B %d, %Y is the formatting options for strptime
##        Finally, we wrap it all in str() so that it's in the correct type for the MySQL query
##</BEASTMODE COMMAND>
