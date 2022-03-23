import os

path = os.path.dirname(os.path.abspath(__file__))
lookinto = f"{path}/files/raw/meteor/"
def search_files(lookinto):
    files = [x[2] for x in os.walk(lookinto)]
    return files[0]

f = search_files(lookinto)
print(f)