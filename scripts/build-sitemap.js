const fs = require('fs');
const path = require('path');
const { SERVICES_DATA } = require('../js/data/services.js');
const { GYEONGGI_REGIONS } = require('../js/data/regions-gyeonggi.js');

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cleanforme.co.kr';

// 12 core services (종합청소 제외)
const coreServices = SERVICES_DATA.filter(s => s.serviceSlug !== 'general-cleaning');

// Generate links array for sitemap
const links = [];
const seenUrls = new Set();

function addLink(url) {
    if (seenUrls.has(url)) {
        return false;
    }
    seenUrls.add(url);
    links.push({ url });
    return true;
}

GYEONGGI_REGIONS.forEach(region => {
    // 1. City level variants
    region.cityVariants.forEach(cVar => {
        coreServices.forEach(s => {
            const displayName = s.serviceNameKo === '인테리어 후 청소' ? '인테리어청소' : s.serviceNameKo;
            const urlTask = displayName.replace(/\s+/g, '');
            const url = `/?k=${encodeURIComponent(cVar + '-' + urlTask)}`;
            addLink(url);
        });
    });

    // 2. District level variants
    if (region.districts && region.districts.length > 0) {
        region.districts.forEach(dist => {
            dist.variants.forEach(dVar => {
                coreServices.forEach(s => {
                    const displayName = s.serviceNameKo === '인테리어 후 청소' ? '인테리어청소' : s.serviceNameKo;
                    const urlTask = displayName.replace(/\s+/g, '');
                    const url = `/?k=${encodeURIComponent(dVar + '-' + urlTask)}`;
                    addLink(url);
                });
            });
        });
    }

    // 3. Dong level variants (including Gwacheon's extraDongs)
    let allDongsForSitemap = [];
    if (region.districts && region.districts.length > 0) {
        region.districts.forEach(dist => {
            allDongsForSitemap = allDongsForSitemap.concat(dist.dongs);
        });
    }
    if (region.dongs && region.dongs.length > 0) {
        allDongsForSitemap = allDongsForSitemap.concat(region.dongs);
    }
    if (region.extraDongs && region.extraDongs.length > 0) {
        allDongsForSitemap = allDongsForSitemap.concat(region.extraDongs);
    }

    const uniqueDongs = [...new Set(allDongsForSitemap)];

    uniqueDongs.forEach(dong => {
        coreServices.forEach(s => {
            const displayName = s.serviceNameKo === '인테리어 후 청소' ? '인테리어청소' : s.serviceNameKo;
            const urlTask = displayName.replace(/\s+/g, '');
            const url = `/?k=${encodeURIComponent(dong + '-' + urlTask)}`;
            addLink(url);
        });
    });
});

// sitemap.xml 생성
let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${BASE_URL}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${BASE_URL}/seo-hub</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
`;

// 동적 경로 추가
links.forEach(l => {
    sitemapXml += `    <url>
        <loc>${(BASE_URL + l.url).replace(/&/g, '&amp;')}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>\n`;
});

sitemapXml += `</urlset>`;

// 파일 저장
fs.writeFileSync(path.join(__dirname, '../sitemap.xml'), sitemapXml, 'utf8');
console.log('✅ sitemap.xml 생성 완료! 총 URL 개수:', links.length + 2);

// robots.txt 생성
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(__dirname, '../robots.txt'), robotsTxt, 'utf8');
console.log('✅ robots.txt 생성 완료!');
