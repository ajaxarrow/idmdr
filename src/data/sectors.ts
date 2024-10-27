import { Sector } from "../interfaces/sector.interface.ts";

const sectors: Sector[] = [
  {
    name: "Corn Plantation in Musuan",
    slug: "corn-plantation-in-musuan",
    description: "High-yield corn farming in Musuan.",
    image: "https://balchem.com/plant-nutrition/wp-content/uploads/sites/4/2021/02/Balchem-plant-nutrittion-field-crops.jpg",
    tags: [
      "Bukidnon Agriculture",
      "Corn Farming",
      "Crop Management",
      "Agricultural Innovation",
      "Sustainable Farming"
    ],
    // bbox: [125.04945310510442, 7.857776158468681, 125.05006067326354, 7.858584911607338],
    geojson: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              125.04972840942571,
              7.858584911607338
            ],
            [
              125.05006067326354,
              7.858453254227797
            ],
            [
              125.04977112906306,
              7.857776158468681
            ],
            [
              125.04945310510442,
              7.85792192223181
            ],
            [
              125.04972840942571,
              7.858584911607338
            ]
          ]
        ]
      },
      properties: {
      }
    }
  },
  {
    name: "Kalilangan Rice",
    slug: "kalilangan-rice",
    description: "Premium rice from Kalilangan fields.",
    image: "https://www.ft.com/__origami/service/image/v2/images/raw/http%3A%2F%2Fcom.ft.imagepublish.upp-prod-eu.s3.amazonaws.com%2Fc588b2a0-fbbe-11e8-b03f-bc62050f3c4e?source=next-article&fit=scale-down&quality=highest&width=700&dpr=1",
    tags: [
      "Bukidnon Agriculture",
      "Rice Farming",
      "Quality Grains",
      "Local Delicacy",
      "Agricultural Excellence"
    ],
    // bbox: [124.74859881165821, 7.745382003639904, 124.75040990896747, 7.746103037315137],
    geojson: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates:[
          [
            [
              124.74867966421743,
              7.746103037315137
            ],
            [
              124.75033309903762,
              7.745946813456797
            ],
            [
              124.75040990896747,
              7.745382003639904
            ],
            [
              124.74859881165821,
              7.745570273662679
            ],
            [
              124.74867966421743,
              7.746103037315137
            ]
          ]
        ]
      },
      properties: {
      }
    }
  },
  {
    name: "Rice Plantations",
    slug: "lampanusan-rice-plantations",
    description: "Sustainable rice farming communities in Lampanusan, Bukidnon.",
    image: "https://newsaf.cgtn.com/news/2020-10-18/Chinese-owned-rice-farm-helps-farmers-in-rural-Uganda-to-boost-incomes-UFDeEjkRQ4/img/616a37e9df0c4df4abe9f55fdf9e20e1/616a37e9df0c4df4abe9f55fdf9e20e1.jpeg",
    tags: [
      "Bukidnon Agriculture",
      "Rice Production",
      "Food Security",
      "Community Development",
      "Sustainable Agriculture"
    ],
    // bbox: [124.76174470883751, 7.654181388794996, 124.76238432987753, 7.6549809942480636],
    geojson: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              124.76178468515229,
              7.6549809942480636
            ],
            [
              124.76238432987753,
              7.654977392424669
            ],
            [
              124.7623806956658,
              7.65420660160251
            ],
            [
              124.76174470883751,
              7.654181388794996
            ],
            [
              124.76178468515229,
              7.6549809942480636
            ]
          ]
        ]
      },
      properties: {
      }
    }
  },
  {
    name: "Sugarcane Plantation",
    slug: "sugarcane-plantation",
    description: "Juicy sugarcane harvests in Bukidnon.",
    image: "https://cdn.britannica.com/14/136114-050-04BB907A/Sugarcane.jpg",
    tags: [
      "Bukidnon Agriculture",
      "Sugarcane Farming",
      "Harvesting Season",
      "Sugar Production",
      "Rural Economy"
    ],
    // bbox: [125.12522930805017, 8.068693364406684, 125.13351791712404, 8.07804631626631],
    geojson: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              125.1287641560375,
              8.07804631626631
            ],
            [
              125.13351791712404,
              8.076356766798412
            ],
            [
              125.13168954747539,
              8.070926024204311
            ],
            [
              125.12973928651684,
              8.072072520387422
            ],
            [
              125.12784997121418,
              8.068693364406684
            ],
            [
              125.12681389507901,
              8.069779524767938
            ],
            [
              125.12626538418539,
              8.0697191826022
            ],
            [
              125.12522930805017,
              8.070684656172219
            ],
            [
              125.12529025370611,
              8.072253545803136
            ],
            [
              125.1287641560375,
              8.07804631626631
            ]
          ]
        ],
      },
      properties: {
      }
    }
  }
];

export default sectors;
