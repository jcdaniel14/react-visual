import json
import pandas as pd
import os

path = os.path.dirname(os.path.abspath(__file__))


def main():
    df = pd.read_csv(f"{path}/files/clean/dataset_clima.csv")
    corr = df.corr()
    rs = {
        "x": list(corr.columns),
        "y": list(corr.columns),
        "z": [list(x) for x in list(corr.values)],
    }
    print(json.dumps(rs))


main()
