__author__ = 'scottsfarley'
import csv
import datetime
import time
import nltk

writer = csv.writer(open("/Users/scottsfarley/documents/wooden_ships/main/assets/data/rn_ship_pythoned.csv", 'w'), lineterminator='\n')

r = open("/Users/scottsfarley/documents/wooden_ships/main/assets/data/ship_lookup.csv")
reader = csv.reader(r)
shipdates = []
i = 0
for row in reader:
    if i == 0 :
        writer.writerow(row)
        i+=1
    try:
        d = row[-1]
        int(d[0:4])
        row.append("")
        shipdates.append(row)
    except Exception as e:
        print str(e)

rn = open("/Users/scottsfarley/documents/wooden_ships/main/assets/data/rn_ship_wikipedia.csv", 'rU')
rn_reader = csv.reader(rn)
reader_rows = []
for row in rn_reader:
    reader_rows.append(row)


done = []
for row in reader_rows:
    rn_ship = row[1].upper()
    print rn_ship
    t = row[2]
    words = nltk.word_tokenize(t)
    possible_years = []
    guns = ""
    for word in words:
        if "-gun" in word or "-guns" in word:
            guns = word
            try:
                guns = guns.split("-")
                guns = int(guns[0])
            except:
                pass
        try:
            int(word)
            if len(word) == 4:
                possible_years.append(int(word))
        except:
            pass
    if possible_years != []:
        minYear = datetime.date(year=min(possible_years), month=1, day=1)
        maxYear = datetime.date(year=max(possible_years), month=1, day=1)
        print guns
        for ship in shipdates:
            try:
                d = ship[-2]
                unpacked = d.split("-")
                year = int(unpacked[0])
                month = int(unpacked[1])
                day = int(unpacked[2])
                d = datetime.date(year=year, month=month, day=day)
                shipname = ship[0].upper()
                if shipname == rn_ship:
                    if d >= minYear and d <= maxYear and ship[5] == 'British':
                        ship[-1] = t
                        ship.append(minYear)
                        ship.append(maxYear)
                        ship.append(guns)
                        writer.writerow(ship)

            except Exception as e:
                pass
    else:
        continue




