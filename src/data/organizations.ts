import {Organization} from "../interfaces/organization.interface.ts";
import {ClusterType, OrganizationType} from "../interfaces/enums/organization.enum.ts";

const organizations: Organization[] = [
  {
    name: "Central Mindanao University",
    slug: "central-mindanao-university",
    acronym: "CMU",
    address: "University Town, Musuan, Dologon, Maramag, Bukidnon",
    type: OrganizationType.Institution,
    description: "Central Mindanao University is a State University located in the heart of Mindanao Island, Province of Bukidnon, Philippines. It was transformed from a settlement farm school organized by the Americans. It started as the Mailag Industrial School founded in 1910. It is one of the oldest premier universities in Southern Philippines. In 1918, the school was renamed, Bukidnon National Agricultural School (BNAS) and offered the last three grades of elementary agriculture curriculum. By June 19, 1965, Republic Act No. 4498 catapulted the institution into Central Mindanao University. Mandate Section 2 of Republic Act No. 4498 mandates that Central Mindanao University “shall provide programs of instruction at all levels in the arts, sciences, technical, professional, educational, and philosophical fields, and shall concern itself with “pure” and “applied” research in all branches of knowledge for the intellectual and professional growth of faculty members, for the advance instruction of students, and for increasing knowledge and understanding.” Vision A leading ASEAN university actively committed to the total development of people for a globally sustainable environment and a humane society. Mission To advance the frontier of knowledge through internationalization of education and equitable access to quality instruction, research, extension and production for economic prosperity, moral integrity, social and cultural sensitivity and environmental consciousness.",
    email: "cmu1910op@cmu.edu.ph",
    tel: "888-828-7899",
    phone: "+63 998-5741-547",
    president: "Dr. Rolito G. Eballe Ph.D ",
    image: "https://www.cmu.edu.ph/wp-content/uploads/2023/06/branding-web-cover-660x330.jpg",
    clusterRepresentatives: [
      {
        type: ClusterType.ResearchAndDevelopment,
        name: "Jupiter V. Casas, PhD",
        email: "jupitcasas@yahoo.com",
      },
      {
        type: ClusterType.TechnologyTransfer,
        name: "Estrella Dacillo, PhD",
        email: "dacilloestrella@gmail.com",
      },
      {
        type: ClusterType.InformationCommunication,
        name: "Ferdinand Jr. D. Bascones",
        email: "ferdinand.basconesjr@cmu.edu.ph",
      },
      {
        type: ClusterType.ScienceCommunication,
        name: "Maejoy L. Talisay",
      }
    ],
    geojson: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates:[
          [
            [
              125.02117034155145,
              7.86130881346925
            ],
            [
              125.02518549147368,
              7.856846323025451
            ],
            [
              125.032138555973,
              7.854615059816183
            ],
            [
              125.03977713387366,
              7.847921198278726
            ],
            [
              125.0386998985287,
              7.845495859519346
            ],
            [
              125.04477158865484,
              7.841906332195094
            ],
            [
              125.05458324679336,
              7.835124646117535
            ],
            [
              125.05708941883694,
              7.83205072217153
            ],
            [
              125.05899888325115,
              7.831104894854732
            ],
            [
              125.06401122733843,
              7.821291809774024
            ],
            [
              125.06615937480439,
              7.821291809774024
            ],
            [
              125.07904825960026,
              7.845883201159822
            ],
            [
              125.06496595954553,
              7.852740156947519
            ],
            [
              125.06544332564903,
              7.854040601314722
            ],
            [
              125.06377254428662,
              7.855459263253536
            ],
            [
              125.06341451970894,
              7.8584147933927255
            ],
            [
              125.06281781207957,
              7.860188101376508
            ],
            [
              125.06341451970894,
              7.8613703024897035
            ],
            [
              125.06520464259734,
              7.862552500234912
            ],
            [
              125.06639805785613,
              7.861133862536505
            ],
            [
              125.06902357142576,
              7.861133862536505
            ],
            [
              125.07093303583986,
              7.860188101376508
            ],
            [
              125.07487130619421,
              7.861133862536505
            ],
            [
              125.07725813671198,
              7.862670719824166
            ],
            [
              125.07869023502258,
              7.863616475325557
            ],
            [
              125.08048035791091,
              7.8664537288920116
            ],
            [
              125.08203179774745,
              7.869882051052372
            ],
            [
              125.08370257910991,
              7.8717735270035405
            ],
            [
              125.08370257910991,
              7.874847157010251
            ],
            [
              125.0785708934967,
              7.877093256824168
            ],
            [
              125.07809352739315,
              7.878038979417283
            ],
            [
              125.07737747823779,
              7.880521490946805
            ],
            [
              125.07510998924596,
              7.882412918309953
            ],
            [
              125.07260381720232,
              7.883476842402942
            ],
            [
              125.07188776804702,
              7.884422550411301
            ],
            [
              125.0680688392186,
              7.884540763760398
            ],
            [
              125.06520464259734,
              7.885722895393187
            ],
            [
              125.06138571376886,
              7.891042445928861
            ],
            [
              125.05959559088058,
              7.892815614231182
            ],
            [
              125.05673139425926,
              7.893406668641504
            ],
            [
              125.05374785611212,
              7.893761300881948
            ],
            [
              125.05195773322379,
              7.893406668641504
            ],
            [
              125.0489741950766,
              7.890451388137819
            ],
            [
              125.04622933998115,
              7.88855999752802
            ],
            [
              125.04443921709287,
              7.8903331764781655
            ],
            [
              125.04312646030809,
              7.891278868808655
            ],
            [
              125.04062028826445,
              7.891397080197848
            ],
            [
              125.03357913823709,
              7.880994348597909
            ],
            [
              125.02117034155145,
              7.86130881346925
            ]
          ]
        ]
      },
      properties: {
      }
    }
  },
  {
    name: "Bukidnon State University",
    slug: "bukidnon-state-university",
    acronym: "BSU",
    address: "Fortich St., Malaybalay, Bukidnon",
    type: OrganizationType.Institution,
    description: "The mandate of Republic Act No. 9456 An Act Converting The Bukidnon State College In The City Of Malaybalay, Province Of Bukidnon, Into A State University, To Be Known As The Bukidnon State University And Appropriating Funds Therefor (Approved by the President of the Republic on May 15, 2007) The University shall primarily provide advanced education, higher technological, professional instruction and training in the fields of education, arts and sciences, public, administration, information technology, accountancy, law and other relevant fields of study. It shall also promote research and extension service, and provide progressive leadership in its areas of specialization. RA 8292 and its Implementing Rules and Regulations (IRR) An Act Providing For The Uniform Composition And Powers Of The Governing Boards, The Manner Of Appointment And Term Of Office Of The President Of Chartered State Universities And Colleges, And For Other Purposes. Vision A premier institution of innovative and ethical leaders for sustainable development. Mission To develop competitive professionals who are committed to build a sustainable life for all through quality instruction, research, extension and production.",
    email: "pressoffice@bsc.edu.ph",
    tel: "221-2237 ",
    phone: "+63 998-5741-547",
    president: "Atty. Ryan L. Estevez (OIC)",
    image: "https://i.ytimg.com/vi/1qczSFQBx80/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC9gaIPv6vNlW_rIUzzOZSGyP5EOg",
    clusterRepresentatives: [
      {
        type: ClusterType.ResearchAndDevelopment,
        name: "Lesley C. Lubos",
        email: "bbicar@yahoo.com",
      },
      {
        type: ClusterType.TechnologyTransfer,
        name: "Jiemalyn B. Paulican ",
        email: "godsgift.jaraba@gmail.com",
      },
      {
        type: ClusterType.InformationCommunication,
        name: "Ma. Teresa G. Salumintao",
      },
    ],
    geojson: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              125.12567014039928,
              8.156801077753315
            ],
            [
              125.1258540320128,
              8.156636662377977
            ],
            [
              125.12612690343815,
              8.156395911171188
            ],
            [
              125.12555150064975,
              8.155749992582656
            ],
            [
              125.12507694164941,
              8.156184519748464
            ],
            [
              125.12567014039928,
              8.156801077753315
            ]
          ]
        ]
      },
      properties: {
      }
    }
  },
  {
    name: "Liceo de Cagayan University",
    slug: "liceo-de-cagayan-university",
    acronym: "LDCU",
    address: "University Town, Musuan, Dologon, Maramag, Bukidnon",
    type: OrganizationType.Institution,
    description: "Founded in 1955 by Atty. Rodolfo N. Pelaez of Cagayan de Oro City and his wife Elsa Pelaez of Cebu City, the University was established with the primary mission to impart professional education to the youth of Northern Mindanao especially those who are deserving, but are financially-challenged. Envisioned to make relevant and quality education accessible to the youth, this higher institution of learning was founded as a catalyst in their total human formation anchored on universal moral values and Christian precepts. The University believes that educating the youth means instilling in them the commitment to academic excellence through a genuine interest in learning, self-discipline, and personal growth in order to realize their own potentials and to develop into fully integrated persons as they pursue their professional careers to become productive members of society. Believing that combining work and study, social involvement and academic improvement is a major instrument for greater equity in the quest for a better life, the Liceo de Cagayan University commits to provide students with a dynamic curriculum that covers wide spectrum of educational objectives such as moral character, personal discipline, civic consciousness, citizenship training, and professional expertise enhanced by actual community outreach programs.",
    email: "cmu1910op@cmu.edu.ph",
    tel: "888-828-7899",
    phone: "+63 998-5741-547",
    president: "Dr. Alain Marc P. Golez ",
    image: "https://www.liceo.edu.ph/images/Paseo%20Facilities%20Home.jpg",
    clusterRepresentatives: [
      {
        type: ClusterType.ResearchAndDevelopment,
        name: "Ma. Felicitas M. Mamuag",
        email: "mmamauag@liceo.edu.ph",
      },
      {
        type: ClusterType.TechnologyTransfer,
        name: "Jun Brian P. Tubongbanua",
        email: "jbtubongbanua@liceo.edu.ph",
      },
      {
        type: ClusterType.InformationCommunication,
        name: "Aurora Cindy A. Balabat",
        email: "acbalabat@liceo.edu.ph",
      },
      {
        type: ClusterType.ScienceCommunication,
        name: "Judy Marie R. Zoleta",
        email: "jrzoleta@liceo.edu.ph"
      }
    ],
    geojson: {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              124.6389864070398,
              8.486211113377635
            ],
            [
              124.63935556901072,
              8.486106310352696
            ],
            [
              124.63925302401941,
              8.485788520359108
            ],
            [
              124.6388906983803,
              8.485883181235934
            ],
            [
              124.6389864070398,
              8.486211113377635
            ]
          ]
        ]
      },
      properties: {
      }
    }
  },
]

export default organizations