__author__ = 'scottsfarley'

## dumps to insert statements
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

remoteConn = connectToDatabase("144.92.235.47", "scottsfarley", "xP73m3YAb1", "wooden_ships")
remoteCursor = remoteConn.cursor()
if (remoteConn):
    print "Connected to remote server."
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




