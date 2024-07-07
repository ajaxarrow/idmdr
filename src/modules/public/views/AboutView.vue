<script setup lang="ts">
import { onMounted, ref } from 'vue';
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
                  <li><a href="#intro-project">About the Project</a></li>
                  <li><a href="#intro-stakeholders">Stakeholders</a></li>
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
            <p class="text-h4 font-weight-bold">About IDMDR</p>
            <section id="intro">
              <h2>Introduction</h2>
              <div id="intro-project">
                <h3>About the Project</h3>
                <p>
                  The Interactive Data Mapping Distribution and Repository aims to digitize and centralize the storage of datasets collected by NOMCAARRD. This platform will enable organization members to establish repositories, categorize datasets into specific geographical areas on a map, and visualize data.
                </p>
                <p>
                  The project, NIDMDR, seeks to establish a comprehensive repository for datasets, accommodating various data types such as images, CSV files, and text documents. This repository will provide researchers and users with a centralized location to access and manage diverse datasets efficiently.
                </p>
                <p>
                  The project was created by Khent Mark J. Dahay, Mereal Kate C. Silvestre and Jiu Axl R. Tabilla. These 3 students single-handedly documented, designed, and created the whole system.
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
            <section id="problem">
              <h2>Problem</h2>
              <div id="problem-repository">
                <h3>Storing and Sharing of Data</h3>
                <p>
                  The Slides editor has a developer mode which is useful if you know a bit of HTML and CSS. With this mode active you will be able to modify the underlying HTML of your deck, allowing you to make adjustments that the Slides editor does not provide interface options for.
                </p>
                <p>
                  To enable the developer mode open the editor settings in the bottom left corner:
                </p>
              </div>

              <div id="problem-access-control">
                <h3>Unwanted Access</h3>
                <p>
                  The per-slide HTML editor can be accessed from the slide options area. It gives you raw access to the current slide's HTML, allowing you to change anything you like. Note that some elements, such as <code>&lt;script&gt;</code> and <code>&lt;link&gt;</code>, are not allowed for security reasons.﻿
                </p>
                <img class="developer-image" src="https://s3.amazonaws.com/static.slid.es/site/developers/slides-developer-mode-2.png" />
              </div>

              <div id="problem-tagging">
                <h3>Project and Area Association</h3>
                <p>
                  As a paying Slides customer you have access to the <a href="#css">CSS editor</a> which allows you to add custom styles to your deck. By turning on the developer mode a new "class name" field will appear for any block that you focus. This allows you to easily target a specific element with your CSS.
                </p>
                <p>
                  Here's an example that defines an "upside-down" class using custom CSS and applies it to a text block.
                </p>
                <pre class="code-block" data-highlight-theme="github-gist"><code class="hljs css">.upside-down {
  transform: scale(1, -1);
}</code></pre>
                <img class="developer-image" src="https://s3.amazonaws.com/static.slid.es/site/developers/slides-developer-mode-3.png" />
              </div>

              <div id="problem-visualization">
                <h3>Visualizing Data</h3>
                <p>
                  Just like you can add custom classes to individual elements it's also possible to add custom classes at the slide level. This can be used to apply broader changes to the whole slide like inverting text and icon colors or changing the slide transition.
                </p>
                <img class="developer-image" src="https://s3.amazonaws.com/static.slid.es/site/developers/slides-developer-mode-4.png" />
                <p>
                  Under the hood the slide background element is separate from the slide itself. Here are two examples showing how you'd target the slide contents or slide background using a custom class called "night-sky":
                </p>
                <img class="developer-image" src="https://s3.amazonaws.com/static.slid.es/site/developers/slides-developer-mode-5.png" />
              </div>

            </section>

            <section id="solution">
              <h2>Solution</h2>
              <div id="solution-repository">
                <h3>Repository Management</h3>
                <p>
                  You can access the complete HTML for all slides in your deck inside of the export panel, under "Export to reveal.js"﻿. This provides a way of exporting your deck markup and the core Slides styles to reveal.js. There are a few limitations with exporting this way but it should provide a good starting point.
                </p>
                <img class="developer-image" src="https://s3.amazonaws.com/static.slid.es/site/developers/slides-developer-mode-6.png" />
              </div>
             <div id="solution-access-control">
               <h3>Access Control</h3>
               <p>
                 The CSS editor lets you author custom styles for your presentation with a real-time preview of the result. It's available as an option inside of the Style panel of the presentation editor.
               </p>
               <p>
                 The editor preprocesses styles using <a href="http://lesscss.org/">LESS</a>, though you're free to write plain CSS as well. We apply the styles in real-time as you type so there's no need to leave the editor or even press a refresh button to see what you're getting. Note that when your styles are saved they will be automatically wrapped in a ".reveal {}" selector to avoid conflicts with other page styles.
               </p>
             </div>
            <section id="solution-tagging">
              <h3>Sector Tagging</h3>
              <p>
                If you turn on the <a href="#dev">developer mode</a> you can also add custom classes to any focused element. This is a convenient way to easily apply your CSS to specific elements.
              </p>
            </section>

            <section id="solution-visualization">
              <h3>Map Visualization</h3>

              <p>
                All of the above is scoped to your specific presentation and won't affect other presentations or the site in general.
              </p>
              <p>
                In this example we are changing the text color and adding a border to all slides. Here's how it looks when combined with a <a href="http://slides.com/november-media/dev-zenith/export?autosize=1">default theme</a>.
              </p>
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
    margin: 30px 0;
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
