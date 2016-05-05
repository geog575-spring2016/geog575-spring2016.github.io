__author__ = 'scottsfarley'
import csv
reader = csv.reader(open("../data/lookups/geodata.csv", 'rU'))
writer = csv.writer(open("../data/geocode.csv", 'w'))
s = 0
a = 0
for row in reader:
    newrow = []
    for item in row:
        try:
            item.decode("utf-8", 'replace')
            newrow.append(item)

        except Exception as e:
            newrow.append("")
            s += 1
            print e
    # if newrow[27] == "NA" or newrow[28] == "NA":
    #     a += 1
    # else:
    writer.writerow(newrow)
print s
print a
