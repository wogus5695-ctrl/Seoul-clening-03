const fs = require('fs');
const path = require('path');
const { generateRoutes } = require('./generate-routes.js');

// 환경변수에서 사이트 기본 URL을 가져오거나, 임시 Vercel 도메인 등을 폴백으로 사용
// 예: 실제 서버 환경이나 CI/CD 에서는 NEXT_PUBLIC_SITE_URL을 주입하여 사용
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://seoul-clening-03.vercel.app';

const routes = generateRoutes();

// sitemap.xml 생성
let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${BASE_URL}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${BASE_URL}/sitemap-gyeonggi.html</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
`;

// 동적 경로 추가 (1,560개)
routes.forEach(r => {
    sitemapXml += `    <url>
        <loc>${BASE_URL}${r.path}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>\n`;
});

sitemapXml += `</urlset>`;

// 파일 저장
fs.writeFileSync(path.join(__dirname, '../sitemap.xml'), sitemapXml, 'utf8');
console.log('✅ sitemap.xml 생성 완료! 총 URL 개수:', routes.length + 2);

// robots.txt 생성
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(__dirname, '../robots.txt'), robotsTxt, 'utf8');
console.log('✅ robots.txt 생성 완료!');
