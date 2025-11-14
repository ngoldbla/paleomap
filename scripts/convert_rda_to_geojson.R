#!/usr/bin/env Rscript
# Script to convert .rda paleomap data to GeoJSON format for web use

library(rgdal)
library(geojsonio)

# List of periods to convert
periods <- c(
  "Permian", "Triassic", "Jurassic", "Cretaceous",
  "Paleocene", "Eocene", "Oligocene", "Miocene",
  "Pliocene", "Pleistocene", "Holocene"
)

# Create output directory
dir.create("public/geojson", recursive = TRUE, showWarnings = FALSE)

# Convert each period
for (period in periods) {
  tryCatch({
    cat(sprintf("Converting %s...\n", period))

    # Load the R data file
    load(sprintf("data/%s.rda", period))

    # Get the shapefile object (it's named after the period)
    shape <- get(period)

    # Convert to GeoJSON
    geojson_file <- sprintf("public/geojson/%s.geojson", period)
    geojson_write(shape, file = geojson_file)

    cat(sprintf("  ✓ Saved to %s\n", geojson_file))
  }, error = function(e) {
    cat(sprintf("  ✗ Error converting %s: %s\n", period, e$message))
  })
}

cat("\nConversion complete!\n")
