
from flask import Flask, request, jsonify
from google.cloud import bigquery
import os

app = Flask(__name__)
client = bigquery.Client()

@app.route("/api/tables")
def list_tables():
    dataset_id = "YOUR_DATASET_ID"
    tables = client.list_tables(dataset_id)
    return jsonify([table.table_id for table in tables])

@app.route("/api/columns")
def list_columns():
    table = request.args.get("table")
    query = f"SELECT * FROM `YOUR_PROJECT.YOUR_DATASET.{table}` LIMIT 1"
    df = client.query(query).to_dataframe()
    columns = list(df.columns)
    inputs = [c for c in columns if "date" in c or "code" in c]
    outputs = [c for c in columns if "qty" in c or "sales" in c]
    groups = ["material_id", "plant_group_id"]
    return jsonify({"inputs": inputs, "outputs": outputs, "groups": groups})

@app.route("/api/images", methods=["POST"])
def get_images():
    data = request.get_json()
    table = data["table"]
    x_vars = data["x_vars"]
    y_vars = data["y_vars"]
    group_by = data["group_by"]

    # Build GCS URI path logic
    base_path = "https://storage.googleapis.com/YOUR_BUCKET_NAME"
    images = []
    for x in x_vars:
        for y in y_vars:
            file_path = f"{base_path}/{'-'.join(group_by)}/{x}x{y}.png"
            images.append(file_path)
    return jsonify({"images": images})
