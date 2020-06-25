# Creating your own style within the code

Especially suited to cases where you only require a small number of available features to be displayed. For example only buildings or (as in our example) national parks. There is no hard and fast rule when to use this method or when to use a separate file for the style, this is largely personal preference.

For this example we will only load the styles relating to the national parks and a very faint representation of the landmass of GB.

* We remove the line beginning with `var promise2 =` and remove `promise2, ` from the following section:
   ```
   Promise.all([promise1, promise2, promise3])
   ```

* We replace `var style = results[1];` with:
   ```
   var style = {};
   ```
   This disables the automatic loading of the pre-defined style and sets up our in-line style variable.
   
* Between the `{}` of the `var style = {};` we have just inserted we must now build the style JSON.
   We start with:
   ```
    "version": 8,
    "sprite": "https://api.os.uk/maps/vector/v1/vts/resources/sprites/sprite",
    "glyphs": "https://api.os.uk/maps/vector/v1/vts/resources/fonts/{fontstack}/{range}.pbf",
    "sources": {
      "esri": {
        "type": "vector",
        "url": "https://api.os.uk/maps/vector/v1/vts/"
      }
    },
    "layers": []
   ```
   This is identical to the starting definition of the pre-defined style. We leave the version number as it is when we check the original style file. In our current case this is 8.
   "sprite" and "glyphs" are design elements (symbol collections and text typeface). If you have your own this is where you would replace ours. For our demo we will continue to include the pre-defined ones.
   "sources" describes the source of the service and is best left as it currently is.
   Our main focus will be on the "layers" section.
  
* Between the `[]` of `"layers": []` we can now include the various elements we want to style.
   To demonstrate this let's add the background colour for GB:
   ```
   {
      "id": "OS Open Zoomstack - Road/land",
      "type": "fill",
      "source": "esri",
      "source-layer": "land",
      "layout": {},
      "paint": {
        "fill-color": "#fefefe",
        "fill-outline-color": "#fefefe"
      }
    }
   ```
   This will give GB a very faint eggshell white background.
   
* We add the remaining layers and their definitions in the same manner. Each individual section as described above is separated with a comma. Here is our full example for the "layers" attribute:
   ```
   "layers": [
      {
        "id": "OS Open Zoomstack - Road/land",
        "type": "fill",
        "source": "esri",
        "source-layer": "land",
        "layout": {},
        "paint": {
          "fill-color": "#fefefe",
          "fill-outline-color": "#fefefe"
        }
      },
      {
        "id": "OS Open Zoomstack - Road/national_parks",
        "type": "fill",
        "source": "esri",
        "source-layer": "national_parks",
        "maxzoom": 11.85,
        "layout": {},
        "paint": {
          "fill-color": "#E5F5CC",
          "fill-opacity": 0.5
        }
      },
      {
        "id": "OS Open Zoomstack - Road/national parks",
        "type": "symbol",
        "source": "esri",
        "source-layer": "national parks",
        "minzoom": 6.53,
        "layout": {
          "icon-image": "OS Open Zoomstack - Road/national parks",
          "icon-allow-overlap": true,
          "text-font": [
            "Arial Bold"
          ],
          "text-size": 10.6667,
          "text-anchor": "center",
          "text-field": "{_name}",
          "text-optional": true
        },
        "paint": {
          "icon-color": "rgba(240,240,240,0)",
          "text-color": "#44913B",
          "text-halo-color": "#F4F4EE",
          "text-halo-width": 1.51181
        }
      }
    ]
   ```
   This will provide the faint background for GB and also display national parks and their labels in the same style of the original style.

* Finally we replace `var sprite = results[2];` with `var sprite = results[1];`, this is due to us removing one argument from the promise statement earlier.

* To ensure the demo opens in an area where we have national parks we change the center from `var center = [-121099, 7161610];` to `var center = [-343282, 7259502];`.

While you could change the style on-the-fly as in the very first example, this method is a little easier to maintain. If for some reason the style we pre-define changes it will not have any impact on your styling as you have "hard-coded" the style.