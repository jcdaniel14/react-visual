from lstm_model import split_training_test, LSTM_E_1, electric_supervised, weather_supervised, daily_consumption_forecast_1
from sklearn.preprocessing import StandardScaler, MinMaxScaler

import argparse
import json
import pandas as pd
import os

path = os.path.dirname(os.path.abspath(__file__))
MAX_SIZE = 12
SEMESTRE = 24 * 31 * 6  # 24hx31dx6m


def main():
    data = []
    if args.uploaded:
        df1 = pd.read_csv(f"{path}/files/upload/dataset_prueba.csv", parse_dates=True, index_col=0)
    else:
        df1 = pd.read_csv(f"{path}/files/clean/dataset_modelo.csv", parse_dates=True, index_col=0)
    electricity = electric_supervised(df1, MAX_SIZE, 1)
    weather = weather_supervised(df1, MAX_SIZE, 0)
    full = weather.join(electricity)

    # === MODELO
    mm, ss = MinMaxScaler(), StandardScaler()
    X_train, X_test, y_train, y_test = split_training_test(full, mm, ss)
    model = LSTM_E_1(X_train.shape[2], X_train.shape[1])
    if len(model.checkpoint) == 0:
        model.start_training(X_train, X_test, y_train, y_test)

    prev_fut = df1
    prev_fut = prev_fut.loc[:, ["temp_celsius", "hr", "pandemia", "month", "day", "weekday", "sin_hour", "cos_hour", "energia_activa"]]
    pred, act, y_f = daily_consumption_forecast_1(prev_fut, mm, ss, MAX_SIZE, model)
    input = df1.iloc[:MAX_SIZE + 1, :]
    trace = {"x": list(input.index.astype(str)), "y": list(input["energia_activa"].values), "mode": "lines", "name": "Input"}
    data.append(trace)
    trace = {"x": list(act.iloc[MAX_SIZE:, :].index.astype(str)), "y": list(y_f), "mode": "lines", "name": "Output"}
    data.append(trace)

    rs = {"status": "ok", "msg": data}
    to_file(rs)
    print(json.dumps(rs))


def main_2():
    rs = from_file()
    print(rs)


def to_file(rs):
    with open(f"{path}/files/models/output.json", "w+") as f:
        f.write(json.dumps(rs))


def from_file():
    with open(f"{path}/files/models/output.json") as f:
        return f.read()


parser = argparse.ArgumentParser(description="Predicciones del modelo")
parser.add_argument("--uploaded", action="store_true", help="Indicador de carga de archivo de pruebas")
args = parser.parse_args()
main_2()
