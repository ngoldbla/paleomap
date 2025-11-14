# Data Conversion Scripts

## Converting R Data to GeoJSON

To convert the paleomap `.rda` files to GeoJSON format for use in the web application:

### Prerequisites

Install required R packages:

```r
install.packages(c("rgdal", "geojsonio", "sf"))
```

### Running the Conversion

```bash
cd /home/user/paleomap
Rscript scripts/convert_rda_to_geojson.R
```

This will create GeoJSON files in `public/geojson/` for all major geological periods.

### Alternative: Using sf package

If you prefer using the `sf` package (more modern approach):

```r
library(sf)

# Load R data
load("data/Cretaceous.rda")

# Convert to sf object then to GeoJSON
shape_sf <- st_as_sf(Cretaceous)
st_write(shape_sf, "public/geojson/Cretaceous.geojson", driver = "GeoJSON")
```

## Data Sources

- Paleomap data: From [GPlates](http://www.gplates.org/)
- Fossil data: From [Paleobiology Database](http://paleobiodb.org/)
