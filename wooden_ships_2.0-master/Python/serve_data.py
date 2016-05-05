__author__ = 'scottsfarley'
import cherrypy
import cherrypy
import psycopg2
from time import strftime
import json

def connectToDatabase(hostname, username, password, database):
    try:
        connectString = "dbname='" + str(database) + "' user='" + str(username) + "' host='" + str(hostname) + "' password='" + str(password) + "'"
        conn = psycopg2.connect(connectString)
        return conn
    except:
        print "I am unable to connect to the database"
        return False

def closeConnection(connection):
    try:
        connection.close()
        return True
    except:
        print "Failed to close connection."
        return False

def getColNames():
    conn = connectToDatabase("localhost", "scottsfarley", "Sequoia93!", "WoodenShips")
    cursor = conn.cursor()
    cursor.execute("Select * FROM Logbook")
    colnames = [desc[0] for desc in cursor.description]
    return colnames

# colnames = getColNames() ## dynamically get the table structure each time the server restarts
# print colnames
##use this array for debug while table structure is static
colnames = ['recid', 'instabbr', 'logbooklanguage', 'voyagefrom', 'voyageto', 'shipname', 'shiptype', 'company', 'othershipinformation', 'nationality', 'name1', 'rank1', 'name2', 'rank2', 'zeromeridian', 'obsgen', 'distunits', 'disttolandmarkunits', 'disttravelledunits', 'longitudeunits', 'voyageini', 'unitsofmeasurement', 'year', 'month', 'day', 'date', 'distance', 'lat3', 'lon3', 'anchored', 'anchorplace', 'winddirection', 'allwinddirections', 'windforce', 'windforcescale', 'allwindforces', 'windscale', 'weather', 'shapeclouds', 'dirclouds', 'clearness', 'precipitationdescriptor', 'cloudfrac', 'gusts', 'rain', 'fog', 'snow', 'thunder', 'hail', 'seaice', 'sstreading', 'sstreadingunits', 'statesea', 'currentdir', 'currentspeed', 'tairreading', 'airthermreadingunits', 'probtair', 'baroreading', 'airpressurereadingunits', 'barometertype', 'bartempreading', 'bartempreadingunits', 'humreading', 'humidityunits', 'humiditymethod', 'pumpwater', 'wateratthepumpunits', 'lifeonboard', 'lifeonboardmemo', 'cargo', 'cargomemo', 'shipandrig', 'shipandrigmemo', 'biology', 'biologymemo', 'warsandfights', 'warsandfightsmemo', 'illustrations', 'otherrem', 'point', 'fromgeocode', 'togeocode']


def toBool(s):
    if type(s) is bool:
        return s
    else:
        if s.lower() == "false":
            return False
        elif s.lower() == "true":
            return True
        else:
            return False

class GeocodedPlaces:
    exposed= True
    def GET(self, callback="", *arg, **kwargs):
        sql = "SELECT DISTINCT(place, latitude, longitude, modernname) FROM geocode "
        conn = connectToDatabase("localhost", "scottsfarley", 'Sequoia93!', 'WoodenShips')
        cursor = conn.cursor()
        cursor.execute(sql)
        rows = cursor.fetchall()
        out = {}
        outRows = []
        for row in rows:
            row = row[0].replace("'", "")
            row = row.replace(")", "")
            row = row.replace("(", "")
            row = row.replace('"', "")
            row = row.split(",")
            if row[3] != "''":
                place = row[3]
            else:
                place = row[0]
            newRow = {
                'place': place,
                'latitude': row[1],
                'longitude': row[2]
            }
            try:
                if float(row[1]) != 0 and float(row[2]) != 0 and newRow['place'] != "" and newRow['place'] != "''" and "?" not in newRow['place']:
                    outRows.append(newRow)
            except:
                pass
        out['data'] = outRows
        out['query'] = sql
        out['success'] = True
        out['timestamp'] = str(strftime("%Y-%m-%d %H:%M:%S"))
        out = json.dumps(out)
        if callback != "":
            # this is jsonp
            out = callback + "(" + out + ")"
        return out

class VoyageStarts:
    exposed =True
    def GET(self, callback="", *arg, **kwargs):
        sql = "SELECT DISTINCT(fromgeocode) FROM logbook;"
        conn = connectToDatabase("localhost", "scottsfarley", 'Sequoia93!', 'WoodenShips')
        cursor = conn.cursor()
        cursor.execute(sql)
        rows = cursor.fetchall()
        out = {}
        outRows = []
        for row in rows:
            try:
                row = row[0].replace("'", "")
                row = row.replace(")", "")
                row = row.replace("(", "")
                row = row.replace('"', "")
                row = row.split(",")
                newRow = {
                    'place': row[0]
                }
                try:
                    if row[0] != "":
                        outRows.append(newRow)
                except:
                    pass
            except:
                pass
        out['data'] = outRows
        out['query'] = sql
        out['success'] = True
        out['timestamp'] = str(strftime("%Y-%m-%d %H:%M:%S"))
        out = json.dumps(out)
        if callback != "":
            # this is jsonp
            out = callback + "(" + out + ")"
        return out

class VoyageEnds:
    exposed =True
    def GET(self, callback="", *arg, **kwargs):
        sql = "SELECT DISTINCT(togeocode) FROM logbook;"
        conn = connectToDatabase("localhost", "scottsfarley", 'Sequoia93!', 'WoodenShips')
        cursor = conn.cursor()
        cursor.execute(sql)
        rows = cursor.fetchall()
        out = {}
        outRows = []
        for row in rows:
            try:
                row = row[0].replace("'", "")
                row = row.replace(")", "")
                row = row.replace("(", "")
                row = row.replace('"', "")
                row = row.split(",")
                newRow = {
                    'place': row[0]
                }
                try:
                    if row[0] != "":
                        outRows.append(newRow)
                except:
                    pass
            except:
                pass
        out['data'] = outRows
        out['query'] = sql
        out['success'] = True
        out['timestamp'] = str(strftime("%Y-%m-%d %H:%M:%S"))
        out = json.dumps(out)
        if callback != "":
            # this is jsonp
            out = callback + "(" + out + ")"
        return out

class ShipTypes:
    exposed= True
    def GET(self, callback="", *arg, **kwargs):
        sql = "SELECT DISTINCT(shiptype) FROM logbook;"
        conn = connectToDatabase("localhost", "scottsfarley", 'Sequoia93!', 'WoodenShips')
        cursor = conn.cursor()
        cursor.execute(sql)
        rows = cursor.fetchall()
        out = {}
        outRows = []
        for row in rows:
            row = row[0].replace("'", "")
            row = row.replace(")", "")
            row = row.replace("(", "")
            row = row.replace('"', "")
            row = row.split(",")
            newRow = {
                'type': row[0]
            }
            try:
                if row[0] != "":
                    outRows.append(newRow)
            except:
                pass
        out['data'] = outRows
        out['query'] = sql
        out['success'] = True
        out['timestamp'] = str(strftime("%Y-%m-%d %H:%M:%S"))
        out = json.dumps(out)
        if callback != "":
            # this is jsonp
            out = callback + "(" + out + ")"
        return out



class RawData:
    exposed = True
    def GET(self, header=False, logbookLanguage = "", voyageFrom = "", voyageTo = "", shipName = "", shipType = "", company = "", nationality = "",
            name1= "", year = "", month = "", day = "", lat = "", lng = "", obsGen = False, cargo = False, biology=False,
            warsAndFights=False, otherObs=False, illustrations=False, shipsAndRig=False, lifeOnBoard=False,
            anchored = False, windDirection = "", windForce="", weather="", shapeClouds= "", dirClouds="", clearness="",
            precipitationDescriptor="", gusts=False, rain=False, fog=False, snow=False, thunder=False, hail=False, seaice=False,
            minYear="", maxYear="", minMonth="", maxMonth="", minDay="", maxDay="", latN="", latS = "", lngE="", lngW="", weatherCodeNotNull=False,
            fieldlist="", callback="", windSpeedMax = "", windDirMax = "",windSpeedMin="", windDirMin = "", join=False, *args, **kwargs):
        '''Returns the data from a sql query in the logbooks table and writes as JSON'''
        conn = connectToDatabase("localhost", "scottsfarley", 'Sequoia93!', 'WoodenShips')
        cursor = conn.cursor()
        sql = "SELECT "
        if fieldlist != "":
            sql += fieldlist
        else:
            sql += "*"
        sql += " FROM Logbook "
        if toBool(join):
            sql += " INNER JOIN windforces ON logbook.windforce = windforces.nldesc "
            sql += " INNER JOIN winddirections ON logbook.winddirection = winddirections.nldesc "
            newColnames = ['windForceID', 'windForceDesc', 'windForceClass', 'windForceBeaufort', 'windSpeed', 'windForceLanguage', 'windDirectionID', 'windDirectionDesc', 'windDir', 'windDirectionLanguage']
            for c in newColnames:
                colnames.append(c)
        sql += " WHERE "

        if logbookLanguage != "":
            sql += " logbooklanguage='" + str(logbookLanguage) + "' AND "
        if voyageFrom != "":
            sql += " fromgeocode='" + str(voyageFrom) + "' AND " ## use the modern name if possible
        if voyageTo != "":
            sql += " togeocode='" + str(voyageTo) + "' AND "
        if shipName != "":
            sql += " shipname='" + str(shipName) + "' AND "
        if shipType != "":
            sql += " shiptype='" + str(shipType) + "' AND "
        if company != "":
            sql += " company='" + str(company) + "' AND "
        if nationality != "":
            sql += " nationality='" + str(nationality) + "' AND "
        if name1 != "":
            sql += " name1='" + str(name1) + "' AND "
        if year != "":
            sql += " year=" + str(year) + " AND "
        if month != "":
            sql += " month=" + str(month) + " AND "
        if day != "":
            sql += " day=" + str(day) + " AND "
        if lat != "":
            sql += " lat3=" + str(lat) + " AND "
        if lng != "":
            sql += " lng3=" + str(lng) + " AND "
        if toBool(obsGen):
            sql += " obsgen <> '' AND "
        if toBool(cargo):
            sql += " cargo = TRUE AND "
        if toBool(biology):
            sql += " biology = TRUE AND "
        if toBool(warsAndFights):
            sql += " warsandfights = TRUE AND "
        if toBool(otherObs):
            sql += " otherrem <> ''  AND "
        if toBool(illustrations):
            sql += " illustrations = TRUE AND "
        if toBool(shipsAndRig):
            sql += " shipandrig = TRUE AND "
        if toBool(lifeOnBoard):
            sql += " lifeonboard = TRUE AND "
        if toBool(anchored):
            sql += " anchored = TRUE AND "
        if windDirection != "":
            sql += " winddirection ='" + str(windDirection) + "' AND "
        if windForce != "":
            sql += " windforce ='" + str(windForce) + "' AND "
        if weather != "":
            sql += " weather ='" + str(weather) + "' AND "
        if shapeClouds != "":
            sql += " shapeclouds ='" + str(shapeClouds) + "' AND "
        if dirClouds != "":
            sql += " dirclouds ='" + str(dirClouds) + "' AND "
        if clearness != "":
            sql += " clearness ='" + str(clearness) + "' AND "
        if precipitationDescriptor != "":
            sql += " precipitationdescriptor ='" + str(precipitationDescriptor) + "' AND "
        ##booleans
        if toBool(gusts):
            sql += " gusts = TRUE AND "
        if toBool(rain):
            sql += " rain = TRUE AND "
        if toBool(fog):
            sql += " fog = TRUE AND "
        if toBool(snow):
            sql += " snow = TRUE AND "
        if toBool(thunder):
            sql += " thunder = TRUE AND "
        if toBool(hail):
            sql += " hail = TRUE AND "
        if toBool(seaice):
            sql += " seaice  = TRUE AND "


        ## advanced search options
        ## Geo
        if latN != "":
            sql += " lat3 <=" + str(latN) + " AND "
        if latS != "":
            sql += ' lat3 >=' + str(latS) + " AND "
        if lngE != "":
            sql += " lon3 <=" + str(lngE) + " AND "
        if lngW != "":
            sql +=  " lon3 >=" +str(lngW) + " AND "
        ## temporal
        if minYear != "":
            minDate = minYear
            if minMonth != "":
                minDate += "-" + str(minMonth)
                if minDay != "":
                    minDate += "-" + str(minDay)
                else:
                    minDate += "-01"
            else:
                minDate += "-01"
            sql += " date >= CAST('" + minDate + "' AS DATE) AND "
        if maxYear != "":
            maxDate = maxYear
            if maxMonth != "":
                maxDate += "-" + str(maxMonth)
                if maxDay != "":
                    maxDate += "-" + str(maxDay)
                else:
                    maxDate += "-01"
            else:
                maxDate += "-01"
            sql += " date <= CAST('" + maxDate + "' AS DATE) AND "
        ## find weather records
        if toBool(weatherCodeNotNull):
            sql += " weather <> '' AND "
        if join: #will fail if the tables havent been told to join
            if windSpeedMin != "":
                sql += " CAST((COALESCE(mps,'0')) AS double precision) >= " + str(windSpeedMin) + " AND "
            if windSpeedMax != "":
                sql += " CAST((COALESCE(mps,'0')) AS double precision) >= " + str(windSpeedMax) + " AND "
            if windDirMin != "":
                sql += " direction >= " + str(windDirMin) + " AND "
            if windDirMax != "":
                sql += " direction <= " + str(windDirMax) + "AND "
        ## fix the end of query
        if sql[-4:] == "AND ":
            sql = sql[:-4]
        if sql[-6:] == 'WHERE ':
            sql = sql[:-6]
        sql += ";"
        cursor.execute(sql)
        rows = cursor.fetchall()
        out = {}
        outData = []
        if header: # include field names in json response
            for row in rows:
                # row = row[0].replace("'", "")
                # row = row.replace(")", "")
                # row = row.replace("(", "")
                # row = row.replace('"', "")
                # row = row.split(",")
                newRow = {}
                if fieldlist == "":
                    t = 0
                    while t < len(row):
                        fieldName = colnames[t]
                        if t == 25:
                            t += 1
                        newRow[fieldName] = row[t]
                        t += 1
                elif fieldlist != "":
                    fields = fieldlist.split(",")
                    t = 0
                    while t < len(fields):
                        fieldName = fields[t]
                        newRow[fieldName] = row[t]
                        t += 1
                outData.append(newRow)
        else:
            outData = rows
        out['data'] = outData
        out['query'] = sql
        out['success'] = True
        out['timestamp'] = str(strftime("%Y-%m-%d %H:%M:%S"))
        out = json.dumps(out)
        if callback != "":
            # this is jsonp
            out = callback + "(" + out + ")"
        return out

class Header:
    exposed = True

    def GET(self, callback="", *args, **kwargs):
        '''Returns the column names for the schema stored in the database'''
        # conn = connectToDatabase("localhost", "scottsfarley", "Sequoia93!", "WoodenShips")
        # cursor = conn.cursor()
        # cursor.execute("Select * FROM Logbook")
        # colnames = [desc[0] for desc in cursor.description]
        out = {}
        out['data'] = colnames
        out['success'] = True
        out['timestamp'] = str(strftime("%Y-%m-%d %H:%M:%S"))
        out = json.dumps(out)
        if callback != "":
            # this is jsonp
            out = callback + "(" + out + ")"
        return out

class Ships:
    exposed = True
    def GET(self, company="", nationality="", captain="", shiptype= "", minYear="", maxYear="",
            minMonth="", maxMonth="", minDay="", maxDay="", callback="",*args, **kwargs):
        '''Returns a list of unique ship names and their companies and nationalities
            [(shipName, shipType, captain, company, nation), ...]'''
        conn = connectToDatabase("localhost", "scottsfarley", "Sequoia93!", "WoodenShips")
        cursor = conn.cursor()
        out = {}
        sql = "SELECT DISTINCT(shipname, nationality) FROM Logbook WHERE "
        if company != "":
            sql += " company='" + str(company) + "' AND "
        if nationality != "":
            sql += " nationality='" +str(nationality) + "' AND "
        if captain != "":
            sql += " name1='" + str(captain) + "' AND "
        if shiptype != "":
            sql += " shiptype='" + str(shiptype) + "' AND "
        if minYear != "":
            minDate = minYear
            if minMonth != "":
                minDate += "-" + str(minMonth)
                if minDay != "":
                    minDate += "-" + str(minDay)
                else:
                    minDate += "-01"
            else:
                minDate += "-01"
            sql += " date >= CAST('" + minDate + "' AS DATE) AND "
        if maxYear != "":
            maxDate = maxYear
            if maxMonth != "":
                maxDate += "-" + str(maxMonth)
                if maxDay != "":
                    maxDate += "-" + str(maxDay)
                else:
                    maxDate += "-01"
            else:
                maxDate += "-01"
            sql += " date <= CAST('" + maxDate + "' AS DATE) AND "
        ## fix the end of query
        if sql[-4:] == "AND ":
            sql = sql[:-4]
        if sql[-6:] == 'WHERE ':
            sql = sql[:-6]
        sql += ";"
        cursor.execute(sql)
        rows = cursor.fetchall()
        out = {}
        outData = []
        for row in rows: ## fix the output format
            newRow = {}
            row = row[0].replace("'", "")
            row = row.replace(")", "")
            row = row.replace("(", "")
            row = row.replace('"', "")
            row = row.split(",")
            newRow['ShipName'] = row[0]
            newRow['Nationality'] = row[1]
            outData.append(newRow)
        out['data'] = outData
        out['query'] = sql
        out['success'] = True
        out['timestamp'] = str(strftime("%Y-%m-%d %H:%M:%S"))
        out = json.dumps(out)
        if callback != "":
            # this is jsonp
            out = callback + "(" + out + ")"
        return out

class Voyages:
    exposed = True
    def GET(self, company="", nationality="", captain="", shiptype= "", minYear="", maxYear="",
            minMonth="", maxMonth="", minDay="", maxDay="", callback="", *args, **kwargs):
        '''Returns a list of unique voyages
            [(shipName, shipType, captain, company, nation, fromPlace, toPlace), ...]'''
        conn = connectToDatabase("localhost", "scottsfarley", "Sequoia93!", "WoodenShips")
        cursor = conn.cursor()
        out = {}
        sql = "SELECT DISTINCT(shipname, shiptype, name1, company, nationality, voyagefrom, voyageto) FROM Logbook WHERE "
        if company != "":
            sql += " company='" + str(company) + "' AND "
        if nationality != "":
            sql += " nationality='" +str(nationality) + "' AND "
        if captain != "":
            sql += " name1='" + str(captain) + "' AND "
        if shiptype != "":
            sql += " shiptype='" + str(shiptype) + "' AND "
        if minYear != "":
            minDate = minYear
            if minMonth != "":
                minDate += "-" + str(minMonth)
                if minDay != "":
                    minDate += "-" + str(minDay)
                else:
                    minDate += "-01"
            else:
                minDate += "-01"
            sql += " date >= CAST('" + minDate + "' AS DATE) AND "
        if maxYear != "":
            maxDate = maxYear
            if maxMonth != "":
                maxDate += "-" + str(maxMonth)
                if maxDay != "":
                    maxDate += "-" + str(maxDay)
                else:
                    maxDate += "-01"
            else:
                maxDate += "-01"
            sql += " date <= CAST('" + maxDate + "' AS DATE) AND "
        ## fix the end of query
        if sql[-4:] == "AND ":
            sql = sql[:-4]
        if sql[-6:] == 'WHERE ':
            sql = sql[:-6]
        sql += ";"
        cursor.execute(sql)
        rows = cursor.fetchall()
        outData = []
        for row in rows: ## fix the output format
            newRow = {}
            row = row[0].replace("'", "")
            row = row.replace(")", "")
            row = row.replace("(", "")
            row = row.replace('"', "")
            row = row.split(",")
            newRow['ShipName'] = row[0]
            newRow['ShipType'] = row[1]
            newRow['Captain'] = row[2]
            newRow['Company'] = row[3]
            newRow['Nationality'] = row[4]
            newRow['FromPlace'] = row[5]
            newRow['ToPlace'] = row[6]
            outData.append(newRow)
        out = {}
        out['data'] = outData
        out['query'] = sql
        out['success'] = True
        out['timestamp'] = str(strftime("%Y-%m-%d %H:%M:%S"))
        out = json.dumps(out)
        if callback != "":
            # this is jsonp
            out = callback + "(" + out + ")"
        return out


class Captains:
    exposed = True
    def GET(self, name="", rank="", shipname="", company="", nationality="", shiptype="", minYear="", maxYear="",
            minMonth="", maxMonth="", minDay="", maxDay="", callback="", *args, **kwargs):
        '''returns a list of unique captain names and ranks and the ship they are sailing
            [(name, rank, shipname, shiptype, company, nationality),...]'''
        conn = connectToDatabase("localhost", "scottsfarley", "Sequoia93!", "WoodenShips")
        cursor = conn.cursor()
        out = {}
        sql = "SELECT DISTINCT(name1, rank1, name1, shipname, shiptype, company, nationality) FROM Logbook WHERE "
        if company != "":
            sql += " company='" + str(company) + "' AND "
        if nationality != "":
            sql += " nationality='" +str(nationality) + "' AND "
        if name != "": # name of captain
            sql += " name1='" + str(name) + "' AND "
        if shiptype != "":
            sql += " shiptype='" + str(shiptype) + "' AND "
        if rank != "":
            sql += " rank1='" + str(rank) + "' AND "
        if shipname != "":
            sql += " shipname='" + str(shipname) + "' AND "
        if minYear != "":
            minDate = minYear
            if minMonth != "":
                minDate += "-" + str(minMonth)
                if minDay != "":
                    minDate += "-" + str(minDay)
                else:
                    minDate += "-01"
            else:
                minDate += "-01"
            sql += " date >= CAST('" + minDate + "' AS DATE) AND "
        if maxYear != "":
            maxDate = maxYear
            if maxMonth != "":
                maxDate += "-" + str(maxMonth)
                if maxDay != "":
                    maxDate += "-" + str(maxDay)
                else:
                    maxDate += "-01"
            else:
                maxDate += "-01"
            sql += " date <= CAST('" + maxDate + "' AS DATE) AND "
        ## fix the end of query
        if sql[-4:] == "AND ":
            sql = sql[:-4]
        if sql[-6:] == 'WHERE ':
            sql = sql[:-6]
        sql += ";"
        cursor.execute(sql)
        rows = cursor.fetchall()
        out = {}
        outData = []
        for row in rows: ## fix the output format
            newRow = {}
            row = row[0].replace("'", "")
            row = row.replace(")", "")
            row = row.replace("(", "")
            row = row.replace('"', "")
            row = row.split(",")
            newRow['Captain'] = row[0]
            newRow['CaptainRank'] = row[1]
            newRow['ShipName'] = row[2]
            newRow['ShipType'] = row[3]
            newRow['Company'] = row[4]
            newRow['Nationality'] = row[5]
            outData.append(newRow)
        out['data'] = outData
        out['query'] = sql
        out['success'] = True
        out['timestamp'] = str(strftime("%Y-%m-%d %H:%M:%S"))
        if callback != "":
            # this is jsonp
            out = callback + "(" + out + ")"
        out = json.dumps(out)
        return out

class Companies:
    exposed = True
    def GET(self, company="", nationality="", minYear="", maxYear="", minMonth="", maxMonth="", minDay="", maxDay="", callback="",*args, **kwargs):
        '''Returns a list of unique company names, their nationalities'''
        conn = connectToDatabase("localhost", "scottsfarley", "Sequoia93!", "WoodenShips")
        cursor = conn.cursor()
        out = {}
        sql = "SELECT DISTINCT(company, nationality) FROM Logbook WHERE "
        if company != "":
            sql += " company='" + str(company) + "' AND "
        if nationality != "":
            sql += " nationality='" +str(nationality) + "' AND "
        if minYear != "":
            minDate = minYear
            if minMonth != "":
                minDate += "-" + str(minMonth)
                if minDay != "":
                    minDate += "-" + str(minDay)
                else:
                    minDate += "-01"
            else:
                minDate += "-01"
            sql += " date >= CAST('" + minDate + "' AS DATE) AND "
        if maxYear != "":
            maxDate = maxYear
            if maxMonth != "":
                maxDate += "-" + str(maxMonth)
                if maxDay != "":
                    maxDate += "-" + str(maxDay)
                else:
                    maxDate += "-01"
            else:
                maxDate += "-01"
            sql += " date <= CAST('" + maxDate + "' AS DATE) AND "
        ## fix the end of query
        if sql[-4:] == "AND ":
            sql = sql[:-4]
        if sql[-6:] == 'WHERE ':
            sql = sql[:-6]
        sql += ";"
        cursor.execute(sql)
        rows = cursor.fetchall()
        out = {}
        outData = []
        for row in rows: ## fix the output format
            newRow = {}
            row = row[0].replace("'", "")
            row = row.replace(")", "")
            row = row.replace("(", "")
            row = row.replace('"', "")
            row = row.split(",")
            newRow['Company'] = row[0]
            newRow['Nationality'] = row[1]
            outData.append(newRow)
        out['data'] = outData
        out['query'] = sql
        out['success'] = True
        out['timestamp'] = str(strftime("%Y-%m-%d %H:%M:%S"))
        out = json.dumps(out)
        if callback != "":
            # this is jsonp
            out = callback + "(" + out + ")"
        return out

class Nationalities:
    exposed = True
    def GET(self, company="", minYear="", maxYear="", minMonth="", maxMonth="", minDay="", maxDay="", callback="", *args, **kwargs):
        '''Returns a list of unique nationalities'''
        conn = connectToDatabase("localhost", "scottsfarley", "Sequoia93!", "WoodenShips")
        cursor = conn.cursor()
        out = {}
        sql = "SELECT DISTINCT(nationality) FROM Logbook WHERE "
        if minYear != "":
            minDate = minYear
            if minMonth != "":
                minDate += "-" + str(minMonth)
                if minDay != "":
                    minDate += "-" + str(minDay)
                else:
                    minDate += "-01"
            else:
                minDate += "-01"
            sql += " date >= CAST('" + minDate + "' AS DATE) AND "
        if maxYear != "":
            maxDate = maxYear
            if maxMonth != "":
                maxDate += "-" + str(maxMonth)
                if maxDay != "":
                    maxDate += "-" + str(maxDay)
                else:
                    maxDate += "-01"
            else:
                maxDate += "-01"
            sql += " date <= CAST('" + maxDate + "' AS DATE) AND "
        ## fix the end of query
        if sql[-4:] == "AND ":
            sql = sql[:-4]
        if sql[-6:] == 'WHERE ':
            sql = sql[:-6]
        sql += ";"
        cursor.execute(sql)
        rows = cursor.fetchall()
        out = {}
        outData = []
        for row in rows: ## fix the output format
            newRow = {}
            row = row[0].replace("'", "")
            row = row.replace(")", "")
            row = row.replace("(", "")
            row = row.replace('"', "")
            row = row.split(",")
            newRow['Nationality'] = row[0]
            outData.append(newRow)
        out['data'] = outData
        out['query'] = sql
        out['success'] = True
        out['timestamp'] = str(strftime("%Y-%m-%d %H:%M:%S"))

        out = json.dumps(out)
        if callback != "":
            # this is jsonp
            out = callback + "(" + out + ")"
        return out



class Tracks:
    exposed=True
    def GET(self,
            nationality="", company="", shipname="", callback = "", captain = "", *args, **kwargs):
        '''returns the location of ships for a given date range, locational range, and metadata'''
        conn = connectToDatabase("localhost", "scottsfarley", "Sequoia93!", "WoodenShips")
        cursor = conn.cursor()
        sql = "SELECT shipname, ST_AsText(ST_MakeLine(ST_MakePoint(lon3, lat3) ORDER BY date)) As track FROM logbook WHERE "
        if nationality != "":
            sql += " nationality ='" + str(nationality) + "' AND "
        if company != "":
            sql += " company ='" + str(company) + "' AND "
        if shipname != "":
            sql += " shipname ='" + str(shipname) + "' AND "
        if captain != "":
            sql += " name1 = '" + str(captain) + "' AND "
        if sql[-4:] == "AND ":
            sql = sql[:-4]
        if sql[-6:] == 'WHERE ':
            sql = sql[:-6]
        sql += " GROUP BY shipname "
        sql += ";"
        cursor.execute(sql)
        rows = cursor.fetchall()
        out = {}
        outData = []


        for row in rows: ## fix the output format
            newRow = {}
            # row = row[0].replace("'", "")
            # row = row.replace(")", "")
            # row = row.replace("(", "")
            # row = row.replace('"', "")
            # row = row.split(",")
            newRow['ShipName'] = row[0]
            newRow['Track'] = row[1]
            outData.append(newRow)
        out['data'] = outData
        out['query'] = sql
        out['success'] = True
        out['timestamp'] = str(strftime("%Y-%m-%d %H:%M:%S"))
        out = json.dumps(out)
        if callback != "":
            # this is jsonp
            out = callback + "(" + out + ")"
        return out

class Locations:
    exposed=True
    def GET(self, minYear="", maxYear="", minMonth="", maxMonth="", minDay="", maxDay="",
            nationality="", company="", shipname="", latN="", latS="", lngE="", lngW="", callback = "", captain = "", *args, **kwargs):
        '''returns the location of ships for a given date range, locational range, and metadata'''
        conn = connectToDatabase("localhost", "scottsfarley", "Sequoia93!", "WoodenShips")
        cursor = conn.cursor()
        sql = "SELECT DISTINCT(recid, shipname, nationality, company, lat3, lon3, year, month, day, name1) FROM Logbook WHERE "
        if minYear != "":
            minDate = minYear
            if minMonth != "":
                minDate += "-" + str(minMonth)
                if minDay != "":
                    minDate += "-" + str(minDay)
                else:
                    minDate += "-01"
            else:
                minDate += "-01"
            sql += " date >= CAST('" + minDate + "' AS DATE) AND "
        if maxYear != "":
            maxDate = maxYear
            if maxMonth != "":
                maxDate += "-" + str(maxMonth)
                if maxDay != "":
                    maxDate += "-" + str(maxDay)
                else:
                    maxDate += "-01"
            else:
                maxDate += "-01"
            sql += " date <= CAST('" + maxDate + "' AS DATE) AND "
        if nationality != "":
            sql += " nationality ='" + str(nationality) + "' AND "
        if company != "":
            sql += " company ='" + str(company) + "' AND "
        if shipname != "":
            sql += " shipname ='" + str(shipname) + "' AND "
        if captain != "":
            sql += " name1 = '" + str(captain) + "' AND "
        if latN != "":
            sql += " lat3 <=" + str(latN) + " AND "
        if latS != "":
            sql += ' lat3 >=' + str(latS) + " AND "
        if lngE != "":
            sql += " lon3 <=" + str(lngE) + " AND "
        if lngW != "":
            sql +=  " lon3 >=" +str(lngW) + " AND "
        if sql[-4:] == "AND ":
            sql = sql[:-4]
        if sql[-6:] == 'WHERE ':
            sql = sql[:-6]
        sql += ";"
        cursor.execute(sql)
        rows = cursor.fetchall()
        out = {}
        outData = []
        for row in rows: ## fix the output format
            newRow = {}
            row = row[0].replace("'", "")
            row = row.replace(")", "")
            row = row.replace("(", "")
            row = row.replace('"', "")
            row = row.split(",")
            newRow['RecordID'] = row[0]
            newRow['ShipName'] = row[1]
            newRow['Nationality'] = row[2]
            newRow['Company'] = row[3]
            newRow['Latitude'] = row[4]
            newRow['Longitude'] = row[5]
            newRow['Year'] = row[6]
            newRow['Month'] = row[7]
            newRow['Day'] = row[8]
            newRow['Captain'] = row[9]
            outData.append(newRow)
        out['data'] = outData
        out['query'] = sql
        out['success'] = True
        out['timestamp'] = str(strftime("%Y-%m-%d %H:%M:%S"))
        out = json.dumps(out)
        if callback != "":
            # this is jsonp
            out = callback + "(" + out + ")"
        return out

class SingleRecord:
    exposed= True
    def GET(self, recordID, header=True, *args, **kwargs):
        conn = connectToDatabase("localhost", "scottsfarley", "Sequoia93!", "WoodenShips")
        cursor = conn.cursor()
        sql = "SELECT * FROM Logbook WHERE recid=" + str(recordID)
        cursor.execute(sql)
        rows = cursor.fetchall()
        out = {}
        outData = []
        if header: # include field names in json response
            for row in rows:
                # row = row[0].replace("'", "")
                # row = row.replace(")", "")
                # row = row.replace("(", "")
                # row = row.replace('"', "")
                # row = row.split(",")
                newRow = {}
                t = 0
                while t < len(row):
                    fieldName = colnames[t]
                    if t == 25:
                        t += 1
                    newRow[fieldName] = row[t]
                    t += 1
                outData.append(newRow)
        else:
            outData = rows
        out['data'] = outData[0] ## only select a single record
        out['query'] = sql
        out['success'] = True
        out['timestamp'] = str(strftime("%Y-%m-%d %H:%M:%S"))
        out = json.dumps(out)
        return out

class WindForce:
    exposed = True
    def GET(self, minForce="", maxForce="", minYear="", maxYear="", minMonth="", maxMonth="", minDay="", maxDay="",
            latN="", latS="", lngE="", lngW=""):
        '''returns a list of locations with most likely wind speeds > minForce and < maxForce in the given spatiotemporal search bounds'''
        out = {}
        out['data'] = []
        out['query'] = None
        out['success'] = False
        out['timestamp'] = str(strftime("%Y-%m-%d %H:%M:%S"))
        out['message'] = "Not yet implemented."

class WindDirection:
    exposed = True
    def GET(self, minForce="", maxForce="", minYear="", maxYear="", minMonth="", maxMonth="", minDay="", maxDay="",
            latN="", latS="", lngE="", lngW=""):
        '''returns a list of locations with most likely wind speeds > minForce and < maxForce in the given spatiotemporal search bounds'''
        out = {}
        out['data'] = []
        out['query'] = None
        out['success'] = False
        out['timestamp'] = str(strftime("%Y-%m-%d %H:%M:%S"))
        out['message'] = "Not yet implemented."




class Root:
    exposed = True

    def GET(self, *args, **kwargs):
        out = {
            "Data" : [],
            "Message": "Existing method names are: data"}
        out = json.dumps(out)
        return out

if __name__ == '__main__':
    cherrypy.tree.mount(
        Root(), '/api',
        {'/':
            {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
        }
    )
    cherrypy.tree.mount(
        RawData(), '/api/data',
        {'/':
            {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
        }
    )
    cherrypy.tree.mount(
        Header(), '/api/header',
        {'/':
            {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
        }
    )
    cherrypy.tree.mount(
        Ships(), '/api/ships',
        {'/':
            {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
        }
    )
    cherrypy.tree.mount(
        Captains(), '/api/captains',
        {'/':
            {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
        }
    )
    cherrypy.tree.mount(
        Nationalities(), '/api/nations',
        {'/':
            {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
        }
    )
    cherrypy.tree.mount(
        Companies(), '/api/companies',
        {'/':
            {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
        }
    )
    cherrypy.tree.mount(
        Voyages(), '/api/voyages',
        {'/':
            {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
        }
    )
    cherrypy.tree.mount(
        Locations(), '/api/locations',
        {'/':
            {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
        }
    )
    cherrypy.tree.mount(
        SingleRecord(), '/api/details',
        {'/':
            {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
        }
    )
    cherrypy.tree.mount(
        WindForce(), '/api/windforce',
        {'/':
            {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
        }
    )
    cherrypy.tree.mount(
        WindDirection(), '/api/winddirection',
        {'/':
            {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
        }
    )
    cherrypy.tree.mount(
        GeocodedPlaces(), '/api/places',
        {'/':
            {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
        }
    )
    cherrypy.tree.mount(
        ShipTypes(), '/api/shiptypes',
        {'/':
            {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
        }
    )
    cherrypy.tree.mount(
        VoyageStarts(), '/api/voyagestarts',
        {'/':
            {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
        }
    )
    cherrypy.tree.mount(
        VoyageEnds(), '/api/voyageends',
        {'/':
            {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
        }
    )
    cherrypy.tree.mount(
        Tracks(), '/api/tracks',
        {'/':
            {'request.dispatch': cherrypy.dispatch.MethodDispatcher()}
        }
    )




    cherrypy.engine.start()
    cherrypy.engine.block()

