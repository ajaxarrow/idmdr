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
    ]
  }
]

export default organizations