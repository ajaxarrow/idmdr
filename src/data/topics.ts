import { Topic } from "../interfaces/discussion.interface.ts";

const topics: Topic[] = [
  {
    repository: 'forest-fire-incident-reports-bukidnon-area',
    title: 'June Incident Report is missing',
    description: `
      <p>There is a missing incident report for June. This report is crucial for analyzing the trends and patterns of forest fire incidents in the Bukidnon area. Without it, our analysis for that month remains incomplete.</p>
      <p>Please check if there were any technical issues or oversights that prevented the report from being filed. If possible, retrieve the data from backup sources or encourage field teams to provide any available information to fill this gap.</p>
      <p><strong>Contact:</strong> invento.prince@example.com</p>
    `,
    id: 'topic-1',
    owner: 'Invento, Prince',
    ownerImage: 'https://mighty.tools/mockmind-api/content/abstract/11.jpg'
  },
  {
    repository: 'biodiversity-mapping-forest-flora-and-fauna-records-worldwide',
    title: 'Duplicate Records',
    description: `
      <p>There are duplicate records in the repository, particularly in the fauna section for the same species. For example, records for the <em>Begonia coccinea</em> species appear multiple times with slight variations in data entries.</p>
      <p>This duplication complicates data analysis and leads to inaccuracies in biodiversity mapping efforts. It's essential to identify and merge or remove duplicate entries to maintain data integrity.</p>
      <p><strong>Contact:</strong> invento.prince@example.com</p>
    `,
    id: 'topic-2',
    owner: 'Invento, Prince',
    ownerImage: 'https://mighty.tools/mockmind-api/content/abstract/11.jpg'
  },
  {
    repository: 'biodiversity-mapping-forest-flora-and-fauna-records-worldwide',
    title: 'Records are not Sorted',
    description: `
      <p>Some fauna records are incorrectly categorized under flora. For instance, records of certain plant species like <em>Begonia grandis</em> are incorrectly labeled as fauna.</p>
      <p>This misclassification hinders accurate mapping and analysis of biodiversity. It's crucial to review and reclassify these records based on their correct taxonomic classifications.</p>
      <p><strong>Contact:</strong> pamisa.arram@example.com</p>
    `,
    id: 'topic-3',
    owner: 'Pamisa, Arram',
    ownerImage: 'https://mighty.tools/mockmind-api/content/abstract/43.jpg'
  },
  {
    repository: 'soil-health-monitoring-databases-on-agricultural-lands-across-borders',
    title: 'Location Typo',
    description: `
      <p>The coordinates for Musuan, Bukidnon aren't correct. Currently, they show the coordinates for Camiguin instead of the correct location.</p>
      <p>This error misleads data analysis and impacts decisions based on soil health in agricultural planning. Please update the coordinates to accurately reflect the location of Musuan, Bukidnon.</p>
      <p><strong>Contact:</strong> cabahug.anie@example.com</p>
    `,
    id: 'topic-4',
    owner: 'Cabahug, Anie Joseph',
    ownerImage: 'https://mighty.tools/mockmind-api/content/abstract/40.jpg'
  },
  {
    repository: 'biodiversity-mapping-forest-flora-and-fauna-records-worldwide',
    title: 'Outdated Data',
    description: `
      <p>Some data related to Begonia species are outdated, particularly in terms of distribution maps and population estimates.</p>
      <p>Updating this data is crucial for understanding the current status of endangered species and for conservation efforts.</p>
      <p><strong>Contact:</strong> cabahug.anie@example.com</p>
    `,
    id: 'topic-5',
    owner: 'Cabahug, Anie Joseph',
    ownerImage: 'https://mighty.tools/mockmind-api/content/abstract/40.jpg'
  },
  {
    repository: 'biodiversity-mapping-forest-flora-and-fauna-records-worldwide',
    title: 'Additional Records',
    description: `
      <p>I have additional fauna records that I would like to add to the repository to enhance the comprehensive database.</p>
      <ul>
        <li>New species sightings</li>
        <li>Updated data on existing species</li>
        <li>Contribution to a more accurate biodiversity map</li>
      </ul>
      <p><strong>Contact:</strong> james.lebron@example.com</p>
    `,
    id: 'topic-6',
    owner: 'James, LeBron',
    ownerImage: 'https://mighty.tools/mockmind-api/content/abstract/20.jpg'
  },
  {
    repository: 'crop-monitoring-and-yield-prediction-in-plantation-at-lampanusan-bukidnon',
    title: 'Suggestion: Data Expansion',
    description: `
      <p>There are some towns in Lampanusan that are missing from the repository, such as Barangay A, Barangay B, and Barangay C.</p>
      <p>Including these towns in the dataset will provide a more comprehensive analysis of crop yields and monitoring efforts in the region.</p>
      <p><strong>Contact:</strong> edwards.anthony@example.com</p>
    `,
    id: 'topic-7',
    owner: 'Edwards, Anthony',
    ownerImage: 'https://mighty.tools/mockmind-api/content/abstract/25.jpg'
  },
  {
    repository: 'soil-health-monitoring-databases-on-agricultural-lands-across-borders',
    title: 'Suggestion: Moisture Content Data',
    description: `
      <p>Please upload data on moisture content for accurate soil health monitoring across agricultural lands.</p>
      <p>This data is crucial for assessing irrigation needs and optimizing agricultural practices.</p>
      <p><strong>Contact:</strong> irving.kyrie@example.com</p>
    `,
    id: 'topic-8',
    owner: 'Irving, Kyrie',
    ownerImage: 'https://mighty.tools/mockmind-api/content/abstract/21.jpg'
  },
  {
    repository: 'forest-fire-incident-reports-bukidnon-area',
    title: 'Corrupt Video',
    description: `
      <p>The community awareness video is corrupted. The video glitches from timestamp 4:13 to 6:45, affecting the clarity of information conveyed.</p>
      <p>Repairing or replacing this video is essential to ensure accurate dissemination of fire safety information to the community.</p>
      <p><strong>Contact:</strong> jokic.nikola@example.com</p>
    `,
    id: 'topic-9',
    owner: 'Jokic, Nikola',
    ownerImage: 'https://mighty.tools/mockmind-api/content/abstract/17.jpg'
  },
  {
    repository: 'forest-fire-incident-reports-bukidnon-area',
    title: 'Missing and Incomplete Reports',
    description: `
      <p>Some details in the incident reports are missing or incomplete, such as exact locations, eyewitness accounts, and severity assessments.</p>
      <dl>
        <dt>Missing Details:</dt>
        <dd>Exact locations</dd>
        <dd>Eyewitness accounts</dd>
        <dd>Severity assessments</dd>
      </dl>
      <p>Completing these reports accurately is crucial for comprehensive analysis and effective response planning in future incidents.</p>
      <p><strong>Contact:</strong> thompson.klay@example.com</p>
    `,
    id: 'topic-10',
    owner: 'Thompson, Klay',
    ownerImage: 'https://mighty.tools/mockmind-api/content/abstract/10.jpg'
  }
];

export default topics;
