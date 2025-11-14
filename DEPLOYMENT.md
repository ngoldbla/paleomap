# PaleoMap Web Application - Deployment Guide

## Overview

This repository now contains both:
1. The original R package for paleogeographic analysis (`paleoMap`)
2. A new Next.js web application for interactive visualization of continental drift

## Quick Start - Vercel Deployment

### Prerequisites
- A Vercel account (free tier works fine)
- GitHub repository connected to Vercel

### Deploy to Vercel

1. **Import Project to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically detect the Next.js configuration

### Environment Variables

No environment variables are required for basic functionality. The app uses the public GPlates Web Service API.

## Local Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Features

### 1. Interactive Map Viewer
- Displays paleogeographic reconstructions for different geological periods
- Uses GPlates Web Service for real-time data
- Supports 11 major time periods from Permian (260 Ma) to present

### 2. Continental Drift Animation
- Automatic playback through geological periods
- Adjustable animation speed
- Visual timeline progress indicator

### 3. Time Period Selection
- Manual selection of any geological period
- Period information and descriptions
- Age ranges in millions of years

## Data Sources

### Primary Data Source: GPlates Web Service
The web application uses the [GPlates Web Service](https://gws.gplates.org/) API to fetch paleogeographic reconstructions in real-time.

API endpoints used:
- Coastlines: `https://gws.gplates.org/reconstruct/coastlines/`
- Static Polygons: `https://gws.gplates.org/reconstruct/static_polygons/`

### Alternative: Local R Data Files
The repository includes `.rda` files in the `data/` directory containing paleomap shapefiles. These can be converted to GeoJSON for offline use.

To convert R data to GeoJSON:

```bash
# Requires R with sf or geojsonio packages
Rscript scripts/convert_rda_to_geojson.R
```

See `scripts/README.md` for detailed conversion instructions.

## Project Structure

```
paleomap/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── PaleoMap.tsx       # Main map component
│   ├── TimePeriodSelector.tsx
│   └── TimelineAnimation.tsx
├── lib/                   # Utility functions
│   ├── gplates.ts         # GPlates API integration
│   └── periods.ts         # Geological period data
├── public/                # Static files
│   └── geojson/          # Optional: Local GeoJSON files
├── R/                     # Original R package code
├── data/                  # Original R data files (.rda)
├── scripts/              # Conversion scripts
└── vercel.json           # Vercel configuration
```

## Troubleshooting

### Map Not Loading
- Check browser console for API errors
- Verify internet connection (required for GPlates API)
- Try a different geological period

### Build Errors
- Clear `.next` directory: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (requires Node 18+)

### Vercel Deployment Issues
- Ensure `package.json` exists in repository root
- Verify `next.config.js` is properly configured
- Check build logs in Vercel dashboard

## Technology Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet
- **Data Source**: GPlates Web Service API
- **Deployment**: Vercel

## Contributing

### Adding New Features

1. Create feature branch
2. Implement changes
3. Test locally with `npm run dev`
4. Build and verify: `npm run build`
5. Submit pull request

### Adding More Time Periods

Edit `lib/periods.ts` to add new geological periods:

```typescript
{
  name: 'NewPeriod',
  era: 'Era',
  ageStart: 300,
  ageEnd: 250,
  description: 'Period description'
}
```

## License

GPL-2 (same as original R package)

## Credits

- Original R package: Sara Varela, Sonja Rothkugel
- Paleomap data: [GPlates](https://www.gplates.org/)
- Fossil data: [Paleobiology Database](http://paleobiodb.org/)
- Web application: Next.js conversion for Vercel deployment

## Support

For issues related to:
- **R package**: See original `README.md`
- **Web application**: Create issue on GitHub
- **GPlates API**: Visit [GPlates documentation](https://gwsdoc.gplates.org/)
