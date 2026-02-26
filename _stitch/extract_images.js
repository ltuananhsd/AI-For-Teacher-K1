const fs = require('fs');
const path = require('path');
const https = require('https');

const scratchDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\scratch';
const publicImagesDir = 'f:\\1. Antigravity\\web\\google-ai-bootcamp-2026\\public\\images';

if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
}

function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
}

async function processFiles() {
    const files = fs.readdirSync(scratchDir).filter(f => f.endsWith('.html'));
    
    for (const file of files) {
        const filePath = path.join(scratchDir, file);
        let content = fs.readFileSync(filePath, 'utf-8');
        
        // Match <img ... src="url" ...> or similar
        const srcRegex = /src=["'](https?:\/\/[^"']+)["']/g;
        let match;
        const matches = [];
        while ((match = srcRegex.exec(content)) !== null) {
            matches.push(match[1]);
        }
        
        for (const url of matches) {
            if (url.includes('cdn.tailwindcss.com') || url.includes('fonts.googleapis.com')) {
                continue; // Skip script/css tags and only target images mostly
            }
            // Generate a safe filename
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            let filename = pathParts[pathParts.length - 1];
            if (!filename || filename.length > 50) {
                // If it's a long googleusercontent object ID, hash it
                const hash = require('crypto').createHash('md5').update(url).digest('hex');
                filename = `${hash}.jpg`;
            } else if (!filename.includes('.')) {
                 filename += '.jpg';
            }
            
            const destPath = path.join(publicImagesDir, filename);
            console.log(`Downloading ${url} to ${filename}`);
            try {
                await downloadImage(url, destPath);
                // Replace in HTML
                content = content.replace(url, `/images/${filename}`);
            } catch (e) {
                console.error(`Failed to download ${url}`, e);
            }
        }
        fs.writeFileSync(filePath, content);
    }
    console.log("Assets extracted and downloaded!");
}

processFiles().catch(console.error);
