<script setup lang="ts">
// @ts-nocheck
import {onMounted, onUnmounted, ref} from 'vue';
import Navbar from "../components/Landing/Navbar.vue";
import Footer from "../components/Footer.vue";
const TOP_MARGIN = 0.1;
const BOTTOM_MARGIN = 0.2;

let tocItems = ref([]);
let pathLength = ref(0);
let lastPathStart = ref(0);
let lastPathEnd = ref(0);

const drawPath = () => {
  const toc = document.querySelector('.toc');
  const tocPath = document.querySelector('.toc-marker path');

  tocItems.value = Array.from(toc.querySelectorAll('li')).map(item => {
    const anchor = item.querySelector('a');
    const target = document.getElementById(anchor.getAttribute('href').slice(1));
    return {
      listItem: item,
      anchor: anchor,
      target: target
    };
  }).filter(item => !!item.target);

  const path = [];
  let pathIndent;

  tocItems.value.forEach((item, i) => {
    const x = item.anchor.offsetLeft - 5;
    const y = item.anchor.offsetTop;
    const height = item.anchor.offsetHeight;

    if (i === 0) {
      path.push('M', x, y, 'L', x, y + height);
      item.pathStart = 0;
    } else {
      if (pathIndent !== x) path.push('L', pathIndent, y);
      path.push('L', x, y);
      tocPath.setAttribute('d', path.join(' '));
      //@ts-ignore
      item.pathStart = tocPath.getTotalLength() || 0;
      path.push('L', x, y + height);
    }

    pathIndent = x;
    tocPath.setAttribute('d', path.join(' '));
    //@ts-ignore
    item.pathEnd = tocPath.getTotalLength();
  });

  //@ts-ignore
  pathLength.value = tocPath.getTotalLength();
  sync();
};

const sync = () => {
  const tocPath = document.querySelector('.toc-marker path');
  const windowHeight = window.innerHeight;

  let pathStart = pathLength.value;
  let pathEnd = 0;
  let visibleItems = 0;

  tocItems.value.forEach(item => {
    const targetBounds = item.target.getBoundingClientRect();
    if (targetBounds.bottom > windowHeight * TOP_MARGIN && targetBounds.top < windowHeight * (1 - BOTTOM_MARGIN)) {
      pathStart = Math.min(item.pathStart, pathStart);
      pathEnd = Math.max(item.pathEnd, pathEnd);
      visibleItems += 1;
      item.listItem.classList.add('visible');
    } else {
      item.listItem.classList.remove('visible');
    }
  });

  if (visibleItems > 0 && pathStart < pathEnd) {
    if (pathStart !== lastPathStart.value || pathEnd !== lastPathEnd.value) {
      tocPath.setAttribute('stroke-dashoffset', '1');
      tocPath.setAttribute('stroke-dasharray', `1, ${pathStart}, ${pathEnd - pathStart}, ${pathLength.value}`);
      //@ts-ignore
      tocPath.setAttribute('opacity', 1);
    }
  } else {
    //@ts-ignore
    tocPath.setAttribute('opacity', 0);
  }

  lastPathStart.value = pathStart;
  lastPathEnd.value = pathEnd;
};

onMounted(() => {
  window.addEventListener('resize', drawPath, false);
  window.addEventListener('scroll', sync, false);
  drawPath();
});

onUnmounted(() => {
  window.removeEventListener('resize', drawPath, false);
  window.removeEventListener('scroll', sync, false);
});
</script>

<template>
  <VLayout>
    <Navbar>
      <VContainer>
        <div>
          <nav class="toc">
            <ul>
              <li>
                <a href="#about">About the Stakeholders</a>
                <ul>
                  <li><a href="#intro-stakeholders">Who are NOMCAARRD's Stakeholders?</a></li>
                </ul>
              </li>
              <li>
                <a href="#categories">Categories of Stakeholders</a>
                <ul>
                  <li><a href="#categories-farmers">Smallholder Farmers and Agricultural Workers</a></li>
                  <li><a href="#categories-fisherfolk">Fisherfolk Communities</a></li>
                  <li><a href="#categories-indigenous">Indigenous Communities</a></li>
                  <li><a href="#categories-entrepreneurs">Agricultural Entrepreneurs and Value Chain Actors</a></li>
                  <li><a href="#categories-consumers">Consumers and Urban Communities</a></li>
                  <li><a href="#categories-environmental">Environmental Stewards and Conservation Groups</a></li>
                </ul>
              </li>
              <li>
                <a href="#engagement">Stakeholder Engagement</a>
<!--                <ul>-->
<!--                  <li><a href="#engagement-research">Participatory Research Approaches</a></li>-->
<!--                  <li><a href="#engagement-knowledge">Knowledge Sharing Networks</a></li>-->
<!--                  <li><a href="#engagement-capacity">Capacity Building for Stakeholders</a></li>-->
<!--                </ul>-->
              </li>
              <li>
                <a href="#impact">Impact on Stakeholders</a>
<!--                <ul>-->
<!--                  <li><a href="#impact-economic">Economic Benefits</a></li>-->
<!--                  <li><a href="#impact-environmental">Environmental Sustainability</a></li>-->
<!--                  <li><a href="#impact-social">Social and Cultural Well-being</a></li>-->
<!--                </ul>-->
              </li>
              <li>
                <a href="#future">Future Directions for Stakeholder Engagement</a>
<!--                <ul>-->
<!--                  <li><a href="#future-needs">Emerging Stakeholder Needs</a></li>-->
<!--                  <li><a href="#future-voice">Enhancing Stakeholder Voice and Agency</a></li>-->
<!--                </ul>-->
              </li>
            </ul>
            <svg class="toc-marker" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
              <path stroke="#444" stroke-width="3" fill="transparent" stroke-dasharray="0, 0, 0, 1000" stroke-linecap="round" stroke-linejoin="round" transform="translate(-0.5, -0.5)" />
            </svg>
          </nav>

          <article class="contents">
            <p class="text-h4 font-weight-bold">Stakeholders</p>
            <section id="about">
              <h2>About the Stakeholders</h2>
              <div id="intro-stakeholders">
                <h3>Who are NOMCAARRD's Stakeholders?</h3>
                <p>
                  NOMCAARRD (Northern Mindanao Consortium for Agriculture, Aquatic, and Natural Resources Research and Development) serves a diverse range of stakeholders across Region 10. While NOMCAARRD functions as a coordinating body, its true purpose is to benefit the various individuals and groups who rely on agriculture, aquatic resources, and natural resources for their livelihoods and wellbeing.
                </p>
                <p>
                  The primary stakeholders of NOMCAARRD include farmers, fisherfolk, indigenous communities, agricultural entrepreneurs, consumers, and ecosystem stewards. These groups represent the heart of Northern Mindanao's agricultural and resource sectors, and NOMCAARRD's initiatives are designed specifically to address their needs, challenges, and aspirations.
                </p>
                <p>
                  Through its research, development, and extension priorities, NOMCAARRD works to ensure that scientific and technological advancements directly benefit these stakeholders by improving productivity, sustainability, and resilience within the region's vital resource sectors.
                </p>
              </div>
            </section>

            <section id="categories">
              <h2>Categories of Stakeholders</h2>
              <div id="categories-farmers">
                <h3>Smallholder Farmers and Agricultural Workers</h3>
                <p>
                  Smallholder farmers represent the largest stakeholder group served by NOMCAARRD. These agricultural producers typically farm on less than two hectares of land and often face significant challenges including limited access to modern technology, vulnerability to climate change, and market access barriers.
                </p>
                <p>
                  In Region 10, smallholder farmers grow a diverse range of crops including rice, corn, high-value fruits and vegetables, coconut, and coffee. Many practice integrated farming, combining crop production with small-scale livestock raising to maximize land productivity and income sources.
                </p>
                <p>
                  Agricultural workers, including seasonal laborers and farm hands, also form a significant stakeholder group. These individuals often depend on agricultural employment for their livelihoods but may lack secure tenure or access to social protection.
                </p>
                <p>
                  NOMCAARRD develops and promotes technologies specifically designed for the needs of smallholder farmers, including:
                </p>
                <ul>
                  <li>Climate-resilient crop varieties adapted to local conditions</li>
                  <li>Low-cost farming implements suitable for small land areas</li>
                  <li>Integrated pest management systems that reduce chemical inputs</li>
                  <li>Post-harvest technologies to reduce losses and increase market value</li>
                </ul>
              </div>

              <div id="categories-fisherfolk">
                <h3>Fisherfolk Communities</h3>
                <p>
                  Northern Mindanao's extensive coastline and inland waters support numerous fishing communities. These fisherfolk stakeholders include:
                </p>
                <ul>
                  <li>Small-scale marine fishers who operate in coastal waters using traditional methods</li>
                  <li>Aquaculture producers who cultivate fish, shellfish, and seaweeds</li>
                  <li>Inland fishers who rely on the region's lakes, rivers, and reservoirs</li>
                  <li>Post-harvest processors who add value to fishery products</li>
                </ul>
                <p>
                  These communities face challenges including declining fish stocks, habitat degradation, limited access to sustainable fishing technologies, and vulnerability to extreme weather events.
                </p>
                <p>
                  NOMCAARRD supports fisherfolk communities through research on sustainable fishing practices, aquaculture innovations, post-harvest processing improvements, and coastal resource management. Projects often focus on balancing ecological sustainability with livelihood security for these vulnerable stakeholders.
                </p>
              </div>

              <div id="categories-indigenous">
                <h3>Indigenous Communities</h3>
                <p>
                  Region 10 is home to numerous indigenous communities, including the Higaonon, Talaandig, Manobo, and Bukidnon peoples. These communities often serve as stewards of ancestral domains that contain important forest, water, and biodiversity resources.
                </p>
                <p>
                  Indigenous stakeholders possess valuable traditional ecological knowledge that has been passed down through generations. NOMCAARRD recognizes the importance of this knowledge and works to integrate it with modern scientific approaches.
                </p>
                <p>
                  Research initiatives involving indigenous stakeholders often focus on:
                </p>
                <ul>
                  <li>Documentation and validation of traditional farming systems</li>
                  <li>Sustainable harvesting of non-timber forest products</li>
                  <li>Conservation of locally adapted crop varieties and livestock breeds</li>
                  <li>Watershed protection and forest restoration</li>
                </ul>
                <p>
                  NOMCAARRD ensures that research involving indigenous communities respects cultural protocols and promotes free, prior, and informed consent in all engagements.
                </p>
              </div>

              <div id="categories-entrepreneurs">
                <h3>Agricultural Entrepreneurs and Value Chain Actors</h3>
                <p>
                  Beyond primary producers, NOMCAARRD serves stakeholders involved in agricultural value chains, including:
                </p>
                <ul>
                  <li>Small and medium agricultural enterprises</li>
                  <li>Food processors and manufacturers</li>
                  <li>Seed producers and agricultural input suppliers</li>
                  <li>Traders, transporters, and market vendors</li>
                  <li>Rural financial service providers</li>
                </ul>
                <p>
                  These stakeholders play crucial roles in transforming raw agricultural and fishery products into marketable goods, creating employment opportunities, and strengthening the regional economy.
                </p>
                <p>
                  NOMCAARRD supports these entrepreneurs through research on processing technologies, quality standards, market information systems, and business development. Special attention is given to supporting women and youth entrepreneurs to promote inclusive economic growth within the agriculture and natural resources sectors.
                </p>
              </div>

              <div id="categories-consumers">
                <h3>Consumers and Urban Communities</h3>
                <p>
                  The ultimate beneficiaries of NOMCAARRD's work include consumers throughout Northern Mindanao and beyond. Consumer stakeholders benefit from:
                </p>
                <ul>
                  <li>Increased availability of nutritious, safe, and affordable food</li>
                  <li>Reduced environmental impact of agricultural production</li>
                  <li>Preserved ecosystem services such as clean water and air</li>
                  <li>Enhanced cultural heritage connected to traditional food systems</li>
                </ul>
                <p>
                  Urban communities in particular rely on the productivity and sustainability of rural agricultural systems. NOMCAARRD's research on urban agriculture, food safety, nutrition, and waste management also directly benefits these stakeholders.
                </p>
              </div>

              <div id="categories-environmental">
                <h3>Environmental Stewards and Conservation Groups</h3>
                <p>
                  Environmental stakeholders include both individual land stewards and organized conservation groups working to protect Northern Mindanao's rich biodiversity and natural resources.
                </p>
                <p>
                  NOMCAARRD partners with these stakeholders on research related to:
                </p>
                <ul>
                  <li>Agroforestry and sustainable land management</li>
                  <li>Biodiversity conservation in agricultural landscapes</li>
                  <li>Watershed protection and water resource management</li>
                  <li>Climate change mitigation and adaptation</li>
                </ul>
                <p>
                  These partnerships ensure that agricultural development proceeds in harmony with environmental conservation, recognizing that long-term food security depends on healthy ecosystems.
                </p>
              </div>
            </section>

            <section id="engagement">
              <h2>Stakeholder Engagement</h2>
              <div id="engagement-research">
                <h3>Participatory Research Approaches</h3>
                <p>
                  NOMCAARRD employs participatory research methodologies that directly involve stakeholders in all stages of the research process, from problem identification to technology development and evaluation.
                </p>
                <p>
                  Farmer-led research, community-based monitoring systems, and participatory technology development are common approaches. These methods ensure that research outputs are relevant, appropriate, and readily adoptable by the intended users.
                </p>
                <p>
                  Through participatory guarantee systems and farmer field schools, NOMCAARRD facilitates peer-to-peer learning and technology diffusion among stakeholder groups.
                </p>
              </div>

              <div id="engagement-knowledge">
                <h3>Knowledge Sharing Networks</h3>
                <p>
                  NOMCAARRD facilitates various knowledge-sharing networks that connect stakeholders with researchers and extension workers:
                </p>
                <ul>
                  <li>Community learning centers in strategic agricultural areas</li>
                  <li>Demonstration farms showcasing integrated farming systems</li>
                  <li>Mobile information services reaching remote communities</li>
                  <li>Stakeholder forums for dialogue on research priorities</li>
                  <li>Digital platforms connecting producers with markets and information</li>
                </ul>
                <p>
                  These networks ensure that research findings flow efficiently to those who can most benefit from them, while also allowing stakeholder feedback to inform future research directions.
                </p>
              </div>

              <div id="engagement-capacity">
                <h3>Capacity Building for Stakeholders</h3>
                <p>
                  Beyond conducting research, NOMCAARRD invests in building the capacity of its stakeholders through:
                </p>
                <ul>
                  <li>Technical training programs tailored to specific needs</li>
                  <li>Leadership development for farmer and fisher organizations</li>
                  <li>Enterprise development support for agricultural entrepreneurs</li>
                  <li>Youth mentorship to encourage next-generation involvement</li>
                  <li>Climate resilience planning for vulnerable communities</li>
                </ul>
                <p>
                  These capacity-building initiatives empower stakeholders to adapt to changing conditions, implement new technologies, and participate more effectively in governance of natural resources.
                </p>
              </div>
            </section>

            <section id="impact">
              <h2>Impact on Stakeholders</h2>
              <div id="impact-economic">
                <h3>Economic Benefits</h3>
                <p>
                  NOMCAARRD's research and development initiatives have generated significant economic benefits for stakeholders through:
                </p>
                <ul>
                  <li>Increased agricultural productivity and reduced production costs</li>
                  <li>Enhanced market access and value addition opportunities</li>
                  <li>Diversified income sources and reduced seasonal vulnerability</li>
                  <li>Improved resource efficiency and waste reduction</li>
                  <li>Development of niche markets for specialty products</li>
                </ul>
                <p>
                  Case studies throughout Northern Mindanao demonstrate how stakeholders have used NOMCAARRD-developed technologies to increase household income, create employment opportunities, and build financial resilience.
                </p>
              </div>

              <div id="impact-environmental">
                <h3>Environmental Sustainability</h3>
                <p>
                  Stakeholders also benefit from NOMCAARRD's focus on environmental sustainability, including:
                </p>
                <ul>
                  <li>Reduced dependency on chemical inputs through biological alternatives</li>
                  <li>Improved soil health and water management</li>
                  <li>Conservation of agricultural biodiversity</li>
                  <li>Ecosystem restoration in degraded areas</li>
                  <li>Climate-smart practices adapted to local conditions</li>
                </ul>
                <p>
                  These environmental benefits ensure the long-term viability of agricultural and natural resource-based livelihoods for future generations of stakeholders.
                </p>
              </div>

              <div id="impact-social">
                <h3>Social and Cultural Well-being</h3>
                <p>
                  NOMCAARRD recognizes that stakeholder well-being extends beyond economic and environmental dimensions to include social and cultural aspects:
                </p>
                <ul>
                  <li>Preservation of traditional farming knowledge and practices</li>
                  <li>Strengthened community organizations and social capital</li>
                  <li>Enhanced food security and improved nutrition</li>
                  <li>Recognition of women's roles in agriculture and natural resource management</li>
                  <li>Revitalization of local food cultures and traditions</li>
                </ul>
                <p>
                  By taking this holistic approach, NOMCAARRD ensures that technological innovations complement rather than displace the social and cultural systems that provide meaning and resilience to stakeholder communities.
                </p>
              </div>
            </section>

            <section id="future">
              <h2>Future Directions for Stakeholder Engagement</h2>
              <div id="future-needs">
                <h3>Emerging Stakeholder Needs</h3>
                <p>
                  As Northern Mindanao develops, stakeholder needs are evolving. NOMCAARRD is adapting its research agenda to address:
                </p>
                <ul>
                  <li>Digital inclusion for rural stakeholders in an increasingly technology-driven sector</li>
                  <li>Youth engagement to address agricultural aging and succession challenges</li>
                  <li>Climate resilience as weather patterns become more unpredictable</li>
                  <li>Urbanization and changing land-use patterns affecting agricultural space</li>
                  <li>Consumer demand for traceability, sustainability, and food safety</li>
                </ul>
                <p>
                  These emerging needs require innovative approaches and deeper stakeholder involvement in setting research priorities.
                </p>
              </div>

              <div id="future-voice">
                <h3>Enhancing Stakeholder Voice and Agency</h3>
                <p>
                  NOMCAARRD is committed to amplifying stakeholder voices through:
                </p>
                <ul>
                  <li>Representation in governance structures and decision-making processes</li>
                  <li>Regular stakeholder consultations to identify research gaps</li>
                  <li>Collaborative design of research methodologies and metrics</li>
                  <li>Stakeholder-led monitoring and evaluation</li>
                  <li>Recognition of diverse forms of knowledge and expertise</li>
                </ul>
                <p>
                  By enhancing stakeholder agency, NOMCAARRD ensures that its work remains relevant, effective, and equitable in serving the diverse communities of Northern Mindanao.
                </p>
              </div>
            </section>
          </article>
        </div>
      </VContainer>
      <Footer/>
    </Navbar>
  </VLayout>
</template>

<style scoped>
p{
  line-height: 26px;
  margin: 20px 0;
}

section{
  margin: 45px 0;
}

h3{
  margin: 20px 0;
}

h2{
  margin: 30px 0;
}


.toc {
  position: fixed;
  right: 100px;
  top: 95px;
  width: 250px;
  padding: 20px;
  background-color: #f9f9f9;
}

.toc ul {
  list-style: none;
  padding: 0;
}

.toc li {
  margin-bottom: 5px;
}

.toc a {
  text-decoration: none;
  color: #333;
}

.toc a:hover {
  text-decoration: underline;
}

.toc-marker {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.contents {
  margin-right: 320px;
  padding: 10px 20px 20px 20px;
}

.contents img {
  max-width: 100%;
  border: 1px solid #e4e4e4;
  border-radius: 4px;
}

.code-block {
  background: #f5f5f5;
  padding: 10px;
  border: 1px solid #ddd;
}

.header-secondary-text {
  font-size: 0.8em;
  color: #666;
}

.toc ul {
  list-style: none;
  padding: 0;
  margin: 0; }
.toc ul ul {
  padding-left: 2em; }
.toc li a {
  display: inline-block;
  color: #aaa;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1); }
.toc li.visible > a {
  color: #111;
  transform: translate(5px); }

.toc-marker {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; }
.toc-marker path {
  transition: all 0.3s ease; }

.vcontainer {
  opacity: 0;
  height: 0;
  overflow: hidden;
}

@media (max-width: 768px) {
  .toc {
    display: none;
  }

  .contents {
    margin-right: 0;
  }
}

@media (max-width: 1096px){
  .toc{
    right: 70px;
  }
}

@media (max-width: 960px){
  .toc{
    right: 50px;
  }
}

</style>
