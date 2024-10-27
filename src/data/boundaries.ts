import bukidnon from './geojsons/municities-province-16-bukidnon.0.1.json';
import camiguin from './geojsons/municities-province-21-camiguin.0.1.json';
import lanaodelnorte from './geojsons/municities-province-41-lanaodelnorte.0.1.json';
import misamisoccidental from './geojsons/municities-province-48-misamisoccidental.0.1.json';
import misamisoriental from './geojsons/municities-province-49-misamisoriental.0.1.json';

import tagline from './tagline.ts';
import {Sector} from "../interfaces/sector.interface.ts";

const boundaries: Sector[] = [
  {
    name: "Bukidnon",
    slug: "bukidnon",
    image: 'https://lh4.googleusercontent.com/-v1sBL5M3eliGraWwH1BGBJhrGYel95oJ8lbDoofFRjaeLtpYRF-caWRPZuUpg88ySN50YNorMB6zj4laLm7kS34ghJpsKuGY6ywD0IcTp8Isjxhl9ISUqLt7l4pr2Mq2-6OX4oC',
    geojson: bukidnon,
    bbox: [
      124.5524437,
      7.4032606,
      125.4493218,
      8.6015805
    ],
    tags: [
      'Pineapple Plantation',
      'Agricultural Data',
      'Environmental Research',
      'Crop Yield',
      'Agriculture',
      'Soil Health Analysis'
    ]
  },
  {
    name: "Camiguin",
    slug: "camiguin",
    image: 'https://nolisoli.ph/wp-content/uploads/2023/09/camiguin-White-Island-with-Hibok-Hibok-as-background.jpeg',
    geojson: camiguin,
    bbox: [
      124.4966914,
      8.9888298,
      124.9625913,
      9.3931111
    ],
    tags: [
      'Volcanic Soil Farming',
      'Eco-Tourism',
      'Fruit Plantation',
      'Sustainable Agriculture'
    ]
  },
  {
    name: "Lanao del Norte",
    slug: "lanao-del-norte",
    image: 'https://thumbs.dreamstime.com/b/fish-farm-lala-lanao-del-norte-near-panguil-bay-183855207.jpg',
    geojson: lanaodelnorte,
    bbox: [
      123.5569475,
      7.5782852,
      124.3733085,
      8.3422263
    ],
    tags: [
      'Rice Farming',
      'Fishery',
      'Coconut Plantation',
      'Livestock Farming'
    ]
  },
  {
    name: "Misamis Occidental",
    slug: "misamis-occidental",
    image: 'https://www.judethetourist.com/wp-content/uploads/2023/04/misamis-tourist-spots-2023.jpeg',
    geojson: misamisoccidental,
    bbox: [
      123.5403155,
      8.0002065,
      123.9989158,
      8.8069686
    ],
    tags: [
      'Rubber Plantation',
      'Banana Plantation',
      'Forest Conservation',
      'Agroforestry'
    ]
  },
  {
    name: "Misamis Oriental",
    slug: "misamis-oriental",
    image: 'https://www.projectlupad.com/wp-content/uploads/2018/03/Red-Sand-Beach-in-Talisayan-Misamis-Oriental-Aerial-View-Project-LUPAD.jpeg',
    geojson: misamisoriental,
    bbox: [
      124.1077834,
      8.316188,
      125.2547442,
      9.2305102
    ],
    tags: [
      'Abaca Farming',
      'Poultry Farming',
      'Agri-Tourism',
      'Vegetable Farming'
    ]
  },
];

const boundariesWithTaglines = boundaries.map(boundary => ({
  ...boundary,
  description: tagline[boundary.name] || "Default Tagline",
}));

export default boundariesWithTaglines;
