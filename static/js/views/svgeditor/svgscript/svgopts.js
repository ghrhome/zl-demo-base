/**
 * Created by plocc on 16/3/17.
 */
/**
 * @param {object} opts Extension mechanisms may call setCustomHandlers with three functions: opts.open, opts.save, and opts.exportImage
 * opts.open's responsibilities are:
 *	- invoke a file chooser dialog in 'open' mode
 *	- let user pick a SVG file
 *	- calls svgCanvas.setSvgString() with the string contents of that file
 *  opts.save's responsibilities are:
 *	- accept the string contents of the current document
 *	- invoke a file chooser dialog in 'save' mode
 *	- save the file to location chosen by the user
 *  opts.exportImage's responsibilities (with regard to the object it is supplied in its 2nd argument) are:
 *	- inform user of any issues supplied via the "issues" property
 *	- convert the "svg" property SVG string into an image for export;
 *		utilize the properties "type" (currently 'PNG', 'JPEG', 'BMP',
 *		'WEBP', 'PDF'), "mimeType", and "quality" (for 'JPEG' and 'WEBP'
 *		types) to determine the proper output.
 */
editor.setCustomHandlers = function (opts) {
    editor.ready(function() {
        if (opts.open) {
            $('#tool_open > input[type="file"]').remove();
            $('#tool_open').show();
            svgCanvas.open = opts.open;
        }
        if (opts.save) {
            editor.showSaveWarning = false;
            svgCanvas.bind('saved', opts.save);
        }
        if (opts.exportImage) {
            customExportImage = opts.exportImage;
            svgCanvas.bind('exported', customExportImage); // canvg and our RGBColor will be available to the method
        }
        if (opts.exportPDF) {
            customExportPDF = opts.exportPDF;
            svgCanvas.bind('exportedPDF', customExportPDF); // jsPDF and our RGBColor will be available to the method
        }
    });
};