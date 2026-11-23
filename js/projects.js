/**
 * MOHAMMED ASHAR - DYNAMIC PROJECTS ENGINE
 * Handles:
 * - Dynamic project data storage (LocalStorage + Remote JSON fallback)
 * - Rendering into projects.html (archive grid) and index.html (recent work grid)
 * - GitHub REST API integration for 1-click cloud sync to repository
 * - Full CRUD API for admin dashboard at /ashar35-access
 */

(function () {
  'use strict';

  // 14 Baseline projects from Mohammed Ashar's portfolio
  const DEFAULT_PROJECTS = [
    {
      id: "proj_1",
      title: "Innopix Studio",
      category: "wordpress",
      categoryLabel: "Wordpress",
      tags: "WordPress,Elementor Pro,ACF,Responsive,UI/UX,Branding",
      pills: ["WordPress", "Elementor Pro", "ACF", "Responsive"],
      description: "Complete custom WordPress development for a modern digital media and branding production studio. Built with bespoke Elementor Pro templates, Advanced Custom Fields (ACF) architecture, dynamic client showcases, and speed-optimized responsive styling.",
      url: "https://innopixstudio.com/",
      image: "assets/images/innopix-mockup.png",
      imageAlt: "Innopix Studio - Branding & Media Production Website",
      featured: true,
      createdAt: "2024-01-15T00:00:00.000Z"
    },
    {
      id: "proj_2",
      title: "Ashwini Digital Solutions",
      category: "wordpress",
      categoryLabel: "Wordpress",
      tags: "WordPress,Elementor,Responsive,Display Solutions,Smart Signage,UI/UX",
      pills: ["WordPress", "Elementor", "Display Tech", "Responsive"],
      description: "Commercial product catalog and corporate web platform showcasing smart digital displays, LED signage solutions, and interactive quotation workflows. Engineered with tailored layouts, clean typography, and search engine optimization.",
      url: "https://ashwinidigitalsolution.com/",
      image: "assets/images/ashwini-mockup.png",
      imageAlt: "Ashwini Digital Solutions - Smart Display Solutions Website",
      featured: true,
      createdAt: "2024-02-10T00:00:00.000Z"
    },
    {
      id: "proj_3",
      title: "Bellfabs Boilers",
      category: "wordpress",
      categoryLabel: "Wordpress",
      tags: "ACF,Elementor Pro,Dynamic,Industrial,Boilers,Engineering",
      pills: ["ACF", "Elementor Pro", "Engineering", "Industrial"],
      description: "Engineering and manufacturing web presence for an industrial steam boiler manufacturer. Features dynamic boiler model taxonomies, technical specifications tables, and automated quotation inquiry forms.",
      url: "https://bellfabsindia.com/",
      image: "assets/images/bellfabs-boilers-mockup.png",
      imageAlt: "Bellfabs Boilers - Industrial Steam Boilers Website",
      featured: true,
      createdAt: "2024-03-05T00:00:00.000Z"
    },
    {
      id: "proj_4",
      title: "Kids Nation Preschool",
      category: "wordpress",
      categoryLabel: "Wordpress",
      tags: "WordPress,Elementor,Education,Preschool,Admissions,Responsive",
      pills: ["WordPress", "Elementor", "Education", "Responsive"],
      description: "Vibrant, parent-friendly early childhood education academy website. Designed with friendly colors, structured age-group curriculum guides, photo galleries, and multi-step online admission inquiry forms.",
      url: "https://kidsnationpreschool.com/",
      image: "assets/images/kids-nation-mockup.png",
      imageAlt: "Kids Nation Preschool - Early Childhood Education Website",
      featured: true,
      createdAt: "2024-04-12T00:00:00.000Z"
    },
    {
      id: "proj_5",
      title: "Vine Info Tech",
      category: "wordpress",
      categoryLabel: "Wordpress",
      tags: "WordPress,Corporate,IT Solutions,Consulting,Tech Services,Responsive",
      pills: ["WordPress", "Corporate", "IT Services", "Speed Optimized"],
      description: "Corporate web platform for an information technology and consulting services firm. Built with modular service sections, enterprise software offerings, client case studies, and modern branding aesthetics.",
      url: "https://vineinfotech.com/",
      image: "assets/images/vineinfo-tech-mockup.png",
      imageAlt: "Vine Info Tech - Corporate IT Solutions Website",
      featured: false,
      createdAt: "2024-05-18T00:00:00.000Z"
    },
    {
      id: "proj_6",
      title: "Core Energy Solutions",
      category: "wordpress",
      categoryLabel: "Wordpress",
      tags: "Core Energy Solutions,CES,WordPress,Elementor Pro,Engineering,Industrial,Energy,products,Critical Industries",
      pills: ["WordPress", "Elementor Pro", "Industrial", "Engineering"],
      description: "Energy engineering portfolio and service catalog showcasing clean power generators, substations, and critical electrical engineering infrastructure projects with custom interactive request-a-quote flows.",
      url: "https://cescare.in/",
      image: "assets/images/ces-mockup.png",
      imageAlt: "Core Energy Solutions - Engineering & Energy Website",
      featured: false,
      createdAt: "2024-06-20T00:00:00.000Z"
    },
    {
      id: "proj_7",
      title: "First Frame Fourm (F3)",
      category: "wordpress",
      categoryLabel: "Wordpress",
      tags: "WordPress,Elementor,Media,Cinematography,Visual Arts,Portfolio",
      pills: ["WordPress", "Elementor", "Cinematography", "Media"],
      description: "Creative visual showcase and cinematography portfolio for film production and photography services. Featuring dark aesthetic design, fluid video showcases, and gallery lightboxes.",
      url: "https://firstframeforum.in/",
      image: "assets/images/f3-mockup.png",
      imageAlt: "First Frame Forum (F3) - Visual Arts & Media Production Website",
      featured: false,
      createdAt: "2024-07-08T00:00:00.000Z"
    },
    {
      id: "proj_8",
      title: "Popo Foods",
      category: "wordpress",
      categoryLabel: "Wordpress",
      tags: "WordPress,WooCommerce,Elementor,Food & Beverage,Snacks,Catalog",
      pills: ["WordPress", "WooCommerce", "Snacks Catalog", "Responsive"],
      description: "Vibrant FMCG product catalog showcasing healthy extruded snacks, puffs, and chips. Optimized for mobile consumers with product categorization and distribution inquiry forms.",
      url: "https://popofoods.in/",
      image: "assets/images/popo foods-mockup.png",
      imageAlt: "Popo Foods - FMCG Snacks & Food Products Website",
      featured: false,
      createdAt: "2024-08-14T00:00:00.000Z"
    },
    {
      id: "proj_9",
      title: "Boss ERP & Operations Dashboard",
      category: "dashboard",
      categoryLabel: "Dashboard UI",
      tags: "ERPNext,Frappe,Python,MariaDB,Operations,Dashboard UI,Supply Chain,Invoicing",
      pills: ["ERPNext", "Frappe Framework", "Dashboard UI", "Operations"],
      description: "Custom enterprise management dashboard developed with Frappe and ERPNext framework. Integrates inventory control, accounting ledgers, purchase order approvals, and real-time operational analytics.",
      url: "https://ashwinidigitalsolution.com/",
      image: "assets/images/boss-dashboard-mockup.png",
      imageAlt: "Boss ERP & Operations Dashboard - ERPNext Frappe Framework",
      featured: false,
      createdAt: "2024-09-01T00:00:00.000Z"
    },
    {
      id: "proj_10",
      title: "BNA - Business Network App Landing Page",
      category: "landingpage",
      categoryLabel: "Landing Page",
      tags: "WordPress,Elementor Pro,Landing Page,B2B,Networking,Lead Gen,Modern UI",
      pills: ["Wordpress", "Landing Page", "B2B Network", "Modern UI"],
      description: "High-conversion corporate landing page for a business networking application. Features interactive feature tours, member testimonials, pricing tier tables, and download call-to-actions.",
      url: "https://bna.co.in/",
      image: "assets/images/BNA-landing page.png",
      imageAlt: "BNA - Business Network App Landing Page",
      featured: false,
      createdAt: "2024-09-20T00:00:00.000Z"
    },
    {
      id: "proj_11",
      title: "BSS - Best Security Services Landing Page",
      category: "landingpage",
      categoryLabel: "Landing Page",
      tags: "WordPress,Landing Page,Security,Manned Guarding,Corporate Security,Elementor",
      pills: ["Wordpress", "Landing Page", "Security", "Lead Gen"],
      description: "Conversion-focused landing page for corporate and industrial security guard services. Highlights professional manned guarding, residential & corporate security showcases, and instant quotation inquiry funnels.",
      url: "https://bestsecurity.co/lp/securityservices/",
      image: "assets/images/BSS landing page.png",
      imageAlt: "BSS - Best Security Services Landing Page",
      featured: false,
      createdAt: "2024-10-05T00:00:00.000Z"
    },
    {
      id: "proj_12",
      title: "Smart Shelf Monitoring System",
      category: "aiml-iot",
      categoryLabel: "AI/ML & IOT",
      tags: "Python,YOLOv8,OpenCV,Streamlit,Computer Vision,Machine Learning,Deep Learning,AI/ML,Smart Shelf Monitoring",
      pills: ["AI/ML", "YOLOv8", "OpenCV", "Streamlit"],
      description: "AI-powered shelf detection system to monitor product availability in real-time. Built with YOLOv8, OpenCV, and Streamlit.",
      url: "assets/docs/PROJECT%20REPORT.pdf",
      image: "assets/images/Smart Shelf Monitoring System-mockup.png",
      imageAlt: "Smart Shelf Monitoring System - Real-Time YOLOv8 AI Detection",
      featured: false,
      createdAt: "2024-10-22T00:00:00.000Z"
    },
    {
      id: "proj_13",
      title: "Mobile Price Prediction Model",
      category: "aiml-iot",
      categoryLabel: "AI/ML & IOT",
      tags: "Python,Machine Learning,Streamlit,Scikit-Learn,Data Science,AI/ML,Predictive Modeling,Algorithms,Mobile Price Prediction",
      pills: ["AI/ML", "Python", "Scikit-Learn", "Streamlit"],
      description: "Interactive machine learning web application predicting mobile phone price valuations based on specifications like RAM, storage, battery, camera, and processor.",
      url: "https://mobilepriceprediction-lrrwrjddoffhfcyppkz9zc.streamlit.app/",
      image: "assets/images/mobile-price-prediction.png",
      imageAlt: "Mobile Price Prediction Model - Machine Learning Streamlit App",
      featured: false,
      createdAt: "2024-11-02T00:00:00.000Z"
    },
    {
      id: "proj_14",
      title: "Smart Environmental Monitoring & IoT Prototype",
      category: "aiml-iot",
      categoryLabel: "AI/ML & IOT",
      tags: "MicroPython,Raspberry Pi Pico,Arduino,Wokwi,IoT,Sensors,Embedded Systems,IOT,Hardware",
      pills: ["IOT", "MicroPython", "Raspberry Pi", "Wokwi"],
      description: "Embedded microcomputing prototype integrating ultrasonic distance sensors, environmental temperature/humidity telemetry, and cloud serial logging using Raspberry Pi Pico and MicroPython.",
      url: "https://github.com/mohammedashar35",
      image: "assets/images/IOT-mockup.png",
      imageAlt: "Smart Environmental Monitoring & IoT Telemetry System - Raspberry Pi Pico",
      featured: false,
      createdAt: "2024-11-15T00:00:00.000Z"
    }
  ];

  const STORAGE_KEY = 'ashar_portfolio_projects';
  const GITHUB_REPO = 'mohammedashar35/Mohammed-Ashar-Portfolio';
  const GITHUB_BRANCH = 'main';
  const GITHUB_PATH = 'data/projects.json';

  // Helper: Escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, function (tag) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag;
    });
  }

  // PortfolioProjects Core API
  const PortfolioProjects = {
    DEFAULT_PROJECTS: DEFAULT_PROJECTS,
    STORAGE_KEY: STORAGE_KEY,
    GITHUB_REPO: GITHUB_REPO,
    GITHUB_BRANCH: GITHUB_BRANCH,
    GITHUB_PATH: GITHUB_PATH,

    /**
     * Get all projects:
     * Checks localStorage first. If empty, tries data/projects.json, else DEFAULT_PROJECTS.
     */
    async getAll() {
      // 1. Check LocalStorage
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {
          console.warn('Failed to parse local projects:', e);
        }
      }

      // 2. Try fetching data/projects.json (from static server / GitHub Pages)
      try {
        const res = await fetch('data/projects.json?t=' + Date.now());
        if (res.ok) {
          const remoteData = await res.json();
          if (Array.isArray(remoteData) && remoteData.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
            return remoteData;
          }
        }
      } catch (err) {
        // Fallback for file:// or offline
      }

      // 3. Fallback to bundled defaults
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
      return DEFAULT_PROJECTS;
    },

    /**
     * Synchronous getter for immediate render from cache/defaults
     */
    getAllSync() {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        } catch (e) {}
      }
      return DEFAULT_PROJECTS;
    },

    /**
     * Save projects array to local storage and dispatch event
     */
    saveAll(projects) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      window.dispatchEvent(new CustomEvent('portfolioProjectsUpdated', { detail: projects }));
    },

    /**
     * Add a new project
     */
    add(projectData) {
      const projects = this.getAllSync();
      const newId = 'proj_' + Date.now();
      
      const pills = Array.isArray(projectData.pills) 
        ? projectData.pills 
        : (projectData.tags || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);

      const newProject = {
        id: newId,
        title: projectData.title || 'Untitled Project',
        category: projectData.category || 'wordpress',
        categoryLabel: projectData.categoryLabel || 'Wordpress',
        tags: projectData.tags || pills.join(','),
        pills: pills.slice(0, 5), // Keep top pills for card display
        description: projectData.description || '',
        url: projectData.url || '#',
        image: projectData.image || 'assets/images/ashar_logo.png',
        imageAlt: projectData.imageAlt || projectData.title,
        featured: Boolean(projectData.featured),
        createdAt: new Date().toISOString()
      };

      // Add to front of projects list
      projects.unshift(newProject);
      this.saveAll(projects);
      return newProject;
    },

    /**
     * Update an existing project
     */
    update(id, updatedFields) {
      const projects = this.getAllSync();
      const index = projects.findIndex(p => p.id === id);
      if (index === -1) return false;

      let pills = updatedFields.pills;
      if (!pills && updatedFields.tags) {
        pills = updatedFields.tags.split(',').map(s => s.trim()).filter(Boolean);
      } else if (!pills) {
        pills = projects[index].pills;
      }

      projects[index] = {
        ...projects[index],
        ...updatedFields,
        pills: pills.slice(0, 5),
        updatedAt: new Date().toISOString()
      };

      this.saveAll(projects);
      return projects[index];
    },

    /**
     * Delete a project by ID
     */
    delete(id) {
      const projects = this.getAllSync();
      const filtered = projects.filter(p => p.id !== id);
      if (filtered.length !== projects.length) {
        this.saveAll(filtered);
        return true;
      }
      return false;
    },

    /**
     * Toggle featured status
     */
    toggleFeatured(id) {
      const projects = this.getAllSync();
      const project = projects.find(p => p.id === id);
      if (project) {
        project.featured = !project.featured;
        this.saveAll(projects);
        return project.featured;
      }
      return false;
    },

    /**
     * Reset data to default 14 portfolio projects
     */
    resetToDefaults() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROJECTS));
      window.dispatchEvent(new CustomEvent('portfolioProjectsUpdated', { detail: DEFAULT_PROJECTS }));
      return DEFAULT_PROJECTS;
    },

    /**
     * Build HTML for projects.html Archive Card
     */
    createArchiveCardHtml(project) {
      const title = escapeHtml(project.title);
      const category = escapeHtml(project.category);
      const categoryLabel = escapeHtml(project.categoryLabel || category);
      const tags = escapeHtml(project.tags || (project.pills ? project.pills.join(',') : ''));
      const desc = escapeHtml(project.description || '');
      const url = escapeHtml(project.url || '#');
      const img = escapeHtml(project.image || 'assets/images/Ashar_logo.png');
      const imgAlt = escapeHtml(project.imageAlt || title);

      const pillsHtml = (project.pills || ['Project'])
        .map(p => `<span class="work-pill">${escapeHtml(p)}</span>`)
        .join('\n              ');

      return `
        <article class="project-archive-card" data-category="${category}" data-category-label="${categoryLabel}"
          data-title="${title}" data-tags="${tags}"
          data-desc="${desc}"
          data-url="${url}" data-id="${project.id}">

          <div class="project-card-media">
            <img src="${img}" alt="${imgAlt}" class="project-card-img" loading="lazy" onerror="this.onerror=null;this.src='assets/images/Ashar_logo.png';">
          </div>

          <div class="project-card-body">
            <div class="project-card-pills">
              ${pillsHtml}
            </div>

            <div class="project-card-title-row">
              <h2 class="project-card-title">${title}</h2>
              <span class="project-card-arrow" aria-hidden="true">
                <i class="bi bi-arrow-up-right"></i>
              </span>
            </div>

            <div class="project-card-actions">
              <a href="${url}" target="_blank" rel="noopener noreferrer"
                class="btn-project-visit btn-animation" title="Visit ${title} Live">
                <span class="btn-anim-text">Visit Live Site</span>
                <span class="btn-anim-icon btn-arrow-marquee" aria-hidden="true">
                  <i class="bi bi-box-arrow-up-right arrow-first"></i>
                  <i class="bi bi-box-arrow-up-right arrow-second"></i>
                </span>
              </a>
            </div>
          </div>
        </article>`;
    },

    /**
     * Build HTML for index.html Recent Work Card (Homepage)
     */
    createRecentWorkCardHtml(project) {
      const title = escapeHtml(project.title);
      const url = escapeHtml(project.url || '#');
      const img = escapeHtml(project.image || 'assets/images/Ashar_logo.png');
      const imgAlt = escapeHtml(project.imageAlt || title);

      const pillsHtml = (project.pills || ['Project'])
        .slice(0, 4)
        .map(p => `<span class="work-pill">${escapeHtml(p)}</span>`)
        .join('\n              ');

      return `
        <a href="${url}" target="_blank" rel="noopener noreferrer" class="recent-work-card"
          title="Open ${title} Website" data-id="${project.id}">
          <div class="recent-work-media-box">
            <img src="${img}" alt="${imgAlt}" class="recent-work-img" loading="lazy" onerror="this.onerror=null;this.src='assets/images/Ashar_logo.png';">
          </div>
          <div class="recent-work-info">
            <div class="recent-work-pills">
              ${pillsHtml}
            </div>
            <div class="recent-work-bottom-row">
              <h3 class="recent-work-name">${title}</h3>
              <span class="btn-project-visit btn-animation" aria-hidden="true">
                <span class="btn-anim-text">Visit Live Site</span>
                <span class="btn-anim-icon btn-arrow-marquee">
                  <i class="bi bi-box-arrow-up-right arrow-first"></i>
                  <i class="bi bi-box-arrow-up-right arrow-second"></i>
                </span>
              </span>
            </div>
          </div>
        </a>`;
    },

    /**
     * Render projects to projects.html Grid
     */
    renderArchiveGrid(containerEl, projects) {
      if (!containerEl) return;
      containerEl.innerHTML = projects.map(p => this.createArchiveCardHtml(p)).join('\n');
      
      // Update count badge
      const countEl = document.getElementById('visibleProjectsCount');
      if (countEl) {
        countEl.textContent = projects.length;
      }

      // Re-trigger project filtering if main.js filter function exists
      if (typeof window.filterProjects === 'function') {
        window.filterProjects();
      }
    },

    /**
     * Render projects to index.html Recent Work Grid (homepage)
     */
    renderRecentWorkGrid(containerEl, projects) {
      if (!containerEl) return;
      // Show featured projects, or first 4 projects if none marked featured
      let featured = projects.filter(p => p.featured);
      if (featured.length === 0) {
        featured = projects.slice(0, 4);
      }
      containerEl.innerHTML = featured.map(p => this.createRecentWorkCardHtml(p)).join('\n');
    },

    /**
     * Direct GitHub REST API Sync
     * Commits the current projects directly to GitHub repository:
     * https://github.com/mohammedashar35/Mohammed-Ashar-Portfolio
     */
    async syncToGitHub(token, repo = GITHUB_REPO, branch = GITHUB_BRANCH) {
      if (!token) {
        throw new Error('GitHub Personal Access Token is required to commit changes to GitHub.');
      }

      const projects = this.getAllSync();
      const contentStr = JSON.stringify(projects, null, 2);
      
      // UTF-8 to Base64
      const base64Content = btoa(unescape(encodeURIComponent(contentStr)));
      const apiUrl = `https://api.github.com/repos/${repo}/contents/${GITHUB_PATH}`;

      // Step 1: Get existing file SHA if present
      let fileSha = null;
      try {
        const getRes = await fetch(`${apiUrl}?ref=${branch}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (getRes.ok) {
          const fileData = await getRes.json();
          fileSha = fileData.sha;
        }
      } catch (err) {
        console.warn('Could not fetch existing file SHA, will attempt create:', err);
      }

      // Step 2: PUT updated file content to GitHub
      const bodyPayload = {
        message: `Update portfolio projects via Admin Dashboard [skip ci]`,
        content: base64Content,
        branch: branch
      };

      if (fileSha) {
        bodyPayload.sha = fileSha;
      }

      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyPayload)
      });

      if (!putRes.ok) {
        const errData = await putRes.json().catch(() => ({}));
        throw new Error(errData.message || `GitHub API error: ${putRes.status} ${putRes.statusText}`);
      }

      const result = await putRes.json();
      return result;
    }
  };

  // Expose to window
  window.PortfolioProjects = PortfolioProjects;

  // Auto-render on DOM ready if containers exist
  document.addEventListener('DOMContentLoaded', async function () {
    const archiveGrid = document.getElementById('projectsGrid');
    const recentWorkGrid = document.getElementById('recentWorkGrid');

    if (archiveGrid || recentWorkGrid) {
      const projects = await PortfolioProjects.getAll();

      if (archiveGrid) {
        PortfolioProjects.renderArchiveGrid(archiveGrid, projects);
      }

      if (recentWorkGrid) {
        PortfolioProjects.renderRecentWorkGrid(recentWorkGrid, projects);
      }
    }
  });

  // Re-render when projects are updated from Admin Dashboard
  window.addEventListener('portfolioProjectsUpdated', function (e) {
    const projects = e.detail;
    const archiveGrid = document.getElementById('projectsGrid');
    const recentWorkGrid = document.getElementById('recentWorkGrid');

    if (archiveGrid) {
      PortfolioProjects.renderArchiveGrid(archiveGrid, projects);
    }
    if (recentWorkGrid) {
      PortfolioProjects.renderRecentWorkGrid(recentWorkGrid, projects);
    }
  });

})();
