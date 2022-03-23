from datetime import datetime as dt
import numpy as np
import pandas as pd
import os
import logging

logger = logging.getLogger("preprocess")
logging.basicConfig(level=logging.INFO)

path = os.path.dirname(os.path.abspath(__file__))


def main():
    medidor, clima = pd.read_csv(f"{path}/files/clean/med_principal.csv", usecols=["tiempo", "energia_activa"]), pd.read_csv(f"{path}/files/clean/clima.csv")
    medidor["tiempo"], clima["tiempo"] = medidor["tiempo"].astype("datetime64"), clima["tiempo"].astype("datetime64")
    print(medidor.info())

    # === GROUP DATASET PARA ANALISIS DE CORRELACION
    med_group = medidor.groupby(pd.Grouper(key="tiempo", freq="H"))[medidor.columns].sum().reset_index()
    cli_group = clima.groupby(pd.Grouper(key="tiempo", freq="H"))[clima.columns].mean().reset_index()

    x_med_min, x_cli_min = med_group["tiempo"].min(), cli_group["tiempo"].min()
    x_med_max, x_cli_max = med_group["tiempo"].max(), cli_group["tiempo"].max()
    min_ts, max_ts = max([x_med_min, x_cli_min]), min([x_med_max, x_cli_max])

    df1 = med_group[(med_group["tiempo"] >= min_ts) & (med_group["tiempo"] <= max_ts)]
    df2 = cli_group[(cli_group["tiempo"] >= min_ts) & (cli_group["tiempo"] <= max_ts)]
    df_total = df1.join(df2.set_index("tiempo"), on="tiempo")
    df_total.to_csv(f"{path}/files/clean/dataset_clima.csv", index=False)

    # === PANDEMIA DATASET

    df_total["pandemia"] = np.zeros((df_total.shape[0], 1), dtype=int, order='C')
    df_total.loc[:, "pandemia"][(df_total["tiempo"] >= "2020-03-17 00:00:00") & (df_total["tiempo"] <= get_today_ymd())] = 1
    df_total = df_total.set_index("tiempo")
    df_total["month"] = df_total.index.month
    df_total["day"] = df_total.index.day
    df_total["hour"] = df_total.index.hour

    df_total = df_total.reset_index()
    df_total["weekday"] = df_total.apply(lambda row: row["tiempo"].weekday(), axis=1)
    df_total.drop(["lluvia_mm", "dir_viento", "vel_viento", "vel_rafagas"], axis=1, inplace=True)
    df_total = cyclical_features(df_total, 'hour', 24, 0)

    df_total = df_total[df_total["pandemia"] == 0]
    df_total.to_csv(f"{path}/files/clean/dataset_modelo.csv", index=False)


def cyclical_features(df, col_name, period, start_num=0):
    kwargs = {
        f'sin_{col_name}': lambda x: np.sin(2 * np.pi * (df[col_name] - start_num) / period),
        f'cos_{col_name}': lambda x: np.cos(2 * np.pi * (df[col_name] - start_num) / period)
    }
    return df.assign(**kwargs).drop(columns=[col_name])


def get_today_ymd():
    d = dt.today().replace(hour=0, minute=0, second=0, microsecond=0)
    return d.strftime("%Y-%m-%d %H:%M:%S")


main()
