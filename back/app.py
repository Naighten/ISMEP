# -*- coding: utf-8 -*-
"""
Created on Thu Mar 31 14:44:14 2022

@author: pitonhik
"""

import json
import os
from sql import sql
import pandas as pd
from flask import Flask, flash, request, redirect
from flask_cors import CORS
from werkzeug.utils import secure_filename

import datetime
import re

from ml.KmeenCluster import return_cluster_model

CLUSTER_N = 4
LASTFILE = 'Prilozhenie_k_keysu_data.xls'

USER_TO_FILE = json.load(open("user_to_file.json", "r"))
USERS = json.load(open("users.json", "r"))

ID_TO_NAME_TECH = json.load(open("all_vehicles.json", "r",encoding='utf-8'))


def file_normal(filename):
    with open(filename, "r") as file:
        x = re.sub(r",[\d-]+\s+(\d+:)", r",\1", file.read())
    with open(filename, "w") as file:
        file.write(x)


def try_to_normal(dtf):
    for column in dtf:
        mode = dtf[column].mode()[0]
        if mode == "-":
            mode = "0"
        dtf[column] = dtf[column].fillna(mode)
        dtf[column] = dtf[column].replace("-", mode)
    return dtf


def get_valid_file(user_id):
    try:
        file_name = USER_TO_FILE[str(user_id)]
        df = pd.read_csv('load/' + file_name, sep=",")

    except:
        df = pd.read_excel('Prilozhenie_k_keysu_data.xls')

    return df


def conv(time, hms):
    time = str(time).split(':')

    int_time = list()
    for i in range(len(time)):
        int_time.append(int(time[i]))
    try:
     return (int_time[0] * 3600 + int_time[1] * 60 + int_time[2]) / hms
    except:
     return 0


changeColumns = ['Время движения час:мин:сек',
                 'Время работы двигателя, час:мин:сек',
                 'Время работы двигателя в движении, час:мин:сек',
                 'Время работы двигателя без движения, час:мин:сек',
                 'Время работы двигателя на холостом ходу, час:мин:сек',
                 'Время работы двигателя на нормальных оборотах, час:мин:сек',
                 'Время работы двигателя на предельных оборотах, час:мин:сек',
                 'Время с выключенным двигателем, час:мин:сек',
                 'Время работы двигателя под нагрузкой, час:мин:сек']


def time_conv(df, hms):
    global changeColumns
    for i in changeColumns:
        df[i] = df[i].fillna('00:00:00')
        df[i] = df[i].apply(lambda x: conv(x, hms))
    return df


def conv_number(df):
    set0 = ['Начальный объём, л.1', 'Конечный объём, л.1', 'Пробег, км']
    for i in set0:
        df[i] = df[i].fillna(0)
    return df


def main_conv(df, hms):
    df = time_conv(df, hms)
    df = conv_number(df)
    df['Средняя скорость'] = df.apply(lambda x: rule(x['Пробег, км'], x['Время движения час:мин:сек']), axis=1)
    return df


def rule(x, y):
    x = float(x)
    y = float(y)
    if y == 0:
        return 0
    return x / y


'''
 with open(pkl_filename, 'rb') as file: 
 pickle_model = pickle.load(file)
 pickle_model.predict(Xtest) 

 '''


def get_tech_info(_id, user_id, label=None):
    df = get_valid_file(user_id)
    df = df[df['id'] == int(_id)]
    time_x = list(df['Дата'])
    df = df.drop(['id', 'Дата'], axis=1)
    df = main_conv(df, 3600)
    if label:
        y = list(df[label])
        return {'time': time_x, 'labels': [{'name': label, 'array': y}]}
    else:
        labels = []
        for i in list(df.columns):
            labels.append({'name': i, 'array': list(df[i])})
        return {'time': time_x, 'labels': labels}


def get_data_info(_data, user_id, label=None):
    df = get_valid_file(user_id)
    df = df[df['Дата'] == _data]
    time_x = list(df['id'])
    df = df.drop(['id', 'Дата'], axis=1)
    df = main_conv(df, 3600)
    if label:
        y = list(df[label])
        return {'time': time_x, 'labels': [{'name': label, 'array': y}]}
    else:
        labels = []
        for i in list(df.columns):
            labels.append({'name': i, 'array': list(df[i])})
        return {'time': time_x, 'labels': labels}


def get_no_work(user_id, label=None):
    global changeColumns
    df = get_valid_file(user_id)
    df = main_conv(df, 3600)
    data = list(df['Дата'].unique())
    res = []
    if label:
        for i in data:
            d = df[df['Дата'] == i]
            res.append(len(d[d[label] == 0]))
    else:
        for i in data:
            d = df[df['Дата'] == i]
            for j in changeColumns:
                d = d[d[j] == 0]
            res.append(len(d))
    return {'time': data, 'labels': res}


n, k, t = return_cluster_model(get_valid_file(0), int(CLUSTER_N))

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = 'load'


@app.route("/getoil", methods=["POST", "GET"])
def get_oil_api():
    user_id = request.args["userId"]
    df = get_valid_file(user_id)
    df = main_conv(df, 3600)
    df = df[df['id'] == 734]

    def rule_oil(x, y):
        res = x - y
        if res > 0:
            return res
        else:
            return 0

    df['oil'] = df.apply(lambda x: rule_oil(x['Начальный объём, л.1'], x['Конечный объём, л.1']), axis=1)
    dfnew = pd.DataFrame(columns=['Дата', 'oil'])
    dfnew['Дата'] = df['Дата']
    dfnew['oil'] = df['oil']
    return {'time': list(dfnew['Дата']), 'labels': list(dfnew['oil'])}


@app.route("/getnowork", methods=["POST", "GET"])
def get_no_work_api():
    user_id = request.args["userId"]
    args = request.args
    if 'label' in args.keys():
        return get_no_work(user_id, label=args['label'])
    else:
        return get_no_work(user_id)


@app.route("/getdata", methods=["POST", "GET"])
def get_data_api():
    user_id = request.args["userId"]
    args = request.args
    if 'label' in args.keys():
        return get_data_info(args['data'], user_id, label=args['label'])
    else:
        return get_data_info(args['data'], user_id)


@app.route("/getinfo", methods=["POST", "GET"])
def get_info_api():
    user_id = request.args["userId"]
    args = request.args
    if 'label' in args.keys():
        return get_tech_info(args['id'], user_id, label=args['label'])
    else:
        return get_tech_info(args['id'], user_id)


@app.route("/getcolum", methods=["POST", "GET"])
def get_columns_api():
    user_id = request.args["userId"]
    df = get_valid_file(user_id)
    return {'items': list(df.columns) + ['Средняя скорость']}


@app.route("/lox", methods=["POST"])
def index_file_lox():
    if request.method == "POST":
        return {'lox': True}


@app.route("/files", methods=["POST"])
def index_file_api():
    user_id = request.args["userId"]
    global n, k, t

    if request.method == "POST":
        upload_files = request.files.getlist('fileUpload')
        arr = []
        for i in range(len(upload_files)):
            arr.append(upload_files[i].filename)
            upload_files[i].save(os.path.join('load', secure_filename(upload_files[i].filename)))
        for i in range(len(arr)):
            df = pd.read_excel('load/' + arr[i])

            df = try_to_normal(df)

            df.to_csv("load/final_output" + str(i) + ".csv", index=None)
        arr_concat = []
        for i in range(len(arr)):
            df = pd.read_csv("load/final_output" + str(i) + ".csv")
            arr_concat.append(df)

        file = pd.concat(arr_concat)

        filename = secure_filename(str(datetime.datetime.now().strftime("%y%m%d_%H%M%S")))
        filename = filename + ".csv"
        file.to_csv(os.path.join(app.config['UPLOAD_FOLDER'], filename), index=None)
        file_normal(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    if True:
        USER_TO_FILE[str(user_id)] = filename
        json.dump(USER_TO_FILE, open("db.json", "w", encoding="utf-8"), ensure_ascii=False)
        n, k, t = return_cluster_model(get_valid_file(user_id), int(CLUSTER_N))
    return {'response': True}


@app.route("/lenclusters", methods=["POST", "GET"])
def cluster_api():
    user_id = request.args["userId"]
    global CLUSTER_N, n, k, t
    if request.method == "GET":
        args = request.args
        if 'len' in args:
            CLUSTER_N = int(args['len'])
            n, k, t = return_cluster_model(get_valid_file(user_id), int(CLUSTER_N))
            return {'response': True}
    return {'response': False}


@app.route("/gettech", methods=["POST", "GET"])
def tech_api():
    user_id = request.args["userId"]
    if request.method == "GET":
        df = get_valid_file(user_id)
        res = list(df['id'].unique())
        for i in range(len(res)):
            res[i] = {"id": int(res[i]), "name": ID_TO_NAME_TECH[str(res[i])]}
        return {'response': True, 'items': res}
    else:
        return {'response': False, 'items': None}


@app.route("/getdays", methods=["POST", "GET"])
def data_api():
    user_id = request.args["userId"]
    if request.method == "GET":

        df = get_valid_file(user_id)
        raw = list(df['Дата'].unique())

        res = list()
        for i in range(len(raw)):
            res.append(str(raw[i]))

        return {'response': True, 'items': raw}
    else:
        return {'response': False, 'items': None}


funcs = {'Cреднее значение': 'mean', 'Медиана': 'median', 'Сумма': 'sum'}
r = ''


@app.route("/getinfoagr", methods=["POST", "GET"])
def get_info_agr():
    user_id = request.args["userId"]
    global funcs, CLUSTER_N, n, k, t

    func = funcs[str(request.args['func'])]
    column = str(request.args['colum'])
    cluster = str(request.args['cluster'])
    _id = []

    if cluster != 'Все':
        cluster = int(cluster)
        for i in range(len(k.labels_)):
            if k.labels_[i] == cluster - 1:
                _id.append(t[i])

    df = get_valid_file(user_id)
    df = main_conv(df, 3600)
    if _id:
        df_filt = df['id'].isin(_id)
        df = df[df_filt]
    res = list(df['Дата'].unique())

    try:
        if max(k.labels_) < cluster - 1:
            return {'response': True, 'items': {'time': res, 'label': []}}
    except Exception as e:
        print(e)

    label = []
    for i in res:
        df1 = df[df['Дата'] == i]
        df1 = df1[column].agg([func])[func]

        label.append(float(int(df1 * 100)) / 100)
    return {'response': True, 'items': {'time': res, 'label': label}}


@app.route("/getclusterinfo", methods=["POST", "GET"])
def get_clusters_len():
    global n, k, t

    clusters = set(k.labels_)

    res = {}
    for i in clusters:
        res[str(i)] = 0
        for j in k.labels_:
            if str(i) == str(j):
                res[str(i)] = res[str(i)] + 1

    time = []
    label = []
    for i in res.keys():
        time.append('Кластер ' + i)
        label.append(res[str(i)])

    return {'time': time, 'label': label}


@app.route("/getclusterid", methods=["POST", "GET"])
def get_clusters_id():
    global n, k, t
    df = pd.read_excel('vehicles_ids.xls')
    length = len(set(k.labels_))
    res = []
    for i in range(len(k.labels_)):
        try:
            res.append({'id': df[df['id'] == int(t[i])]['Транспортное средство'].iloc[0], 'class': int(k.labels_[i])})
        except:
            res.append({'id': int(t[i]), 'class': int(k.labels_[i])})

    return {'items': res, 'len': int(length)}


@app.route("/checkemailexist", methods=["POST", "GET"])
def check_email_exist_api():
    if request.method == "GET":
        email = request.args["email"]

        return {"exist": email in USERS}


@app.route("/authuser", methods=["POST", "GET"])
def auth_user_api():
    if request.method == "GET":
        email = request.args["email"]
        password = request.args["pas"]
        user = sql.sql_select('users', {'login': email, 'pas': password})['items']
        if user:
            return {"response": True, 'user': user[0]['id'], 'type': user[0]['type']}
        else:
            return {'response:': False}


@app.route("/user", methods=["POST", "GET"])
def user_api():
    if request.method == "POST":
        email, password = request.json["email"], request.json["pas"]
        name, fname, oname, post = request.json["name"], request.json["fname"], request.json["oname"], request.json[
            "post"]
        user = sql.sql_select('users', {'login': email})['items']
        if not user:
            id_s = sql.sql_insert('users',
                                  {'login': email, 'pas': password, 'name': name, 'fname': fname, 'oname': oname,
                                   'type': '0', 'lastfile': '', 'post': post, 'timer': '0'})
            return {"response": True, 'user': id_s['id'], 'type': '0'}
        else:
            return {'response:': False, 'error': 'user in database'}
    return {'response:': False}


@app.route("/getworker", methods=["POST", "GET"])
def getworker():
    if request.method == "GET":
        users = sql.sql_select('users', {'type': '0'})['items']
        res = []
        for i in range(len(users)):
            res.append(
                {'img': '../../../../assets/img/workers__img.png', 'name': users[i]['fname'] + ' ' + users[i]['name'],
                 'post': users[i]['post']})
        return {'response:': True, 'items': res}


def findu(ids, users):
    for i in users:
        if str(ids) == str(i['id']):
            return i['fname'] + ' ' + i['name'][0] + '.' + i['oname'][0] + '.'
    return '-'


@app.route("/gettеch", methods=["POST", "GET"])
def gettech():
    if request.method == "GET":
        tech = sql.sql_select('tech', {})['items']
        u = []
        for i in tech:
            if i['userid'] != None:
                u.append(i['userid'])
        u = list(set(u))
        users = sql.sql_select('users', {'id': u})['items']
        res = []
        for i in range(len(tech)):
            res.append({'name': tech[i]['name'], 'worker': findu(tech[i]['userid'], users), 'state': tech[i]['stat']})
        return {'response:': True, 'items': res}


def findt(ids, users):
    for i in users:
        if str(ids) == str(i['id']):
            return i['name']
    return '-'


@app.route("/gettask", methods=["POST", "GET"])
def gettask():
    if request.method == "GET":
        task = sql.sql_select('task', {})['items']
        u = []
        t = []
        for i in task:
            if i['userid'] != None and i['userid'] != 'undefined':
                u.append(i['userid'])
            if i['techid'] != None and i['techid'] != 'undefined':
                t.append(i['techid'])
        u = list(set(u))
        t = list(set(t))
        users = sql.sql_select('users', {'id': u})['items']
        techs = sql.sql_select('tech', {'id': t})['items']
        res = []
        for i in range(len(task)):
            res.append({'id': task[i]['id'], 'name': findt(task[i]['techid'], techs),
                        'worker': findu(task[i]['userid'], users), 'state': task[i]['stat'], 'date': task[i]['date']})
        return {'response:': True, 'items': res}


@app.route("/getusers", methods=["POST", "GET"])
def getusers():
    return sql.sql_select('users', {'type': '0'})


@app.route("/gettechs", methods=["POST", "GET"])
def gettechs():
    return sql.sql_select('tech', {})


@app.route("/settask", methods=["POST", "GET"])
def settask():
    if request.method == "GET":
        user = request.args["user"]
        tech = request.args["tech"]
        text = request.args["task"]
        data = request.args["date"]
        return sql.sql_insert('task', {'userid': user, 'techid': tech, 'text': text, 'date': data, 'stat': 'В работе'})


@app.route("/getadminf", methods=["POST", "GET"])
def adminf():
    if request.method == "GET":
        task = sql.sql_select('task', {})['items']
        tclose = 0
        for i in task:
            if i['stat'] == 'Выполнено':
                tclose += 1
        return {'all': len(task), 'open': len(task) - tclose}


@app.route("/changestattask", methods=["POST", "GET"])
def changestattask():
    if request.method == "GET":
        id_s = request.args['id']
        sql.sql_update('task', {'id': id_s, 'stat': 'Выполнено'})
        return {'response:': True}


@app.route("/wokerinfo", methods=["POST", "GET"])
def wokerinfo():
    if request.method == "GET":
        id_s = request.args['id']
        user = sql.sql_select('users', {'id': str(id_s)})['items'][0]
        users = sql.sql_select('users', {'type': '0'})['items']
        tasks = sql.sql_select('task', {'userid': id_s})['items']
        utech = sql.sql_select('tech', {'userid': id_s})['items']
        if utech:
            nametech = utech[0]['name']
        else:
            nametech = '-'
        notclose = 0
        for i in tasks:
            if i['stat'] == 'В работе':
                notclose += 1
        return {'task': tasks, 'all': len(tasks), 'notclose': notclose, 'timer': user['timer'], 'users': users,
                'name': user['name'], 'techname': nametech}


@app.route("/getshering", methods=["POST", "GET"])
def getshering():
    if request.method == "GET":
        tech = sql.sql_select('tech', {'stat': ['в простое', 'в аренде']})['items']
        return {'response:': True, 'items': tech}


@app.route("/changeshering", methods=["POST", "GET"])
def changeshering():
    if request.method == "GET":
        id_s = request.args['id']
        stat = request.args['stat']
        return sql.sql_update('tech', {'id': id_s, 'stat': stat})


@app.route("/get_status", methods=["POST", "GET"])
def calculate_status_for_tech():
    data_frame = pd.read_csv("dataset.csv",encoding='utf-8')

    info_keys = (
        "Время работы двигателя на холостом ходу, час:мин:сек",
        "Время работы двигателя на предельных оборотах, час:мин:сек",
        "Время работы двигателя под нагрузкой, час:мин:сек"
    )

    rv = list()

    maximum_value = dict()
    tech_value = dict()

    def filter(data_frame, date_filter):
        if date_filter == "00":
            return data_frame

        return data_frame.iloc[
            [data_frame.loc[row]["Дата"].split(".")[1] == date_filter for row in range(len(data_frame))]]

    df = filter(try_to_normal(data_frame), request.args["filter"])

    for tech_id in tuple(df["id"].unique()):
        tech_info = df[df["id"] == tech_id]

        tech_name = ID_TO_NAME_TECH[str(tech_id)]

        tech_value[tech_name] = dict()

        for info in info_keys:

            current_value = 0

            for value in list(tech_info[info]):
                if not isinstance(value, datetime.time):
                    value = datetime.time.fromisoformat(value)

                current_value += (value.hour * 60 + value.minute) * 60 + value.second

            try:
                if current_value > maximum_value[info]:
                    maximum_value[info] = current_value
            except KeyError as ke:
                maximum_value[info] = current_value

            tech_value[tech_name][info] = current_value

    for tech_id in tuple(df["id"].unique()):
        tech_name = ID_TO_NAME_TECH[str(tech_id)]

        tv = tech_value[tech_name]
        mv = maximum_value

        info = info_keys[0]

        if tv[info] == mv[info]:
            status = "Простаивает на холостом ходу больше всех"
            continue

        info = info_keys[1]

        if tv[info] == mv[info]:
            status = "Больше всех работает на предельных оборотах"
            continue

        info = info_keys[2]

        if tv[info] == 0:
            status = "Простаивает"
        elif tv[info] < 0.1 * mv[info]:
            status = "Работает чрезмерно мало"
        elif tv[info] < 0.3 * mv[info]:
            status = "Работает меньше среднего"
        elif tv[info] < 0.6 * mv[info]:
            status = "Работает в нормальном режиме"
        elif tv[info] < 0.8 * mv[info]:
            status = "Работает выше среднего"
        elif tv[info] > 0.8 * mv[info]:
            status = "Работает чрезмерно много"
        else:
            status = "Работает больше всех под нагрузкой"

        rv.append({"name": tech_name, "status": status})

    return {"response": True, "result": rv}


if __name__ == '__main__':
    app.run(host= '0.0.0.0', port=8000)
