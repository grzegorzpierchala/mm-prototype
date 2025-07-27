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
    
    const request = protocol.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${path.basename(filepath)}`);
        resolve();
      });
    });
    
    request.on('error', (err) => {
      require('fs').unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
    
    // Set timeout for download
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Download timeout'));
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

// Check if already processed
async function isProcessed(name) {
  try {
    await fs.access(path.join('question-types-doc', `${name}.md`));
    return true;
  } catch {
    return false;
  }
}

// Main extraction function
async function extractQuestionType(page, urlInfo, index) {
  console.log(`\nProcessing ${index + 1}: ${urlInfo.name}`);
  
  // Check if already processed
  if (await isProcessed(urlInfo.name)) {
    console.log(`Already processed: ${urlInfo.name}`);
    return { success: true, name: urlInfo.name, skipped: true };
  }
  
  try {
    // Navigate to the page with retry logic
    console.log(`Navigating to: ${urlInfo.url}`);
    let retries = 3;
    while (retries > 0) {
      try {
        await page.goto(urlInfo.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        break;
      } catch (e) {
        retries--;
        if (retries === 0) throw e;
        console.log(`Retry navigation (${3 - retries}/3)...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    // Wait for main content to load
    await page.waitForSelector('#main > div > div > article > section.main-content-area', { timeout: 30000 });
    
    // Close cookie banner if present
    try {
      const cookieButton = await page.$('button:has-text("Accept all")');
      if (cookieButton) {
        await cookieButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (e) {
      // Cookie banner might not be present
    }
    
    // Wait a bit for content to stabilize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Extract content
    const content = await page.evaluate(() => {
      const mainContent = document.querySelector('#main > div > div > article > section.main-content-area');
      if (!mainContent) return null;
      
      // Get the page title
      const title = document.querySelector('h1')?.textContent || 'Unknown Question Type';
      
      // Clone the content to avoid modifying the original
      const contentClone = mainContent.cloneNode(true);
      
      // Remove "Was this helpful?" sections
      contentClone.querySelectorAll('[id*="helpful"], .helpful-section, .feedback-section, .was-this-helpful').forEach(el => el.remove());
      
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
    const failedImages = [];
    
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
        console.error(`Failed to download image: ${filename}`, err.message);
        failedImages.push(img.src);
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
    
    return { success: true, name: urlInfo.name, failedImages };
    
  } catch (error) {
    console.error(`Error processing ${urlInfo.name}:`, error.message);
    return { success: false, name: urlInfo.name, error: error.message };
  }
}

// Main function
async function main() {
  console.log('Starting Qualtrics documentation extraction (remaining files)...');
  
  // Read URLs
  const urlsData = JSON.parse(await fs.readFile('urls.json', 'utf8'));
  const urls = urlsData.urls;
  
  // Check which ones are already processed
  let toProcess = [];
  for (const url of urls) {
    if (!(await isProcessed(url.name))) {
      toProcess.push(url);
    }
  }
  
  console.log(`Found ${urls.length} total URLs`);
  console.log(`Already processed: ${urls.length - toProcess.length}`);
  console.log(`To process: ${toProcess.length}`);
  
  if (toProcess.length === 0) {
    console.log('All files already processed!');
    return;
  }
  
  // Launch browser
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const results = [];
  
  // Create page that we'll reuse
  const page = await browser.newPage();
  
  // Process each URL
  for (let i = 0; i < toProcess.length; i++) {
    const result = await extractQuestionType(page, toProcess[i], i);
    results.push(result);
    
    // Small delay between requests
    if (i < toProcess.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  await page.close();
  await browser.close();
  
  // Generate summary report
  const successful = results.filter(r => r.success && !r.skipped).length;
  const skipped = results.filter(r => r.skipped).length;
  const failed = results.filter(r => !r.success);
  
  let report = `# Extraction Report (Remaining Files)\n\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += `Total URLs to process: ${toProcess.length}\n`;
  report += `Successful: ${successful}\n`;
  report += `Skipped (already done): ${skipped}\n`;
  report += `Failed: ${failed.length}\n\n`;
  
  if (failed.length > 0) {
    report += `## Failed Extractions\n\n`;
    failed.forEach(f => {
      report += `- ${f.name}: ${f.error}\n`;
    });
  }
  
  await fs.writeFile('extraction-report-remaining.md', report, 'utf8');
  console.log('\nExtraction complete! See extraction-report-remaining.md for details.');
}

// Run the script
main().catch(console.error);