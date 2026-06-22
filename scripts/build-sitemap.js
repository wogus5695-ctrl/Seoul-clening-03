const fs = require('fs');
const path = require('path');
const { SERVICES_DATA } = require('../js/data/services.js');

const TARGET_REGIONS = [
    { city: "성남", citySlug: "seongnam", cityVariants: ["성남시", "성남"], districts: [
        { name: "수정구", slug: "sujeong", variants: ["수정구", "수정"] },
        { name: "중원구", slug: "jungwon", variants: ["중원구", "중원"] },
        { name: "분당구", slug: "bundang", variants: ["분당구", "분당"] }
    ]},
    { city: "과천", citySlug: "gwacheon", cityVariants: ["과천시", "과천"], districts: [] },
    { city: "수원", citySlug: "suwon", cityVariants: ["수원시", "수원"], districts: [
        { name: "장안구", slug: "jangan", variants: ["장안구", "장안"] },
        { name: "권선구", slug: "gwonseon", variants: ["권선구", "권선"] },
        { name: "팔달구", slug: "paldal", variants: ["팔달구", "팔달"] },
        { name: "영통구", slug: "yeongtong", variants: ["영통구", "영통"] }
    ]}
];

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://seoul-clening-03.vercel.app';

// 12 core services (종합청소 제외)
const coreServices = SERVICES_DATA.filter(s => s.serviceSlug !== 'general-cleaning');

// Generate links array for sitemap
const links = [];
TARGET_REGIONS.forEach(region => {
    // 1. City level variants
    region.cityVariants.forEach(cVar => {
        coreServices.forEach(s => {
            const urlTask = s.serviceNameKo.replace(/\s+/g, '');
            const url = `/?k=${encodeURIComponent(cVar + '-' + urlTask)}`;
            links.push({ url });
        });
    });

    // 2. District level variants
    region.districts.forEach(dist => {
        dist.variants.forEach(dVar => {
            coreServices.forEach(s => {
                const urlTask = s.serviceNameKo.replace(/\s+/g, '');
                const url = `/?k=${encodeURIComponent(dVar + '-' + urlTask)}`;
                links.push({ url });
            });
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
        <loc>${BASE_URL}/seo-hub.html</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
`;

// 동적 경로 추가 (240개)
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
