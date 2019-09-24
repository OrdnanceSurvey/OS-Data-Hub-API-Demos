# Creating your own style in a separate file

See the "ExternalFile" folder for a completed example.

Particularly suited to complete styling changes and custom styles.

This example will use a changed copy of the existing style. We are mainly interested in demonstrating how an external file can be used to define the style. In our case the resulting map will have the same content as the original in the same order and hierarchy, just different colours.

1. To begin, get a copy of the full pre-defined style from our service by calling https://osdatahubapi.os.uk/omse/vts/resources/styles/?key={Your Key} in your browser.
   Search online for a "JSON pretty print" service which will turn the minified JSON data you received back into a more readable format.
   
   Take a look at this to get a better understanding of the structure. You will notice that each element contains a combination of defining attributes and style attributes. We can access, filter and change all of these.
   
2. Save the style JSON into a new file. We will call ours "custom_style.json" and will save it in the same folder as the index.html and map.js file in our demo project.

3. Edit the JSON to suit your needs. In our example we have edited all colours to their greyscale equivalents.

4. At the very start of the JSON file, before the first `{` add `var custom_style = `. Change "custom_style" to your file name without the .json. While this naming convention is not strictly necessary, it ensures consistency.

5. In our index.html file for the demo project we need to include the new "custom_style.json" file. To do this add `<script type="text/javascript" src="custom_style.json"></script>` before the <script> tag referencing the map.js file.

6. In our map.js file change `var style = results[1];` to:
   ```
   // var style = results[1];
   var style = custom_style;
   ```

7. Open the index.html file in a browser and this should display the VTS data in the style you have defined (grayscale if you have used our demo file).