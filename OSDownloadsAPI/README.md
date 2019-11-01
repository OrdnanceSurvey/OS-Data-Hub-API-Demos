# Pre-requisites

A working installation of Python. Tested and developed against Python 3. While Python 2.7 will work in principle the name retrieval of the downloaded file does not work in the same way and would require some rework. There are good tutorials explaining the differences between Python 2 and Python 3 available through a search engine search.

# Usage

## Basic commandline syntax

```
python downloader.py
```

This will result in a interactive commandline prompt asking the user for all required input.

## Parameters

If the commandline syntax is extended with parameters the script can run without any manual intervention. Refer to the examples at the end of this readme to see how this could work.

### Required for download

These parameters will be requested as user input if they are missing.

* product=
* areas=
* format=
* location=

### Required for version test

If ```version``` is found a product input is required. If the test passes and a newer version is available the script will continue with the download sequence expecting the inputs required for download. If the test fails and no newer version is available the script will exit with an explanatory message.

* product=
* version=

## Examples

```
python downloader.py product=OpenNames areas=GB format=CSV location=c:\data version=2019-04
```

Checks whether a newer version of OS OpenNames to April 2019 is available. If this is available it is downloaded as a GB national set in CSV format to ```c:\data```.

```
python downloader.py product=OpenMapLocal areas=ST,SO,SN,SS,SM,SR format=GeoPackage location=c:\data
```

Downloads OS OpenMap Local for the tiles ST,SO,SN,SS,SM,SR in GeoPackage format to ```c:\data```. No version check is made.

```
python downloader.py product=OpenMapLocal areas=SU location=c:\data
```

Downloads OS OpenMap Local for tile SU to ```c:\data``` after prompting the user for the format to download.