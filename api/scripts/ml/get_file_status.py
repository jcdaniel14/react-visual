import pandas as pd
import os
import json
import logging
import time

logger = logging.getLogger("xs")
logging.basicConfig(level=logging.INFO)
path = os.path.dirname(os.path.abspath(__file__))


def main():
    start = time.time()
    # === Si no hay nada en upload, carga el main
    df = pd.read_csv(f"{path}/files/clean/dataset_modelo.csv", parse_dates=True, index_col=0, engine="pyarrow")
    rs = {
        "count": f"{df['energia_activa'].count():.0f}",
        "mean": f"{df['energia_activa'].mean():.2f}",
        "max": f"{df['energia_activa'].max():.2f}",
        "filename": "dataset_modelo.csv"
    }
    # print(rs)
    print(json.dumps(rs))
    logger.info(f"{round(time.time() - start, 4)} seconds")


main()
