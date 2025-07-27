const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');
const TurndownService = require('turndown');

// Initialize Turndown for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced'
});

// Custom rule to handle images with local paths
turndownService.addRule('images', {
  filter: 'img',
  replacement: function(content, node) {
    const alt = node.alt || '';
    const src = node.src || '';
    if (src) {
      // Extract filename from URL
      const filename = src.split('/').pop();
      // Use local path structure
      const folder = node.closest('h1')?.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'images';
      return `![${alt}](${folder}/${filename})`;
    }
    return '';
  }
});

// List of URLs to process
const urls = [
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/standard-content/multiple-choice/?parent=p001132", name: "multiple-choice" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/standard-content/text-entry/?parent=p001132", name: "text-entry" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/static-content/descriptive-text-and-graphic/?parent=p001131", name: "descriptive-text" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/standard-content/matrix-table/?parent=p001132", name: "matrix-table" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/standard-content/form-field-question/?parent=p001132", name: "form-field" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/standard-content/calendar-question/", name: "calendar" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/standard-content/slider/?parent=p001132", name: "slider" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/standard-content/rank-order/?parent=p001132", name: "rank-order" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/standard-content/side-by-side/?parent=p001132", name: "side-by-side" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/specialty-questions/net-promoter-score/", name: "net-promoter-score" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/advanced/timing/?parent=p001134", name: "timing" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/specialty-questions/graphic-slider/", name: "graphic-slider" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/specialty-questions/constant-sum/?parent=p001133", name: "constant-sum" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/advanced/file-upload/", name: "file-upload" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/specialty-questions/pick-group-and-rank/?parent=p001133", name: "pick-group-and-rank" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/specialty-questions/drill-down/", name: "drill-down" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/specialty-questions/signature/", name: "signature" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/specialty-questions/heat-map/", name: "heat-map" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/specialty-questions/hot-spot/", name: "hot-spot" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/advanced/meta-info-question/?parent=p001134", name: "meta-info" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/advanced/captcha-verification/", name: "captcha" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/specialty-questions/highlight/", name: "highlight" },
  { url: "https://www.qualtrics.com/support/website-app-feedback/common-use-cases/screen-capture/?parent=p002057", name: "screen-capture" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/specialty-questions/video-response-question/", name: "video-response" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/specialty-questions/unmoderated-user-testing-question/", name: "unmoderated-user-testing" },
  { url: "https://www.qualtrics.com/support/common-use-case/analyzing-results/corexm-analysis/location-data/#LocationSelectorQuestion", name: "location-selector" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/advanced/arcgis-map-question/", name: "arcgis-map" },
  { url: "https://www.qualtrics.com/support/integrations/online-reputation-management/solicit-reviews-question/", name: "solicit-reviews" },
  { url: "https://www.qualtrics.com/support/survey-platform/survey-module/editing-questions/question-types-guide/specialty-questions/tree-testing-question/", name: "tree-testing" }
];

async function extractContent() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  for (const item of urls) {
    console.log(`\nProcessing ${item.name}...`);
    
    try {
      // Navigate to the page
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      
      // Wait for content to load
      await page.waitForTimeout(5000);
      
      // Get the page title
      const title = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        return h1 ? h1.innerText : 'Question Type';
      });
      
      // Get the number of sections
      const sectionCount = await page.evaluate(() => {
        const mainContent = document.querySelector('#main > div > div > article > section.main-content-area');
        if (!mainContent) return 0;
        return mainContent.querySelectorAll('section').length;
      });
      
      console.log(`  Found ${sectionCount} sections`);
      
      // Start with the title
      let markdown = `# ${title}\n\n`;
      
      // Extract each section
      for (let i = 0; i < sectionCount; i++) {
        console.log(`  Extracting section ${i + 1}/${sectionCount}...`);
        
        const sectionHtml = await page.evaluate((index) => {
          const mainContent = document.querySelector('#main > div > div > article > section.main-content-area');
          if (!mainContent) return '';
          
          const sections = mainContent.querySelectorAll('section');
          if (sections[index]) {
            // Fix image URLs to be absolute
            const section = sections[index].cloneNode(true);
            section.querySelectorAll('img').forEach(img => {
              if (img.src && !img.src.startsWith('http')) {
                img.src = new URL(img.src, window.location.href).href;
              }
            });
            return section.outerHTML;
          }
          return '';
        }, i);
        
        if (sectionHtml) {
          // Convert HTML to Markdown
          const sectionMarkdown = turndownService.turndown(sectionHtml);
          markdown += sectionMarkdown + '\n\n';
        }
      }
      
      // Clean up the markdown
      markdown = markdown
        .replace(/Was this helpful\?YesNo/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      
      // Save the markdown file
      const outputPath = path.join('question-types-doc', `${item.name}.md`);
      await fs.writeFile(outputPath, markdown);
      
      console.log(`✓ Saved ${item.name}.md`);
      
      // Wait between requests
      await page.waitForTimeout(5000);
      
    } catch (error) {
      console.error(`✗ Error processing ${item.name}:`, error.message);
    }
  }
  
  await browser.close();
  console.log('\nExtraction complete!');
}

extractContent().catch(console.error);