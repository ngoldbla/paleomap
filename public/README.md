# GeoJSON Data Files

This directory contains paleogeographic data in GeoJSON format for visualization in the web application.

## Data Conversion

The actual paleomap data is stored in R data format (`.rda` files) in the `data/` directory.
To convert this data to GeoJSON format:

### Option 1: Using R (Recommended)

```bash
cd /home/user/paleomap
Rscript scripts/convert_rda_to_geojson.R
```

See `scripts/README.md` for more details.

### Option 2: Using Online Services

You can use the [GPlates Web Service](https://gws.gplates.org/) API to fetch paleogeographic data directly.

### Option 3: Manual Conversion

1. Load the `.rda` file in R
2. Use the `sf` or `geojsonio` package to convert to GeoJSON
3. Save to `public/geojson/[PeriodName].geojson`

## Data Format

Each GeoJSON file should follow this structure:

```json
{
  "type": "FeatureCollection",
  "features": [...]
}
```

## Current Status

The repository includes sample/placeholder GeoJSON data. For production use, please run the conversion scripts to generate actual paleomap data from the R data files.
