<script setup lang="ts">
// @ts-nocheck
import {onMounted, onUnmounted, ref} from 'vue';
import Navbar from "../components/Landing/Navbar.vue";
import auth from "../../../assets/helpcenter/auth.png"
import dashboard from "../../../assets/helpcenter/dashboard.png"
import mapping from "../../../assets/helpcenter/mapping.png"
import newRepo1 from "../../../assets/helpcenter/newRepo1.png"
import newRepo2 from "../../../assets/helpcenter/newRepo2.png"
import org from "../../../assets/helpcenter/org.png"
import org2 from "../../../assets/helpcenter/org2.png"
import orgNew from "../../../assets/helpcenter/orgNew.png"
import orgRoles from "../../../assets/helpcenter/orgRoles.png"
import repo from "../../../assets/helpcenter/repo.png"
import repoDetails from "../../../assets/helpcenter/repoDetails.png"
import repoTopics from "../../../assets/helpcenter/repoTopics.png"
import repoTopics2 from "../../../assets/helpcenter/repoTopics2.png"
import tag1 from "../../../assets/helpcenter/tag1.png"
import tag2 from "../../../assets/helpcenter/tag1.png"
import LINNKSFooter from "../components/LINNKSFooter.vue";

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
                  <li><a href="#intro-about">About this Page</a></li>
                </ul>
              </li>
              <li>
                <a href="#auth">Authentication</a>
              </li>
              <li>
                <a href="#dashboard">Dashboard</a>
              </li>
              <li>
                <a href="#repo">Repository Management</a>
                <ul>
                  <li><a href="#repo-new">Creating a New Repository</a></li>
                  <li><a href="#repo-details">Repository Details</a></li>
                  <li><a href="#repo-discuss">Repository Discussions</a></li>
                </ul>
              </li>
              <li>
                <a href="#mapping">Mapping</a>
              </li>
              <li>
                <a href="#sector">Sector Tagging</a>
              </li>
              <li>
                <a href="#org">Organization Management</a>
                <ul>
                  <li><a href="#org-new">Creating New Organization</a></li>
                  <li><a href="#org-access">Organization Access Roles</a></li>
                </ul>
              </li>
              <li>
                <a href="#faqs">Frequently Asked Questions</a>
<!--                <ul>-->
<!--                  <li><a href="#faq1">Public Module</a></li>-->
<!--                  <li><a href="#faq2">Requesting Access</a></li>-->
<!--                </ul>-->
              </li>
            </ul>
            <svg class="toc-marker" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
              <path stroke="#444" stroke-width="3" fill="transparent" stroke-dasharray="0, 0, 0, 1000" stroke-linecap="round" stroke-linejoin="round" transform="translate(-0.5, -0.5)" />
            </svg>
          </nav>

          <article class="contents">
            <p class="text-h4 font-weight-bold">Help Center</p>
            <section id="intro">
              <h2>Introduction</h2>
              <div id="intro-about">
                <h3>About this Page</h3>
                <p>
                  This page will guide NOMCAARRD members in navigating the system and interacting with it daily. It will highlight the main features and provide tips on how to maximize and utilize these features to assist with their everyday tasks.
                </p>
              </div>
            </section>
            <section id="auth">
              <h2>Authentication</h2>
              <div>
                <p>
                  The authentication page of the study features two buttons for users to authenticate via their Google and GitHub accounts exclusively. The system restricts authentication to only these two providers to avoid multiple and dummy user accounts.
                </p>
                <img class="developer-image" :src="auth"  alt="auth"/>
              </div>
            </section>
            <section id="dashboard">
              <h2>Dashboard</h2>
              <div>
                <p>
                  The system's primary layout is divided into three sections: the main content area, the sidebar, and the top bar. The main content area dynamically adjusts based on the selected route, such as the dashboard, where users can monitor the status of sectors, repositories, and current organization members within their respective organizations. Additionally, it enables users to browse the latest repositories uploaded or created on the platform and provides an option to easily tag sectors for the organization’s existing repositories.
                </p>
                <img class="developer-image" :src="dashboard"  alt="dashboard"/>
                <p>
                  The top bar includes essential components such as the notification icon, account menu, and organization dropdown. The sidebar serves as the primary navigation hub, offering quick access to key functionalities, including repository management, sector tagging, map visualization, organization settings, and the sign-out option.
                </p>
              </div>
            </section>
            <section id="repo">
              <h2>Repository Management</h2>
              <div>
                <p>
                  On this page, users can view all repositories created within the organization. Additionally, they have the option to add new repositories using a designated button. To facilitate efficient navigation and retrieval, users can filter repositories by utilizing the search input or by selecting tag chips displayed below the search input.
                </p>
                <img class="developer-image" :src="repo"  alt="current-process-1"/>
              </div>
              <div id="repo-new">
                <h3>Creating a New Repository</h3>
                <p>
                  To create a new repository, simply click the "New Repository" button, which will direct you to the repository creation page. This page includes various fields that can be filled out, such as repository title, subtitle, project component, location, abstract, affiliation, tags, and file uploads. Some of these fields are optional, allowing users flexibility in the information they provide. Additionally, there are buttons available for selecting commodity, industry, and the start and end dates of the project.
                </p>
                <img class="developer-image" :src="newRepo1"  alt="current-process-1"/>
                <p>
                  An important feature of the repository creation process is the selection of the access level. Users can choose from three levels: public (including guest view), within the organization (accessible only to members of the repository owner’s organization), or within all organizations (visible to all members of any organization).
                </p>
                <img class="developer-image" :src="newRepo2"  alt="current-process-1"/>
              </div>

              <div id="repo-details">
                <h3>Repository Details</h3>
                <p>
                  While browsing the repository page, users have the option to view the details of a specific repository by clicking the "View Details" button. This action will direct the user to a page with more comprehensive information about the repository, including its abstract, findings, tags, and any files attached. If the repository owner has set the repository to be downloadable, the attached files will be accessible for download.
                </p>
                <img class="developer-image" :src="repoDetails"  alt="current-process-2"/>
              </div>

              <div id="repo-discuss">
                <h3>Repository Discussions</h3>
                <p>
                  The repository includes a discussion section where users can initiate threads or topics to discuss comments or issues related to the specific repository.
                </p>
                <img class="developer-image" :src="repoTopics"  alt="current-process-2"/>
                <img class="developer-image" :src="repoTopics2"  alt="current-process-2"/>
              </div>
            </section>
            <section id="mapping">
              <h2>Mapping</h2>
              <div>
                <p>
                  The Mapping menu provides a visualization of provinces, sectors, and organizations. When a user selects a specific province or sector, the menu displays an overview along with the repositories available or associated with that particular area. Similarly, selecting an organization allows users to locate its physical location and view an overview of the organization, as well as the repositories linked to it.
                </p>
                <img class="developer-image" :src="mapping"  alt="current-process-2"/>
              </div>
            </section>
            <section id="sector">
              <h2>Sector Tagging</h2>
              <div>
                <p>
                  The sector tagging menu features a map that allows users to create new sectors for tagging their repositories or to view existing available sectors. The sectors are categorized into two main types: "Sectors" (representing the locations where projects are based) and "Organization" (indicating the headquarters or base of the organization). Additionally, the menu includes a filter option that enables users to refine the map visualization based on specific sectors.
                </p>
                <img class="developer-image" :src="tag1"  alt="current-process-2"/>
                <p>
                  Additionally, when adding new sectors, users can choose whether to import a GeoJson file or directly draw boundaries on the map.
                </p>
                <img class="developer-image" :src="tag2"  alt="current-process-2"/>
              </div>
            </section>
            <section id="org">
              <h2>Organization Management</h2>
              <div>
                <p>
                  The organization bar allows users to navigate through different available organizations, where they can select and view detailed information about each one. There is also a button for creating a new organization and a search feature for finding existing organizations.
                </p>
                <img class="developer-image" :src="org"  alt="current-process-2"/>
                <p>
                  When selecting or viewing an organization, users will be presented with an overview that includes the organization’s address, consortium type, cluster representatives, and the repositories associated with that organization.
                </p>
                <img class="developer-image" :src="org2"  alt="current-process-2"/>
              </div>
              <div id="org-new">
                <h3>Creating New Organization</h3>
                <p>
                  When creating a new organization, the creator has the option to specify whether it is an agency or institution. They will need to input the organization's name, description, address, president, contact information, and details for the organization's representatives. Additionally, there is an option to upload a logo or relevant image for the organization. Creators can also directly attach a GeoJSON file or draw the boundary for the organization.
                </p>
                <img class="developer-image" :src="orgNew"  alt="current-process-2"/>
              </div>
              <div id="org-access">
                <h3>Organization Access Roles</h3>
                <p>
                  The organization owner or creator has comprehensive management capabilities for their organization. They can update any details related to the organization, ensuring that information remains current and accurate. In addition, the owner can manage membership by adding new members to the organization. When adding members, the owner can assign specific access levels to each individual, which include read-only access for viewing information without making changes, moderate access for limited editing capabilities, and full access control for complete administrative authority. This allows for tailored management and control based on the roles and responsibilities of each member within the organization.
                </p>
                <img class="developer-image" :src="orgRoles"  alt="proposed-process-2"/>
              </div>
            </section>
            <section id="faqs">
              <h2>Frequently Asked Questions</h2>
              <div id="">
                <h3>Can I Access Information and Repositories Without an Account?</h3>
                <p>
                  You can browse the platform’s map to explore publicly available information without needing to register an account.
                </p>
              </div>
              <div id="">
                <h3>How Can I Request Access to a Specific Repository?</h3>
                <p>
                  To request access to a specific repository, ensure you are logged in with your authenticated account. Navigate to the repository you wish to access, and you will find an option to request access. The request will be reviewed by the repository owner or administrator, and you will be notified once access is granted.
                </p>
              </div>
            </section>
          </article>
        </div>
      </VContainer>
      <LINNKSFooter/>
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
