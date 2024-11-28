<script setup lang="ts">
// @ts-nocheck
import {onMounted, onUnmounted, ref} from 'vue';
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
                <a href="#intro">Intro</a>
                <ul>
                  <li><a href="#intro-project">About the Application</a></li>
                  <li><a href="#intro-stakeholders">Stakeholders</a></li>
                </ul>
              </li>
              <li>
                <a href="#dev">System Development</a>
                <ul>
                  <li><a href="#dev-about">About the Capstone</a></li>
                  <li><a href="#dev-team">The Team</a></li>
                  <li><a href="#dev-others">Other Contributors</a></li>
                </ul>
              </li>
              <li>
                <a href="#problem">Problems</a>
                <ul>
                  <li><a href="#problem-repository">Storing and Sharing of Data</a></li>
                  <li><a href="#problem-access-control">Unwanted Access</a></li>
                  <li><a href="#problem-tagging">Project and Area Association</a></li>
                  <li><a href="#problem-visualization">Visualizing Data</a></li>
                </ul>
              </li>
              <li>
                <a href="#solution">Solution</a>
                <ul>
                  <li><a href="#solution-repository">Repository Management</a></li>
                  <li><a href="#solution-access-control">Access Controls</a></li>
                  <li><a href="#solution-tagging">Sector Tagging</a></li>
                  <li><a href="#solution-visualization">Map Visualization</a></li>
                </ul>
              </li>
            </ul>
            <svg class="toc-marker" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
              <path stroke="#444" stroke-width="3" fill="transparent" stroke-dasharray="0, 0, 0, 1000" stroke-linecap="round" stroke-linejoin="round" transform="translate(-0.5, -0.5)" />
            </svg>
          </nav>

          <article class="contents">
            <p class="text-h4 font-weight-bold">About LINNKS</p>
            <section id="intro">
              <h2>Introduction</h2>
              <div id="intro-project">
                <h3>About the Application</h3>
                <p>
                  Learning and Information Network for NOMCAARRD Knowledge-Based System, or LINNKS, is an interactive platform designed for NOMCAARRD to manage projects and consortium member institutions. It provides a centralized space for accessing, sharing, and organizing key data and resources across the organization.
                </p>
                <p>
                  LINNKS empowers users by offering streamlined data visualization and collaboration tools. With its intuitive interface, users can easily navigate through project information, fostering transparency and informed decision-making.
                </p>
                <p>
                  The platform also supports dynamic mapping and knowledge-sharing capabilities to enhance communication among consortium members. By connecting insights and expertise, LINNKS strengthens NOMCAARRD's mission to drive innovation and growth within the organization.
                </p>
              </div>
              <div id="intro-stakeholders">
                <h3>Stakeholders</h3>
                <p>
                  The Northern Mindanao Consortium for Agriculture, Aquatic and Natural Resources Research and Development (NOMCAARRD) is a collaborative organization consisting of 20 government and non-government entities in region 10.
                </p>
                <p>
                  These include educational institutions like Central Mindanao University (CMU), Xavier University (XU), and others, as well as government agencies like the Department of Agriculture Regional Field Office-10 (DA RFO-10) and the National Economic Development Authority-10 (NEDA-10). NOMCAARRD's main goal is to coordinate research, development, and extension efforts related to agriculture, fisheries, and natural resources in the region. Its office is situated at CMU.
                </p>
                <p>
                  NOOMCAARD is supported the development of the project. They are the stakeholders of the system. The system is tailored to the organizations' problems and needs.
                </p>
              </div>

            </section>
            <section id="dev">
              <h2>System Development</h2>
              <div id="dev-about">
                <h3>About the Capstone</h3>
                <p>
                  LINNKS is based on the capstone project entitled Interactive Data Mapping Distribution and Repository. The project was created by Khent Mark J. Dahay, Mereal Kate C. Silvestre and Jiu Axl R. Tabilla. These 3 students single-handedly documented, designed, and created the whole system.
                </p>
                <p>
                  The Interactive Data Mapping Distribution and Repository aims to digitize and centralize the storage of datasets collected by NOMCAARRD. This platform will enable organization members to establish repositories, categorize datasets into specific geographical areas on a map, and visualize data.
                </p>
                <p>
                  The project, NIDMDR, seeks to establish a comprehensive repository for datasets, accommodating various data types such as images, CSV files, and text documents. This repository will provide researchers and users with a centralized location to access and manage diverse datasets efficiently.
                </p>

              </div>
              <div id="dev-team">
                <h3>About the Developers</h3>
                <p>
                  The proponents of the project are Khent Mark J. Dahay, Mereal Kate C. Silvestre, and Jiu Axl R. Tabilla. These Software Development students dedicated to crafting innovative, user-centric digital solutions. With the utilization spanning various technologies and frameworks, we thrive on solving simple-complex challenges and delivering sensible user experiences.
                </p>
                <h3>Vision</h3>
                <p>
                  To create meaningful, high-quality software that empowers users and fosters growth in the digital space.
                </p>
                <h3>Core Values</h3>
                <ul>
                  <li>
                    <strong>Innovation:</strong> Continuously exploring new technologies to push the boundaries of what's possible.
                  </li>
                  <li>
                    <strong>Collaboration:</strong> Working closely with clients and users to ensure their needs are met with precision and care.
                  </li>
                  <li>
                    <strong>Excellence:</strong> Committing to the highest standards of quality in every project we undertake.
                  </li>
                </ul>
                <h3>The Team</h3>
                <ul>
                  <li>
                    <strong>Jiu Axl R. Tabilla</strong> Front-end Developer, focused on creating intuitive and visually appealing user interfaces.
                  </li>
                  <li>
                    <strong>Khent Mark J. Dahay:</strong> Back-end Developer, ensuring robust and scalable server-side logic.
                  </li>
                  <li>
                    <strong>Mereal Kate C. Silvestre:</strong>  Quality Assurance, ensures that the system works as expected to ensure performance and reliability.
                  </li>
                </ul>
              </div>
              <div id="dev-others">
                <h3>Other Contributors</h3>
                <p>
                  The project proponents—Khent Mark J. Dahay, Mereal Kate C. Silvestre, and Jiu Axl R. Tabilla—are passionate Software Development students dedicated to crafting innovative, user-centric digital solutions. With expertise spanning diverse technologies and frameworks, the team thrives on solving complex challenges while delivering exceptional user experiences.
                </p>
                <h3>Stakeholders</h3>
                <p>
                  The proponents extend their heartfelt gratitude to the stakeholders at <strong>NOMCAARRD</strong> for their valuable feedback and unwavering support, which were instrumental in shaping this project. Special recognition is given to the members of NOMCAARRD who actively participated in the testing phase, offering insights that ensured the system's functionality and usability.
                </p>
                <h3>Adviser</h3>
                <p>
                  Deep appreciation is given to <strong>Neil John J. Jomaya</strong>, the project's adviser, for his guidance, encouragement, and expertise throughout the development journey.
                </p>
                <h3>Consultant</h3>
                <p>
                  Gratitude is also extended to <strong>Rinante Buntod</strong> for providing invaluable consultations, significantly enriching the project's overall quality.
                </p>
                <h3>Panel Members</h3>
                <p>
                  Sincere appreciation is expressed to the panel members, <strong>Kent Levi A. Bonifacio</strong> and <strong>Donah Rae P. Verula</strong>, for their constructive feedback and recommendations, which played a crucial role in guiding the project toward improvement.
                </p>
              </div>

            </section>
            <section id="problem">
              <h2>Problem</h2>
              <div id="problem-repository">
                <h3>Storing and Sharing of Data</h3>
                <p>
                  Projects from each cluster under NOMCAARRD have been stored locally, resulting in several issues. Over the years, NOMCAARRD relied heavily on local storage solutions like flash drives, hard drives, and individual computers. Unfortunately, numerous project files and documentation have been lost due to hardware failures, such as broken or damaged computers.
                </p>
                <img class="developer-image" :src="p1Current"  alt="current-process-1"/>
                <p>
                  In addition to storage issues, the sharing of project updates and information lacked coordination and centralization. Updates were often communicated through messenger, a platform not designed for systematic data management or archiving. This decentralized approach not only made it difficult to track and retrieve essential documents but also increased the risk of data fragmentation and loss. The absence of a centralized system hindered collaboration, making it challenging for team members to access up-to-date information and maintain a consistent understanding of project progress.
                </p>
              </div>

              <div id="problem-access-control">
                <h3>Unwanted Access</h3>
                <p>
                  Preventing unauthorized access to files and data is crucial to avoid the leakage of sensitive information that should remain within the organization. Unfortunately, security measures for accessing and sharing data within NOMCAARRD were not fully implemented. The use of social media platforms, such as messenger, for transmitting data and information further exacerbated this issue, as these platforms support forwarding information to any individuals even outside the organization. This practice not only exposed sensitive information to potential breaches but also highlighted a significant gap in the organization’s data security infrastructure.
                </p>
                <img class="developer-image" :src="p2Current"  alt="current-process-2"/>
              </div>

              <div id="problem-tagging">
                <h3>Project and Area Association</h3>
                <p>
                  In line with preventing unwanted access, it is important to recognize that nearly all of the organization’s projects and data are assigned to specific clusters. Access to ongoing projects should be restricted to individuals within the relevant cluster to maintain confidentiality and protect sensitive information. The data of ongoing projects should be limited to members directly associated with the specific area until a careful decision is made about whether to share it more broadly—whether privately, within the organization, or publicly.
                </p>
                <p>
                  Furthermore, both ongoing and completed projects should be closely monitored to determine which specific area or cluster they belong to. This tracking not only ensures proper access control but also highlights the contributions of each cluster to the organization’s overall research and development efforts.
                </p>
              </div>

              <div id="problem-visualization">
                <h3>Visualizing Data</h3>
                <p>
                  Project data and information within the organization were primarily visualized using PowerPoint presentations or Excel spreadsheets. These tools were used to compile and present the results of various projects during organizational meetings and conferences. While effective for basic reporting, this approach has limitations in terms of dynamic data interaction and comprehensive analysis. The reliance on static presentations may hinder deeper insights and collaborative discussions, as the data is often presented in a one-dimensional format, lacking the flexibility needed for real-time exploration or detailed examination of trends and outcomes.
                </p>
              </div>

            </section>

            <section id="solution">
              <h2>Solution</h2>
              <div id="solution-repository">
                <h3>Repository Management</h3>
                <p>
                  To address the challenges of storing and sharing data and information across various parties, establishing a centralized repository is crucial. A well-organized repository will serve as a central hub where members of the organization can collaborate, share updates, and manage their projects efficiently. This centralized system will not only facilitate seamless collaboration among team members but also ensure that all project data is consistently monitored and updated in real time. By having a unified repository, the organization can improve data integrity, streamline project management, and enhance overall productivity, making it easier to track progress and ensure that all relevant stakeholders have access to the most up-to-date information.
                </p>
                <img class="developer-image" :src="p1Proposed"  alt="proposed-process-1"/>
              </div>
             <div id="solution-access-control">
               <h3>Access Control</h3>
               <p>
                 To prevent unauthorized access to data and information, each field within the repository should have an option to set its visibility level—whether it should be accessible to the public, limited to a specific group within the organization, or available to all members of the organization. By empowering the repository owner with the ability to control the visibility of each project, the organization can significantly reduce the risk of data breaches and prevent the leakage of sensitive information. This level of control ensures that only authorized individuals can access critical data, thereby maintaining the confidentiality and integrity of the organization’s projects.
               </p>
               <img class="developer-image" :src="p2Proposed"  alt="proposed-process-2"/>
             </div>
            <section id="solution-tagging">
              <h3>Sector Tagging</h3>
              <p>
                Sector tagging directly addresses the challenge of monitoring data within specific entities. By implementing sector tagging, each project is clearly associated with the relevant entity or sector, allowing for more effective tracking of progress and development within that specific area. This system not only enhances the ability to monitor contributions and advancements by individual sectors but also enables filtering of projects to display only those related to a particular sector. As a result, sector tagging facilitates more targeted analysis and reporting, ensuring that data management is both organized and efficient.
              </p>

            </section>
              <img class="developer-image" :src="p4Proposed"  alt="proposed-process-4"/>
            <section id="solution-visualization">
              <h3>Map Visualization</h3>
              <p>
                This platform provides map visualization capabilities, allowing users to visualize data and information for each project and repository geographically. Map visualization plays a crucial role in monitoring and tracking data related to specific locations where sectors have conducted their research and development activities. The map visualization module enables users to view repositories situated within designated areas, including predefined regions such as the provinces of Region X, as well as custom boundaries created by users. This feature enhances the ability to analyze geographic trends, assess the impact of projects in particular areas, and support strategic decision-making based on location-specific data.
              </p>
              <img class="developer-image" :src="p3Proposed"  alt="proposed-process-3"/>
            </section>
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
