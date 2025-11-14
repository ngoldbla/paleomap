# PaleoMap

[![Build Status](https://travis-ci.org/macroecology/paleoMap.svg)](https://travis-ci.org/macroecology/paleoMap)
[![License: GPL-2](https://img.shields.io/badge/License-GPL%202-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html)

> Combining paleomaps from GPlates with fossil records from Paleobiology Database for paleogeographic analysis and visualization

## Overview

**PaleoMap** is a comprehensive toolkit for paleogeographic research that combines:

1. **R Package**: Download paleomaps from [GPlates](http://www.gplates.org/) and analyze fossil records from the [Paleobiology Database](http://paleobiodb.org/) to generate paleodiversity maps
2. **Web Application**: Interactive visualization of continental drift from Pangea to present day, deployed on Vercel with real-time GPlates data

---

## Table of Contents

- [Web Application](#-web-application)
  - [Features](#features)
  - [Live Demo](#live-demo)
  - [Quick Start](#quick-start-web-app)
- [R Package](#-r-package)
  - [Installation](#installation)
  - [Functions Overview](#functions-overview)
  - [Usage Examples](#usage-examples)
- [Technology Stack](#technology-stack)
- [Contributing](#contributing)
- [Citation](#citation)
- [License](#license)

---

## 🌍 Web Application

An interactive Next.js application for visualizing continental drift through geological time periods.

### Features

- **Interactive Map Viewer**: Explore paleogeographic reconstructions for 11 major geological periods (Permian to Present)
- **Continental Drift Animation**: Watch Pangea break apart through automated playback
- **Real-time Data**: Fetches reconstructions from GPlates Web Service API
- **Responsive UI**: Modern interface built with Next.js, TypeScript, and Tailwind CSS
- **Seamless Deployment**: Optimized for Vercel with serverless API routes to handle CORS

### Live Demo

🔗 *Deploy your own instance to Vercel in minutes!*

### Quick Start (Web App)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

**For Production Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md) for complete Vercel deployment instructions.

### Web App Technology Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 14 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Mapping | Leaflet + React Leaflet |
| Data Source | GPlates Web Service API |
| Deployment | Vercel |

---

## 📦 R Package

The original `paleoMap` R package provides tools for downloading paleomaps and analyzing fossil data to create paleodiversity maps and latitudinal gradients.

### Installation

**From CRAN** (stable version):

```r
install.packages("paleoMap")
library(paleoMap)
```

**From GitHub** (development version):

```r
install.packages("devtools")
library(devtools)
install_github("macroecology/paleoMap")
library(paleoMap)
```

### Functions Overview

`paleoMap` version 0.1 includes:

| Category | Functions | Description |
|----------|-----------|-------------|
| **Data Retrieval** | `pm_getmap`, `pm_getdata`, `pm_plot` | Get paleogeographical maps and fossil data |
| **Diversity Rasters** | `pm_occraster`, `pm_richraster`, `pm_divraster_loc`, `pm_divraster_cell` | Construct paleodiversity rasters |
| **Diversity Matrices** | `pm_occ`, `pm_occ_cell` | Create diversity matrices by localities or cells |
| **Latitudinal Gradients** | `pm_latrich`, `pm_latdiv` | Calculate latitudinal diversity gradients |

### Usage Examples

#### 1. Get and Visualize Paleogeographical Maps

**Download a paleomap for a specific time interval:**

```r
# Get Cretaceous paleomap
shape <- pm_getmap(interval = "Cretaceous")
shape
```

```
class       : SpatialPolygonsDataFrame
features    : 86
extent      : -180, 180, -88.8737, 83.6951  (xmin, xmax, ymin, ymax)
coord. ref. : NA
variables   : 13
```

![Cretaceous Map](figure/cretaceous.png)

#### 2. Download Fossil Data

**Get fossil occurrences from Paleobiology Database:**

```r
# Download turtle fossils from Paleocene
data <- pm_getdata(base_name = "Testudines", interval = "Paleocene")
head(data)
```

```
   occurrence_no               matched_name matched_rank matched_no     early_interval   late_interval paleolng paleolat geoplate
          40165        Peritresius ornatus      species     173397          Thanetian            <NA>   -44.51    40.13      109
          40166       Rhetechelys platyops      species     128351          Thanetian            <NA>   -44.51    40.13      109
         149344 Aspideretoides virginianus      species     316507          Thanetian            <NA>   -47.60    38.76      109
```

#### 3. Visualize Fossils on Paleomap

```r
data <- pm_getdata(base_name = "Testudines", interval = "Paleocene")
pm_plot(interval = "Paleocene", data)
```

![Fossil Occurrences](figure/occ_test.png)

#### 4. Create Diversity Rasters

**Generate sampling effort raster:**

```r
shape <- pm_getmap(interval = "Paleocene")
data <- pm_getdata(base_name = "Testudines", interval = "Paleocene")
pm_occraster(shape, data, rank = "species")
```

![Occurrence Raster](figure/raster_test.png)

**Generate species richness raster:**

```r
pm_richraster(shape, data, rank = "species")
```

![Richness Raster](figure/raster_rich_test.png)

#### 5. Calculate Paleodiversity

**Shannon diversity per locality:**

```r
occ_df <- pm_occ(data, rank = "species")
pm_divraster_loc(shape, occ_df, fun = mean)
```

![Diversity Map](figure/diversity.png)

**Shannon diversity per cell:**

```r
occ_df_cell <- pm_occ_cell(data, rank = "species")
pm_divraster_cell(shape, occ_df_cell, res = 10)
```

![Cell Diversity](figure/div_cell.png)

#### 6. Latitudinal Diversity Gradients

**Calculate latitudinal species richness:**

```r
pm_latrich(shape, data, rank = "species", res = 10)
```

```
 lat_min lat_max richn
1      -90     -80     0
2      -80     -70     0
...
13      30      40    17
14      40      50    17
15      50      60    13
```

![Latitudinal Richness](figure/lat_rich.png)

**Calculate latitudinal Shannon diversity:**

```r
occ_df <- pm_occ(data)
pm_latdiv(occ_df, shape, fun = mean)
```

![Latitudinal Diversity](figure/lat_div.png)

---

## Technology Stack

### Web Application
- Next.js 14 (React framework)
- TypeScript (type-safe JavaScript)
- Tailwind CSS (utility-first styling)
- Leaflet & React Leaflet (interactive maps)
- GPlates Web Service API (paleogeographic data)

### R Package
- R (>= 2.10)
- Dependencies: `paleobioDB`, `raster`, `vegan`, `maptools`, `roxygen2`

---

## Contributing

We welcome contributions to both the R package and web application!

### For R Package Development
1. Fork the repository
2. Create a feature branch
3. Make your changes to R functions in `R/`
4. Update documentation with roxygen2
5. Add tests in `tests/`
6. Submit a pull request

### For Web Application Development
1. Fork the repository
2. Install dependencies: `npm install`
3. Create a feature branch
4. Make your changes
5. Test locally: `npm run dev`
6. Build and verify: `npm run build`
7. Submit a pull request

### Adding New Geological Periods

Edit `lib/periods.ts`:

```typescript
{
  name: 'NewPeriod',
  era: 'Era',
  ageStart: 300,
  ageEnd: 250,
  description: 'Period description'
}
```

---

## Citation

If you use **paleoMap** in publications, please cite:

```
Sara Varela, K. Sonja Rothkugel (2015). paleoMap: combine paleogeography
and paleobiodiversity. R package version 0.1.
https://github.com/macroecology/paleoMap
```

**BibTeX entry:**

```bibtex
@Manual{paleoMap,
  title = {paleoMap: combine paleogeography and paleobiodiversity},
  author = {Sara Varela and Sonja Rothkugel},
  year = {2016},
  note = {R package version 0.1},
  url = {https://github.com/macroecology/paleoMap},
}
```

---

## License

GPL-2 - See [LICENSE](LICENSE) for details

---

## Credits

- **Original R Package**: Sara Varela, Sonja Rothkugel
- **Paleomap Data**: [GPlates](https://www.gplates.org/)
- **Fossil Data**: [Paleobiology Database](http://paleobiodb.org/)
- **Web Application**: Next.js conversion with Vercel deployment

---

## Support & Issues

- **Issues & Bugs**: [GitHub Issues](https://github.com/macroecology/paleoMap/issues)
- **R Package Questions**: Contact Sara Varela <svarela@paleobiogeography.org>
- **GPlates API**: [GPlates Documentation](https://gwsdoc.gplates.org/)

---

**Made with 🌍 for paleobiology research**
