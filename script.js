// Initialize the Fabric.js canvas
const canvas = new fabric.Canvas('canvas', {
  preserveObjectStacking: true,
});

// Function to load and add an SVG to the canvas
async function addSVGToCanvas(string) {
  try {
    // const response = await fetch(svgURL); // Fetch the SVG file
    // const svgText = await response.text(); // Get the SVG content as text

    // Use the asynchronous `fabric.loadSVGFromString`
    const { objects, options } = await fabric.loadSVGFromString(string);

    // Create a Fabric.js group from the SVG elements
    const svgGroup = fabric.util.groupSVGElements(objects, options);

    svgGroup.set({
      left: canvas.width / 2 - svgGroup.width / 2,
      top: canvas.height / 2 - svgGroup.height / 2,
      originX: 'center',
      originY: 'center',
      selectable: true,
      lockScalingFlip: true
    });

    canvas.add(svgGroup);
    canvas.renderAll();
  } catch (error) {
    console.error('Error loading SVG:', error);
  }
}

// Attach click event listeners to SVG thumbnails
document.querySelectorAll('.thumbnail').forEach((thumbnail) => {
  thumbnail.addEventListener('click', () => {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(thumbnail);
    addSVGToCanvas(svgString); // Load and add the SVG
  });
});

window.addEventListener('keydown', function (event) {
  const key = event.key;
  if (key === "Backspace" || key === "Delete") {
    canvas.remove(canvas.getActiveObject());
  }
});

document.getElementById('export-button').addEventListener('click', () => {
  // Convert canvas content to a Data URL
  const svgData = canvas.toSVG();

  // Create a temporary download link
  const link = document.createElement('a');
  link.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
  link.download = 'canvas-image.svg'; // File name for the downloaded image
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
