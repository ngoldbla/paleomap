/**
 * Paleobiology Database (PBDB) Types
 * Based on API documentation: https://paleobiodb.org/data1.2/
 */

export interface FossilOccurrence {
  oid: number // Occurrence ID
  cid?: number // Collection ID
  tna: string // Taxonomic name (accepted)
  rnk?: number // Taxonomic rank

  // Taxonomic information
  odl?: string // Order
  cll?: string // Class
  phl?: string // Phylum
  fml?: string // Family
  gnl?: string // Genus

  // Geographic coordinates
  lat?: number // Modern latitude
  lng?: number // Modern longitude

  // Paleogeographic coordinates
  paleolat?: number // Paleo latitude
  paleolng?: number // Paleo longitude

  // Time information
  eag?: number // Early age (Ma)
  lag?: number // Late age (Ma)
  oei?: string // Early interval
  oli?: string // Late interval

  // Additional information
  cc2?: string // Country code
  stn?: string // State/province name
  rid?: number // Reference ID
}

export interface PBDBResponse {
  records: FossilOccurrence[]
  elapsed_time?: number
  data_source?: string
  data_license?: string
}

export interface TaxonGroup {
  name: string
  label: string
  color: string
  description: string
}

export const TAXON_GROUPS: TaxonGroup[] = [
  {
    name: 'Dinosauria',
    label: 'Dinosaurs',
    color: '#e74c3c',
    description: 'Non-avian dinosaurs from the Mesozoic Era'
  },
  {
    name: 'Mammalia',
    label: 'Mammals',
    color: '#3498db',
    description: 'Mammals including early forms and modern groups'
  },
  {
    name: 'Reptilia',
    label: 'Marine Reptiles',
    color: '#2ecc71',
    description: 'Marine reptiles like plesiosaurs and ichthyosaurs'
  },
  {
    name: 'Plantae',
    label: 'Plants',
    color: '#27ae60',
    description: 'Fossil plants and vegetation'
  },
  {
    name: 'Ammonoidea',
    label: 'Ammonites',
    color: '#9b59b6',
    description: 'Extinct cephalopods with coiled shells'
  },
  {
    name: 'Trilobita',
    label: 'Trilobites',
    color: '#f39c12',
    description: 'Extinct marine arthropods from the Paleozoic'
  },
]
