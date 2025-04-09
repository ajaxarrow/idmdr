import {CMI} from "../interfaces/cmi.interface.ts";
import {ClusterType} from "../interfaces/enums/organization.enum.ts";

const cmis: CMI[] = [
    {
        name: 'Central Mindanao University',
        acronym: 'CMU',
        slug: 'central-mindanao-university',
        logo: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2024/05/CMU-logo.png',
        cover: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/09/cmu.jpg',
        description: 'Central Mindanao University is a State University located in the heart of Mindanao Island, Province of Bukidnon, Philippines. It was transformed from a settlement farm school organized by the Americans. It started as the Mailag Industrial School founded in 1910. It is one of the oldest premier universities in Southern Philippines. In 1918, the school was renamed, Bukidnon National Agricultural School (BNAS) and offered the last three grades of elementary agriculture curriculum. By June 19, 1965, Republic Act No. 4498 catapulted the institution into Central Mindanao University. Mandate Section 2 of Republic Act No. 4498 mandates that Central Mindanao University “shall provide programs of instruction at all levels in the arts, sciences, technical, professional, educational, and philosophical fields, and shall concern itself with “pure” and “applied” research in all branches of knowledge for the intellectual and professional growth of faculty members, for the advance instruction of students, and for increasing knowledge and understanding.” Vision A leading ASEAN university actively committed to the total development of people for a globally sustainable environment and a humane society. Mission To advance the frontier of knowledge through internationalization of education and equitable access to quality instruction, research, extension and production for economic prosperity, moral integrity, social and cultural sensitivity and environmental consciousness.',
        director: 'Dr. Rolito G. Eballe Ph.D',
        email: 'cmu1910op@cmu.edu.ph',
        phone: '888-828-7899',
        withData: true,
        research: true,
        representatives: [
            {
                name: 'Dr. Jupiter V. Casas',
                type: ClusterType.ResearchAndDevelopment,
            },
            {
                name: 'Ferdinand D. Bascones, Jr.',
                type: ClusterType.InformationCommunication,
            },
            {
                name: 'Dr. Estrella Dacillo',
                type: ClusterType.TechnologyTransfer,
            },
            {
                name: 'Ms. Maejoy L. Talisay',
                type: ClusterType.ScienceCommunication,
            },
        ]
    },
    {
        name: 'Bukidnon State University',
        acronym: 'BSU',
        slug: 'bukidnon-state-university',
        logo: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/07/Bukidnon-State-University-BukSU.jpg',
        cover: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/09/BUKSU.jpg',
        description: 'The mandate of Republic Act No. 9456 An Act Converting The Bukidnon State College In The City Of Malaybalay, Province Of Bukidnon, Into A State University, To Be Known As The Bukidnon State University And Appropriating Funds Therefor (Approved by the President of the Republic on May 15, 2007) The University shall primarily provide advanced education, higher technological, professional instruction and training in the fields of education, arts and sciences, public, administration, information technology, accountancy, law and other relevant fields of study. It shall also promote research and extension service, and provide progressive leadership in its areas of specialization. RA 8292 and its Implementing Rules and Regulations (IRR) An Act Providing For The Uniform Composition And Powers Of The Governing Boards, The Manner Of Appointment And Term Of Office Of The President Of Chartered State Universities And Colleges, And For Other Purposes. Vision A premier institution of innovative and ethical leaders for sustainable development. Mission To develop competitive professionals who are committed to build a sustainable life for all through quality instruction, research, extension and production.',
        director: 'Atty. Ryan L. Estevez (OIC)',
        email: 'pressoffice@bsc.edu.ph',
        phone: '(088) 221-2237',
        withData: true,
        research: true,
        representatives: [
            {
                name: 'Dr. Lesley C. Lubos',
                type: ClusterType.ResearchAndDevelopment,
                email: 'bbicar@yahoo.com'
            },
            {
                name: 'Dr. Ma. Teresa G. Salumintao',
                type: ClusterType.InformationCommunication,
            },
            {
                name: 'Dr. Jiemalyn B. Paulican',
                type: ClusterType.TechnologyTransfer,
                email: 'godsgift.jaraba@gmail.com'
            },
            {
                name: 'Loraine Mae Asuncion Añasco',
                type: ClusterType.ScienceCommunication,
            },
        ]
    },
    {
        name: 'Liceo de Cagayan University',
        acronym: 'LDCU',
        slug: 'liceo-de-cagayan-university',
        logo: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/07/Liceo-de-Cagayan-University-LDCU.jpg',
        cover: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/09/LDCU.jpg',
        description: 'Founded in 1955 by Atty. Rodolfo N. Pelaez of Cagayan de Oro City and his wife Elsa Pelaez of Cebu City, the University was established with the primary mission to impart professional education to the youth of Northern Mindanao especially those who are deserving, but are financially-challenged. Envisioned to make relevant and quality education accessible to the youth, this higher institution of learning was founded as a catalyst in their total human formation anchored on universal moral values and Christian precepts. The University believes that educating the youth means instilling in them the commitment to academic excellence through a genuine interest in learning, self-discipline, and personal growth in order to realize their own potentials and to develop into fully integrated persons as they pursue their professional careers to become productive members of society.\n' +
            '\n' +
            'Believing that combining work and study, social involvement and academic improvement is a major instrument for greater equity in the quest for a better life, the Liceo de Cagayan University commits to provide students with a dynamic curriculum that covers wide spectrum of educational objectives such as moral character, personal discipline, civic consciousness, citizenship training, and professional expertise enhanced by actual community outreach programs.\n' +
            '\n' +
            'The Licean’s awareness of the problems of the community enables him to actively participate in the basic thrust of the programs and projects of the government. The student’s education is his tool in working out a firm foundation for the community. In so doing, Liceo de Cagayan University hopes that the students will be able to contribute to the sublime task of nation building. These beliefs continue to propel the University to produce the true Licean in mind, heart and spirit. Vision A leading Filipino University preparing responsible global leaders, anchored on Total Human Formation, for God, Country, and Humanity. Mission The University is committed to deliver quality instruction, research, and service learning for global integration.',
        director: 'Dr. Alain Marc P. Golez',
        phone: '(08822) 722244',
        withData: true,
        research: true,
        representatives: [
            {
                name: 'Dr. Ma. Felicitas M. Mamuag',
                type: ClusterType.ResearchAndDevelopment,
                email: 'mmamauag@liceo.edu.ph'
            },
            {
                name: 'Dr. Aurora Cindy A. Balabat',
                type: ClusterType.InformationCommunication,
                email: 'acbalabat@liceo.edu.ph'
            },
            {
                name: 'Jun Brian P. Tubongbanua',
                type: ClusterType.TechnologyTransfer,
                email: 'jbtubongbanua@liceo.edu.ph'
            },
            {
                name: 'Dr. Judy Marie R. Zoleta',
                type: ClusterType.ScienceCommunication,
                email: 'jrzoleta@liceo.edu.ph'
            },
        ]
    },
    {
        name: 'Philippine Carabao Center at CMU',
        acronym: 'PCC at CMU',
        slug: 'philippine-carabao-center-at-cmu',
        logo: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/07/Philippine-Carabao-Center-at-CMU-PCC-at-CMU.png',
        cover: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/09/8346722111_14e4b831bc_b.jpg',
        description: 'The Philippine Carabao Center (PCC) conserves, propagates, and promotes the carabao as a source of draft animal power, meat, milk, and hide to benefit rural farmers. It is responsible for the promotion of profitable and sustainable carabao-based enterprises designed to improve farmers’ income through carabao-genetic improvement, technology development and dissemination, and ensuring better nutrition of rural farming communities. Republic Act No. 7307 (March 27, 1992), the Philippine Carabao Act of 1992, created the Philippine Carabao Center (PCC) under the supervision and control of the Department of Agriculture.',
        director: 'Dr. Lowell C. Paraguas',
        email: 'pccmusuan@yahoo.com',
        withData: true,
        research: true,
        representatives: [
            {
                name: 'Vicenta L. Canatoy',
                type: ClusterType.ResearchAndDevelopment,
                email: 'canatoyvicenta@gmail.com'
            },
        ]
    },
    {
        name: 'Mindanao State University - Iligan Institute of Technology',
        acronym: 'MSU-IIT',
        slug: 'mindanao-state-university-iligan-institute-of-technology',
        logo: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/07/Mindanao-State-University-Iligan-Institute-of-Technology-MSU-IIT.jpg',
        cover: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/09/msuiit.jpg',
        description: 'Mindanao State University – Iligan Institute of Technology is dedicated to academic excellence with a commitment for the holistic development of the individual and the society. Founded in 1968 under the provision of Republic Act (RA) 5363, MSU-IIT is known for its excellence in science and technology and its passion for extensive research and community involvement. MSU-Iligan Institute of Technology is committed to provide quality service towards its constituents for its continual development towards excellence. With this in mind, MSU-IIT has established its core values of commitment, excellence, accountability, integrity, teamwork, transparency, and participation which serve as the guiding principles of its offices. Vision A university committed to the holistic development of the individual and society. Mission To provide quality education for the development of Mindanao and the country through relevant programs in instruction, research and community engagement.',
        director: 'Prof. Alizedney M. Ditucalan, JD, LLM',
        phone: '(063) 351-6151',
        withData: true,
        research: true,
        representatives: [
            {
                name: 'Dr. Guadencio C. Petalcorin, Jr.',
                type: ClusterType.ResearchAndDevelopment,
            },
            {
                name: 'Irene A. Estrada',
                type: ClusterType.InformationCommunication,
                email: 'irene.estrada@g.msuiit.edu.ph'
            },
            {
                name: 'Dr. Maria Shella Ramos',
                type: ClusterType.TechnologyTransfer,
            },
            {
                name: 'Prof. Jingle B. Magallanes',
                type: ClusterType.ScienceCommunication,
                email: 'jingle.magallanes@gmail.msuiit.edu.ph'
            },
        ]
    },
    {
        name: 'Xavier University',
        acronym: 'XU',
        slug: 'xavier-university',
        logo: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/07/Xavier-University-XU.jpg',
        cover: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/09/XU.jpg',
        description: 'Xavier University – Ateneo de Cagayan, the premier academic institution situated at the heart of Cagayan de Oro City in Northern Mindanao, is among Asia’s top universities, based on the 2021 Asian University Rankings released by London-based education and career consultancy Quacquarelli Symonds. The Office of Mission and Ministry (OMM) is the umbrella unit of the University’s formation cluster. It oversees the implementation of the non-academic formation initiatives of the various offices under it. Comprising the Mission and Ministry Cluster are the Office of Student Affairs (OSA), Campus Ministries Office (CMO), Guidance and Counseling Office (GCO), University Athletics Office (UAO), National Service Training Program (NSTP), Xavier Center for Culture and the Arts (XCCA), Alumni Affairs Office (AAO) and Chaplaincy. With its mandate to oversee the whole spectrum of formation initiatives on campus, OMM also works closely with other units/departments from Social Development Cluster such as the Student Social Formation, the Higher Cluster namely the Philosophy, Religious Studies and Psychology Departments; the Basic Education Cluster namely the Senior High School Formation Program, XU Junior High School and XU Grade School-Pueblo and Macasandig formation units. As a coordinating and monitoring body of all formation initiatives in the University, it assesses the program implementation of the units/departments under the cluster, with the aim to form students, faculty, formators, non-teaching staff and administrators into Better Persons, Better Workers and Better Citizens.',
        director: 'Fr. Mars P. Tan SJ',
        email: 'op@xu.edu.ph',
        phone: '(088) 853-9800',
        withData: true,
        research: true,
        representatives: [
            {
                name: 'Dr. Heidi R. Rabanes',
                type: ClusterType.ResearchAndDevelopment,
            },
            {
                name: 'Rechelle Ann T Barraquias',
                type: ClusterType.InformationCommunication,
                email: 'rbarraquias@xu.edu.ph'
            },
            {
                name: 'Judith T. Pit',
                type: ClusterType.TechnologyTransfer,
                email: 'jpit@xu.edu.ph'
            },
            {
                name: 'Dr. Maria Rosario P. Mosqueda',
                type: ClusterType.ScienceCommunication,
            },
        ]
    },
    {
        name: 'University of Science and Technology of Southern Philippines-Cagayan de Oro Campus',
        acronym: 'USTP-Cagayan',
        slug: 'university-of-science-and-technology-of-southern-philippines-cagayan-de-oro-campus',
        logo: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/07/University-of-Science-and-Technology-of-Southern-Philippines-Cagayan-de-Oro-Campus.jpg',
        cover: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/09/ustp.jpg',
        description: 'The University of Science and Technology of Southern Philippines (USTP) is a state university established on August 16, 2016, by virtue of Republic Act 10919 through the amalgamation of the Mindanao University of Science and Technology (MUST) in Cagayan de Oro City, Misamis Oriental and the Misamis Oriental State College of Agriculture and Technology (MOSCAT) in Claveria, Misamis Oriental. It is located in Northern Mindanao, the Gateway to Mindanao, which offers a strategic locational advantage for the institution to train and develop students from all the other regions. Adhering to its general mandate to primarily provide advanced education; higher technological, professional, and advanced instruction; and advanced research and extension work, required for global competitiveness, the University envisions becoming a nationally recognized S&T University providing the vital link between education and the economy. As the university fulfills this mandate, it moves from within its immediate context and toward its larger international environment, as the first and only national university of science and technology in the country. It will operate as such that it will have seamless knowledge and collaboration with its stakeholders in the private and public sectors, the labor market, business, and industry. Vision The University is a nationally recognized Science and Technology University providing the vital link between education and the economy. Mission Bring the world of work (industry) into the actual higher education and training of students, Offer entrepreneurs the opportunity to maximize their business potential through a gamut of services from product conceptualization to commercialization, and contribute significantly to the National Development Goals of food security and energy sufficiency through technological solutions.',
        director: 'Atty/ Dionel O. Albina',
        email: 'president.office@ustp.edu.ph',
        phone: '088856-1738',
        withData: true,
        research: true,
        representatives: [
            {
                name: 'Eng. Alex Maureal',
                type: ClusterType.ResearchAndDevelopment,
                email: 'Alex.maureal@ustp.edu.ph'
            },
            {
                name: 'Dr. Ismael N. Talili',
                type: ClusterType.InformationCommunication,
            },
            {
                name: 'Dr. Venessa A. Garcia',
                type: ClusterType.TechnologyTransfer,
                email: 'venessa.garcia@ustp.edu.ph'
            },
            {
                name: 'John David Moncada',
                type: ClusterType.ScienceCommunication,
                email: 'johndavid.moncada@ustp.edu.ph'
            },
        ]
    },
    {
        name: 'University of Science and Technology of Southern Philippines-Claveria Campus',
        acronym: 'USTP-Claveria',
        slug: 'university-of-science-and-technology-of-southern-philippines-claveria-campus',
        logo: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/07/University-of-Science-and-Technology-of-Southern-Philippines-Claveria-Campus.jpg',
        cover: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/09/uspt-claveria.jpg',
        description: 'The USTP Claveria is one the three (3) major campuses of the University of Science and Technology of Southern Philippines located in the idyllic town of Claveria, Misamis Oriental, Philippines. A campus invigorated with a natural fresh air, clean, cool and friendly environment.\n' +
            'USTP Claveria offers on-demand academic programs that ensure total students personality development from the fields of Agriculture as the flagship program to Environmental Management and Food Technology. It is consistent with the goals of national development promoting research, advanced studies and professional leadership in the various disciplines and areas of specialization. Vision The University is a nationally recognized Science and Technology University providing the vital link between education and the economy. Mission Bring the world of work (industry) into the actual higher education and training of students, Offer entrepreneurs the opportunity to maximize their business potential through a gamut of services from product conceptualization to commercialization, and contribute significantly to the National Development Goals of food security and energy sufficiency through technological solutions.',
        director: 'Dr. Renato O. Arazo',
        email: 'claveriachancellor@ustp.edu.ph',
        phone: '(088) 358-1116',
        withData: true,
        research: true,
        representatives: [
            {
                name: 'Rinante D. Taylaran',
                type: ClusterType.ResearchAndDevelopment,
            },
            {
                name: 'Cyril John C. Nagal',
                type: ClusterType.InformationCommunication,
                email: 'Cyriljohn.nagal@ustp.edu.ph'
            },
            {
                name: 'Imelda U. Hebron, DVM, Ph.D.',
                type: ClusterType.TechnologyTransfer,
                email: 'imelda.hebron@ustp.edu.ph'
            },
            {
                name: 'Randy A. Politud',
                type: ClusterType.TechnologyTransfer,
            },
            {
                name: 'April Mae T. Batuigas',
                type: ClusterType.ScienceCommunication,
                email: 'aprilmae.batuigas@ustp.edu.ph'
            },
        ]
    },
    {
        name: 'Camiguin Polytechnic State University',
        acronym: 'CPSC',
        slug: 'camiguin-polytechnic-state-university',
        logo: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/07/Camiguin-Polytechnic-State-University-CPSC.jpg',
        cover: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/09/Camiguin-Polytechnic-State-College.jpg',
        description: 'Camiguin Polytechnic State College is a public college in the Philippines. It is mandated to provide higher professional, technical and special instructions for special purposes and to promote research and extension services, advanced studies and progressive leadership in agriculture, forestry, engineering, arts and sciences, and other relevant studies. Its main campus is located in Mambajao, Camiguin. Vision A Center of Excellence in Engineering and Technology, Information Technology, Sciences, Education, Marine Biology and Environmental Science, Quality Assurance through Accreditation, Accreditation as indicators of Excellence, Graduates/Outputs are entrepreneurs and leaders in community development,\n' +
            'Research Center, particularly in marine and terrestrial biodiversity and agriculture. Mission Pursuant to section 3 R.A. 7929 CPSC shall provide higher professional, technical and special instructions for special purpose and to promote research and extension services, advanced studies and progressive leadership in agriculture, forestry, engineering, arts and sciences and other relevant studies.',
        director: 'Dr. Macario B. Oclarit',
        email: 'camiguinpolytechnic@yahoo.com',
        phone: '(088)-387-0495',
        withData: true,
        research: true,
        representatives: [
            {
                name: 'Dr. Erecson S. Solis',
                type: ClusterType.ResearchAndDevelopment,
                email: 'erecson.solis@studio.unibo.it'
            },
            {
                name: 'Orson Sabuga',
                type: ClusterType.InformationCommunication,
                email: 'orsonsabuga@gmail.com'
            },
            {
                name: 'Jeanny B. Dacup',
                type: ClusterType.TechnologyTransfer,
            }
        ]
    },
    {
        name: 'Department of Agriculture – Regional Field Unit 10',
        acronym: 'DA-RFU 10',
        slug: 'department-of-agriculture-regional-field-unit-10',
        logo: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/07/Department-of-Agriculture-%E2%80%93-Regional-Field-Unit-10-DA-RFU-10.jpg',
        cover: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/09/Department-of-Agriculture-RFO-X.jpg',
        description: 'Department of Agriculture (DA) Executive Order No. 116 was reorganized in January 1987 under the Executive Order No. 116, the Bureau of Agricultural Extension (BAEx), the Philippine Agricultural Training Council (PATC) and the Philippine Training Centers for Rural Development (PTC-RD) merged, and paved the way for the establishment of the Agricultural Training Institute (ATI).The ATI started its operations in 1987 with 10 training centers from the former PTC-RD. A year after, more training centers were set up adding nine Regional Training Centers (RTC) and seven Farmers’ Training Centers (FTC). Republic Act 8435 ATI’s role as the DA’s extension and training arm was strengthened with Republic Act 8435 or the Agriculture and Fisheries Modernization Act (AFMA) of 1997. Vision Food availability and affordability for every Filipino family through excellent extension services in agriculture and fisheries. Mission Empowerment and building capacities of agriculture and fisheries stakeholders for sustainable development.\n' +
            '\n',
        director: 'Carlene C. Collado',
        email: 'agri10cdo@gmail.com',
        phone: '088) 856-6871; 856-2753-55',
        withData: true,
        research: true,
        representatives: [
            {
                name: 'Cora A. Dumayaca',
                type: ClusterType.ResearchAndDevelopment,
                email: 'da10.r4d@gmail.com'
            },
            {
                name: 'Mae Odimyrl A. Morales',
                type: ClusterType.InformationCommunication,
                email: 'piano_gem@yahoo.com'
            },
            {
                name: 'Arlyn T. Timario',
                type: ClusterType.InformationCommunication,
                email: 'rte10.iss@ati.da.gov.ph'
            },
            {
                name: 'Arlyn T. Timario',
                type: ClusterType.TechnologyTransfer,
                email: 'rte10.iss@ati.da.gov.ph'
            },
            {
                name: 'Lorena V. Duna | lvduna@yahoo.com and lorenavillanuevaduna@gmail.com',
                type: ClusterType.ScienceCommunication,
                email: ''
            },
            {
                name: 'Mae Odimyrl A. Morales',
                type: ClusterType.ScienceCommunication,
                email: 'piano_gem@yahoo.com'
            },
        ]
    },
    {
        name: 'Northwestern Mindanao State College of Science and Technology',
        acronym: 'NMSCST',
        slug: 'northwestern-mindanao-state-college-of-science-and-technology',
        logo: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/07/Northwestern-Mindanao-State-College-of-Science-and-Technology-NMSCST.jpg',
        cover: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/09/NMSCST.jpg',
        description: 'The Northwestern Mindanao State College of Science and Technology (NMSC) started as Tangub Agro-Industrial School (TANAIS) in Sumirap, Tangub City way back in 1971 offering secondary agriculture and trade curricula with Mr. Jesus T. Bonilla as principal. On June 26, 1973, the school was transferred to Labuyo, Tangub City three kilometers from the city proper and approximately four hundred meters from the national highway, with Dr. Perfecto B. Yebes as the Vocational School Administrator. The school started offering post secondary courses in 1974 and had been an affiliate off campus institute of the Central Mindanao University, Musuan, Bukidnon from 1979 to 1984. In 1994, Bachelor’s Degree in Secondary Education and Industrial Technology were then offered. With the promotion of Dr. Yebes to a higher position, Mr. Apolonio S. Vidallo took place of the former and was appointed as the third administrator of TANAIS on August 6, 1996. Prior to Dr. Yebes’ promotion, in 1992 he and Atty. Philip T. Tan, the City Myor of Tangub at that time, conceived the idea of converting TANAIS into a state college. The proposal was filed in Congress by the late Hon. Hilarion Ramiro Jr., the Congressman of the 2nd District of Misamis Occidental at that time. The bill was not passed due to adjournment or the 9th Congress in 1995. The bill to convert TANAIS into a State College was refilled in the 10th Congress in 1995 by Congresswoman Herminia M. Ramiro. The bill passed both houses but with a last minute amendment to transfer the main campus from TANAIS in Tangub City to Oroquieta Agro-Industrial School (OAIS) at Oroquieta City. Vision\n' +
            'An ecologically responsive University in Southern Philippines that fosters a culture of innovation and sustainability on the quality of lives in the community it serves. Mission The University shall primarily provide advanced education, higher technological, professional instruction and training in the fields of agriculture, fisheries, engineering, information and communication technology, arts and sciences, education, business administration and management, health sciences and other relevant fields of study. It shall also undertake research, extension services and production activities in support of the socioeconomic development of the Province of Misamis Occidental, and provide progressive leadership in its areas of specialization.',
        director: 'Dr. Herbert Glenn P. Reyes',
        phone: '(088)586 0173',
        withData: true,
        research: true,
        representatives: [
            {
                name: 'Rodrin A. Rivera',
                type: ClusterType.ResearchAndDevelopment,
                email: 'rodrin.rivera@nmsc.edu.ph'
            },
            {
                name: 'Rhadnie Aquit',
                type: ClusterType.InformationCommunication,
                email: 'rhadnie.aquit@nmsc.edu.ph'
            },
            {
                name: 'Annabelle Joy Mendoza',
                type: ClusterType.TechnologyTransfer,
                email: 'annibellemendoza@gmail.com'
            },
            {
                name: 'Orlando Rosauro',
                type: ClusterType.ScienceCommunication,
                email: 'orlando.rosauro@nmsc.edu.ph'
            },
        ]
    },
    {
        name: 'Mindanao State University-Naawan',
        acronym: 'MSU-Naawan',
        slug: 'mindanao-state-university-naawan',
        logo: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/07/Mindanao-State-University-Naawan-MSU-at-Naawan.jpg',
        cover: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/09/Mindanao-State-University-Naawan.png',
        description: 'Mindanao State University at Naawan was founded as a field laboratory of the MSU College of Fisheries under Dean Domiciano Kapili Villaluz in 1964. This field laboratory was intended to complement the MSU College of Fisheries program in freshwater aquaculture. Through the help of the Municipal government, a 15 hectare mangrove area in Naawan, Misamis Oriental was acquired for training students in the design and construction of brackishwater ponds for the culture of commercially important species of fish. At the same time, a handful of biologists under the leadership of Dean Villaluz was experimenting on the hatchery technique of producing the fry of Penaeus monodon Fabricius under laboratory conditions. Vision An internationally recognized university in research and education in the Philippines. Mission Provide culturally-sensitive research, education, innovation, and entrepreneurship programs.',
        director: 'Dr. Elnor C. Roa',
        phone: '09189068056',
        withData: true,
        research: true,
        representatives: [
            {
                name: 'Dr. Ruby Gonzales',
                type: ClusterType.ResearchAndDevelopment,
                email: 'rubycastrencegonzales@gmail.com'
            },
            {
                name: 'Jeanette Samson, MSc.',
                type: ClusterType.InformationCommunication,
                email: 'jeanette.samson@msunaawan.edu.ph'
            },
            {
                name: 'Mariefe B. Quinones',
                type: ClusterType.TechnologyTransfer,
            },
            {
                name: 'Glebrose Giame Mercado',
                type: ClusterType.ScienceCommunication,
                email: 'glebrosegiame.mercado@msunaawan.edu.ph'
            },
        ]
    },
    {
        name: 'Ecosystems Research and Development Bureau Forest and Wetland Research, Development and Extension Center',
        acronym: 'ERDB-FWRDEC',
        slug: 'ecosystems-research-and-development-bureau-forest-and-wetland-research-development-and-extension-center',
        logo: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/07/Ecosystems-Research-and-Development-Bureau-Forest-and-Wetland-Research-Development-and-Extension-Center-ERDB-FWRDEC.jpg',
        cover: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/09/ERDB-FWRDEC.jpg',
        description: 'The Ecosystems Research and Development Bureau (ERDB) is the principal research and development (R & D) unit of the Department of Environment and Natural Resources (DENR). Its R & D and extension activities are focused on the five major ecosystems of the Philippines which include forests, upland farms, grassland and degraded areas, coastal zone and freshwater, and urban areas.\n' +
            'The ERDB was created in June 1987 under Executive Order (EO) 192 that merged the function of the former Forest Research Institute (FORI) and the National Mangrove Committee. Its headquarters is located at the University of the Philippines Los Baños, College of Forestry and Natural Resources (UPLB-CFNR) campus in the municipality of Los Baños, province of Laguna, Philippines about 65 kms south of Manila. Vision Relevant research, development and extension towards a healthy environment and sustainable natural resources for an improved quality of life. Mission To provide appropriate technology and information through research, development and extension towards the enhanced productivity and sustainability of natural resources and protection of the environment for the improvement of quality of life of the Filipinos.',
        director: 'Dr. Maria Lourdes Ferrer, CESO III',
        phone: '(088) 856-9537; (088) 856-9066',
        withData: true,
        research: true,
        representatives: [
            {
                name: '',
                type: ClusterType.ResearchAndDevelopment,
                email: ''
            },
            {
                name: 'Espie Praca',
                type: ClusterType.InformationCommunication,
                email: 'espiedear@gmail.com'
            },
            {
                name: 'Lourdes Agne',
                type: ClusterType.TechnologyTransfer,
                email: 'ding62_buk@yahoo.com'
            },
            {
                name: 'Mitch T. Bengil',
                type: ClusterType.ScienceCommunication,
            },
        ]
    },
    {
        name: 'Mindanao State University-Lanao del Norte Agricultural College',
        acronym: 'MSU-LNAC',
        slug: 'mindanao-state-university-lanao-del-norte-agricultural-college',
        logo:'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/09/MSU-LNAC-Logo-768x768.png',
        cover: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/09/Mindanao-State-University-Lanao-del-Norte-Agricultural-College-MSU-LNAC.jpg',
        description: 'The school was originally named Lumbatan Farm School in Lumbatan, Lanao del Sur with American S/Sgt. Ed F. Smith as Head Teacher. It was later converted into a high school known as Lumbatan Agricultural High School after the inauguration of the Philippine Assembly on October 16, 1907 in pursuance to the Phil. Bill of 1902. Immediately after the enactment of the Jones Law on August 29, 1914 by US Congress, the curriculum of the school was modified. It then offered complete secondary agricultural level. The medium of instruction and communication used was English because the teachers were all Americans. Mr. Clynton C. Douglas was the first Head Teacher and after a year he was replaced by a Filipino educator named Mr. Bernardo from Bacolod, Lanao del Norte.\n' +
            'In 1947, the school under the leadership of former Congressman Manalao Mindalano was transferred to Malabang, Lanao del Sur. It occupied a portion of Malabang Pilot Central School. In June 1953, then Congressman Mohammad Ali Dimaporo passed a bill seeking the transfer of the school from Malabang, Lanao del Sur to Karomatan, Lanao del Norte (now Sultan Naga Dimaporo, Lanao del Norte) particularly in Ramain Valley. The newly transferred school was a land donated by the prominent native Iranuns of Karomatan, Lanao del Norte. In 1969, pursuant to RA No. 5507, the school was converted into a college known as the Lanao del Norte Agricultural College. However the first college curricular offerings started in 1971.\n' +
            'In 2001, through the BOR Resolution No. 11-A, s, 2001 and pursuant to RA No. 8292 otherwise known as the Higher Education Modernization Act of 1997, mandating all CHED-supervised institutions to be integrated to nearby University, the Lanao del Norte Agriculture College then was integrated to Mindanao State University System and become MSU-Lanao del Norte Agricultural College. Vision MSU-LNAC aspires to be a Center of Excellence and development in agriculture and other disciplines. Mission The MSU-LNAC aspires to provide Quality Instruction and Training in Agriculture, Teacher Education, Computer and Information Technology to produce globally competitive and innovative graduates.',
        director: 'Indihira B. Dimaporo-Tawantawan, Ph.D',
        withData: true,
        research: true,
        representatives: [
            {
                name: 'Dr. Gaudencio M. Alaya-ay,  Jr.',
                type: ClusterType.ResearchAndDevelopment,
                email: 'docjunix.alayaay2008@gmail.com'
            },
            {
                name: 'Johniel Esguera',
                type: ClusterType.ResearchAndDevelopment,
            },
            {
                name: 'Adelfa C. Acala',
                type: ClusterType.InformationCommunication,
            },
            {
                name: 'Johaira C. Tuba',
                type: ClusterType.TechnologyTransfer,
            },
            {
                name: 'Fatmah S. Hadji Ahmad',
                type: ClusterType.ScienceCommunication,
            },
        ]
    },
    {
        name: 'Northern Bukidnon State College',
        acronym: 'NBSC',
        slug: 'northern-bukidnon-state-college',
        logo:'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/11/NBSC-LOGO-Approved-Martinez-Casicas-Nailes111-768x768.png',
        withData: false,
        research: true,
        representatives: [],
        link: 'https://nbsc.edu.ph/'
    },
    {
        name: 'Agricultural Training Institute - Regional Training Center -X',
        acronym: 'ATI - RTC-X',
        slug: 'agricultural-training-institute-regional-training-center-x',
        logo: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/07/Agricultural-Training-Institute-Regional-Training-Center-X-ATI-RTC-X.jpg',
        cover: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/09/ati-rtc-x.jpg',
        description: 'The Agricultural Training Institute’s (ATI) role as the DA’s extension and training arm was strengthened with the Republic Act 8435 or the Agriculture and Fisheries Modernization Act (AFMA) of 1997. But in November 1998, the Regional Fisheries Training Center (RFTC) were turned over to the Bureau of Fisheries and Aquatic Resources. Also, the Fisheries Training Center (FTC) were renamed Provincial Training Centers. As the lead agency for agriculture and fisheries extension, ATI is geographically situated nationwide to be able to reach its target clientele in the agriculture and fisheries sector. It has 16 regional training centers and one international training center, with its Central Office located at Diliman, Quezon City, Philippines. The following section presents ATI’s Officials: starting with the directorate followed by the division chiefs then the center directors of the various regions. Vision Food availability and affordability for every Filipino family through excellent extension services in agriculture and fisheries. Mission Empowerment and building capacities of agriculture and fisheries stakeholders for sustainable development.',
        director: 'Maria Llydia A. Echavez',
        phone: '09177707438',
        withData: true,
        research: false,
        representatives: [
            {
                name: 'Noemi Beth G. Macario',
                type: ClusterType.ResearchAndDevelopment,
                email: 'nbgmacario@ati.da.gov.ph'
            },
            {
                name: 'Teodosia D. Jaraba',
                type: ClusterType.TechnologyTransfer,
                email: 'godsgift.jaraba@gmail.com'
            },
            {
                name: 'Honey C. Bastasa',
                type: ClusterType.TechnologyTransfer,
            },
            {
                name: 'Honey C. Bastasa',
                type: ClusterType.InformationCommunication,
            },
            {
                name: 'Maria Eloisa A. Akut',
                type: ClusterType.ScienceCommunication,
                email: 'rte10.iss@ati.da.gov.ph'
            },
        ]
    },
    {
        name: 'Department of Science and Technology - Region X',
        acronym: 'DOST 10',
        slug: 'department-of-science-and-technology-region-x',
        logo:'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/07/Department-of-Science-and-Technology-Region-X-DOST-10.jpg',
        cover: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/09/dostx.jpg',
        description: 'MANDATE/MISSION Executive Order No. 128 mandates the Department to “provide central direction, leadership and coordination of scientific and technological efforts and ensure that the results there from are geared and utilized in areas of maximum economic and social benefits for the people”. Vision The Department envisions to be “an excellent provider of new knowledge and useful innovations, competent human resources and quality S & T services that uplift the socio economic well-being of the Filipino people and ensure sustainability for future generations.” Vision of DOST-X An effective and competent catalyst of inclusive development by providing world class and innovative Science & Technology services in Region X.',
        director: 'USEC. Sancho A. Mabborang (OIC)',
        withData: true,
        research: false,
        representatives: [
            {
                name: 'Virgilio M. Fuertes',
                type: ClusterType.ResearchAndDevelopment,
            },
            {
                name: 'Virgilio M. Fuertes',
                type: ClusterType.InformationCommunication,
            },
            {
                name: 'Virgilio M. Fuertes',
                type: ClusterType.TechnologyTransfer,
            },
            {
                name: 'Virgilio M. Fuertes',
                type: ClusterType.ScienceCommunication,
            },
        ]
    },
    {
        name: 'Bureau of Fisheries and Aquatic Resources- Region X',
        acronym: 'BFAR 10',
        slug: 'bureau-of-fisheries-and-aquatic-resources-region-x',
        logo: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/07/Bureau-of-Fisheries-and-Aquatic-Resources-Region-X-BFAR-10.jpg',
        cover: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/09/bfarx.jpg',
        description: 'BFAR is the government agency responsible for the development, improvement, management and conservation of the country’s fisheries and aquatic resources. It was reconstituted as a line bureau by virtue of Republic Act No. 8550 (Philippine Fisheries Code of 1998). The bureau is under the Department of Agriculture. Vision “an institution of excellence in sustainable fisheries management and innovative services contributing to the nation’s food security and improving fisherfolk quality of life.” Mission “to ensure sustainable fisheries and aquatic resources by empowering fisherfolk towards productivity and resiliency.”',
        director: 'Dr. Teodoro A. Bacolod Jr.',
        phone: '(088) 856-9593',
        withData: true,
        research: false,
        representatives: [
            {
                name: 'Wilson Viloria II',
                type: ClusterType.ResearchAndDevelopment,
            }
        ]
    },
    {
        name: 'National Economic and Development Authority- Region X',
        acronym: 'NEDA 10',
        slug: 'national-economic-and-development-authority-region-x',
        logo: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/07/National-Economic-and-Development-Authority-Region-X-NEDA-10.jpg',
        cover: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/09/NEDAX.jpg',
        description: 'NEDA traces its beginnings to the creation of its forerunner, the National Economic Council (NEC), under Commonwealth Act No. 2 that was approved by the National Assembly on 23 December 1935. The NEC’s principal mandate was to advise the national government on the formulation and adoption of a State economic program based on the policy of national independence. The Finance Secretary at that time was appointed the acting Chairman. In 1943, during the Second World War, while the country was under Japanese occupation, a National Planning Board was created under Executive Order No. 1, but this was replaced by the Economic Planning Board created under EO No. 46 of 1944, tasked to recommend measures for the economic development.',
        director: 'Dir. Mylah Faye Aurora B. Cariño, CESO III',
        phone: '(088) 2272-8072',
        withData: true,
        research: false,
        representatives: [
            {
                name: 'Kathleen Emillie A. Navarra',
                type: ClusterType.ResearchAndDevelopment,
                email: 'kanavarra@neda.gov.ph'
            },
            {
                name: 'EnP Archimedes C. Lazaro',
                type: ClusterType.ResearchAndDevelopment,
                email: 'aclazaro@neda.gov.ph'
            },
        ]
    },
    {
        name: 'Department of Agriculture-Bureau of Agricultural Research',
        acronym: 'DA-BAR',
        slug: 'department-of-agriculture-bureau-of-agricultural-research',
        logo:'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/07/Department-of-Agriculture-Bureau-of-Agricultural-Research-DA-BAR.png',
        cover: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/09/DA-BAR.jpg',
        description: 'The Bureau of Agricultural Research (BAR) was created by virtue of Executive Order 116 signed in 1987 under the Freedom Constitution. Under this EO, the government addressed the lack of coordination and integration of agriculture research and development among the existing bureaus, councils, and agencies by creating BAR under the Research, Training, and Extension Group.\n' +
            'BAR’s specific mandate to coordinate agricultural research was affirmed by EO 292, otherwise known as the Administrative Code of 1987. BAR’s specific mandate is to:“(1) ensure that all agricultural research is coordinated and undertaken for maximum utility to agriculture (Section 22).”\n' +
            'In 1997, Republic Act 8435, a landmark law also known as the Agriculture and Fisheries Modernization Act (AFMA), was enacted. This law affirmed the leading role of BAR in agriculture and fisheries research and development (R&D).\n' +
            'Executive Orders 127 (1999) and 338 (2000) further expanded the mandate of BAR to orchestrate, consolidate, and strengthen the National Research and Development System for Agriculture and Fisheries (NaRDSAF).\n' +
            '“The Bureau coordinates and funds agricultural and fishery research and development activities, develops partnerships and linkages with local and international research organizations, sources funds from local and foreign donor institutions, strengthens institutional capabilities of the agriculture and fisheries sectors, manages knowledge, facilitates technology utilization, and advocates policies toward improved governance and progressive agricultural and fishery sector value chain.” Mandate The Department of Agriculture – Bureau of Agricultural Research (DA-BAR) was created by virtue of Executive Order 116, series of 1987. Executive Order 292, otherwise known as the Administrative Code of 1987, mandates DA-BAR to “ensure that all agricultural research is coordinated and undertaken for maximum utility to agriculture (Section 22).” Vision The lead Research for Development (R4D) coordinating agency towards a technology-empowered agriculture and fisheries sector contributory to inclusive growth. Mission We coordinate, integrate, fund, and manage the Research for Development (R4D) system to ensure its optimum utility for the agriculture and fisheries sector.',
        director: 'Dr. Junel B. Soriano',
        phone: '02-928-8505',
        withData: true,
        research: false,
        representatives: [
            {
                name: 'Wilson Viloria II',
                type: ClusterType.ResearchAndDevelopment,
                email: 'ianjdlsu@gmail.com'
            },
        ]
    },
    {
        name: 'National Irrigation Administration - X',
        acronym: 'NIA 10',
        slug: 'national-irrigation-administration-x',
        logo:'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/07/National-Irrigation-Administration-X-NIA-10.jpg',
        cover: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/09/nia.jpg',
        description: 'The National Irrigation Administration (NIA) is a Government-Owned and Controlled Corporation created by the passage of Republic Act 3601 which was signed into law on June 22, 1963 by President Diosdado Macapagal. Its forerunner was the Irrigation Division of the defunct Bureau of Public Works Presidential Decree No. 1 dated September 23, 1972 integrated all irrigation activites under NIA. The Agency’s powers were broadened and capitalization increased from P300M to P2Billion by P.D. 552 on September 11, 1974. Capitalization was further increased P10 Billion under P.D. 1702 on July 18, 1980. The central office is presently located at the government center of EDSA, Diliman, Quezon City. Vision By 2022, NIA is a professional and efficient irrigation agency contributing to the inclusive growth of the country and in the improvement of the farmers’ quality of life. Mission To plan, construct, operate and maintain irrigation systems consistent with integrated water resource management principles to improve agricultural productivity and increase farmers’ income.',
        director: 'Engr. Constancio G. Banaay Jr.',
        email: 'r10@nia.gov.ph',
        phone: '(088) 2272-6589',
        withData: true,
        research: false,
        representatives: [
            {
                name: 'Janeta G. Lorono',
                type: ClusterType.ResearchAndDevelopment,
                email: ' r10@nia.gov.ph'
            }
        ]
    },
    {
        name: 'Philippine Council for Agriculture, Aquatic and Natural Resources Research and Development',
        acronym: 'PCAARRD',
        slug: 'philippine-council-for-agriculture-aquatic-and-natural-resources-research-and-development',
        logo: 'https://nomcaarrd.cmu.edu.ph/wp-content/uploads/2022/07/Philippine-Council-for-Agriculture-Aquatic-and-Natural-Resources-Research-and-Development-PCAARRD.jpg',
        withData: false,
        research: false,
        representatives: [],
        link: 'https://www.pcaarrd.dost.gov.ph/'
    },
]

export default cmis