import pandas as pd
import os
import logging

logger = logging.getLogger("procesamiento")
logging.basicConfig(level=logging.INFO)

path = os.path.dirname(os.path.abspath(__file__))


def main():
    medidor_col = ["tiempo", "energia_activa", "energia_activa_sin_factor", "energia_reactiva", "energia_reactiva_sin_factor", "demanda_activa",
                   "demanda_reactiva"]
    load_datasets("medidor", "med_principal", medidor_col)
    clima_col = ["n", "tiempo", "temp_celsius", "hr", "lluvia_mm", "dir_viento", "vel_viento", "vel_rafagas"]
    load_datasets_clima("clima", "clima", clima_col)


def load_datasets(directory, filename, columns):
    dfs = []
    for i in range(1, 13):
    # for i in range(1, 3):
        df = pd.read_excel(f"{path}/files/raw/{directory}/2017/{i}.xlsx", engine='openpyxl', skiprows=2)
        dfs.append(df)
        df = pd.read_excel(f"{path}/files/raw/{directory}/2018/{i}.xlsx", engine='openpyxl', skiprows=2)
        dfs.append(df)
        df = pd.read_excel(f"{path}/files/raw/{directory}/2019/{i}.xlsx", engine='openpyxl', skiprows=2)
        dfs.append(df)
        df = pd.read_excel(f"{path}/files/raw/{directory}/2020/{i}.xlsx", engine='openpyxl', skiprows=2)
        dfs.append(df)

    df = pd.concat(dfs)
    df.columns = columns
    df["tiempo"] = df["tiempo"].astype("datetime64")
    size, nodup_size = df.shape[0], df.drop_duplicates(keep='last').shape[0]
    ratio_duplicado = ((size - nodup_size) / size) * 100
    logger.info(f"El porcentaje de registros duplicados (medidor) a eliminar es {ratio_duplicado:.2f}%")
    df.drop_duplicates(inplace=True)
    df.to_csv(f"{path}/files/clean/{filename}.csv", index=False)
    return df


def load_datasets_clima(directory, filename, columns):
    dfs, files = [], search_files(f"{path}/files/raw/{directory}")
    for file in files:
        df = pd.read_csv(f"{path}/files/raw/{directory}/{file}", delimiter=';')
        dfs.append(df)

    df = pd.concat(dfs)
    df.columns = columns
    df["tiempo"] = df["tiempo"].astype("datetime64")
    df.drop(['n'], axis=1, inplace=True)
    size, nodup_size = df.shape[0], df.drop_duplicates(keep='last').shape[0]
    ratio_duplicado = ((size - nodup_size) / size) * 100
    logger.info(f"El porcentaje de registros duplicados (clima) a eliminar es {ratio_duplicado:.2f}%")
    df.drop_duplicates(inplace=True)
    df.to_csv(f"{path}/files/clean/{filename}.csv", index=False)
    return df


def search_files(lookinto):
    files = [x[2] for x in os.walk(lookinto)]
    return files[0]


main()
