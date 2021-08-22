from flask import Flask, json, jsonify, render_template, request, url_for
import pyodbc

app = Flask(__name__)

conn = pyodbc.connect('Driver={ODBC Driver 17 for SQL Server};Server=tcp:borneobats.database.windows.net,1433;Database=borneobats;Uid=borneobats;Pwd=EeL1ied8@Aish7lai;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;')

cursor = conn.cursor()

@app.route('/', methods = ['POST', 'GET'])
def homepage():
    return render_template("index.html")


@app.route('/api/output/table/<family>/<genus>/<species>/<country>', methods=['GET', 'POST'])
def createOutputTable(family, genus, species, country):
    if request.method == 'GET':

        if species == "papillosa_lenis":
            species = 'papillosa / lenis'

        flag = False
        query = "Select * FROM borneobats.dbo.BruneiBats_1"

        if family != 'Any':
            if not flag:
                query += f" WHERE Family = '{family}'"
                flag = True
    
        if genus != 'Any':
            if not flag:
                query += f" WHERE Genus = '{genus}'"
                flag = True
            else:
                query += f" and Genus = '{genus}'"

        if species != 'Any':
            if not flag:
                query += f" WHERE Species = '{species}'"
                flag = True
            else:
                query += f" and Species = '{species}'"

        if country != 'Any':
            if not flag:
                query += f" WHERE Country = '{country}'"
                flag = True
            else:
                query += f" and Country = '{country}'"

        cursor.execute(query)
    
    headings = [i[0] for i in cursor.description]
    rows = cursor.fetchall()
    matrix = []
    for row in rows:
        matrix.append(list(row))

    return jsonify(headings, matrix)


@app.route('/api/distinct/Genus/<family>', methods=['GET', 'POST'])
def helperDynamicDropdownFam(family):
    if request.method == 'GET':
        if family != 'Any':
            cursor.execute(f"Select DISTINCT Genus FROM borneobats.dbo.BruneiBats_1 where Family = '{family}'")
        if family == 'Any':
            cursor.execute("Select DISTINCT Genus FROM borneobats.dbo.BruneiBats_1")
        
    arr = {'GenusArray' : [i[0] for i in cursor.fetchall()]}
    return jsonify(arr)


@app.route('/api/distinct/Species/<genus>/<family>', methods=['GET', 'POST'])
def helperDynamicDropdownGen(genus, family):
    if request.method == 'GET':
        flag = False
        query = "Select DISTINCT Species FROM borneobats.dbo.BruneiBats_1"

        if family != 'Any':
            if not flag:
                query += f" WHERE Family = '{family}'"
                flag = True
    
        if genus != 'Any':
            if not flag:
                query += f" WHERE Genus = '{genus}'"
                flag = True
            else:
                query += f" and Genus = '{genus}'"
        cursor.execute(query)

    arr = {'Species' : [i[0] for i in cursor.fetchall()]}
    return jsonify(arr)


@app.route('/api/distinct/Country/<spe>/<genus>/<family>', methods=['GET', 'POST'])
def helperDynamicDropdownSpe(spe, genus, family):
    if request.method == 'GET':
        if spe == "papillosa_lenis":
            spe = 'papillosa / lenis'
        
        flag = False
        query = "Select DISTINCT Country FROM borneobats.dbo.BruneiBats_1"

        if family != 'Any':
            if not flag:
                query += f" WHERE Family = '{family}'"
                flag = True
    
        if genus != 'Any':
            if not flag:
                query += f" WHERE Genus = '{genus}'"
                flag = True
            else:
                query += f" and Genus = '{genus}'"

        if spe != 'Any':
            if not flag:
                query += f" WHERE Species = '{spe}'"
                flag = True
            else:
                query += f" and Species = '{spe}'"
        cursor.execute(query)

    arr = {'Country' : [i[0] for i in cursor.fetchall()]}
    return jsonify(arr)


if __name__ == "__main__":
    app.run(port=8000)
