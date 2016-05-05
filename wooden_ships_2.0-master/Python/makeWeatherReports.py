__author__ = 'scottsfarley'

import csv
f = open("/Users/scottsfarley/documents/wooden_ships/main/assets/data/french_memos.csv", 'r')
out = open("/Users/scottsfarley/documents/wooden_ships/main/assets/data/french_memos_update.csv", 'w')
reader = csv.DictReader(f)
rows = []
for row in reader:
    rows.append(row)
s = sorted(rows, key= lambda d: int(d['locationID']) )

types = ["biology", "warsAndFights", 'shipAndRig', "cargo", "lifeOnBoard", "generalObservations", 'anchorPlace', "otherRemmarks"]

done = []
obj = {}
currentLocID = ""
for observation in s:
    thisLocID = observation['locationID']
    if observation['memoType'] in types:
        done.append(observation)
    else:
        if currentLocID != thisLocID:
            if thisLocID != "" and obj != {}:
                done.append(obj)
            obj = {
                "obsDate" : observation['obsDate'],
                "Latitude" : observation['Latitude'],
                "Longitude" : observation['Longitude'],
                "voyageID" : observation['voyageID'],
                "memoText" : "",
                "memoType" : "weatherReport",
                "locationID" : thisLocID,
                "observationID" : None
            }
            currentLocID = thisLocID
        else:
            thisType = observation['memoType']
            thisText = observation['memoText']
            obj[thisType] = thisText

writer = csv.DictWriter(out, ["obsDate", "Latitude", "Longitude", "voyageID", "memoText", "memoType", "locationID"])
writer.writeheader()
out = []
for observation in done:
    if observation['memoType'] == "weatherReport":
        text = ""
        try:
            windDir = observation['allWindDirections']
            text += "Winds today " + windDir + ";"
            del observation['allWindDirections']
        except KeyError:
            pass
        try:
            text += " Skies " + observation['clearness'].lower() + ";"
            del observation['clearness']
        except KeyError:
            pass
        try:
            text += " Winds blowing " + observation['windForce'].lower() + "."
            del observation['windForce']
        except KeyError:
            pass
        try:
            text += " " + observation['shapeOfClouds'].lower() + " to the " + observation['directionOfClouds'].lower()
            del observation['cloudShape']
            del observation['directionOfClouds']
            try:
                text += " covering approximately " + observation['cloudFraction'].lower()
                del observation['cloudFraction']
            except KeyError:
                pass
            text += ";"
        except KeyError:
            pass
        try:
            text += " Weather notes: " + observation['weather'].lower() + "."
        except:
            pass
        try:
            text += " Sea conditions: " + observation['stateOfSea'].lower() + "."
        except:
            pass
        try:
            text += " Currently travelling " + observation['currentTravelDirection']
            del observation['currentTravelDirection']
        except KeyError:
            pass
        try:
            text += " moving at " + observation['currentTravelSpeed'].lower() + " knots."
            del observation['currentTravelSpeed']
        except KeyError:
            pass
        ## delete unused fields
        try:
            del observation['anchored']
        except KeyError:
            pass
        try:
            del observation['windDirection']
        except:
            pass
        try:
            del observation['allWindForces']
        except:
            pass
        try:
            del observation['precipitationDescription']
        except:
            pass
        try:
            del observation['weather']
        except:
            pass
        try:
            del observation['otherRemmarks']
        except:
            pass
        try:
            del observation['stateOfSea']
        except:
            pass
        try:
            del observation['shapeOfClouds']
        except:
            pass
        try:
            del observation['directionOfClouds']
        except:
            pass
        try:
            del observation['cloudFraction']
        except:
            pass
        observation['memoText'] = text

    try:
        del observation['observationID']
    except:
        pass
    writer.writerow(observation)

