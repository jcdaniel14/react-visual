from torch import nn, zeros, Tensor, reshape, cuda, optim, load
from torch import device as torch_device, save as torch_save
from torch.autograd import Variable

import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os
import logging

path = os.path.dirname(os.path.abspath(__file__))
logger = logging.getLogger("preprocess")
logging.basicConfig(level=logging.INFO)


def daily_consumption_forecast_1(previous_df, mm, ss, max_size, model):
    """
    Toma la data de clima y el consumo, predice el siguiente valor
    """
    actual_val = pd.DataFrame(data=previous_df.values, columns=previous_df.columns, index=previous_df.index)
    y_predic = []
    for i in range(previous_df.shape[0] - max_size):
        # logger.info(f"Prediction - iteration n={i}")
        # filter out from data frame the 12+1 values which will be used
        # to generate the input tensor. This includes the last predicted value.
        previous = previous_df.iloc[i:i + (max_size + 1), :]
        # prepare and generate input array
        electricity = electric_supervised(previous, max_size, 1)
        weather = weather_supervised(previous, max_size, 0)
        in_previous = weather.join(electricity)
        # select inputs and targets
        X_previous = in_previous.iloc[:, :-1]
        # y_previous = in_previous.iloc[:, -1:]
        # normalization
        X_val = ss.transform(X_previous)
        # y_val = mm.transform(y_previous)
        # from array to tensors and variables
        X_val_tensors = Variable(Tensor(X_val))
        # y_val_tensors = Variable(Tensor(y_val))
        # reshape input tensor
        seq = 1
        X_val_tensors_final = reshape(X_val_tensors, (int(X_val_tensors.shape[0] / seq), seq, X_val_tensors.shape[1]))
        # forward pass
        model.eval()
        y_pred = model.forward(X_val_tensors_final.to(model.device))
        # reverse normalization
        y_predict = y_pred.cpu().data.numpy()  # numpy conversion
        y_predict = mm.inverse_transform(y_predict)
        # add to dataframe the calculated value for the next hour
        aux = previous['energia_activa'].values.tolist()
        aux[max_size] = y_predict.item()
        y_predic.append(y_predict.item())
        previous_df.iloc[i:i + (max_size + 1), -1:] = aux

    prediction = pd.DataFrame(data=previous_df.values, columns=previous_df.columns, index=previous_df.index)
    return prediction, actual_val, y_predic


def split_training_test(full, mm, ss):
    X = full.iloc[:, :-1]
    y = full.iloc[:, -1:]

    X_ss = ss.fit_transform(X)
    y_mm = mm.fit_transform(y)
    train_hours = int(2 * full.shape[0] / 3)
    logger.info(f"Splitting dataset into {train_hours}/{full.shape[0]}")
    X_train = X_ss[:train_hours, :]
    X_test = X_ss[train_hours:, :]
    y_train = y_mm[:train_hours, :]
    y_test = y_mm[train_hours:, :]

    # to tensors and variables
    X_train_tensors = Variable(Tensor(X_train))
    X_test_tensors = Variable(Tensor(X_test))
    y_train_tensors = Variable(Tensor(y_train))
    y_test_tensors = Variable(Tensor(y_test))

    X_train_final = reshape(X_train_tensors, (int(X_train_tensors.shape[0] / 1), 1, X_train_tensors.shape[1]))
    X_test_final = reshape(X_test_tensors, (int(X_test_tensors.shape[0] / 1), 1, X_test_tensors.shape[1]))
    return X_train_final, X_test_final, y_train_tensors, y_test_tensors


def weather_supervised(dataframe, n_in, n_out):
    df = dataframe.copy()
    df.pop('energia_activa')
    return series_to_supervised(data=df, n_in=n_in, n_out=n_out, dropnan=True)


def electric_supervised(dataframe, n_in, n_out):
    elec = pd.DataFrame(dataframe['energia_activa'])
    elec_sup = series_to_supervised(data=elec, n_in=n_in, n_out=n_out, dropnan=True)
    return elec_sup


def series_to_supervised(data, n_in=1, n_out=1, dropnan=True):
    # n_vars = 1 if type(data) is list else data.shape[1]
    # df = pd.DataFrame(data)
    df = data
    cols, names = list(), list()
    # input sequence (t-n, ... t-1)
    for i in range(n_in, 0, -1):
        cols.append(data.shift(i))
        names += [('{}(t-{})'.format(j, i)) for j in data.columns]
    # forecast sequence (t, t+1, ... t+n)
    for i in range(0, n_out):
        cols.append(df.shift(-i))
        if i == 0:
            names += [('{}(t)'.format(j)) for j in data.columns]
        else:
            names += [('{}(t+{})'.format(j, i)) for j in data.columns]
    # put it all together
    agg = pd.concat(cols, axis=1)
    agg.columns = names
    # drop rows with NaN values
    if dropnan:
        agg.dropna(inplace=True)
    return agg


class LSTM_E_1(nn.Module):
    def __init__(self, input_size, seq_length, num_classes=1, hidden_size=133, num_layers=1, num_dir=1, lr=0.01, num_epochs=500):
        super(LSTM_E_1, self).__init__()

        # === MODEL PARAMETERS
        if cuda.is_available():
            self.device = torch_device("cuda")
        else:
            self.device = torch_device("cpu")
        logger.info(f"Running in: {self.device}")
        self.num_epochs = num_epochs
        self.lr = lr
        self.num_classes = num_classes  # number of outputs
        self.num_layers = num_layers  # number of layers
        self.input_size = input_size  # input size
        self.hidden_size = hidden_size  # hidden state
        self.seq_length = seq_length  # sequence length
        self.num_directions = num_dir
        self.loss = None
        if num_dir == 2:
            bi = True
        else:
            bi = False

        # === MODEL LAYERS
        self.lstm = nn.LSTM(input_size=input_size, hidden_size=hidden_size, num_layers=num_layers, batch_first=True, bidirectional=bi)
        self.fc_1 = nn.Linear(hidden_size * num_dir, 100)
        self.fc = nn.Linear(100, num_classes)
        self.relu = nn.ReLU()
        self.checkpoint = {}

        # === LOAD MODEL PARAMETERS
        if os.path.isfile(f"{path}/files/models/model_LSTM_1_checkpoint.tar"):
            self.optimizer = optim.Adam(self.parameters(), lr=0.001)
            self.checkpoint = load(f"{path}/files/models/model_LSTM_1_checkpoint.tar", map_location=self.device)
            self.load_state_dict(self.checkpoint['model_state_dict'])
            self.optimizer.load_state_dict(self.checkpoint['optimizer_state_dict'])
        else:
            self.optimizer = optim.Adam(self.parameters(), lr=self.lr)
            self.criterion = nn.MSELoss()
        self.to(self.device)

    def forward(self, x):
        h_0 = Variable(zeros(self.num_layers * self.num_directions, x.size(0), self.hidden_size)).to(self.device)
        c_0 = Variable(zeros(self.num_layers * self.num_directions, x.size(0), self.hidden_size)).to(self.device)

        output, _ = self.lstm(x, (h_0, c_0))
        out = output.view(-1, self.hidden_size * self.num_directions)
        out = self.relu(out)
        out = self.fc_1(out)
        out = self.relu(out)
        out = self.fc(out)
        return out

    def start_training(self, X_train, X_test, y_train, y_test):
        self.train()
        train_loss = []
        val_loss = []
        X_train, X_test, y_train, y_test = X_train.to(self.device), X_test.to(self.device), y_train.to(self.device), y_test.to(self.device)

        for epoch in range(self.num_epochs):
            outputs = self.forward(X_train)
            self.optimizer.zero_grad()
            self.loss = self.criterion(outputs, y_train)
            train_loss.append(self.loss.item())
            self.loss.backward()  # Calculo del error y de la función de error
            self.optimizer.step()  # Optimización del error realizando el backpropagation

            # validation
            val_out = self.forward(X_test)
            loss_val = self.criterion(val_out, y_test)
            val_loss.append(loss_val.item())

            if epoch % 50 == 0:
                logger.info("Epoch: %d, loss: %1.5f, val_loss: %1.5f" % (epoch, train_loss[epoch], val_loss[epoch]))

        epoch = np.arange(0, self.num_epochs)

        # plotting
        plt.plot(epoch, train_loss, label="Train loss")
        plt.plot(epoch, val_loss, label="Validation loss")
        plt.legend()
        plt.xlabel('epoch')
        plt.ylabel('MSE loss')
        plt.show()

        # Guarda el modelo de entrenamiento
        torch_save({'epoch': len(epoch), 'model_state_dict': self.state_dict(), 'optimizer_state_dict': self.optimizer.state_dict(), 'loss': self.loss.item()},
                   f"{path}/files/models/model_LSTM_1_checkpoint.tar")
