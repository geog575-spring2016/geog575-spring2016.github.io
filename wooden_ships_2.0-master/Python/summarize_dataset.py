__author__ = 'scottsfarley'
import csv
f = open("/Users/scottsfarley/downloads/CLIWOC15.csv", 'r')
reader = csv.DictReader(f)
numRecords = 0
numCoords = 0
numShips = 0
ships = []
numNations = 0
nations = []
numyears = 0
years = []
numCompanies = 0
companies = []
shipTypes = []
numWindDirection = 0
numTemperature = 0
numWeather = 0
numRain = 0
numSST = 0
numHumidity = 0
numCloudFrac = 0
numStateSea = 0





for row in reader:
    numRecords += 1
    if row['ShipName'] not in ships:
        ships.append(row['ShipName'])
    if row['Year'] not in years:
        years.append(row['Year'])
    if row['Company'] not in companies:
        companies.append(row['Company'])
    if row['ShipType'] not in shipTypes:
        shipTypes.append(row['ShipType'])
    if row['Lat3'] != "NA" and row['Lat3'] != '' and row['Lon3'] != "NA" + row['Lon3'] != '':
        numCoords += 1
    if row['WindDirection'] != "NA" and row['WindDirection'] != '':
        numWindDirection +=1
    if row['Weather'] != 'NA' and row['Weather'] != '':
        numWeather += 1
    if row['Rain']  != 'NA' and row['Rain'] != '':
        numRain += 1
    if row['SSTReading']  != 'NA' and row['SSTReading'] != '':
        numSST += 1
    if row['HumReading']  != 'NA' and row['HumReading'] != '':
        numHumidity += 1
    if row['CloudFrac']  != 'NA' and row['CloudFrac'] != '':
        numCloudFrac += 1
    if row['StateSea']  != 'NA' and row['StateSea'] != '':
        numStateSea += 1
    if row['TairReading']  != 'NA' and row['TairReading'] != '':
        numTemperature += 1


header = ['RecID', 'InstAbbr', 'InstName', 'InstPlace', 'InstLand', 'NumberEntry', 'NameArchiveSet', 'ArchivePart', 'Specification', 'LogbookIdent', 'LogbookLanguage', 'EnteredBy',
          'DASnumber', 'ImageNumber', 'VoyageFrom', 'VoyageTo', 'ShipName', 'ShipType', 'Company', 'OtherShipInformation', 'Nationality', 'Name1', 'Rank1', 'Name2', 'Rank2',
          'Name3', 'Rank3', 'ZeroMeridian', 'StartDay', 'TimeGen', 'ObsGen', 'ReferenceCourse', 'ReferenceWindDirection',
          'DistUnits', 'DistToLandmarkUnits', 'DistTravelledUnits', 'LongitudeUnits', 'VoyageIni',
          'UnitsOfMeasurement', 'Calendar', 'Year', 'Month', 'Day', 'DayOfTheWeek', 'PartDay',
          'TimeOB', 'Watch', 'Glasses', 'UTC', 'CMG', 'ShipSpeed', 'Distance', 'drLatDeg', 'drLatMin',
          'drLatSec', 'drLatHem', 'drLongDeg', 'drLongMin', 'drLongSec', 'drLongHem', 'LatDeg', 'LatMin',
          'LatSec', 'LatHem', 'LongDeg', 'LongMin', 'LongSec', 'LongHem', 'Lat3', 'Lon3', 'LatInd', 'LonInd',
          'PosCoastal', 'EncName', 'EncNat', 'EncRem', 'Anchored', 'AnchorPlace', 'LMname1', 'LMdirection1',
          'LMdistance1', 'LMname2', 'LMdirection2', 'LMdistance2', 'LMname3', 'LMdirection3', 'LMdistance3',
          'EstError', 'ApplError', 'WindDirection', 'AllWindDirections', 'WindForce', 'WindForceScale',
          'AllWindForces', 'WindScale', 'Weather', 'ShapeClouds', 'DirClouds', 'Clearness',
          'PrecipitationDescriptor', 'CloudFrac', 'Gusts', 'Rain', 'Fog', 'Snow',
          'Thunder', 'Hail', 'SeaIce', 'Duplicate', 'Release', 'SSTReading',
          'SSTReadingUnits', 'StateSea', 'CurrentDir', 'CurrentSpeed',
          'TairReading', 'AirThermReadingUnits', 'ProbTair', 'BaroReading',
          'AirPressureReadingUnits', 'BarometerType', 'BarTempReading',
          'BarTempReadingUnits', 'HumReading', 'HumidityUnits',
          'HumidityMethod', 'PumpWater', 'WaterAtThePumpUnits',
          'LifeOnBoard', 'LifeOnBoardMemo', 'Cargo', 'CargoMemo',
          'ShipAndRig', 'ShipAndRigMemo', 'Biology', 'BiologyMemo',
          'WarsAndFights', 'WarsAndFightsMemo', 'Illustrations', 'TrivialCorrection', 'OtherRem']

print  "Number of Attributes: " + str(len(header))
print "Number of Records: " + str(numRecords)
print "Number of Records with Coordinates: " + str(numCoords)
print "Number of Ships: ", len(ships)
print "Number of companies: ", len(companies)
print "Number of Ship Types: ", len(shipTypes)
print "Number of records with wind direction: ", numWindDirection
print "Number of records with air temperature: ", numTemperature
print "Number of records with weather code:", numWeather
print "Number of records with SST Reading: ", numSST
print "Number of records with humidity reading: ", numHumidity
print "Number of records with cloud fraction reading: ", numCloudFrac
print "Number of records reporting sea state: ", numStateSea
