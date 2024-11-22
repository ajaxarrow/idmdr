const commodities = [
  'Abaca', 'Banana', 'Cacao', 'Cashew', 'Cement/Concrete', 'Citrus', 'Coconut', 'Coffee', 'Corn', 'Grains',
  'Legume - Mungbean', 'Legume - Peanut', 'Legume - Soybean', 'Mango', 'Medicinal Plants', 'Natural Sources of Dye', 'Oil Palm',
  'Ornamental - Cutflowers', 'Ornamental - Foliages', 'Pili', 'Rice', 'Rubber', 'Rootcrops - Cassava', 'Rootcrops - Sweet Potato', 'Sericulture and Apiculture',
  'Sugarcane', 'Tropical Fruits - Citrus', 'Tropical Fruits - Durian', 'Tropical Fruits - Jackfruit', 'Tropical Fruits - Papaya', 'Tropical Fruits - Pineapple',
  'Tropical Fruits - Pomelo', 'Vegetables', 'Crops (Others)', 'Others'
];

const repoType = ['Project Repository', 'Document Repository']


const industries = [
  'Agriculture', 'Biotechnology / Molecular Technology', 'Construction', 'Crops',
  'Environmental Services / Climate Change Adaptation and Disaster Risk Reduction', 'Food Processing', 'Forestry',
  'Information Technology', 'Livestock', 'Marine and Inland Aquatic', 'Mining', 'Others'
]

const technologyCategories = [
  'Application of genomics in the study of diseases of aquatic species',
  'Aquatic R&D agenda',
  'Biologics and diagnostics development',
  'Breed development and genetic improvement (for meat, dairy and draft)',
  'Cement/Concrete',
  'Climate change adaptation and disaster risk reduction',
  'Conservation',
  'Conservation and improvement of native animals',
  'Conservation and management of biodiversity in terrestrial',
  'Conservation and management of biodiversity in terrestrial, forestry and marine ecosystems',
  'Cultural Management Practices - Development of biofertilizers and soil fertility enhancers',
  'Cultural Management Practices - Development of crop disease diagnostic kits/techniques and disease management protocols',
  'Cultural Management Practices - Development of eco-friendly pest and disease management and control strategies',
  'Cultural Management Practices - Organic Agriculture',
  'Cultural Management Practices - Soil health',
  'Crop production systems research - Decision support systems',
  'Crop production systems research - Development of climate-resilient technologies',
  'Crop production systems research - Off-season production and cultivation',
  'Crop production systems research - Smart farming approaches',
  'Crops',
  'Detection of chemical residues and anti-microbial resistance',
  'Development and sustainable management practices',
  'Development of high value products from agricultural and forest wastes',
  'Development of high yielding varieties (HYVs) of priority timber species with superior traits',
  'Development of smart farming approaches (including organic agriculture, integrated farming, ICT application and other climate-resilient agricultural production technologies',
  'Development of sustainable harvesting and postharvest techniques/technologies and marketing strategies for timber and non-timber forest species/products',
  'Development/Refinement of culture systems (broodstock management, hatchery, nursery, grow-out)',
  'Disease diagnostics and disease management',
  'Enhancing sustainable development through lifescape-landscape approach',
  'Fish health',
  'Fishkill warning and mitigation systems and environmental management for sustainable aquaculture',
  'Forestry',
  'Development protocols for the propagation of quality timber and non-timber forest planting materials',
  'Habitat management for fishery and ecosystem sustainability',
  'Improving fish resistance to climate change; molecular phylogenetics; population genetics',
  'Innovative management systems for unique landscapes and ecosystems',
  'Livestock',
  'Management and rehabilitation of problem',
  'Marine environmental management (to include Harmful Algal Blooms, coastal integrity/erosion, fish kills and eutrophication)',
  'Mechanization and automated systems for feeding',
  'Mitigation and adaptation studies (including protected agriculture, vertical agriculture)',
  'Natural resources and environment',
  'Nutrition',
  // 'Others',
  'Postharvest',
  'Postharvest handling',
  'Processing and new product development',
  'Production protocols for the propagation of quality timber and non-timber forest planting materials',
  'Production of good quality seeds and planting materials',
  'Production and management decision support systems',
  'Resource and ecosystems assessment and monitoring',
  'Reproductive biotechniques for priority livestock species',
  'Rubber',
  'Sustainable utilization',
  'Sustainable watershed management and utilization',
  'Strategies/decision management tools for climate change resilient environment',
  'Utilization and Management',
  'Varietal improvement and selection',
  'Vaccine',
  'Water and culture management and post production',
  'Others',
];


const technologyStatus = ['Laboratory experiment stage / Lab testing / Greenhouse testing', 'Pilot Testing stage', 'Upscaled Testing stage', 'Commercial scale testing stage', 'Technology ready for commercialization', 'Commercialized technology']

const readinessLevel = [
  'Level 1 - Basic principles observed and reported',
  'Level 2 - Technology concept and/or application formulated',
  'Level 3 - Analytical and experimental critical function and/or characteristic proof of concept',
  'Level 4 - Component and/or breadboard validation in laboratory environment',
  'Level 5 - Component and/or breadboard validation in relevant environment',
  'Level 6 - System/subsystem model or prototype demonstration in a relevant environment',
  'Level 7 - System prototype demonstration in an operational environment',
  'Level 8 - Actual system completed and "mission qualified" through test and demonstration in an operational environment',
  'Level 9 - Actual system "mission proven" through successful mission operations'
]

const agencies = [
  'Aurora State College of Technology (ASCoT)',
  'Bataan Peninsula State University (BPSU)',
  'Bureau of Agricultural Research (DA-BAR)',
  'Biotechnology Office (DA-BIOTECH)',
  'Bulacan Agricultural State College (BASC)',
  'Central Luzon State University (CLSU)',
  'CHED-Office of Planning',
  'Research and Knowledge Management (OPRKM) Research Development and Extension (RDE)',
  'Commission on Higher Education',
  'Department of Agriculture (DA)',
  'Department of Agriculture Region 3 (DA-Reg.3)',
  'DA-Agricultural Competitiveness Enhancement Fund (ACEF)',
  'DA-Bureau of Fisheries and Aquatic Resources Region 3',
  'DA-Regional Field Office III',
  'Department of Environment and Natural Resources (DENR)',
  'Department of Information and Communications Technology (DICT)',
  'Department of Science and Technology (DOST)',
  'Department of Trade and Industry (DTI)',
  'Department of Trade and Industry  Region III',
  'DOST-Philippine Council for Agriculture',
  'Aquatic and Natural Resources Research and Development (PCAARRD)',
  'DOST-Food and Nutrition Research Institute (FNRI)',
  'DOST-Philippine for Health Research and Development (PCHRD)',
  'DOST-Philippine Council for Industry Energy and Emerging Technology Research and Development (PCIEERD)',
  'DOST-Technology Application and Promotion Institute (TAPI)',
  'DOST-Forest Products Research and Development Instittute (FPRDI)',
  'DOST-Advanced Science and Technology Institute (ASTI)',
  'DOST-Philippine Atmospheric',
  'Geophysical and Astronomical Services Administration (PAGASA)',
  'DOST-Science Education Institute',
  'DOST-Philippine Institute of Volcanology and Seismology (PHIVOLCS)',
  'DOST Regional Field Office III',
  'Other DOST-attached agencies',
  'Foundation for the Philippine Environment (FPE)',
  'National Commission for Culture and the Arts (NCCA)',
  'National Research Council of the Philippines (NCRP)',
  'National Economic and Development Authority (NEDA)',
  'National Innovation Council',
  'National Research Foundation (NRF)',
  'Philippine Carabao Center (PCC) Main',
  'Philippine Center for Investigative Journalism (PCIJ)',
  'Philippine Center for Postharvest Development and Mechanization (PhilMech)',
  'Philippine Institute for Development Studies (PIDS)',
  'President Ramon Magsaysay State University (PRMSU)',
  'Philippine Rice Research Institute (PhilRice)',
  'Pampanga State Agriculture University',
  'Southeast Asian Regional Center for Graduate Study and Research in Agriculture (SEARCA)',
  'Tarlac Agricultural University (TAU)',
  'Australian Assistance for International Development (AusAID)',
  'Canadian International Development Assistance (CIDA)',
  'Danish International Development Assistance (DANIDA)',
  'German Technical Cooperation (GTZ)',
  'German Agency for Financial Cooperation (KFW)',
  'Japan International Cooperation Agency (JICA)',
  'Korea International Cooperation Agency (KOICA)',
  'New Zealand Aid Programme (NZAP)',
  'Norwegian Agency for Development Cooperation (Norad)',
  'Spanish Agency for International Development Cooperation (AECID)',
  'Swedish International Development Assistance (SIDA)',
  'United States Assistance for International Development (USAID)',
  'United States for Technical Development Assistance (USTDA)',
  'Global Partnership for Education (GPE)',
  'French Development Agency (AFD)',
  'Others'
];


const transferPlans = ["Extension", "Deployment", "Commercialization"]

const adopters = [
  'Farmers',
  'Feed producers',
  'Fisherfolks',
  'Local Government Units',
  'Machine fabricators',
  'Manufacturers',
  'National Government',
  // 'Others',
  'Policy Makers',
  'Regulatory bodies',
  'Seed companies',
  'Students',
  'Others'
];


const ipType = [
  'Copyright & Related Rights',
  'Geographical Indications',
  'Industrial Design',
  'Layout Design',
  'Patent',
  'Plant Variety Protection',
  'Protection of Undisclosed Information',
  'Trademark/Service Mark',
  'Utility Model'
];


const ipStatus = ['For filing', 'Filed', 'Not yet granted', 'Active', 'Withdrawn', 'Abandoned', 'Expired', 'For revival']

const modeStatus = ['Direct Sales', 'Donation', 'Licensing', 'Start-up', 'Spin-off']

const currentStatus = ['Applied Fairness Opinion Report', 'Awaiting Fairness Opinion Report', 'Granted Fairness Opinion Report']

const priorityLevels = ["high", "medium", "low"]


export {commodities, industries, technologyCategories, agencies, transferPlans, adopters, ipType, ipStatus, modeStatus, currentStatus, priorityLevels, technologyStatus, readinessLevel, repoType}