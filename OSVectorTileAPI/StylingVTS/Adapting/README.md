# Adapting the pre-defined style

This method is particularly useful if you are aiming to highlight a feature in the existing style or wish to change a small number of elements. Since the method is manipulating the existing style on-the-fly it is taking browser resources to do so and may feel slow on low spec devices depending on the amount of change.

For this example we have changed the colour of all roads to bright red.

* In our original demo code we are already changing the styling due to a quirk in the styling package for OpenLayers.
   ```
   style.layers.forEach(layer => {
      if(layer.paint && layer.paint['icon-color']) {
          layer.paint['icon-color'] = layer.paint['icon-color'].replace(',0)', ',1)');
      }
   });
   ```
   This code loops through all layers defined in the style and makes some minor changes. All we need to do is adapt this code to allow us to change the colour of the roads.

* To make our style changes we include the following directly before the final `});` :
   ```
   if (layer['source-layer'].startsWith('road')) {
     layer.paint['line-color'] = '#FF0000';
   }
   ```
   This will check each layer source name to see whether it is beginning with "road". If the source layer begins with "road" the colour of the line will be changed to #FF0000 (bright red).

This method works well if you are making small changes to a defined style.

If you want to make complex changes or indeed create your own style this method can quickly become cumbersome and require a lot of code. In these cases you may find it easier to create your own style file or to include the JSON for the style directly in the code.