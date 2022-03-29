import json
import pandas as pd
import os

path = os.path.dirname(os.path.abspath(__file__))


def main():
    payload = {}
    df = pd.read_csv(f"{path}/files/clean/dataset_clima.csv")
    df.tiempo = df.tiempo.astype("datetime64")
    days = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]
    for j in range(1, 13):
        data = []
        for i in range(2017, 2021):
            traces = {}
            traces["type"] = "scatter"

            mydf = df.loc[(df["tiempo"].dt.year == i) & (df["tiempo"].dt.month == j)]
            mydf = mydf.groupby(mydf["tiempo"].dt.weekday).mean().reset_index()
            traces["x"] = days
            traces["y"] = list(mydf["energia_activa"].values)
            traces["name"] = i
            traces["mode"] = "lines"
            traces["line"] = {"shape": "spline"}
            data.append(traces)
        payload[j] = data
    print(json.dumps({"status": "ok", "msg": payload}))


main()
