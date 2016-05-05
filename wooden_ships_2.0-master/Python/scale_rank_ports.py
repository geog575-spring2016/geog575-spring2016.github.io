__author__ = 'scottsfarley'
import csv
portReader = csv.reader(open("/Users/scottsfarley/documents/wooden_ships_2.0/main/assets/data/port_cities.csv",'rU'))
portWriter = csv.writer(open("/Users/scottsfarley/documents/wooden_ships_2.0/main/assets/data/port_cities_scale_rank.csv", 'w'))
ports = []
for row in portReader:
    row.append(0)
    row.append(0)
    row.append(0)
    row.append(0)
    ports.append(row)


newPorts = []
shipReader = csv.reader(open("/Users/scottsfarley/documents/wooden_ships_2.0/main/assets/data/ship_lookup_original.csv", 'rU'))
for row in shipReader:
    if row[5] == 'British':
        ind = -4
    elif row[5] == "Spanish":
        ind = -3
    elif row[5] == "Dutch":
        ind = -2
    elif row[5] == "French":
        ind = -1
    elif row[5] == "nationality":
        continue
    print ind
    fromPlace = row[-2].upper()
    toPlace = row[-5].upper()
    for port in ports:
        portName = port[0].upper()
        if fromPlace == portName:
            port[ind] += 1
        if toPlace == portName:
            port[ind] += 1

for port in ports:
    portWriter.writerow(port)
