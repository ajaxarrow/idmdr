<script setup lang="ts">
// @ts-nocheck
import { onMounted, ref } from 'vue';
import Navbar from "../components/Landing/Navbar.vue";
import Footer from "../components/Footer.vue";
import p1Proposed from "../../../assets/about/p1-proposed.png";
import p2Proposed from "../../../assets/about/p2-proposed.png";
import p1Current from "../../../assets/about/p1-current.png";
import p2Current from "../../../assets/about/p2-current.png";
import p3Proposed from "../../../assets/about/p3-proposed.png";
import p4Proposed from "../../../assets/about/p4-proposed.png";


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
                  <li><a href="#intro-nomcaarrd">What is NOMCAARRD?</a></li>
                </ul>
              </li>
              <li>
                <a href="#goals">Purpose and Goals</a>
                <ul>
                  <li><a href="#goals-vision">Vision</a></li>
                  <li><a href="#goals-mission">Mission</a></li>
                  <li><a href="#goals-objectives">Objectives</a></li>
                </ul>
              </li>
              <li>
                <a href="#cmi">Consortium Member-Institutions</a>
                <ul>
                  <li><a href="#cmi-about">What is a CMI?</a></li>
                  <li><a href="#cmi-research">Research Delivering Institutions</a></li>
                  <li><a href="#cmi-non-research">Non-Research Delivering Institutions</a></li>
                </ul>
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
              <div id="intro-nomcaarrd">
                <h3>What is NOMCAARRD?</h3>
                <p>
                  The Northern Mindanao Consortium for Agriculture, Aquatic, and Natural Resources Research and Development (NOMCAARRD) is a collaborative organization of 20 government and non-government entities in Region 10. Its primary role is to coordinate regional research, development, and extension priorities within the agriculture, fisheries, and natural resources sectors.
                </p>
                <p>
                  NOMCAARRD’s history includes several name changes and organizational expansions. It began in December 1978 as the Northern and Central Mindanao Coordinated Agriculture and Resources Research Program (NOCEMCARRP), initially consisting of only 9 member agencies. As the consortium grew, it was renamed the Northern Mindanao Consortium for Agriculture and Natural Resources Research and Development (NOMCAARD) to reflect its broader membership. Following a government rationalization program, where the Philippine Council for Aquatic Marine Resources Research and Development (PCAMRRD) was integrated with the Philippine Council for Agriculture and Natural Resources Research and Development (PCAARD) to form the Philippine Council for Agriculture, Aquatic and Natural Resources Research and Development (PCAARRD), the consortium adapted to these changes by adopting its current name, Northern Mindanao Consortium for Agriculture, Aquatic and Natural Resources Research and Development (NOMCAARRD), in 2015.
                </p>
                <p>
                  To address the need for better collaboration and data visualization among its varied member organizations, NOMCAARRD looked into NOMCAARRD Interactive Data Mapping Distribution and Repository (NIDMDR). This centralized repository serves as a platform for the consortium’s projects and developments, providing a visual representation of the initiatives across different sectors and organizations involved with NOMCAARRD.
                </p>
              </div>
            </section>
            <section id="goals">
              <h2>NOMCAARRD'S Purpose and Goals</h2>
              <div>
                <p>
                  The Consortium is hereby created for the following:
                </p>
                <ul>
                  <li>
                    To promote science and technology applications for agriculture, aquatic, forestry, and natural resources (AANR) sectors.
                  </li>
                  <li>
                    To promote science and technology applications for agriculture, aquatic, forestry, and natural resources (AANR) sectors.
                    Provide a venue for planning, monitoring evaluation and sharing resources through collaborative involvements of its members through the implementation of:
                    <ol class="ml-5">
                      <li>
                        Strategic Research and Development
                      </li>
                      <li>
                        Capability Building and Research and Development Governance
                      </li>
                      <li>
                        Research Results Dissemination and Utilization
                      </li>
                      <li>
                        Policy Advocacy
                      </li>
                    </ol>
                  </li>
                  <li>
                    To collaborate with Regional Research, Development, and Innovation Committee (RRDIC)-Region 10 for maximizing the utilization of research results to support regional development.
                  </li>
                  <li>
                    To source other funds for use in the implementation of research and development.

                  </li>
                </ul>
                <p>
                  It shall   operate as a program funded by the Department of Science and Technology – Philippine Council for Agriculture, Aquatic and natural Resources Research and Development (DOST-PCAARRD) as the PCAARRD in the Northern Mindanao.
                </p>
              </div>
              <div id="goals-vision">
                <h3>NOMCAARRD'S Vision</h3>
                <p>
                  NOMCAARRD envisions a productive, competitive, and sustainable Science and Technology-based (S&T) Agriculture, Aquatic, and Natural Resources (AANR) sector in Northern Mindanao. As a regional research and development consortium, it is committed to develop knowledge and provide innovative technologies through collaboration and networking with local and international organizations to bring about improvements for the AANR sectors.
                </p>
              </div>
              <div id="goals-mission">
                <h3>NOMCAARRD'S Mission</h3>
                <p>
                  As a regional research consortium, we commit ourselves to develop knowledge and provide innovative technologies through collaboration and networking with local and international organizations to bring about improvements for the AAFNR sectors.
                </p>
              </div>
              <div id="goals-objectives">
                <h3>NOMCAARRD'S Objectives</h3>
                <ul>
                  <li>
                    To identify regional research and development priorities;
                  </li>
                  <li>
                    To plan, monitor, and evaluate integrated regional research and development programs;
                  </li>
                  <li>
                    To plan, monitor and evaluate related activities in agriculture, fisheries, forestry environment, and natural resources;
                  </li>
                  <li>
                    To develop and implement a system of research management attuned to the development efforts of the region to maximize the utilization of research results to support regional development; and,
                  </li>
                  <li>
                    To source other funds for use in the implantation of research and development programs.
                  </li>
                </ul>
              </div>


            </section>

            <section id="cmi">
              <h2>Consortium Member-Institutions (CMIs)</h2>
              <div id="cmi-about">
                <h3>What is a CMI?</h3>
                <p>
                  The Consortium Member-Institutions (CMIs) represent a collective of esteemed agencies and academic institutions dedicated to advancing research and development in the fields of agriculture, aquatic sciences, and natural resources within Northern Mindanao.
                </p>
                <p>
                  These institutions collaborate to pool their expertise, resources, and knowledge to address the region's most pressing challenges, driving innovation and sustainable practices that benefit both the environment and local communities. Through their concerted efforts, the CMIs aim to foster a vibrant research ecosystem that supports the region's growth and development, ensuring a prosperous future for the people and the natural heritage of Northern Mindanao.
                </p>
              </div>
              <div id="cmi-research">
                <h3>Research Delivering Institutions</h3>
                <p>
                  Research Delivering Institutions are central to the consortium’s mission, driving innovation through focused research in agriculture, aquatic sciences, and natural resources. With advanced facilities and skilled researchers, these institutions develop sustainable technologies and solutions to address regional challenges. Their research directly supports the socio-economic growth of Northern Mindanao, benefiting local communities and ecosystems.
                </p>
              </div>
              <div id="cmi-non-research">
                <h3>Non-Research Delivering Institutions</h3>
                <p>
                  Non-Research Delivering Institutions play a supportive role in the consortium, helping to apply and disseminate the research conducted by their counterparts. These institutions, which include government agencies and NGOs, focus on policy-making, education, and community engagement. Their efforts ensure that research outcomes are effectively implemented, enhancing sustainability and development in Northern Mindanao.
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
