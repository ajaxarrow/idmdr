interface NewsUpdate {
  title: string;
  slug: string;
  date: string;
  image: string;
  content: string;
}

const newsUpdates: NewsUpdate[] = [
  {
    title: "Breaking News: Technology Innovation",
    slug: "breaking-news-technology-innovation",
    date: "2024-08-17",
    image: "https://www.diyphotographystuff.info/wp-content/uploads/2023/11/The-Future-of-Photography-Emerging-Trends-and-Technologies.jpg",
    content: `
      <h2>Introduction</h2>
      <p>Lorem ipsum dolor sit amet, <strong>consectetur adipiscing elit</strong>. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.</p>
      <p><em>Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum</em>. Curabitur blandit tempus porttitor. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.</p>
      <h2>Impact of Innovation</h2>
      <p>Vestibulum id ligula porta felis euismod semper. Sed posuere consectetur est at lobortis. Cras mattis consectetur purus sit amet fermentum.</p>
      <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. <a href="#">Donec ullamcorper nulla non metus auctor fringilla</a>. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
      <h2>Conclusion</h2>
      <p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis. Aenean lacinia bibendum nulla sed consectetur.</p>
    `
  },
  {
    title: "Health & Wellness: New Advancements",
    slug: "health-wellness-new-advancements",
    date: "2024-08-16",
    image: "https://t4.ftcdn.net/jpg/01/91/68/25/360_F_191682556_gCnZ4B9JBbNinLRtLVU8KY2k5lnEW8b2.jpg",
    content: `
      <h2>Introduction</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. <strong>Curabitur blandit tempus porttitor</strong>.</p>
      <h2>Recent Studies</h2>
      <p>Nullam quis risus eget urna mollis ornare vel eu leo. Vestibulum id ligula porta felis euismod semper. Sed posuere consectetur est at lobortis.</p>
      <p>Aenean lacinia bibendum nulla sed consectetur. Maecenas faucibus mollis interdum.</p>
      <h2>Health Tips</h2>
      <p>Pellentesque ornare sem lacinia quam venenatis vestibulum. Etiam porta sem malesuada magna mollis euismod. Vestibulum id ligula porta felis euismod semper.</p>
      <p><em>Praesent commodo cursus magna, vel scelerisque nisl consectetur et</em>. Curabitur blandit tempus porttitor.</p>
    `
  },
  {
    title: "Global Economy: Trends to Watch",
    slug: "global-economy-trends-to-watch",
    date: "2024-08-15",
    image: "https://png.pngtree.com/thumb_back/fh260/background/20220621/pngtree-global-economy-paper-exploration-globe-photo-image_13934408.jpg",
    content: `
      <h2>Overview</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. <strong>Curabitur blandit tempus porttitor</strong>.</p>
      <h2>Market Analysis</h2>
      <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Nullam quis risus eget urna mollis ornare vel eu leo. Cras mattis consectetur purus sit amet fermentum.</p>
      <h2>Future Predictions</h2>
      <p>Sed posuere consectetur est at lobortis. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Sed posuere consectetur est at lobortis.</p>
      <p><a href="#">Donec ullamcorper nulla non metus auctor fringilla</a>. Vestibulum id ligula porta felis euismod semper.</p>
    `
  },
  {
    title: "Environmental Impact: Climate Change",
    slug: "environmental-impact-climate-change",
    date: "2024-08-14",
    image: "https://www.greenprophet.com/wp-content/uploads/Rainwater-collection-2012-by-Prasanta-Biswas-India.jpeg",
    content: `
      <h2>Climate Overview</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.</p>
      <h2>Effects on Wildlife</h2>
      <p>Cras justo odio, dapibus ac facilisis in, egestas eget quam. <strong>Nullam quis risus eget urna mollis ornare vel eu leo</strong>.</p>
      <h2>Steps Forward</h2>
      <p>Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. <em>Donec ullamcorper nulla non metus auctor fringilla</em>.</p>
      <p>Curabitur blandit tempus porttitor. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
    `
  },
  {
    title: "Finance: Market Volatility",
    slug: "finance-market-volatility",
    date: "2024-08-13",
    image: "https://thumbs.dreamstime.com/b/finance-accounting-concept-business-woman-working-desk-using-calculator-to-calculate-office-finance-accounting-141544975.jpg",
    content: `
      <h2>Understanding Volatility</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.</p>
      <h2>Historical Data</h2>
      <p><strong>Vestibulum id ligula porta felis euismod semper</strong>. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor.</p>
      <h2>Investor Reactions</h2>
      <p>Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
      <p>Aenean lacinia bibendum nulla sed consectetur. Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
    `
  },
  {
    title: "Travel & Leisure: Top Destinations",
    slug: "travel-leisure-top-destinations",
    date: "2024-08-12",
    image: "https://i.natgeofe.com/n/fba4cbb4-6a7f-4a4d-9e32-9f691cef8856/higts_southafrica_8502902-Edit_HR_square.jpg",
    content: `
      <h2>Introduction</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.</p>
      <h2>Top Picks</h2>
      <p><strong>Vestibulum id ligula porta felis euismod semper</strong>. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor.</p>
      <h2>Travel Tips</h2>
      <p>Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
      <p>Aenean lacinia bibendum nulla sed consectetur. Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
    `
  },
  {
    title: "Science & Research: Space Exploration",
    slug: "science-research-space-exploration",
    date: "2024-08-11",
    image: "https://www.commercialphotographersnetwork.com/wp-content/uploads/2022/04/photography-of-scientist-using-microscope-in-Torbay-Devon-73d1b369dba66bf2f30ba8d34ae374d8.jpg",
    content: `
      <h2>Introduction</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.</p>
      <h2>Recent Discoveries</h2>
      <p><strong>Vestibulum id ligula porta felis euismod semper</strong>. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor.</p>
      <h2>Future Missions</h2>
      <p>Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
      <p>Aenean lacinia bibendum nulla sed consectetur. Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
    `
  },
  {
    title: "Education: Online Learning Growth",
    slug: "education-online-learning-growth",
    date: "2024-08-10",
    image: "https://i.insider.com/5fd3f4a1e00bce00188bafd9?width=700",
    content: `
      <h2>Introduction</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.</p>
      <h2>Benefits of E-learning</h2>
      <p><strong>Vestibulum id ligula porta felis euismod semper</strong>. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor.</p>
      <h2>Challenges and Solutions</h2>
      <p>Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
      <p>Aenean lacinia bibendum nulla sed consectetur. Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
    `
  },
  {
    title: "Entertainment: Film Industry Updates",
    slug: "entertainment-film-industry-updates",
    date: "2024-08-09",
    image: "https://images.squarespace-cdn.com/content/v1/5c90fe2eaf468307c83acde2/1622562484987-9OQ742WE81W6FAA20E3C/HkRGTRaDaJeD6UK74HfNd0IPRgyifIDG1619726108.jpg",
    content: `
      <h2>Introduction</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.</p>
      <h2>Box Office Hits</h2>
      <p><strong>Vestibulum id ligula porta felis euismod semper</strong>. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor.</p>
      <h2>Industry Trends</h2>
      <p>Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
      <p>Aenean lacinia bibendum nulla sed consectetur. Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
    `
  },
  {
    title: "Sports: Upcoming Events",
    slug: "sports-upcoming-events",
    date: "2024-08-08",
    image: "https://cdn.prod.website-files.com/607e857d7feb56d9de8c60ab/60b74eaed3ce666e1ff023ec_andrew-bernstein-nba-lebron-james-lakers.JPG",
    content: `
      <h2>Introduction</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.</p>
      <h2>Top Competitions</h2>
      <p><strong>Vestibulum id ligula porta felis euismod semper</strong>. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor.</p>
      <h2>Athlete Profiles</h2>
      <p>Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
      <p>Aenean lacinia bibendum nulla sed consectetur. Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
    `
  },
  {
    title: "Business: Corporate Social Responsibility",
    slug: "business-corporate-social-responsibility",
    date: "2024-08-07",
    image: "https://png.pngtree.com/background/20230519/original/pngtree-an-asian-man-in-a-business-suit-posing-for-a-photo-picture-image_2651708.jpg",
    content: `
      <h2>Introduction</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.</p>
      <h2>CSR Initiatives</h2>
      <p><strong>Vestibulum id ligula porta felis euismod semper</strong>. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor.</p>
      <h2>Global Impact</h2>
      <p>Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
      <p>Aenean lacinia bibendum nulla sed consectetur. Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
    `
  },
  {
    title: "Technology: Artificial Intelligence",
    slug: "technology-artificial-intelligence",
    date: "2024-08-06",
    image: "https://miro.medium.com/v2/resize:fit:1400/1*D9mrOgbY3hZLZ0484c4wZg.png",
    content: `
      <h2>Introduction</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.</p>
      <h2>AI Applications</h2>
      <p><strong>Vestibulum id ligula porta felis euismod semper</strong>. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor.</p>
      <h2>Future of AI</h2>
      <p>Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
      <p>Aenean lacinia bibendum nulla sed consectetur. Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
    `
  },
  {
    title: "Lifestyle: Minimalism in Modern Living",
    slug: "lifestyle-minimalism-modern-living",
    date: "2024-08-05",
    image: "https://www.chase.com/content/dam/unified-assets/photography/articles/credit-card/basics/seo_minimalist-lifestyle_10112022.jpg",
    content: `
      <h2>Introduction</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id dolor id nibh ultricies vehicula ut id elit. Maecenas faucibus mollis interdum.</p>
      <h2>Benefits of Minimalism</h2>
      <p><strong>Vestibulum id ligula porta felis euismod semper</strong>. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor.</p>
      <h2>Tips for a Minimalist Lifestyle</h2>
      <p>Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>
      <p>Aenean lacinia bibendum nulla sed consectetur. Maecenas sed diam eget risus varius blandit sit amet non magna.</p>
    `
  }
];

export type { NewsUpdate };
export {newsUpdates};