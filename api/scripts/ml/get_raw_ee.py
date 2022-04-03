import json
import pandas as pd
import os

path = os.path.dirname(os.path.abspath(__file__))


def main():
    data = []
    df = pd.read_csv(f"{path}/files/clean/dataset_modelo.csv")
    df.tiempo = df.tiempo.astype("datetime64")
    df.set_index("tiempo", inplace=True)
    trace = {"x": list(df.index.astype(str)), "y": list(df.energia_activa.values), "mode": "lines", "name": "Energia"}
    data.append(trace)
    print(json.dumps({"status": "ok", "msg": data}))


main()
