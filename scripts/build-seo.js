const fs = require('fs');
const path = require('path');

// 1. Data Definitions
const REGION_DATA = {
    seoul: [
        "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구",
        "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구",
        "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"
    ],
    gyeonggi: [
        "수원시", "성남시", "안양시", "안산시", "용인시", "광명시", "평택시", "과천시",
        "오산시", "시흥시", "군포시", "의왕시", "하남시", "이천시", "안성시", "김포시",
        "화성시", "광주시", "여주시", "부천시", "고양시", "의정부시", "동두천시", "구리시",
        "남양주시", "파주시", "양주시", "포천시", "연천군", "가평군", "양평군"
    ],
    incheon: [
        "중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"
    ]
};

const TASKS = [
    "외벽청소", "화재청소", "어닝청소", "인테리어 후 청소", "후드청소", "바닥청소", 
    "유리창청소", "바닥왁스코팅", "간판청소", "준공청소", "특수청소", "쓰레기집청소", "종합청소"
];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://seoul-clening-03.vercel.app';
const RELATIVE_BASE_URL = '/index.html';

// 2. Generate Links Array
let links = [];
for (const regionGroup in REGION_DATA) {
    const locations = REGION_DATA[regionGroup];
    for (const loc of locations) {
        for (const task of TASKS) {
            const relativeUrl = `${RELATIVE_BASE_URL}?loc=${encodeURIComponent(loc)}&task=${encodeURIComponent(task)}`;
            const absoluteUrl = `${SITE_URL}${relativeUrl}`;
            const label = `${loc} ${task}`;
            links.push({ relativeUrl, absoluteUrl, label });
        }
    }
}

// 3. Generate seo-hub.html
const hubHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>클린폼 서비스 지역 및 작업 안내 (SEO Hub)</title>
    <meta name="robots" content="index, follow">
    <style>
        body { background-color: #111; color: #f5f5f7; font-family: 'Pretendard', sans-serif; padding: 40px; margin: 0; }
        h1 { color: #00E5FF; text-align: center; margin-bottom: 40px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
        a { color: #999; text-decoration: none; font-size: 0.9rem; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; transition: all 0.3s; }
        a:hover { background: #00E5FF; color: #111; }
        .back-link { display: block; text-align: center; margin-top: 40px; color: #00E5FF; }
    </style>
</head>
<body>
    <h1>클린폼 전체 서비스 네트워크</h1>
    <p style="text-align:center; margin-bottom: 30px;">수도권 전 지역의 전문 청소 서비스를 제공합니다.</p>
    <div class="grid">
        ${links.map(l => `<a href="${l.relativeUrl}">${l.label}</a>`).join('\n        ')}
    </div>
    <a href="./index.html" class="back-link">메인으로 돌아가기</a>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '../seo-hub.html'), hubHtml, 'utf8');

// 4. Generate sitemap.xml
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${SITE_URL}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${SITE_URL}/seo-hub.html</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    ${links.map(l => `
    <url>
        <loc>${l.absoluteUrl.replace(/&/g, '&amp;')}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>`).join('')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, '../sitemap.xml'), sitemapXml, 'utf8');

// 5. Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml`;

fs.writeFileSync(path.join(__dirname, '../robots.txt'), robotsTxt, 'utf8');

console.log('SEO Hub and Sitemap generation complete.');
