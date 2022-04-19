import json
import pandas as pd
import os

path = os.path.dirname(os.path.abspath(__file__))


def main():
    data = []
    df = pd.read_csv(f"{path}/files/clean/dataset_clima.csv")
    df.tiempo = df.tiempo.astype("datetime64")
    for i in range(0, 25):
        monthly = df.loc[(df["tiempo"].dt.hour == i)]
        traces = {}
        traces["y"] = list(monthly["energia_activa"].values)
        traces["name"] = i
        traces["type"] = "box"
        data.append(traces)
    # for i in range(1, 13):
    #     monthly = df.loc[(df["tiempo"].dt.month == i)]
    #     traces = {}
    #     traces["y"] = list(monthly["energia_activa"].values)
    #     traces["name"] = i
    #     traces["type"] = "box"
    #     data.append(traces)
    print(json.dumps({"status": "ok", "msg": data}))


main()
