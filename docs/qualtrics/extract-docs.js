// Script to extract Qualtrics documentation content
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Load URLs
const urls = JSON.parse(fs.readFileSync('urls.json', 'utf8'));

// URLs already processed
const processed = ['multiple-choice', 'text-entry', 'descriptive-text'];

// Remaining URLs
const remaining = urls.filter(item => !processed.includes(item.slug));

async function extractContent(page) {
  try {
    // Wait for content to load
    await page.waitForSelector('#main > div > div > article > section.main-content-area', { timeout: 10000 });
    
    // Extract content
    const content = await page.evaluate(() => {
      const contentArea = document.querySelector('#main > div > div > article > section.main-content-area');
      if (!contentArea) return null;
      
      const result = {
        title: '',
        sections: []
      };
      
      // Get title
      const h1 = contentArea.querySelector('h1');
      if (h1) result.title = h1.innerText.trim();
      
      // Get main content sections
      const elements = contentArea.querySelectorAll('h2, h3, p, ul, ol');
      let currentSection = null;
      
      elements.forEach(el => {
        if (el.tagName === 'H2') {
          currentSection = {
            title: el.innerText.trim(),
            content: []
          };
          result.sections.push(currentSection);
        } else if (currentSection) {
          if (el.tagName === 'H3') {
            currentSection.content.push(`### ${el.innerText.trim()}`);
          } else if (el.tagName === 'P') {
            currentSection.content.push(el.innerText.trim());
          } else if (el.tagName === 'UL' || el.tagName === 'OL') {
            const items = Array.from(el.querySelectorAll('li')).map(li => `- ${li.innerText.trim()}`);
            currentSection.content.push(...items);
          }
        }
      });
      
      return result;
    });
    
    return content;
  } catch (error) {
    console.error('Error extracting content:', error);
    return null;
  }
}

async function processUrl(browser, urlInfo) {
  const page = await browser.newPage();
  
  try {
    console.log(`Processing: ${urlInfo.title}`);
    
    // Navigate to URL
    await page.goto(urlInfo.url, { waitUntil: 'networkidle2' });
    
    // Extract content
    const content = await extractContent(page);
    
    if (content) {
      // Format as markdown
      let markdown = `# ${content.title || urlInfo.title}\n\n`;
      
      content.sections.forEach(section => {
        markdown += `## ${section.title}\n\n`;
        markdown += section.content.join('\n\n') + '\n\n';
      });
      
      // Save to file
      const filename = `${urlInfo.slug}.md`;
      fs.writeFileSync(filename, markdown);
      console.log(`Saved: ${filename}`);
    }
    
    // Wait before next request
    await new Promise(resolve => setTimeout(resolve, 5000));
    
  } catch (error) {
    console.error(`Error processing ${urlInfo.title}:`, error);
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  
  try {
    for (const urlInfo of remaining) {
      await processUrl(browser, urlInfo);
    }
  } finally {
    await browser.close();
  }
}

main().catch(console.error);