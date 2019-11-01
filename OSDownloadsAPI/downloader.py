# Requests module may need to be installed via pip
import requests
# Remaining modules should be available by default
import os
import sys
import time

# Commandline Arguments:
# product= {string of product identifier as listed by API}
# format= {string of format name as listed by API}
# area|areas= {comma separated list of two character area identifiers, incl. GB}
# location= {local path to storage folder}
# version= {yyyy-mm}
#
# If version is supplied the script will terminate with a message if no newer version is available
# Version checking only applies when both version and product are supplied and valid for their types

baseurl = 'https://osdatahubapi.os.uk/downloads/v1/products/'

product = None
format = None
areas = None
location = None
version = None

# Evaluate user arguments if they have been supplied
if len(sys.argv) > 1:
  for var in sys.argv:
    var = var.split('=')
    if var[0] == 'product':
      product = var[1]
    if var[0] == 'format':
      format = var[1]
    if var[0] == 'area' or var[0] == 'areas':
      areas = var[1]
    if var[0] == 'location':
      location = var[1]
    if var[0] == 'version':
      version = var[1]

# A helper function to fetch the json API result
# This can be extended to satisfy various security factors
def apirequest(url, raw):
  r = requests.get(url, verify=False)
  if raw:
    return r
  else:
    return r.json()

# The tester checks whether the testitem is present in the testbody under the testindex
# If true, the testitem is a valid value for the API
# If false, the tester collects user input prompting with the message
# User input uses a numeric dictionary instead of text - prevents mistyping
def tester(testbody,testitem,testindex,message):
  dict = {}
  i = None
  while True:
    if i:
      testitem = dict[int(i)]
      i = None
    for t in testbody:
      if testitem == t[testindex]:
        return testitem
    for idx,t in enumerate(testbody):
      dict[idx] = t[testindex]
      print (str(idx) + ': ' + t[testindex])
    i = input(message)

# This function downloads the actual file using the sanitised API information provided
def download(baseurl, product, format, area, location):
  print ("Requesting " + product + " in " + format + " format for area " + area + "...")
  downloadurl = baseurl + product + '/downloads?format=' + format + '&area=' + area + '&redirect'
  download = apirequest(downloadurl, True)
  filename = download.url.split('?')[0].split('/')[-1]
  print ("Preparing: " + location + '\\' + filename)
  with open(r'' + location + '\\' + filename, 'wb') as file:
    file.write(download.content)
  print ("Finished: " + location + '\\' + filename)

# Make an initial call to the api
# This would be a good point to catch whether the API is available or not
apiresult = apirequest(baseurl, False)
# Test the product identifier information supplied against the service
product = tester(apiresult,product,"id","Enter Product ID: ")

# Get the main product information from the api
productresult = apirequest(baseurl + product, False)

# If a version was supplied, check whether the version on the system is newer
# If api version is newer, proceed with processing, else exit the script
if version and product:
  if time.strptime(productresult["version"], "%Y-%m") <= time.strptime(version, "%Y-%m"):
    sys.exit("No newer version than " + version + " is currently available for " + productresult["name"] + ".")

# Test the format information supplied against the service
format = tester(productresult["formats"],format,"format","Enter the format: ")

# Test the area information supplied against the service
# If the test fails for any of the requested areas, prompt for input
# No area supplied initially is treated as a failed test
# As all areas consist of two characters only this takes text directly
#
# Different to the other tests as we're allowing multiple values in a list
# Each value must be checked individually
test = 0
while test == 0:
  if areas:
    test = 1
    if len(areas) > 2:
      areas = areas.split(',')
      for a in areas:
        # If only one value is not valid for the product download, the whole provided set must fail
        test = test if a.upper().strip() in productresult["areas"] else 0 
    else:
      # If the value is not valid for the product download, the test must fail
      test = test if areas.upper().strip() in productresult["areas"] else 0
  if test == 0:
    for a in productresult["areas"]:
      print (a)
    areas = input("Enter your area(s). Separate by comma without spaces for multiple: ").upper()

# Test if the location is set
# If location is not set get it from the user
# Check whether the location exists and collect further input if not
while True:
  if not location:
    location = input("Enter the download location on your machine: ")
  if location and os.path.exists(location):
    break;
  else:
    print (location + ' - This path does not exist, please check and create the directories and try again or choose a different location.')
    location = None

# Currently each area has its own download link that needs fetching
# We split the downloads by the previously sanitised areas
#
# Where only one area is listed (i.e. two characters are present),
# we simply call areas to prevent the string being split into individual characters
if isinstance(areas,list):
  for area in areas:
    download(baseurl, product, format, area, location)
else:
  download(baseurl, product, format, areas, location)