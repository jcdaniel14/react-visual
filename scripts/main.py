from lstm_model import split_training_test, LSTM_E_1, electric_supervised, weather_supervised, daily_consumption_forecast_1
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from datetime import datetime as dt, timedelta
import numpy as np
import pandas as pd
import os
import logging
import plotly.graph_objs as go
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, mean_absolute_percentage_error

logger = logging.getLogger("preprocess")
logging.basicConfig(level=logging.INFO)

path = os.path.dirname(os.path.abspath(__file__))
MAX_SIZE = 12
TRAIN = True
SEMESTRE = 24 * 31 * 6  # 24hx31dx6m


def main():
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

    print(df1.shape)

    # === PREDICCIONES DEL MODELO
    df = pd.read_csv(f"{path}/files/clean/dataset_prueba.csv", parse_dates=True, index_col=0)
    prev_fut = df
    # prev_fut = df.iloc[-SEMESTRE:-1, :]
    # prev_fut = df.iloc[:SEMESTRE, :]
    prev_fut = prev_fut.loc[:, ["temp_celsius", "hr", "pandemia", "month", "day", "weekday", "sin_hour", "cos_hour", "energia_activa"]]
    print(prev_fut)
    pred, act, y_f = daily_consumption_forecast_1(prev_fut, mm, ss, MAX_SIZE, model)
    print(act)
    Predicted = go.Scatter(x=act.iloc[MAX_SIZE:, :].index, y=np.array(y_f), opacity=0.7, name='Consumo Eléctrico Predicho', line=dict(color='crimson'),
                           yaxis='y')
    # Actual = go.Scatter(x=act.index, y=act['energia_activa'].values, opacity=0.7, name='Consumo Eléctrico (Training Set)', line=dict(color='royalBlue'), yaxis='y', mode="lines")
    Actual = go.Scatter(x=df.iloc[:MAX_SIZE+1, :].index, y=df['energia_activa'].values, opacity=0.7, name='Consumo Eléctrico (Training Set)',
                        line=dict(color='royalBlue'), yaxis='y', mode="lines")
    ActualDotted = go.Scatter(x=df.iloc[MAX_SIZE:, :].index, y=df.iloc[MAX_SIZE:, :]["energia_activa"].values, opacity=0.7, name='Consumo Eléctrico Actual',
                              line=dict(color='royalBlue', dash="dash"), yaxis='y')
    layout = go.Layout(title='Predicción del Consumo Eléctrico Espol', xaxis=dict(title='Hora'),
                       yaxis=dict(title='Watts', overlaying='y'),
                       yaxis2=dict(title='Watts', side='right'))
    fig = go.Figure(data=[Actual, ActualDotted, Predicted], layout=layout)
    # fig = go.Figure(data=[Actual, Predicted], layout=layout)
    fig.show()

    rmse = np.sqrt(mean_squared_error(act['energia_activa'].values[MAX_SIZE:], np.array(y_f)))
    print('Test RMSE: %.3f' % rmse)
    print(len(y_f))
    print(df.shape)


main()
