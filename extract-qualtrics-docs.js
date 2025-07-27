const { chromium } = require('playwright');
const TurndownService = require('turndown');
const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const http = require('http');

// Initialize Turndown for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  codeBlockStyle: 'fenced'
});

// Add custom rules for better conversion
turndownService.addRule('qtip', {
  filter: (node) => {
    return node.className && node.className.includes('qtip');
  },
  replacement: (content) => {
    return `> **Qtip:** ${content}\n`;
  }
});

// Function to download image
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = require('fs').createWriteStream(filepath);
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filepath}`);
        resolve();
      });
    }).on('error', (err) => {
      require('fs').unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Function to extract filename from URL
function getImageFilename(url, index) {
  const urlParts = url.split('/');
  let filename = urlParts[urlParts.length - 1].split('?')[0];
  
  // If no extension, add .png
  if (!filename.includes('.')) {
    filename += '.png';
  }
  
  // If filename is too generic, use index
  if (filename === 'image.png' || filename === '') {
    filename = `image-${index}.png`;
  }
  
  return filename;
}

// Main extraction function
async function extractQuestionType(browser, urlInfo, index) {
  console.log(`\nProcessing ${index + 1}/30: ${urlInfo.name}`);
  
  const page = await browser.newPage();
  
  try {
    // Navigate to the page
    console.log(`Navigating to: ${urlInfo.url}`);
    await page.goto(urlInfo.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait for main content to load
    await page.waitForSelector('#main > div > div > article > section.main-content-area', { timeout: 60000 });
    
    // Close cookie banner if present
    try {
      await page.click('button:has-text("Accept all")', { timeout: 5000 });
    } catch (e) {
      // Cookie banner might not be present
    }
    
    // Extract content
    const content = await page.evaluate(() => {
      const mainContent = document.querySelector('#main > div > div > article > section.main-content-area');
      if (!mainContent) return null;
      
      // Get the page title
      const title = document.querySelector('h1')?.textContent || 'Unknown Question Type';
      
      // Clone the content to avoid modifying the original
      const contentClone = mainContent.cloneNode(true);
      
      // Remove "Was this helpful?" sections
      contentClone.querySelectorAll('[id*="helpful"], .helpful-section, .feedback-section').forEach(el => el.remove());
      
      // Get all images in the content
      const images = [];
      contentClone.querySelectorAll('img').forEach((img, index) => {
        const src = img.src || img.getAttribute('data-src');
        if (src && !src.includes('data:image')) {
          images.push({
            src: src.startsWith('http') ? src : `https://www.qualtrics.com${src}`,
            alt: img.alt || `Image ${index + 1}`
          });
        }
      });
      
      return {
        title,
        html: contentClone.innerHTML,
        images
      };
    });
    
    if (!content) {
      throw new Error('Could not extract content from page');
    }
    
    // Create directories
    const baseDir = path.join('question-types-doc');
    const imageDir = path.join(baseDir, urlInfo.name);
    
    await fs.mkdir(baseDir, { recursive: true });
    await fs.mkdir(imageDir, { recursive: true });
    
    // Download images and update HTML
    let updatedHtml = content.html;
    for (let i = 0; i < content.images.length; i++) {
      const img = content.images[i];
      const filename = getImageFilename(img.src, i + 1);
      const localPath = path.join(urlInfo.name, filename);
      const fullPath = path.join(imageDir, filename);
      
      try {
        await downloadImage(img.src, fullPath);
        // Update HTML to use local path
        updatedHtml = updatedHtml.replace(
          new RegExp(img.src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          `./${localPath}`
        );
      } catch (err) {
        console.error(`Failed to download image: ${img.src}`, err.message);
      }
    }
    
    // Convert to Markdown
    let markdown = `# ${content.title}\n\n`;
    markdown += turndownService.turndown(updatedHtml);
    
    // Clean up markdown
    markdown = markdown
      .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
      .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
      .trim();
    
    // Save markdown file
    const mdPath = path.join(baseDir, `${urlInfo.name}.md`);
    await fs.writeFile(mdPath, markdown, 'utf8');
    console.log(`Created: ${mdPath}`);
    
    // Take screenshot for validation
    const screenshotPath = path.join(imageDir, 'page-screenshot.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved: ${screenshotPath}`);
    
    await page.close();
    return { success: true, name: urlInfo.name };
    
  } catch (error) {
    console.error(`Error processing ${urlInfo.name}:`, error.message);
    await page.close();
    return { success: false, name: urlInfo.name, error: error.message };
  }
}

// Main function
async function main() {
  console.log('Starting Qualtrics documentation extraction...');
  
  // Read URLs
  const urlsData = JSON.parse(await fs.readFile('urls.json', 'utf8'));
  const urls = urlsData.urls;
  
  console.log(`Found ${urls.length} URLs to process`);
  
  // Launch browser
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox']
  });
  
  const results = [];
  
  // Process each URL
  for (let i = 0; i < urls.length; i++) {
    const result = await extractQuestionType(browser, urls[i], i);
    results.push(result);
    
    // Small delay between requests
    if (i < urls.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  await browser.close();
  
  // Generate summary report
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success);
  
  let report = `# Extraction Report\n\n`;
  report += `Total URLs: ${urls.length}\n`;
  report += `Successful: ${successful}\n`;
  report += `Failed: ${failed.length}\n\n`;
  
  if (failed.length > 0) {
    report += `## Failed Extractions\n\n`;
    failed.forEach(f => {
      report += `- ${f.name}: ${f.error}\n`;
    });
  }
  
  await fs.writeFile('extraction-report.md', report, 'utf8');
  console.log('\nExtraction complete! See extraction-report.md for details.');
}

// Run the script
main().catch(console.error);