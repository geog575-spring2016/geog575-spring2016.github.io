# __author__ = 'scottsfarley'
import psycopg2
import csv
#f = open("../data/database3.csv", 'rU')
#connectString = "dbname='" + str("WoodenShips") + "' user='" + str("postgres") + "' host='" + str("localhost") + "' password='" + str("G0Bears7!") + "'"
#conn = psycopg2.connect(connectString)
#reader = csv.reader(f)
# # fields =  reader.fieldnames
createSQL = "CREATE TABLE IF NOT EXISTS Logbook (RecID int, " \
            "InstAbbr text, " \
            "LogbookLanguage text, " \
            "VoyageFrom text, " \
            "VoyageTo text, " \
            "ShipName text, " \
            "ShipType text, " \
            "Company text, " \
            "OtherShipInformation text, " \
            "Nationality text, " \
            "Name1 text, " \
            "Rank1 text, " \
            "Name2 text, " \
            "Rank2 text, " \
            "ZeroMeridian text, " \
            "ObsGen text, " \
            "DistUnits text, " \
            "DistToLandmarkUnits text, " \
            "DistTravelledUnits text, " \
            "LongitudeUnits text, " \
            "VoyageIni text, " \
            "UnitsOfMeasurement text, " \
            "Year int, " \
            "Month int, " \
            "Day int, " \
            "Date date, " \
            "Distance text, " \
            "Lat3 double precision, " \
            "Lon3 double precision, " \
            "Anchored boolean, " \
            "AnchorPlace text," \
            "WindDirection text, " \
            "AllWindDirections text, " \
            "WindForce text, " \
            "WindForceScale text, " \
            "AllWindForces text, " \
            "WindScale text, " \
            "Weather text, " \
            "ShapeClouds text, " \
            "DirClouds text, " \
            "Clearness text, " \
            "PrecipitationDescriptor text, " \
            "CloudFrac text, " \
            "Gusts boolean, " \
            "Rain boolean, " \
            "Fog boolean, " \
            "Snow boolean, " \
            "Thunder boolean, " \
            "Hail boolean, " \
            "SeaIce boolean, " \
            "SSTReading text, " \
            "SSTReadingUnits text, " \
            "StateSea text, " \
            "CurrentDir text, " \
            "CurrentSpeed text, " \
            "TairReading text, " \
            "AirThermReadingUnits text, " \
            "ProbTair text, " \
            "BaroReading text, " \
            "AirPressureReadingUnits text, " \
            "BarometerType text, " \
            "BarTempReading text, " \
            "BarTempReadingUnits text, " \
            "HumReading text, " \
            "HumidityUnits text, " \
            "HumidityMethod text, " \
            "PumpWater text, " \
            "WaterAtThePumpUnits text, " \
            "LifeOnBoard boolean, " \
            "LifeOnBoardMemo text, " \
            "Cargo boolean, " \
            "CargoMemo text, " \
            "ShipAndRig boolean, " \
            "ShipAndRigMemo text, " \
            "Biology boolean, " \
            "BiologyMemo text, " \
            "WarsAndFights boolean, " \
            "WarsAndFightsMemo text, " \
            "Illustrations boolean, " \
            "OtherRem text," \
            "Point point );"

print createSQL
exit()

cursor = conn.cursor()
cursor.execute(createSQL)
conn.commit()
print "Created table"
# copySQL = "COPY logbook FROM '/Users/scottsfarley/documents/wooden_ships/data/CLIWOC15.csv' DELIMITER ',' CSV;"
# cursor.execute(copySQL)
# conn.commit()
i = 0
data = []
for row in reader:
    data.append(row)


def insert(recordNum):
    try:
        row = []
        t = 0
        datum = data[recordNum]
        while t < len(datum):
            row.append(datum[t].replace("'", ""))
            t +=1
        sql = "INSERT INTO Logbook VALUES ("
        sql += row[0] + ","
        sql += "'" + row[1].decode("utf8", "ignore") + "',"
        sql += "'" + row[2].decode("utf8", "ignore") + "',"
        sql += "'" + row[3].decode("utf8", "ignore") + "',"
        sql += "'" + row[4].decode("utf8", "ignore") + "',"
        sql += "'" + row[5].decode("utf8", "ignore") + "',"
        sql += "'" + row[6].decode("utf8", "ignore") + "',"
        sql += "'" + row[7].decode("utf8", "ignore") + "',"
        sql += "'" + row[8].decode("utf8", "ignore") + "',"
        sql += "'" + row[9].decode("utf8", "ignore") + "',"
        sql += "'" + row[10].decode("utf8", "ignore") + "',"
        sql += "'" + row[11].decode("utf8", "ignore") + "',"
        sql += "'" + row[12].decode("utf8", "ignore") + "',"
        sql += "'" + row[13].decode("utf8", "ignore") + "',"
        sql += "'" + row[14].decode("utf8", "ignore") + "',"
        sql += "'" + row[15].decode("utf8", "ignore") + "',"
        sql += "'" + row[16].decode("utf8", "ignore") + "',"
        sql += "'" + row[17].decode("utf8", "ignore") + "',"
        sql += "'" + row[18].decode("utf8", "ignore") + "',"
        sql += "'" + row[19].decode("utf8", "ignore") + "',"
        sql += "'" + row[20].decode("utf8", "ignore") + "',"
        sql += "'" + row[21].decode("utf8", "ignore") + "',"
        sql += "" + row[22] + ","
        sql += "" + row[23] + ","
        sql += "" + row[24] + ","
        sql += "'" + str(row[22]) + "-" + str(row[23]) + "-" + str(row[24]) +  "',"
        sql += "'" + row[26].decode("utf8", "ignore") + "',"
        sql += "" + row[27] + ","
        sql += "" + row[28] + ","
        sql += "'" + row[29] + "',"
        sql += "'" + row[30].decode("utf8", "ignore") + "',"
        sql += "'" + row[31].decode("utf8", "ignore") + "',"
        sql += "'" + row[32].decode("utf8", "ignore") + "',"
        sql += "'" + row[33].decode("utf8", "ignore") + "',"
        sql += "'" + row[34].decode("utf8", "ignore") + "',"
        sql += "'" + row[35].decode("utf8", "ignore") + "',"
        sql += "'" + row[36].decode("utf8", "ignore") + "',"
        sql += "'" + row[37].decode("utf8", "ignore") + "',"
        sql += "'" + row[38].decode("utf8", "ignore") + "',"
        sql += "'" + row[39].decode("utf8", "ignore") + "',"
        sql += "'" + row[40].decode("utf8", "ignore") + "',"
        sql += "'" + row[41].decode("utf8", "ignore") + "',"
        sql += "'" + row[42].decode("utf8", "ignore") + "',"
        sql += "'" + row[43] + "',"
        sql += "'" + row[44] + "',"
        sql += "'" + row[45] + "',"
        sql += "'" + row[46] + "',"
        sql += "'" + row[47] + "',"
        sql += "'" + row[48] + "',"
        sql += "'" + row[49] + "',"
        sql += "'" + row[50].decode("utf8", "ignore") + "',"
        sql += "'" + row[51].decode("utf8", "ignore") + "',"
        sql += "'" + row[52].decode("utf8", "ignore") + "',"
        sql += "'" + row[53].decode("utf8", "ignore") + "',"
        sql += "'" + row[54].decode("utf8", "ignore") + "',"
        sql += "'" + row[55].decode("utf8", "ignore") + "',"
        sql += "'" + row[56].decode("utf8", "ignore") + "',"
        sql += "'" + row[57].decode("utf8", "ignore") + "',"
        sql += "'" + row[58].decode("utf8", "ignore") + "',"
        sql += "'" + row[59].decode("utf8", "ignore") + "',"
        sql += "'" + row[60].decode("utf8", "ignore") + "',"
        sql += "'" + row[61].decode("utf8", "ignore") + "',"
        sql += "'" + row[62].decode("utf8", "ignore") + "',"
        sql += "'" + row[63].decode("utf8", "ignore") + "',"
        sql += "'" + row[64].decode("utf8", "ignore") + "',"
        sql += "'" + row[65].decode("utf8", "ignore") + "',"
        sql += "'" + row[66].decode("utf8", "ignore") + "',"
        sql += "'" + row[67].decode("utf8", "ignore") + "',"
        sql += "'" + row[68] + "',"
        sql += "'" + row[69].decode("utf8", "ignore") + "',"
        sql += "'" + row[70] + "',"
        sql += "'" + row[71].decode("utf8", "ignore") + "',"
        sql += "'" + row[72] + "',"
        sql += "'" + row[73].decode("utf8", "ignore") + "',"
        sql += "'" + row[74] + "',"
        sql += "'" + row[75].decode("utf8", "ignore") + "',"
        sql += "'" + row[76] + "',"
        sql += "'" + row[77].decode("utf8", "ignore") + "',"
        sql += "'" + row[78].decode("utf8", "ignore") + "',"
        sql += "'" + row[79].decode("utf8", "ignore") + "',"
        sql += "'(" + row[28] + "," + row[29] + ")'"
        sql += ");"
        cursor.execute(sql)
        conn.commit()
        print "Execution successful: " + str(recordNum)
    except Exception as e:
        conn.rollback()
        print "Passing: " + str(e)
        return

i = 1
while i < len(data):
    insert(i)
    i += 1



# for datum in data:
#     try:
#         row = []
#         t = 0
#         while t < len(datum):
#             row.append(datum[t].replace("'", ""))
#             t +=1
#         if i == 0:
#             i += 1
#             continue
#         sql = "INSERT INTO Logbook VALUES ("
#         sql += row[0] + ","
#         sql += "'" + row[1].decode("utf8", "ignore") + "',"
#         sql += "'" + row[2].decode("utf8", "ignore") + "',"
#         sql += "'" + row[3].decode("utf8", "ignore") + "',"
#         sql += "'" + row[4].decode("utf8", "ignore") + "',"
#         sql += "'" + row[5].decode("utf8", "ignore") + "',"
#         sql += "'" + row[6].decode("utf8", "ignore") + "',"
#         sql += "'" + row[7].decode("utf8", "ignore") + "',"
#         sql += "'" + row[8].decode("utf8", "ignore") + "',"
#         sql += "'" + row[9].decode("utf8", "ignore") + "',"
#         sql += "'" + row[10].decode("utf8", "ignore") + "',"
#         sql += "'" + row[11].decode("utf8", "ignore") + "',"
#         sql += "'" + row[12].decode("utf8", "ignore") + "',"
#         sql += "'" + row[13].decode("utf8", "ignore") + "',"
#         sql += "'" + row[14].decode("utf8", "ignore") + "',"
#         sql += "'" + row[15].decode("utf8", "ignore") + "',"
#         sql += "'" + row[16].decode("utf8", "ignore") + "',"
#         sql += "'" + row[17].decode("utf8", "ignore") + "',"
#         sql += "'" + row[18].decode("utf8", "ignore") + "',"
#         sql += "'" + row[19].decode("utf8", "ignore") + "',"
#         sql += "'" + row[20].decode("utf8", "ignore") + "',"
#         sql += "'" + row[21].decode("utf8", "ignore") + "',"
#         sql += "" + row[22] + ","
#         sql += "" + row[23] + ","
#         sql += "" + row[24] + ","
#         sql += "'" + str(row[22]) + "-" + str(row[23]) + "-" + str(row[24]) +  "',"
#         sql += "'" + row[26].decode("utf8", "ignore") + "',"
#         sql += "" + row[27] + ","
#         sql += "" + row[28] + ","
#         sql += "'" + row[29] + "',"
#         sql += "'" + row[30].decode("utf8", "ignore") + "',"
#         sql += "'" + row[31].decode("utf8", "ignore") + "',"
#         sql += "'" + row[32].decode("utf8", "ignore") + "',"
#         sql += "'" + row[33].decode("utf8", "ignore") + "',"
#         sql += "'" + row[34].decode("utf8", "ignore") + "',"
#         sql += "'" + row[35].decode("utf8", "ignore") + "',"
#         sql += "'" + row[36].decode("utf8", "ignore") + "',"
#         sql += "'" + row[37].decode("utf8", "ignore") + "',"
#         sql += "'" + row[38].decode("utf8", "ignore") + "',"
#         sql += "'" + row[39].decode("utf8", "ignore") + "',"
#         sql += "'" + row[40].decode("utf8", "ignore") + "',"
#         sql += "'" + row[41].decode("utf8", "ignore") + "',"
#         sql += "'" + row[42].decode("utf8", "ignore") + "',"
#         sql += "'" + row[43] + "',"
#         sql += "'" + row[44] + "',"
#         sql += "'" + row[45] + "',"
#         sql += "'" + row[46] + "',"
#         sql += "'" + row[47] + "',"
#         sql += "'" + row[48] + "',"
#         sql += "'" + row[49] + "',"
#         sql += "'" + row[50].decode("utf8", "ignore") + "',"
#         sql += "'" + row[51].decode("utf8", "ignore") + "',"
#         sql += "'" + row[52].decode("utf8", "ignore") + "',"
#         sql += "'" + row[53].decode("utf8", "ignore") + "',"
#         sql += "'" + row[54].decode("utf8", "ignore") + "',"
#         sql += "'" + row[55].decode("utf8", "ignore") + "',"
#         sql += "'" + row[56].decode("utf8", "ignore") + "',"
#         sql += "'" + row[57].decode("utf8", "ignore") + "',"
#         sql += "'" + row[58].decode("utf8", "ignore") + "',"
#         sql += "'" + row[59].decode("utf8", "ignore") + "',"
#         sql += "'" + row[60].decode("utf8", "ignore") + "',"
#         sql += "'" + row[61].decode("utf8", "ignore") + "',"
#         sql += "'" + row[62].decode("utf8", "ignore") + "',"
#         sql += "'" + row[63].decode("utf8", "ignore") + "',"
#         sql += "'" + row[64].decode("utf8", "ignore") + "',"
#         sql += "'" + row[65].decode("utf8", "ignore") + "',"
#         sql += "'" + row[66].decode("utf8", "ignore") + "',"
#         sql += "'" + row[67].decode("utf8", "ignore") + "',"
#         sql += "'" + row[68] + "',"
#         sql += "'" + row[69].decode("utf8", "ignore") + "',"
#         sql += "'" + row[70] + "',"
#         sql += "'" + row[71].decode("utf8", "ignore") + "',"
#         sql += "'" + row[72] + "',"
#         sql += "'" + row[73].decode("utf8", "ignore") + "',"
#         sql += "'" + row[74] + "',"
#         sql += "'" + row[75].decode("utf8", "ignore") + "',"
#         sql += "'" + row[76] + "',"
#         sql += "'" + row[77].decode("utf8", "ignore") + "',"
#         sql += "'" + row[78].decode("utf8", "ignore") + "',"
#         sql += "'" + row[79].decode("utf8", "ignore") + "',"
#         sql += "'(" + row[28] + "," + row[29] + ")'"
#         sql += ");"
#         cursor.execute(sql)
#         conn.commit()
#         i += 1
#     except Exception as e:
#         print e
# print i
# sql = '''CREATE TABLE IF NOT EXISTS Geocode
# (
#   ID integer,
#   Place text,
#   Latitude double precision,
#   Longitude double precision,
#   Source text,
#   ModernName text,
#   AltModern text,
#   Near text,
#   Ocean text,
#   Spanish text,
#   Dutch text,
#   French text,
#   Notes text
# )'''
# cursor = conn.cursor()
# cursor.execute(sql)
# conn.commit()
# f = open("/Users/scottsfarley/documents/wooden_ships/data/geocode.csv", 'rU')
# reader = csv.reader(f)
# for row in reader:
#     try:
#         vals = []
#         for item in row:
#             try:
#                 newitem = item.decode("utf8", 'ignore')
#                 newitem = newitem.replace("'", "?")
#                 vals.append(newitem)
#             except:
#                 print 'decode error.'
#         sql = "INSERT INTO geocode VALUES(" + str(vals[0]) + ",'" + str(vals[1]) + "'," + str(vals[2]) + "," + str(vals[3])
#         sql += ",'" + str(vals[4]) + "','" + str(vals[5]) + "','" + str(vals[6]) + "','" + str(vals[7]) + "','" + str(vals[8]) + "',"
#         sql += "'" + str(vals[9]) + "','" + str(vals[10]) + "','" + str(vals[11]) + "','" + str(vals[12]) + "');"
#
#     except Exception as e:
#         print e
#
#     cursor.execute(sql)
#     conn.commit()

# sql = '''CREATE TABLE IF NOT EXISTS LogbookReference
# (
#   ID integer,
#   Place text,
#   Ship text,
#   Duplicate integer
# )'''
# cursor = conn.cursor()
# cursor.execute(sql)
# conn.commit()
# f = open("/Users/scottsfarley/documents/wooden_ships/data/lookups/ShipLogbookID.csv", 'rU')
# reader = csv.reader(f)
# index = 0
# for row in reader:
#     if index != 0:
#         vals = []
#         for item in row:
#             try:
#                 newitem = item.decode("utf8", 'ignore')
#                 newitem = newitem.replace("'", "?")
#                 newitem = str(newitem)
#                 vals.append(newitem)
#             except:
#                 print 'decode error.'
#         print vals
#         try:
#             sql = "INSERT INTO LogbookReference VALUES(" + str(vals[0]) + ",'" + str(vals[1]) + "','" + str(vals[2]) + "'," + str(vals[3]) + ");"
#         except:
#             continue
#         try:
#             cursor.execute(sql)
#             conn.commit()
#         except:
#             pass
#     else:
#         index += 1
# sql = '''CREATE TABLE IF NOT EXISTS WeatherCodes
# (
#   ID integer,
#   WeatherCode text,
#   Description text,
#   Symbol text
# );'''
# cursor = conn.cursor()
# cursor.execute(sql)
# conn.commit()
# f = open("/Users/scottsfarley/documents/wooden_ships/data/lookups/weather.csv", 'rU')
# reader = csv.reader(f)
# index = 0
# for row in reader:
#     if index != 0:
#         vals = []
#         for item in row:
#             try:
#                 newitem = item.decode("utf8", 'ignore')
#                 newitem = newitem.replace("'", "?")
#                 newitem = newitem.replace(",", "_")
#                 newitem = str(newitem)
#                 vals.append(newitem)
#             except:
#                 print 'decode error.'
#         print vals
#         try:
#             sql = "INSERT INTO WeatherCodes VALUES(" + str(vals[0]) + ",'" + str(vals[1]) + "','" + str(vals[2]) + "','" + str(vals[3]) + "');"
#         except Exception as e:
#             print e
#             continue
#         cursor.execute(sql)
#         conn.commit()
#     else:
#         index += 1
# sql = '''CREATE TABLE IF NOT EXISTS MagDec
# (
#   ID integer,
#   Lat double precision,
#   Lon double precision,
#   Year int,
#   Declination double precision
# );'''
# cursor = conn.cursor()
# cursor.execute(sql)
# conn.commit()
# f = open("/Users/scottsfarley/documents/wooden_ships/data/lookups/Magnetic_Declinations.csv", 'rU')
# reader = csv.reader(f)
# index = 0
# for row in reader:
#     if index != 0:
#         vals = []
#         for item in row:
#             try:
#                 newitem = item.decode("utf8", 'ignore')
#                 newitem = newitem.replace("'", "?")
#                 newitem = newitem.replace(",", "_")
#                 newitem = str(newitem)
#                 vals.append(newitem)
#             except:
#                 print 'decode error.'
#         print vals
#         try:
#             sql = "INSERT INTO MagDec VALUES(" + str(vals[0]) + "," + str(vals[1]) + "," + str(vals[2]) + "," + str(vals[3]) + "," + str(vals[4]) + ");"
#         except Exception as e:
#             print e
#             continue
#         cursor.execute(sql)
#         conn.commit()
#     else:
#         index += 1

# sql = '''CREATE TABLE IF NOT EXISTS WindDirections
# (
#   ID integer,
#   NLDesc text,
#   Direction double precision,
#   Language text
# );'''
# cursor = conn.cursor()
# cursor.execute(sql)
# conn.commit()
# f = open("/Users/scottsfarley/documents/wooden_ships/data/lookups/Lookup_UK_WindDirection.csv", 'rU')
# reader = csv.reader(f)
# index = 0
# for row in reader:
#     if index != 0:
#         vals = []
#         for item in row:
#             try:
#                 newitem = item.decode("utf8", 'ignore')
#                 newitem = newitem.replace("'", "?")
#                 newitem = newitem.replace(",", "_")
#                 newitem = str(newitem)
#                 vals.append(newitem)
#             except:
#                 print 'decode error.'
#         print vals
#         try:
#             sql = "INSERT INTO WindDirections VALUES(" + str(vals[0]) + ",'" + str(vals[1]) + "'," + str(vals[2]) + ",'British');"
#         except Exception as e:
#             print e
#             continue
#         cursor.execute(sql)
#         conn.commit()
#     else:
#         index += 1

# sql = '''CREATE TABLE IF NOT EXISTS WindForces
# (
#   ID integer,
#   NLDesc text,
#   Class integer,
#   Beaufort text,
#   mps text,
#   Language text
# );'''
# cursor = conn.cursor()
# cursor.execute(sql)
# conn.commit()
# f = open("/Users/scottsfarley/documents/wooden_ships/data/lookups/Lookup_ES_WindForce.csv", 'rU')
# reader = csv.reader(f)
# index = 0
# for row in reader:
#     if index != 0:
#         vals = []
#         for item in row:
#             try:
#                 newitem = item.decode("utf8", 'ignore')
#                 newitem = newitem.replace("'", "?")
#                 newitem = newitem.replace(",", "_")
#                 newitem = str(newitem)
#                 vals.append(newitem)
#             except:
#                 print 'decode error.'
#         print vals
#         try:
#             sql = "INSERT INTO WindForces VALUES(" + str(vals[0]) + ",'" + str(vals[1]) + "'," + str(vals[2]) + ",'" + str(vals[3]) + "','" + str(vals[4]) + "','Spanish');"
#         except Exception as e:
#             print e
#             continue
#         cursor.execute(sql)
#         conn.commit()
#     else:
#         index += 1


outfile = "/Users/scottsfarley/documents/WoodenShips.sql"
out = open(outfile, 'w')
conn = connectToDatabase("localhost", "scottsfarley", "Sequoia93!", "WoodenShips")
cursor = conn.cursor()
sql = "SELECT * FROM logbook;"
cursor.execute(sql)
rows = cursor.fetchall()
index = 0
for result in rows:
    # row = row[0].replace("'", "")
    # row = row.replace(")", "")
    # row = row.replace("(", "")
    # row = row.replace('"', "")
    # row = row.split(",")
    sql = "INSERT INTO logs VALUES ("
    row = []
    for item in result:
        row.append(str(item))
    sql += row[0] + ","
    sql += "'" + row[1].decode("utf8", "ignore") + "',"
    sql += "'" + row[2].decode("utf8", "ignore") + "',"
    sql += "'" + row[3].decode("utf8", "ignore") + "',"
    sql += "'" + row[4].decode("utf8", "ignore") + "',"
    sql += "'" + row[5].decode("utf8", "ignore") + "',"
    sql += "'" + row[6].decode("utf8", "ignore") + "',"
    sql += "'" + row[7].decode("utf8", "ignore") + "',"
    sql += "'" + row[8].decode("utf8", "ignore") + "',"
    sql += "'" + row[9].decode("utf8", "ignore") + "',"
    sql += "'" + row[10].decode("utf8", "ignore") + "',"
    sql += "'" + row[11].decode("utf8", "ignore") + "',"
    sql += "'" + row[12].decode("utf8", "ignore") + "',"
    sql += "'" + row[13].decode("utf8", "ignore") + "',"
    sql += "'" + row[14].decode("utf8", "ignore") + "',"
    sql += "'" + row[15].decode("utf8", "ignore") + "',"
    sql += "'" + row[16].decode("utf8", "ignore") + "',"
    sql += "'" + row[17].decode("utf8", "ignore") + "',"
    sql += "'" + row[18].decode("utf8", "ignore") + "',"
    sql += "'" + row[19].decode("utf8", "ignore") + "',"
    sql += "'" + row[20].decode("utf8", "ignore") + "',"
    sql += "'" + row[21].decode("utf8", "ignore") + "',"
    sql += "" + row[22] + ","
    sql += "" + row[23] + ","
    sql += "" + row[24] + ","
    sql += "'" + str(row[22]) + "-" + str(row[23]) + "-" + str(row[24]) +  "'," ## date
    sql += "'" + row[26].decode("utf8", "ignore") + "',"
    sql += "" + row[27] + "," ## position
    sql += "" + row[28] + ","
    sql += "'" + row[29] + "'," ##anchored
    sql += "'" + row[30].decode("utf8", "ignore") + "',"
    sql += "'" + row[31].decode("utf8", "ignore") + "',"
    sql += "'" + row[32].decode("utf8", "ignore") + "',"
    sql += "'" + row[33].decode("utf8", "ignore") + "',"
    sql += "'" + row[34].decode("utf8", "ignore") + "',"
    sql += "'" + row[35].decode("utf8", "ignore") + "',"
    sql += "'" + row[36].decode("utf8", "ignore") + "',"
    sql += "'" + row[37].decode("utf8", "ignore") + "',"
    sql += "'" + row[38].decode("utf8", "ignore") + "',"
    sql += "'" + row[39].decode("utf8", "ignore") + "',"
    sql += "'" + row[40].decode("utf8", "ignore") + "',"
    sql += "'" + row[41].decode("utf8", "ignore") + "',"
    sql += "'" + row[42].decode("utf8", "ignore") + "',"
    sql += "'" + row[43] + "'," ##guts -- > weather booleans
    sql += "'" + row[44] + "',"
    sql += "'" + row[45] + "',"
    sql += "'" + row[46] + "',"
    sql += "'" + row[47] + "',"
    sql += "'" + row[48] + "',"
    sql += "'" + row[49] + "',"
    sql += "'" + row[50].decode("utf8", "ignore") + "'," ##weather measurements
    sql += "'" + row[51].decode("utf8", "ignore") + "',"
    sql += "'" + row[52].decode("utf8", "ignore") + "',"
    sql += "'" + row[53].decode("utf8", "ignore") + "',"
    sql += "'" + row[54].decode("utf8", "ignore") + "',"
    sql += "'" + row[55].decode("utf8", "ignore") + "',"
    sql += "'" + row[56].decode("utf8", "ignore") + "',"
    sql += "'" + row[57].decode("utf8", "ignore") + "',"
    sql += "'" + row[58].decode("utf8", "ignore") + "',"
    sql += "'" + row[59].decode("utf8", "ignore") + "',"
    sql += "'" + row[60].decode("utf8", "ignore") + "',"
    sql += "'" + row[61].decode("utf8", "ignore") + "',"
    sql += "'" + row[62].decode("utf8", "ignore") + "',"
    sql += "'" + row[63].decode("utf8", "ignore") + "',"
    sql += "'" + row[64].decode("utf8", "ignore") + "',"
    sql += "'" + row[65].decode("utf8", "ignore") + "',"
    sql += "'" + row[66].decode("utf8", "ignore") + "',"
    sql += "'" + row[67].decode("utf8", "ignore") + "',"
    sql += "'" + row[68] + "',"
    sql += "'" + row[69].decode("utf8", "ignore") + "',"
    sql += "'" + row[70] + "',"
    sql += "'" + row[71].decode("utf8", "ignore") + "',"
    sql += "'" + row[72] + "',"
    sql += "'" + row[73].decode("utf8", "ignore") + "',"
    sql += "'" + row[74] + "',"
    sql += "'" + row[75].decode("utf8", "ignore") + "',"
    sql += "'" + row[76] + "',"
    sql += "'" + row[77].decode("utf8", "ignore") + "',"
    sql += "'" + row[78].decode("utf8", "ignore") + "',"
    sql += "'" + row[79].decode("utf8", "ignore") + "',"
    sql += "'" + row[80] + "',"
    sql += "'" + row[81].decode("utf8", 'ignore') +"',"
    sql += "'" + row[82].decode("utf8", 'ignore') + "'"
    sql += ");\n"
    sql = "UPDATE logs SET point='(" + str(row[27]) + "," + str(row[28]) + ")' WHERE recid=" + str(row[0]) + ";"
    remoteCursor.execute(sql)
    remoteConn.commit()
    index += 1
    if index % 100 == 0:
        print index




