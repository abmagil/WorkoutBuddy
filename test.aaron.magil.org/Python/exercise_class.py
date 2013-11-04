class exercise(object):
    def __init__(self,exercise_name):
        self.exercise = exercise_name
        self.reps = 0
        self.type = ""
        self.seconds = 0
        self.distance = 0
        self.weight = 0
        
    def set_type(self,type):
        self.type = type
        
    def add_reps(self,num):
        self.reps += num
    
    def add_sec(self,num):
        self.seconds += num
        
    def add_min(self,num):
        self.seconds += 60 * num
        
    def add_meters(self,num):
        self.distance += num
        
    def add_laps(self,num):
        self.distance += 400 * num
        
    def add_pounds(self,num):
        self.weight += num
        
    def __repr__(self):
        
        