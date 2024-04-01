import bukidnon from './geojsons/municities-province-16-bukidnon.0.1.json'
import camiguin from './geojsons/municities-province-21-camiguin.0.1.json'
import lanaodelnorte from './geojsons/municities-province-41-lanaodelnorte.0.1.json'
import misamisoccidental from './geojsons/municities-province-48-misamisoccidental.0.1.json'
import misamisoriental from './geojsons/municities-province-49-misamisoriental.0.1.json'

import tagline from './tagline.ts'

const boundaries = [
  {
    title: "Bukidnon",
    geo_json: bukidnon,
    bbox: [
      124.5524437,
      7.4032606,
      125.4493218,
      8.6015805
    ]
  },
  {
    title: "Camiguin",
    geo_json: camiguin,
    bbox: [
      124.4966914,
      8.9888298,
      124.9625913,
      9.3931111
    ]
  },
  {
    title: "Lanao del Norte",
    geo_json: lanaodelnorte,
    bbox: [
      123.5569475,
      7.5782852,
      124.3733085,
      8.3422263
    ]
  },
  {
    title: "Misamis Occidental",
    geo_json: misamisoccidental,
    bbox: [
      123.5403155,
      8.0002065,
      123.9989158,
      8.8069686
    ]
  },
  {
    title: "Misamis Oriental",
    geo_json: misamisoriental,
    bbox: [
      124.1077834,
      8.316188,
      125.2547442,
      9.2305102
    ]
  },

];

const boundariesWithTaglines = boundaries.map(boundary => ({
  ...boundary,
  tagline: tagline[boundary.title] || "Default Tagline",
}));

export default boundariesWithTaglines;
