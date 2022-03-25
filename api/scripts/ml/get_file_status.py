import pandas as pd
import os
import json
import logging
import time
import argparse

logger = logging.getLogger("xs")
logging.basicConfig(level=logging.INFO)
path = os.path.dirname(os.path.abspath(__file__))


def main(args):
    start = time.time()
    if args.name:
        df = pd.read_csv(f"{path}/files/upload/{args.name}", parse_dates=True, index_col=0, engine="pyarrow")
    else:
        df = pd.read_csv(f"{path}/files/clean/dataset_modelo.csv", parse_dates=True, index_col=0, engine="pyarrow")
    rs = {
        "count": f"{df['energia_activa'].count():.0f}",
        "mean": f"{df['energia_activa'].mean():.2f}",
        "max": f"{df['energia_activa'].max():.2f}"
    }
    # print(rs)
    print(json.dumps(rs))
    logger.info(f"{round(time.time() - start, 4)} seconds")


parser = argparse.ArgumentParser(description="Overview del dataset")
parser.add_argument("--name", default="", help="Nombre del archivo")
args = parser.parse_args()
main(args)
