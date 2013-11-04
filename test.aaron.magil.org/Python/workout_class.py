class workout(object):
    def __init__(self):
        self.exercise_list = []
        
    def add_exercise(self,exercise):
        self.exercise_list.append(exercise)
        
    def remove_exercise(self,exercise):
        try:
            self.exercise_list.remove(exercise)
        except:
            return
        
    def __repr__(self):
        for exercise in self.exercise_list:
            print exercise
            