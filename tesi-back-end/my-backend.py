import json

from flask import Flask, request
import os
import time
from graphDB import get_distance_graphdb_path_bidirectional, get_distance_graphdb_path, normalQuery,normalQueryWithPreidcateSpecified, normalQueryAllSelectedStatmentSpecified

from flask_cors import cross_origin, CORS

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


def format_server_time():
    server_time = time.localtime()
    return time.strftime("%I:%M:%S %p", server_time)


@app.route('/impianti-distance/')
@cross_origin()
def impianti():
    # * che delimita il contenuto
    values = request.args.get('impianto')
    splitted = values.split('*')
    return_value = get_distance_graphdb_path_bidirectional(splitted[0], splitted[1])
    print('returned value = ' + return_value)
    return return_value


@app.route('/nodes-distance/')
@cross_origin()
def nodes():
    values = request.args.get('node')
    splitted = values.split('*')
    return_value = get_distance_graphdb_path(splitted[0], splitted[1])
    print('returned value = ' + return_value)
    return return_value


@app.route('/query/')
@cross_origin()
def query():
    set = normalQuery()

    obj = json.dumps(list(set), default=serialize_sets)

    return obj

@app.route('/query-with-specified-predicated/')
@cross_origin()
def queryWithPredicate():

  predicate = request.args.get('predicate')
  print(predicate)
  set = normalQueryWithPreidcateSpecified(predicate)
  obj = json.dumps(list(set), default=serialize_sets)
  print(obj)
  return obj

@app.route('/query-with-specified-statement-senza-graffa/')
@cross_origin()
def queryAllSelectedStatmentSpecified():

  statment = request.args.get('statement_senza_graffe')
  print('la query è :    '+statment)
  set = normalQueryAllSelectedStatmentSpecified(statment)
  obj = json.dumps(list(set), default=serialize_sets)
  print(obj)
  return obj


def serialize_sets(obj):
    if isinstance(obj, set):
        return list(obj)

    return obj


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8081)))
