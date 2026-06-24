const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'api/index.js',
    'robots.txt',
    'rss.xml',
    'scripts/build-rss.js',
    'scripts/build-seo.js',
    'scripts/build-sitemap.js',
    'sitemap.xml'
];

const oldDomain = 'seoul-clening-03.vercel.app';
const newDomain = 'www.cleanforme.co.kr';

filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(new RegExp(oldDomain, 'g'), newDomain);
        // Also fix the protocol if there's any case of http:// instead of https://, but the replacement above handles the bare domain perfectly.
        // wait, seoul-clening-03.vercel.app -> www.cleanforme.co.kr handles https://seoul... -> https://www... automatically.
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        console.log(`File not found: ${file}`);
    }
});
