# Pre-requisites

* A working installation of Python.

  Tested and developed against Python 3.  
  While Python 2.7 will work in principle the name retrieval of the downloaded file does not work in the same way and would require some rework. There are good tutorials explaining the differences between Python 2 and Python 3 available through a search engine search.

* The Python ```Requests``` module

  You can install this via the Python Package Manager ```pip```. Further instructions can be found on the [project website](https://pypi.org/project/requests/2.7.0/).

* Command Line access with the ability to execute python and the actual script.
  
  This should be possible on all but the most securely locked down operating systems.
  
* A working internet connection

# Status of the code

This script is intended to provide **an idea** of how an automated download script **could** be created. The script does not feature any error handling or intelligent checking of input or output.  
While it demonstrates the **basic principles of making automated downloads work** in an operating system agnostic way, more work would be required to ensure this script is safe to use outside of development environments.

# Usage

## Basic commandline syntax

Please note that depending on your system setup you may need to specify complete paths to ```python``` or the ```downloader.py``` script. This will depend on individual setups, hence why we use the basic notation here.

```
python downloader.py
```

This will result in a interactive commandline prompt asking the user for all required input.

## Parameters

If the commandline syntax is extended with parameters the script can run without any manual intervention. Refer to the examples at the end of this readme to see how this could work.

### Required for download

These parameters will be requested as user input if they are missing. Where a parameter value requires a space, ensure the entire key=value string is enclosed in quotes (e.g. "location=c:\data store\downloads" "format=ESRI® Shapefile").

All parameters are sanity checked against the API where possible. Location is checked against your file system, though not extensively.

* product=
  
  The name of the product you wish to download.
  
* areas=
  
  The area or areas of the product you wish to download.
  
* format=
  
  The name of the format for the product you are requesting to download. Please note that the registered trademark symbol in the ```ESRI® Shapefile``` can cause problems on some systems. Please refer to guidance from your operating system vendor or command line software vendor for solutions to this.
  
* location=
  
  The file system location you wish to download your files to.
  

### Required for version test

If ```version``` is found a product input is required. If the test passes and a newer version is available the script will continue with the download sequence expecting the inputs required for download. If the test fails and no newer version is available the script will exit with an explanatory message.

* product=
  
  The name of the product you wish to download.
  
* version=
  
  The version data of the product you hold or wish to test against. This must be in YYYY-MM numeric format (e.g. 2019-04).
  

## Examples

**Automated download**

```
python downloader.py product=OpenMapLocal areas=ST,SO,SN,SS,SM,SR format=GeoPackage location=c:\data
```

Downloads OS OpenMap Local for the tiles ST,SO,SN,SS,SM,SR in GeoPackage format to ```c:\data```. No version check is made.

**Automated download with version check**

```
python downloader.py product=OpenNames areas=GB format=CSV location=c:\data version=2019-04
```

Checks whether a newer version of OS OpenNames to April 2019 is available. If this is available it is downloaded as a GB national set in CSV format to ```c:\data```.

**Version check with interactive download**

```
python downloader.py product=OpenNames version=2019-04
```

Checks whether a newer version of OS OpenNames to April 2019 is available. If this is available the user is prompted for the missing inputs (format, areas, location).

**Semi-interactive download**

```
python downloader.py product=OpenMapLocal areas=SU location=c:\data
```

Downloads OS OpenMap Local for tile SU to ```c:\data``` after prompting the user for the format to download.

# Available products and values

Please refer to the [OS Downloads API documentation](https://osdatahub.os.uk/docs/downloads/technicalSpecification) for guidance on identifying the available products and values for your requests.