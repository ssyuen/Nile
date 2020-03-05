from abs_models import ObjMapper

class Users(ObjMapper):
    def __init__(self):
        pass
    # def __init__(self,conn):
    #     self.conn = conn
    #     pass
    def insert(self):
        pass
    def update(self):
        pass
    def delete(self):
        pass



if __name__ == '__main__': 
    u = Users()
    print(type(u))