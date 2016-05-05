# import psycopg2
# import csv
# def connectToDatabase(hostname, username, password, database):
#     try:
#         connectString = "dbname='" + str(database) + "' user='" + str(username) + "' host='" + str(hostname) + "' password='" + str(password) + "'"
#         conn = psycopg2.connect(connectString)
#         return conn
#     except:
#         print "I am unable to connect to the database"
#         return False
#
# def closeConnection(connection):
#     try:
#         connection.close()
#         return True
#     except:
#         print "Failed to close connection."
#         return False
#
# print "Started."
# remoteConn = connectToDatabase("144.92.235.47", "scottsfarley", "xP73m3YAb1", "wooden_ships")
# if not remoteConn:
#     print "Failed to connect to remote resource."
#     exit()
# print "Connected."
#
# out = open("/users/scottsfarley/documents/wooden_ships/main/assets/data/captain_metadata.csv", 'w')
# writer = csv.writer(out, lineterminator="\n")
# header = []

#header = ["locationID", "locationID", "Latitude", "Longitude", "obsDate", "voyageID", "memoType", "memoText"]
# sql = "SELECT locations.locationid, locations.latitude, locations.longitude, locations.date, locations.voyageID, weather.snow, " \
#       "weather.airtemp, weather.pressure, weather.sst, weather.winddirection, weather.windforce, weather.gusts, weather.rain, weather.fog, weather.thunder, weather.hail, weather.seaice " \
#       "from weather " \
#       "inner join locations on locations.locationid = weather.locationid " \
#       "inner join voyages on voyages.voyageid = locations.voyageid " \
#       "inner join nations on nations.nationid = voyages.nationid " \
#       "where nations.nationality = 'French';"
# print sql

# sql = "SELECT portname, latitude, longitude, modernName from voyages inner join ports on voyages.fromPlace = ports.portname WHERE latitude is NOT NULL and longitude is not null; SELECT portname, latitude, longitude, modernname from voyages " \
#       "inner join ports on voyages.toPlace=ports.portname where latitude is not null and longitude is not null;"

# header = ["observationID", "locationID", "Latitude", "Longitude", "obsDate", "voyageID", "memoType", "memoText"]
# sql = "SELECT obsid, locations.locationid, locations.latitude, locations.longitude, locations.date, locations.voyageid, memoType, memoText  " \
#       "FROM observations " \
#       "INNER JOIN locations on locations.locationid=observations.locationid " \
#       "INNER JOIN voyages on voyages.voyageid=locations.voyageid " \
#       "INNER JOIN nations on nations.nationid=voyages.nationid " \
#       "WHERE memoType !='recordID' AND memoType != 'obsLanguage' AND nations.nationality='British' " \
#       "" \
#       ";"
#
#
# #
# # #
# header = ["voyageID", "captainName", "rank", "fromPlace", "toPlace", "voyageStartDate", "nationality", "shipName", "shipType", "companyName"]
# sql = "SELECT voyages.voyageID, captains.captainName, rank, voyages.fromPlace, voyages.toPlace, voyages.startdate, nations.nationality, ships.shipName," \
#       "ships.shipType, companies.companyName from voyages " \
#       "INNER JOIN ships on ships.shipid=voyages.shipid " \
#       "INNER JOIN companies on companies.companyid=voyages.companyid " \
#       "INNER JOIN nations on nations.nationid=voyages.nationid " \
#       "INNER JOIN captains on captains.captainid=voyages.captainid ;"

# header = ["shipName", "shipType", "nationality", "company"]
# sql = "SELECT distinct shipName, shipType, nationality, companyName from ships " \
#       "INNER join voyages on voyages.shipid=ships.shipid " \
#       "inner join nations on nations.nationid=voyages.nationid " \
#       "inner join companies on companies.companyid=voyages.companyid;"

# header = ["captainName", "rank", "nationality", "company"]
# sql = "SELECT distinct captainName, rank, nationality, companyName from captains " \
#       "INNER join voyages on voyages.captainid=captains.captainid " \
#       "inner join nations on nations.nationid=voyages.nationid " \
#       "inner join companies on companies.companyid=voyages.companyid;"
#
# writer.writerow(header)
#
# cursor = remoteConn.cursor()
# cursor.execute(sql)
# rows = cursor.fetchall()
# i = 0
# for row in rows:
#     writer.writerow(list(row))
#     if i % 100 == 0:
#         print i
#     i += 1
# print i
#
# out.close()
import csv
f = open("/Users/scottsfarley/downloads/climate-data-from-ocean-ships (1)/cliwoc15.csv")
reader = csv.DictReader(f)
data = []
ships = []
header = ['RecID', 'InstAbbr', 'InstName', 'InstPlace', 'InstLand', 'NumberEntry', 'NameArchiveSet', 'ArchivePart',
          'Specification', 'LogbookIdent', 'LogbookLanguage', 'EnteredBy', 'DASnumber', 'ImageNumber', 'VoyageFrom',
          'VoyageTo', 'ShipName', 'ShipType', 'Company', 'OtherShipInformation', 'Nationality', 'Name1', 'Rank1',
          'Name2', 'Rank2', 'Name3', 'Rank3', 'ZeroMeridian', 'StartDay', 'TimeGen', 'ObsGen', 'ReferenceCourse',
          'ReferenceWindDirection', 'DistUnits', 'DistToLandmarkUnits', 'DistTravelledUnits', 'LongitudeUnits',
          'VoyageIni', 'UnitsOfMeasurement', 'Calendar', 'Year', 'Month', 'Day', 'DayOfTheWeek', 'PartDay',
          'TimeOB', 'Watch', 'Glasses', 'UTC', 'CMG', 'ShipSpeed', 'Distance', 'drLatDeg', 'drLatMin', 'drLatSec',
          'drLatHem', 'drLongDeg', 'drLongMin', 'drLongSec', 'drLongHem', 'LatDeg', 'LatMin', 'LatSec', 'LatHem',
          'LongDeg', 'LongMin', 'LongSec', 'LongHem', 'Lat3', 'Lon3', 'LatInd', 'LonInd', 'PosCoastal', 'EncName',
          'EncNat', 'EncRem', 'Anchored', 'AnchorPlace', 'LMname1', 'LMdirection1', 'LMdistance1', 'LMname2',
          'LMdirection2', 'LMdistance2', 'LMname3', 'LMdirection3', 'LMdistance3', 'EstError', 'ApplError',
          'WindDirection', 'AllWindDirections', 'WindForce', 'WindForceScale', 'AllWindForces', 'WindScale',
          'Weather', 'ShapeClouds', 'DirClouds', 'Clearness', 'PrecipitationDescriptor', 'CloudFrac',
          'Gusts', 'Rain', 'Fog', 'Snow', 'Thunder', 'Hail', 'SeaIce', 'Duplicate', 'Release',
          'SSTReading', 'SSTReadingUnits', 'StateSea', 'CurrentDir', 'CurrentSpeed', 'TairReading',
          'AirThermReadingUnits', 'ProbTair', 'BaroReading', 'AirPressureReadingUnits', 'BarometerType',
          'BarTempReading', 'BarTempReadingUnits', 'HumReading', 'HumidityUnits', 'HumidityMethod',
          'PumpWater', 'WaterAtThePumpUnits', 'LifeOnBoard', 'LifeOnBoardMemo', 'Cargo', 'CargoMemo',
          'ShipAndRig', 'ShipAndRigMemo', 'Biology', 'BiologyMemo', 'WarsAndFights', 'WarsAndFightsMemo',
          'Illustrations', 'TrivialCorrection', 'OtherRem']


wslookup1 = csv.reader(open("/Users/scottsfarley/downloads/climate-data-from-ocean-ships (1)/Lookup_ES_WindForce.csv"))
wslookup2 = csv.reader(open("/Users/scottsfarley/downloads/climate-data-from-ocean-ships (1)/Lookup_FR_WindForce.csv"))
wslookup3 = csv.reader(open("/Users/scottsfarley/downloads/climate-data-from-ocean-ships (1)/Lookup_NL_WindForce.csv"))
wslookup4 = csv.reader(open("/Users/scottsfarley/downloads/climate-data-from-ocean-ships (1)/Lookup_UK_WindForce.csv"))

wdlookup1 = csv.reader(open("/Users/scottsfarley/downloads/climate-data-from-ocean-ships (1)/Lookup_ES_WindDirection.csv"))
wdlookup2 = csv.reader(open("/Users/scottsfarley/downloads/climate-data-from-ocean-ships (1)/Lookup_FR_WindDirection.csv"))
wdlookup3 = csv.reader(open("/Users/scottsfarley/downloads/climate-data-from-ocean-ships (1)/Lookup_NL_WindDirection.csv"))
wdlookup4 = csv.reader(open("/Users/scottsfarley/downloads/climate-data-from-ocean-ships (1)/Lookup_UK_WindDirection.csv"))




windSpeedLookup = []
i = 0
for row in wslookup1:
    if i == 0:
        i += 1
        continue
    windSpeedLookup.append([row[1], row[4]])
i = 0
for row in wslookup2:
    if i == 0:
        i += 1
        continue
    windSpeedLookup.append([row[1], row[4]])
i =0
for row in wslookup3:
    if i == 0:
        i += 1
        continue
    windSpeedLookup.append([row[1], row[4]])
i = 0
for row in wslookup4:
    if i == 0:
        i += 1
        continue
    windSpeedLookup.append([row[1], row[4]])

windDirectionLookup = []
i = 0
for row in wdlookup1:
    if i == 0:
        i += 1
        continue
    windDirectionLookup.append([row[1], row[2]])

i = 0
for row in wdlookup2:
    if i == 0:
        i += 1
        continue
    windDirectionLookup.append([row[1], row[2]])
i = 0
for row in wdlookup3:
    if i == 0:
        i += 1
        continue
    windDirectionLookup.append([row[1], row[2]])
i = 0
for row in wdlookup4:
    if i == 0:
        i += 1
        continue
    windDirectionLookup.append([row[1], row[2]])


obs = {
    'locationID' : "",
    'latitude' : "",
    'longitude' : "",
    'date' : "",
    'snow' : "",
    'rain' : "",
    'fog': "",
    'thunder' : "",
    'hail' : "",
    'seaIce' : "",
    'gusts' : "",
    'windDirection' : "",
    'windSpeed' : "",
    'voyageID' : "",
    'pressure' : "",
    'airTemp' : '',
    'sst' : ''
}

shipFields = {
            'captainName' : "",
            'rank' : "",
            'captainName2' : "",
            'rank2':"",
            'nationality' : "",
            'fromPlace' : "",
            'toPlace': "",
            'voyageStart' : "",
            'shipName' : "",
            'shipType' : "",
            'company': "",
            'voyageID': ""
        }


doneText = []

memoFields = ['obsDate', 'Latitude', 'Longitude', 'voyageID', 'locationID', 'memoType', 'memoText']

shipMetadata = csv.DictWriter(open("/Users/scottsfarley/documents/wooden_ships/main/assets/data/ship_lookup.csv", 'w'),
                               fieldnames = shipFields.keys())
shipMetadata.writeheader()

britishPoints = csv.DictWriter(open("/Users/scottsfarley/documents/wooden_ships/main/assets/data/british_points_updated.csv", 'w'),
                               fieldnames = obs.keys())
britishPoints.writeheader()
britishMemos = csv.DictWriter(open("/Users/scottsfarley/documents/wooden_ships/main/assets/data/british_memos_updated.csv", 'w'),
                               fieldnames = memoFields)
britishMemos.writeheader()

dutchPoints = csv.DictWriter(open("/Users/scottsfarley/documents/wooden_ships/main/assets/data/dutch_points_updated.csv", 'w'),
                               fieldnames = obs.keys())
dutchPoints.writeheader()
dutchMemos = csv.DictWriter(open("/Users/scottsfarley/documents/wooden_ships/main/assets/data/dutch_memos_updated.csv", 'w'),
                               fieldnames = memoFields)
dutchMemos.writeheader()

spanishPoints = csv.DictWriter(open("/Users/scottsfarley/documents/wooden_ships/main/assets/data/spanish_points_updated.csv", 'w'),
                               fieldnames = obs.keys())
spanishPoints.writeheader()
spanishMemos = csv.DictWriter(open("/Users/scottsfarley/documents/wooden_ships/main/assets/data/spanish_memos_updated.csv", 'w'),
                               fieldnames = memoFields)
spanishMemos.writeheader()
frenchPoints = csv.DictWriter(open("/Users/scottsfarley/documents/wooden_ships/main/assets/data/french_points_updated.csv", 'w'),
                               fieldnames = obs.keys())
frenchPoints.writeheader()
frenchMemos = csv.DictWriter(open("/Users/scottsfarley/documents/wooden_ships/main/assets/data/french_memos_updated.csv", 'w'),
                               fieldnames = memoFields)
frenchMemos.writeheader()

voyageID = 1

i = 0
for row in reader:
    if i == 0:
        i += 1 ## skip the header
    else:
        ## metadata

        captainName1 = row['Name1']
        captainRank1 = row['Rank1']
        captainName2 = row['Name2']
        captainRank2 = row['Rank2']
        nationality = row['Nationality']
        fromPlace = row['VoyageFrom']
        toPlace = row['VoyageTo']
        voyageIni = row['VoyageIni']
        voyageStart = voyageIni[0:4] + "-" + voyageIni[4:6] + "-" + voyageIni[6:8]
        shipName = row['ShipName']
        shipType = row['ShipType']
        shipInfo = row['OtherShipInformation']
        company = row['Company']
        metadata = {
            'captainName' : captainName1,
            'rank' : captainRank1,
            'captainName2' : captainName2,
            'rank2':captainRank2,
            'nationality' : nationality,
            'fromPlace' : fromPlace,
            'toPlace': toPlace,
            'voyageStart' : voyageStart,
            'shipName' : shipName,
            'shipType' : shipType,
            'company': company,
        }

        if (metadata not in ships):
            #shipMetadata.writerow(metadata)
            ships.append(metadata)
            voyageID +=1

        ## make the weather observations
        utc = row['UTC']
        datetime = utc[0:4] + "-" + utc[4:6] + "-" + utc[6:8] + " " + utc[8:10] + ":00"
        partOfDay = row['PartDay']
        timeOnBoard = row['TimeOB']
        try:
            latitude = float(row['Lat3'])
            longitude = float(row['Lon3'])
        except:
            continue
        snow = bool(int(row['Snow']))
        gusts = bool(int(row['Gusts']))
        thunder = bool(int(row['Thunder']))
        fog = bool(int(row['Fog']))
        hail = bool(int(row['Hail']))
        seaIce = bool(int(row['SeaIce']))
        rain = bool(int(row['Rain']))

        if row['ProbTair'] != '' and row['ProbTair'] != 'NA':
            airTemp = row['ProbTair']
        else:
            airTemp = -1

        airPressureUnits = row['AirPressureReadingUnits']
        if airPressureUnits == 'Inches Mercury':
            pressure = float(row['BaroReading']) * 25.4
        elif airPressureUnits == "Millimeters Mercury" or airPressureUnits == "Millimeter Mercury":
            pressure = float(row['BaroReading'])
        else:
            pressure = -1
        if row['SSTReadingUnits'] == 'Fahrenheit':
            sst = (float(row['SSTReading']) -32) * .5556
        else:
            sst = -1

        ## join to numeric wind fields
        windText = row['WindForce']
        windSpeed = -1
        for l in windSpeedLookup:
            if l[0].upper() == windText.upper():
                windSpeed = l[1]
                break
        if windSpeed == "NA":
            windSpeed = -1

        windDirText = row['WindDirection']
        windDirection = -1
        for l in windDirectionLookup:
            if l[0].upper() == windDirText.upper():
                windDirection = l[1]

                break
        if windDirection == 'NA' or windDirection == '999':
            windDirection = -1

        obs = {
            'locationID' : i,
            'latitude' : latitude,
            'longitude' : longitude,
            'date' : datetime,
            'snow' : snow,
            'rain' : rain,
            'fog': fog,
            'thunder' : thunder,
            'hail' : hail,
            'seaIce' : seaIce,
            'gusts' : gusts,
            'windDirection' : windDirection,
            'windSpeed' : windSpeed,
            'voyageID' : voyageID,
            'pressure' : pressure,
            'airTemp' : airTemp,
            'sst' : sst
        }
        if nationality == 'British':
            britishPoints.writerow(obs)
        elif nationality == "Spanish":
            spanishPoints.writerow(obs)
        elif nationality == 'Dutch':
            dutchPoints.writerow(obs)
        elif nationality == 'French':
            frenchPoints.writerow(obs)

        ## do the textual observations now
        text = {}
        text['obsDate'] = datetime
        text['Latitude'] = latitude
        text['Longitude'] = longitude
        text['voyageID'] = voyageID
        text['locationID'] = i
        toSubmit = []

        if row['LMname1'] != '':
            LMText = text
            d = row['LMdirection1']
            dist = row['LMdistance1']
            t = "Sighted " + row['LMname1'].title()
            units = row['DistToLandmarkUnits'].lower()
            if units == '':
                units = row['DistUnits'].lower()
            if d != "NA" and d != '':
                t += " to the " + d
            if dist != 'NA' and dist != '':
                t += " at a distance of " + dist + " " + units + "."
            LMText['memoText'] = t
            LMText['memoType'] = "Landmark"
            if nationality == "British":
                britishMemos.writerow(LMText)
            elif nationality == "Dutch":
                dutchMemos.writerow(LMText)
            elif nationality == "Spanish":
                spanishMemos.writerow(LMText)
            elif nationality == "French":
                frenchMemos.writerow(LMText)


        if row['EncName'] != '' or row['EncNat'] != '' or row['EncRem'] != '':
            EncText = text
            t = "Ship encountered: " + row['EncRem'].lower()
            if row['EncNat'] != '':
                t += ".  Nationality: " + row['EncNat'].title()
            if row['EncName'] != '':
                t += ", ship's name: " + row['EncName'].title()
            t += "."
            EncText['memoType'] = "Encounter"
            EncText['memoText'] = t
            if nationality == "British":
                britishMemos.writerow(EncText)
            elif nationality == "Dutch":
                dutchMemos.writerow(EncText)
            elif nationality == "Spanish":
                spanishMemos.writerow(EncText)
            elif nationality == "French":
                frenchMemos.writerow(EncText)

        if row['Biology'] == 'True':
            BioText= text
            BioText['memoText'] = row['BiologyMemo']
            BioText['memoType'] = 'Biology'
            if nationality == "British":
                britishMemos.writerow(BioText)
            elif nationality == "Dutch":
                dutchMemos.writerow(BioText)
            elif nationality == "Spanish":
                spanishMemos.writerow(BioText)
            elif nationality == "French":
                frenchMemos.writerow(BioText)

        if row['LifeOnBoard'] == "True":
            LOBText = text
            LOBText['memoText'] = row['LifeOnBoardMemo']
            LOBText['memoType'] = "LifeOnBoard"
            if nationality == "British":
                britishMemos.writerow(LOBText)
            elif nationality == "Dutch":
                dutchMemos.writerow(LOBText)
            elif nationality == "Spanish":
                spanishMemos.writerow(LOBText)
            elif nationality == "French":
                frenchMemos.writerow(LOBText)


        if row['Cargo'] == "True":
            cargoText = text
            cargoText['memoText'] = row['CargoMemo']
            cargoText['memoType'] = 'Cargo'
            if nationality == "British":
                britishMemos.writerow(cargoText)
            elif nationality == "Dutch":
                dutchMemos.writerow(cargoText)
            elif nationality == "Spanish":
                spanishMemos.writerow(cargoText)
            elif nationality == "French":
                frenchMemos.writerow(cargoText)
        if row['ShipAndRig'] == "True":
            sarText = text
            sarText['memoText'] = row['ShipAndRig']
            sarText['memoType'] = "ShipAndRig"
            if nationality == "British":
                britishMemos.writerow(sarText)
            elif nationality == "Dutch":
                dutchMemos.writerow(sarText)
            elif nationality == "Spanish":
                spanishMemos.writerow(sarText)
            elif nationality == "French":
                frenchMemos.writerow(sarText)
        if row['WarsAndFights'] == "True":
            wafText = text
            wafText['memoText'] = row['WarsAndFights']
            wafText['memoType'] = 'WarsAndFights'
            if nationality == "British":
                britishMemos.writerow(wafText)
            elif nationality == "Dutch":
                dutchMemos.writerow(wafText)
            elif nationality == "Spanish":
                spanishMemos.writerow(wafText)
            elif nationality == "French":
                frenchMemos.writerow(wafText)
        if row['OtherRem'] != '':
            otherText= text
            otherText['memoText'] = row['OtherRem']
            otherText['memoType'] = 'OtherRem'
            if nationality == "British":
                britishMemos.writerow(otherText)
            elif nationality == "Dutch":
                dutchMemos.writerow(otherText)
            elif nationality == "Spanish":
                spanishMemos.writerow(otherText)
            elif nationality == "French":
                frenchMemos.writerow(otherText)

        if row['Anchored'] == "True":
            anchorText = text
            t = "Anchored at " + row['AnchorPlace'] + "."
            anchorText['memoType'] = "Anchor"
            anchorText['memoText'] = t
            if nationality == "British":
                britishMemos.writerow(anchorText)
            elif nationality == "Dutch":
                dutchMemos.writerow(anchorText)
            elif nationality == "Spanish":
                spanishMemos.writerow(anchorText)
            elif nationality == "French":
                frenchMemos.writerow(anchorText)

        try:
            latitude = float(latitude)
            longitude = float(longitude)
            # # ## build the weatherReport
            weatherReport = text
            t = ""
            if row['AllWindDirections'] != '':
                t += "Winds today " + row['AllWindDirections']
                if row['WindForce'] != '' and row['WindDirection'] != '':
                    t += ", currently blowing " + row['WindForce'].lower() + " to the " + row['WindDirection']
                t += "."
                if row['Clearness'] != '':
                    t += " Skies today " + row['Clearness'] + "."
                if row['ShapeClouds'] != '' and row['DirClouds'] != '':
                    t += " " + row['shapeOfClouds'].lower() + " clouds seen to the " + row['directionOfClouds'].lower()
                    if row['CloudFrac'] != '':
                        t += " covering " + row['CloudFrac'] + "% of the sky."
                    else:
                        t += "."
                if row['Weather'] != '':
                    t += " Weather notes: " + row['Weather']
                    if row['PrecipitationDescriptor'] != '':
                        t += ", today's precipitation was " + row['PrecipitationDescriptor']
                if row['StateSea'] != '':
                    t += " Sea conditions: " + row['StateSea']
                    if row['CurrentSpeed'] != '' and row['CurrentDir'] != '':
                        t += ".  Current flowing " + row['CurrentSpeed'] + " to the " + row['CurrentDir'] + "."
                if t[-1] != '.':
                    t += '.'
                weatherReport['memoType'] = "weatherReport"
                weatherReport['memoText'] = t
                if nationality == "British":
                    britishMemos.writerow(weatherReport)
                elif nationality == "Dutch":
                    dutchMemos.writerow(weatherReport)
                elif nationality == "Spanish":
                    spanishMemos.writerow(weatherReport)
                elif nationality == "French":
                    frenchMemos.writerow(weatherReport)
        except:
            print "Passing"
            i += 1

        #
        if row['ShipSpeed'] != '' and row['Distance'] != '' and row['CMG'] != '':
            travelMemo = text
            travelMemo['memoType'] = 'travelReport'
            t = "Current heading: " + row['CMG'] + "."
            if row['ShipSpeed'] != 'NA':
                t += " Current speed: " + row['ShipSpeed'] + ". "
            if row['Distance'] != 'NA':
                if row['DistTravelledUnits'] == '':
                    units = "miles"
                else:
                    units = row['DistTravelledUnits']
                t += " Traveled " + row['Distance'] + " " + units + " today."
            travelMemo['memoText'] = t
            if nationality == "British":
                britishMemos.writerow(travelMemo)
            elif nationality == "Dutch":
                dutchMemos.writerow(travelMemo)
            elif nationality == "Spanish":
                spanishMemos.writerow(travelMemo)
            elif nationality == "French":
                frenchMemos.writerow(travelMemo)

        if i % 100 == 0:
            print i
        i += 1

idx = 0
for item in ships:
    item['voyageID'] = idx
    shipMetadata.writerow(item)
    idx += 1