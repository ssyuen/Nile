from abc import ABC, abstractmethod

class ObjMapper(ABC):
    @abstractmethod
    def insert(self):
        pass

    @abstractmethod
    def update(self):
        pass

    @abstractmethod
    def delete(self):
        pass