const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

// List of remaining URLs to process
const remainingUrls = [
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

  for (const item of remainingUrls) {
    console.log(`Processing ${item.name}...`);
    
    try {
      // Navigate to the page
      await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      
      // Wait a bit for content to load
      await page.waitForTimeout(5000);
      
      // Extract text content
      const content = await page.evaluate(() => {
        const mainContent = document.querySelector('#main > div > div > article > section.main-content-area');
        if (!mainContent) return 'Content not found';
        return mainContent.innerText || mainContent.textContent || 'No text content found';
      });
      
      // Extract title
      const title = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        return h1 ? h1.innerText : 'Question Type';
      });
      
      // Create markdown content
      let markdown = `# ${title}\n\n`;
      
      // Process the content - split by lines and format
      const lines = content.split('\n');
      let currentSection = '';
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        
        // Check if it's a heading (usually in uppercase)
        if (trimmed === trimmed.toUpperCase() && trimmed.length > 3 && !trimmed.includes('?')) {
          markdown += `\n## ${trimmed.charAt(0) + trimmed.slice(1).toLowerCase()}\n\n`;
        } else {
          markdown += `${trimmed}\n\n`;
        }
      }
      
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
  console.log('Extraction complete!');
}

extractContent().catch(console.error);