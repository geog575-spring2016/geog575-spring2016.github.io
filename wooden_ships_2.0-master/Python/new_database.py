import psycopg2
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

print "Started."
remoteConn = connectToDatabase("144.92.235.47", "scottsfarley", "xP73m3YAb1", "wooden_ships")
if not remoteConn:
    print "Failed to connect to remote resource."
    exit()
print "Connected."


def runQuery(sql):
    cursor.execute(sql)
    rows = cursor.fetchall()
    for row in rows:
        print row
    print cursor.statusmessage

# sql = "DROP table voyages;"
cursor = remoteConn.cursor()
# cursor.execute(sql)
# remoteConn.commit()

## Create the tables

sql = '''CREATE TABLE IF NOT EXISTS voyages (
            voyageID serial PRIMARY KEY,
            fromPlace text,
            toPlace text,
            startDate date,
            captainID integer,
            shipID integer,
            companyID integer,
            nationID integer
        );
        CREATE TABLE IF NOT EXISTS  ships(
            shipID serial PRIMARY KEY,
            nationID integer,
            companyID integer,
            shipType text,
            shipInfo text,
            shipName text,
            notes text
        );
        CREATE TABLE IF NOT EXISTS  companies(
            companyID serial PRIMARY KEY,
            nationID integer,
            companyName text
        );
        CREATE TABLE IF NOT EXISTS  nations (
            nationID serial PRIMARY KEY,
            nationality text
        );
        CREATE TABLE IF NOT EXISTS  locations (
            locationID serial PRIMARY KEY,
            shipID integer,
            latitude double precision,
            longitude double precision,
            voyageID integer,
            distance double precision,
            date date,
            recordID integer
        );
        CREATE TABLE IF NOT EXISTS  observations (
            obsID serial PRIMARY KEY,
            voyageid integer references voyages (voyageID),
            locationID integer references locations (locationID),
            memoType text,
            memoText text,
            memoLanguage text
        );
        CREATE TABLE IF NOT EXISTS weather (
            weatherID serial PRIMARY KEY,
            locationID integer references locations (locationID),
            airtemp double precision,
            pressure double precision,
            sst double precision,
            winddirection double precision,
            windforce double precision,
            pumpwater double precision,
            gusts boolean,
            rain boolean,
            fog boolean,
            snow boolean,
            thunder boolean,
            hail boolean,
            seaice boolean
        );
        CREATE TABLE IF NOT EXISTS captains (
            captainID serial PRIMARY KEY,
            captainName text,
            rank text
        );
        CREATE TABLE IF NOT EXISTS ports (
            portID serial PRIMARY KEY,
            portName text,
            latitude double precision,
            longitude double precision,
            modernName text
        );
        '''


cursor = remoteConn.cursor()
cursor.execute(sql)
remoteConn.commit()
##list table names
# sql = "SELECT * FROM pg_catalog.pg_tables where schemaname != 'pg_catalog' AND schemaname != 'information_schema'"
# cursor.execute(sql)
# print cursor.fetchall()


## enforce the constraints
sql  = '''
    ALTER TABLE voyages ADD constraint captainID foreign key (captainID) references captains (captainID);
    ALTER TABLE voyages ADD constraint shipID foreign key (shipID) references ships (shipID);
    ALTER TABLE voyages ADD constraint companyID foreign key (companyID) references companies (companyID);
    ALTER TABLE voyages ADD constraint nationID foreign key (nationID) references nations (nationID);
    ALTER TABLE companies ADD CONSTRAINT nationID foreign key (nationID) references nations (nationID);
    ALTER TABLE ships ADD constraint nationID foreign key (nationID) references nations (nationID);
    '''
# cursor.execute(sql)
# remoteConn.commit()
# print cursor.statusmessage


##get the data for the ports table

            # portID integer PRIMARY KEY,
            # portName text,
            # latitude double precision,
            # longitude double precision,
            # modernName text
# ports = []
# sql = "SELECT DISTINCT voyagefrom from logs;"
# cursor.execute(sql)
# rows = cursor.fetchall()
# for row in rows:
#     print row[0]
#     ports.append(row[0])
#
# sql = "SELECT DISTINCT voyageto from logs;"
# cursor.execute(sql)
# rows = cursor.fetchall()
# for row in rows:
#     print row[0]
#     if row[0] not in ports:
#         ports.append(row[0])
#
#
# ## lookup in geocode table
# i = 0
# for city in ports:
#     sql = "SELECT * FROM geocode where place LIKE '" + str(city) + "';"
#     cursor.execute(sql)
#     row = cursor.fetchone()
#     if row is None:
#         #print city
#         sql = "INSERT INTO ports values (DEFAULT,'" + str(city) + "', null, null, null);"
#         pass
#     else:
#         print row
#         sql = "INSERT INTO ports values (DEFAULT, '" + str(city) + "'," + str(row[2]) + "," + str(row[3]) + ",'" + str(row[5]) + "');"
#         i += 1
#     cursor.execute(sql)
#     remoteConn.commit()
# print i

## do the captains table
# sql = "SELECT DISTINCT name1, rank1 FROM logs;"
# cursor.execute(sql)
# rows = cursor.fetchall()
# for row in rows:
#     sql = "INSERT INTO captains values (default, '" + str(row[0]) + "','" + str(row[1]) + "');"
#     cursor.execute(sql)
# remoteConn.commit()
#runQuery("SELECT * FROM captains;")

##do the nations table
#
# sql = "SELECT DISTINCT nationality from logs;"
# cursor.execute(sql)
# rows = cursor.fetchall()
# for row in rows:
#     sql = "INSERT INTO nations values (default,'" + str(row[0]).strip() + "');"
#     if row[0] != "British ":
#         cursor.execute(sql)
# remoteConn.commit()
# runQuery("SELECT * FROM nations")

## do the companies table
# sql = "SELECT DISTINCT logs.company, nations.nationid from logs INNER JOIN nations on logs.nationality = nations.nationality;"
# cursor.execute(sql)
# rows = cursor.fetchall()
# for row in rows:
#     sql = "INSERT INTO companies values (default, " + str(row[1]) + ",'" + str(row[0]).strip() + "');"
#     cursor.execute(sql)
# remoteConn.commit()
# runQuery("SELECT * FROM companies;")

## remove duplicates
# sql = '''DELETE FROM companies
# WHERE companyid IN (SELECT companyid
#               FROM (SELECT companyid,
#                              ROW_NUMBER() OVER (partition BY nationid, companyname ORDER BY companyid) AS rnum
#                      FROM companies) t
#               WHERE t.rnum > 1);
# '''
# cursor.execute(sql)
# remoteConn.commit()
# runQuery("SELECT * FROM companies;")



# do the ships table
# sql = '''SELECT distinct logs.shiptype, logs.othershipinformation, logs.shipname, nations.nationid
#     from logs inner join nations on trim(logs.nationality) = trim(nations.nationality);'''
# runQuery(sql)
# cursor.execute(sql)
# for row in cursor.fetchall():
#     sql = "INSERT INTO ships values (default," + str(row[3]) + ",'" + str(row[0]) + "','" + str(row[1]) + "','" + str(row[2]) + "',null);"
#     cursor.execute(sql)
# remoteConn.commit()

# sql = "ALTER Table voyages drop column fromplaceid; alter table voyages drop column toplaceid;"
# cursor.execute(sql)
# remoteConn.commit()

#             voyageID
#             fromPlace text,
#             toPlace text,
#             captainID integer,
#             shipID integer,
#             companyID integer,
#             nationID integer

# ## do the voyages table
# sql = "truncate table voyages;"
# cursor.execute(sql)
# remoteConn.commit()
# sql = '''SELECT distinct voyagefrom, voyageto, voyageini,
#         name1, shipname, company, nationality from logs
#         '''
# cursor.execute(sql)
# for row in cursor.fetchall():
#     try:
#         year = row[2][0:4]
#         month = row[2][4:6]
#         day = row[2][6:8]
#         d = year + "-" + month + "-" + day
#         print d
#         voyagefrom  = row[0]
#         voyageto = row[1]
#         captain = row[3]
#         shipname = row[4]
#         company = row[5]
#         nation = row[6]
#         sql = "SELECT companyid from companies where companyname = '" + company +"';"
#         cursor.execute(sql)
#         companyid = cursor.fetchone()[0]
#         sql = "SELECT nationid from nations where nationality = '" + nation +"';"
#         cursor.execute(sql)
#         nationid = cursor.fetchone()[0]
#         sql = "SELECT shipid from ships where shipname = '" + shipname +"';"
#         cursor.execute(sql)
#         shipid = cursor.fetchone()[0]
#         sql = "SELECT captainid from captains where captainname = '" + captain +"';"
#         cursor.execute(sql)
#         captainid = cursor.fetchone()[0]
#         if row[2] != 'NA':
#             sql = "INSERT INTO voyages values (default,'" + voyagefrom + "','" + voyageto + "','" + d + "','" + str(captainid)+ "','" + str(shipid) + "','" + str(companyid) + "','" + str(nationid) + "') returning voyageid;"
#             cursor.execute(sql)
#             remoteConn.commit()
#             id = cursor.fetchone()[0]
#             sql = "UPDATE logs set voyageid = " + str(id) + " where shipname = '" + shipname + "' AND company = '" + company + "' "
#             sql += " AND nationality='" + nation + "' AND name1 ='" + captain + "' AND voyagefrom='" + voyagefrom + "' AND voyageto ='" + voyageto + "';"
#             cursor.execute(sql)
#             remoteConn.commit()
#     except Exception as e:
#         print e
#         remoteConn.rollback()
# runQuery("SELECT count(*) FROM voyages")


            # locationID integer references locations (locationID),
            # biology text,
            # lifeonboard text,
            # shipandrig text,
            # allwinddirections text,
            # windforcetext text,
            # winddirectiontext text,
            # warsandfights text,
            # otherrem text,
            # genobs text,
            # cargo text,
            # weather text,
            # shapeclouds text,
            # dirclouds text,
            # clearness text,
            # cloudfrac text,
            # precipitation text,
            # seastate text,
            # anchored boolean,
            # anchorPlace text,
            # currentDir text,
            # currentSpeed text
            # allwindforces text
# sql = "ALTER table observations add column allwindforces text;"
# cursor.execute(sql)
# remoteConn.commit()

# sql = '''ALTER table logs add column voyageid integer;'''
# cursor.execute(sql)
# remoteConn.commit()



#
#
#

# sql = "ALTER TABLE logs add column locationid integer;"
#
# cursor.execute(sql)
# remoteConn.commit()

            # locationID serial PRIMARY KEY,
            # shipID integer,
            # latitude double precision,
            # longitude double precision,
            # voyageID integer,
            # distance double precision,
            # date date,
            # recordID integer

# sql = '''SELECT shipname, lat3, lon3, distance, disttravelledunits, recid, voyageid, date from logs where voyageid is not null and recid < 10415 order by recid;'''
# cursor.execute(sql)
# i = 0
# for row in cursor.fetchall():
#     try:
#         shipname = row[0]
#         sql = "select shipid from ships where shipname='" + shipname + "';"
#         cursor.execute(sql)
#         shipid = cursor.fetchone()[0]
#         units = row[4]
#         dist = row[3]
#         lat = row[1]
#         lng = row[2]
#         voyageid = row[6]
#         recid = row[5]
#         date = row[7].isoformat()
#         if dist != "NA":
#         #convert units
#             try:
#                 dist = float(dist)
#             except:
#                 dist = 0
#             if units == "nm":
#                 dist = dist * 1.15078
#             elif units == 'Leagues':
#                 dist = dist * 3.45234
#             else:
#                 dist = 0
#         else:
#             dist = 0
#         sql = "INSERT INTO locations values (default, " + str(shipid) + "," + str(lat) + "," + str(lng) + "," + str(voyageid) + ","
#         sql += str(dist) + ",'" + date + "'," + str(recid) + ");"
#         sql += "Update logs set locationid = (SELECT currval(pg_get_serial_sequence('locations','locationid'))) where recid=" + str(recid) + ";"
#         cursor.execute(sql)
#         remoteConn.commit()
#     except Exception as e:
#         print e
#         remoteConn.rollback()
#     if i % 100 == 0:
#         print i
#     i += 1
#

locationIDS = []
sql = "SELECT locationid from locations;"
cursor.execute(sql)
for row in cursor.fetchall():
    locationIDS.append(row[0])
print len(locationIDS)

sql = '''truncate table observations; SELECT voyageid, locationid, logbooklanguage, biologymemo, lifeonboardmemo, shipandrigmemo, allwinddirections, windforce, winddirection, warsandfightsmemo,
        otherrem, obsgen, cargomemo, weather, shapeclouds, dirclouds, clearness, cloudfrac, precipitationdescriptor, statesea, anchored, anchorplace,
        currentdir, currentspeed, allwindforces, recid from logs WHERE locationid IS NOT NULL order by recid; '''
# 21
cursor.execute(sql)
rows = cursor.fetchall()
i = 0
sql = ""
for row in rows:
    voyageID = row[0]
    locationID = row[1]
    lang = row[2]
    p = 2
    opts = ['voyageid', 'locationid', 'obsLanguage', 'biology', 'lifeOnBoard', 'shipAndRig', 'allWindDirections', 'windForce', 'windDirection', 'warsAndFights', 'otherRemmarks',
            'generalObservations', 'cargo', 'weather', 'shapeOfClouds', 'directionOfClouds', 'clearness', 'cloudFraction', 'precipitationDescription',
            'stateOfSea', 'anchored', 'anchorPlace', 'currentTravelDirection', 'currentTravelSpeed', 'allWindForces', 'recordID']
    if locationID is not None and voyageID is not None and locationID in locationIDS:
        while p < len(row):
            item = row[p]
            if item != '' and item != 'NA':
                col = opts[p]
                sql += "INSERT INTO observations values (default," + str(voyageID) + "," + str(locationID) + ",'" + str(col) + "','" + str(item) + "','" + str(lang) + "');"
            p += 1
        locationIDS.remove(locationID)

    if i % 100 == 0:
        try:
            cursor.execute(sql)
            remoteConn.commit()
            sql = ""

        except Exception as e:
            print e
            remoteConn.rollback()
        print "Observations: " + str(i)
    i += 1
#
#
# locationIDS = []
# sql = "SELECT locationid from locations;"
# cursor.execute(sql)
# for row in cursor.fetchall():
#     locationIDS.append(row[0])
# print len(locationIDS)
#
# sql = '''truncate table weather; select probtair, sstreading, windforces.mps, winddirections.direction, baroreading, sstreadingunits, airpressurereadingunits, pumpwater, locationid, gusts, thunder, rain, snow, seaice, hail, fog from logs
#         INNER JOIN windforces on windforces.nldesc=logs.windforce
#         INNER JOIN winddirections on winddirections.nldesc=logs.winddirection '''
# cursor.execute(sql)
# i = 0
# sql = ""
# for row in cursor.fetchall():
#     airTemp = row[0]
#     if airTemp != 'NA' and airTemp != '' and airTemp is not None:
#         airTemp = float(row[0])
#     else:
#         airTemp = -1
#     sst = row[1]
#     if sst != 'NA' and sst != '' and airTemp is not None:
#         sst = float(row[1])
#     else:
#         sst = -1
#     mps = row[2]
#     if mps != 'NA' and mps != '' and mps is not None:
#         mps = float(mps)
#     else:
#         mps = -1
#     direction = row[3]
#     if direction != 'NA' and direction != '' and direction is not None:
#         direction = float(direction)
#     else:
#         direction = -1
#     pressureReading = row[4]
#     if pressureReading != "NA" and pressureReading != '' and pressureReading is not None:
#         pressureReading = float(pressureReading)
#     else:
#         pressureReading = -1
#     sstUnits = row[5]
#     pressureUnits = row[6]
#     pumpwater = row[7]
#     if pumpwater != 'NA' and pumpwater != '' and pumpwater is not None:
#         pumpwater = float(pumpwater)
#     else:
#         pumpwater = -1
#     locationID = row[8]
#     gusts = row[9]
#     thunder = row[10]
#     rain = row[11]
#     snow = row[12]
#     seaice = row[13]
#     hail = row[14]
#     fog = row[15]
#     ## convert units
#     #Weatherid | locationid | airtemp | pressure | sst | winddirection | windforce | pumpwater | gusts | rain | fog | snow | thunder | hail | seaice
#     if pressureUnits == 'Inches Mercury':
#         pressureReading *= 25.4
#     if pressureUnits != 'Inches Mercury' and pressureUnits != 'Millimeter Mercury' and pressureUnits != 'Millimeters Mercury':
#         pressureReading = -1
#     if locationID in locationIDS:
#         sql += 'INSERT INTO weather values(default,' + str(locationID) + "," + str(airTemp) + "," + str(pressureReading) + "," + str(sst) + "," + str(direction) + "," + str(mps)  + "," + str(pumpwater) + "," + str(gusts) + "," + str(rain) + "," + str(fog) + "," + str(snow) +"," + str(thunder) + "," + str(hail) + "," + str(seaice) + ");"
#         locationIDS.remove(locationID)
#     if i % 100 == 0:
#         try:
#             cursor.execute(sql)
#             remoteConn.commit()
#             sql = ""
#         except Exception as e:
#             print e
#             remoteConn.rollback()
#         print "Weather: " + str(i)
#     i += 1
#
#
#
#
#
