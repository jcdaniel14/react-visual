import json
import pandas as pd
import os
import numpy as np

path = os.path.dirname(os.path.abspath(__file__))


def main():
    df = pd.read_csv(f"{path}/files/upload/dataset_prueba_raw.csv")
    df.columns = ["tiempo", "temp_celsius", "hr", "pandemia", "energia_activa"]
    df["tiempo"] = df["tiempo"].astype("datetime64")
    df = df.set_index("tiempo")
    df["month"] = df.index.month
    df["day"] = df.index.day
    df["hour"] = df.index.hour
    df = df.reset_index()
    df["weekday"] = df.apply(lambda row: row["tiempo"].weekday(), axis=1)
    df = cyclical_features(df, 'hour', 24, 0)
    df = df[["tiempo", "energia_activa", "temp_celsius", "hr", "pandemia", "month", "day", "weekday", "sin_hour", "cos_hour"]]
    df.to_csv(f"{path}/files/upload/dataset_prueba.csv", index=False)
    print(json.dumps({"status": "ok"}))


def cyclical_features(df, col_name, period, start_num=0):
    kwargs = {
        f'sin_{col_name}': lambda x: np.sin(2 * np.pi * (df[col_name] - start_num) / period),
        f'cos_{col_name}': lambda x: np.cos(2 * np.pi * (df[col_name] - start_num) / period)
    }
    return df.assign(**kwargs).drop(columns=[col_name])

try:
    main()
except ValueError:
    print(json.dumps({"status": "error", "msg": "El dataset enviado no cumple con el formato establecido.\n\nPor favor verificar que el archivo CSV contenga solo 5 columnas, las cuales corresponden a tiempo, temp_celsius, hr, pandemia y energia_activa"}))
