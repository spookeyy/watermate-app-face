const fs = require("fs");
const sourceMap = require("source-map");

async function decode(sourceMapPath) {
  try {
    const rawSourceMap = JSON.parse(fs.readFileSync(sourceMapPath));
    const consumer = await new sourceMap.SourceMapConsumer(rawSourceMap);

    // Replace these with your actual error coordinates
    const lookup = consumer.originalPositionFor({
      line: 56, // From your error stack
      column: 0, // Usually 0
    });

    console.log("Error location:", {
      source: lookup.source,
      line: lookup.line,
      column: lookup.column,
      name: lookup.name,
    });
  } catch (error) {
    console.error("Decoding failed:", error.message);
    console.log("\nMake sure to:");
    console.log("1. Run 'expo export --dev --source-maps' first");
    console.log("2. Pass the correct path to the .map file");
    console.log("3. Verify the error line numbers match your bundle");
  }
}

// Get the source map path from command line argument
const mapPath = process.argv[2] || "./dist/bundles/android-index.bundle.map";
decode(mapPath);
