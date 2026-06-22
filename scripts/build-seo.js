const fs = require('fs');
const path = require('path');
const { SERVICES_DATA } = require('../js/data/services.js');
const { GYEONGGI_REGIONS } = require('../js/data/regions-gyeonggi.js');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://seoul-clening-03.vercel.app';

// 12 core services (종합청소 제외)
const coreServices = SERVICES_DATA.filter(s => s.serviceSlug !== 'general-cleaning');

// Generate links array
const links = [];

GYEONGGI_REGIONS.forEach(region => {
    // 1. City level variants
    region.cityVariants.forEach(cVar => {
        coreServices.forEach(s => {
            const urlTask = s.serviceNameKo.replace(/\s+/g, '');
            const url = `/?k=${encodeURIComponent(cVar + '-' + urlTask)}`;
            links.push({ url, label: `${cVar} ${s.serviceNameKo}`, regionName: region.city });
        });
    });

    // 2. District level variants
    if (region.districts && region.districts.length > 0) {
        region.districts.forEach(dist => {
            dist.variants.forEach(dVar => {
                coreServices.forEach(s => {
                    const urlTask = s.serviceNameKo.replace(/\s+/g, '');
                    const url = `/?k=${encodeURIComponent(dVar + '-' + urlTask)}`;
                    links.push({ url, label: `${dVar} ${s.serviceNameKo}`, regionName: region.city });
                });
            });
        });
    }

    // 3. Dong level variants (For Sitemap, including Gwacheon's extraDongs)
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
            const urlTask = s.serviceNameKo.replace(/\s+/g, '');
            const url = `/?k=${encodeURIComponent(dong + '-' + urlTask)}`;
            links.push({ url, label: `${dong} ${s.serviceNameKo}`, regionName: region.city });
        });
    });
});

// Generate seo-hub.html content
let hubHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>클린폼 서비스 지역 및 작업 안내 (SEO Hub)</title>
    <meta name="description" content="클린폼이 제공하는 성남·과천·수원 지역의 외벽청소, 유리창청소, 준공청소, 바닥청소, 특수청소 등 지역별 청소 서비스를 한눈에 확인할 수 있습니다.">
    <meta name="robots" content="index, follow">
    <style>
        :root {
            --bg-color: #F7FAFC;
            --text-main: #111827;
            --text-muted: #4B5563;
            --accent: #00CFE8;
            --accent-dark: #0891A3;
            --card-bg: #FFFFFF;
            --card-border: #DDE7EA;
        }
        body {
            background-color: var(--bg-color);
            color: var(--text-main);
            font-family: 'Pretendard', -apple-system, sans-serif;
            padding: 40px 20px;
            margin: 0;
            line-height: 1.6;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            color: var(--accent-dark);
            text-align: center;
            font-size: clamp(2rem, 4vw, 3rem);
            margin-bottom: 20px;
        }
        .desc {
            text-align: center;
            color: var(--text-muted);
            margin-bottom: 50px;
            font-size: 1.1rem;
        }
        .city-section {
            margin-bottom: 60px;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.01);
        }
        .city-title {
            font-size: 2rem;
            color: var(--accent-dark);
            margin-top: 0;
            margin-bottom: 30px;
            border-bottom: 1px solid var(--card-border);
            padding-bottom: 15px;
        }
        .category-title {
            font-size: 1.4rem;
            color: var(--text-main);
            margin-top: 30px;
            margin-bottom: 20px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 10px;
        }
        a {
            display: block;
            color: var(--text-muted);
            text-decoration: none;
            font-size: 0.95rem;
            padding: 10px;
            background: var(--card-bg);
            border-radius: 6px;
            transition: all 0.3s;
            text-align: center;
            border: 1px solid var(--card-border);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }
        a:hover {
            background: #EEF7F8;
            color: var(--accent-dark);
            border-color: var(--accent);
        }
        .back-link {
            display: block;
            text-align: center;
            margin-top: 40px;
            color: var(--accent-dark);
            text-decoration: none;
        }
        /* Accordion for mobile */
        details {
            margin-bottom: 15px;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }
        summary {
            padding: 15px;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: bold;
            color: var(--text-main);
            list-style: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        summary::-webkit-details-marker {
            display: none;
        }
        summary::after {
            content: '+';
            color: var(--accent-dark);
            font-size: 1.5rem;
        }
        details[open] summary::after {
            content: '-';
        }
        .details-content {
            padding: 15px;
            border-top: 1px solid var(--card-border);
            background: var(--card-bg);
        }
        @media (min-width: 768px) {
            details {
                display: block;
                background: transparent;
                border: none;
            }
            summary {
                pointer-events: none;
                padding: 0 0 15px 0;
                font-size: 1.2rem;
            }
            summary::after {
                display: none;
            }
            .details-content {
                padding: 0;
                border: none;
                background: transparent;
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>클린폼 전체 서비스 네트워크</h1>
        <p class="desc">성남·과천·수원 전 지역의 전문 청소 서비스를 제공합니다.</p>
`;

GYEONGGI_REGIONS.forEach(region => {
    const cityName = region.cityVariants[0]; // 성남시
    const cityShort = region.cityVariants[1]; // 성남
    
    hubHtml += `
        <section class="city-section">
            <h2 class="city-title">${region.city} 섹션</h2>
            
            <h3 class="category-title">1. ${cityName} 통합 키워드</h3>
            <div class="grid">
    `;

    // 1. City level links
    coreServices.forEach(s => {
        const urlTask = s.serviceNameKo.replace(/\s+/g, '');
        const url1 = `/?k=${encodeURIComponent(cityName + '-' + urlTask)}`;
        const url2 = `/?k=${encodeURIComponent(cityShort + '-' + urlTask)}`;
        hubHtml += `                <a href="${url1}">${cityName} ${s.serviceNameKo}</a>\n`;
        hubHtml += `                <a href="${url2}">${cityShort} ${s.serviceNameKo}</a>\n`;
    });

    hubHtml += `            </div>\n`;

    // 2. District level links
    if (region.districts && region.districts.length > 0) {
        hubHtml += `            <h3 class="category-title">2. 구 단위 키워드</h3>\n`;
        region.districts.forEach(dist => {
            const distName = dist.variants[0]; // 수정구
            const distShort = dist.variants[1]; // 수정
            
            hubHtml += `            <details open>
                <summary>${distName} / ${distShort}</summary>
                <div class="details-content">
            `;
            coreServices.forEach(s => {
                const urlTask = s.serviceNameKo.replace(/\s+/g, '');
                const url1 = `/?k=${encodeURIComponent(distName + '-' + urlTask)}`;
                const url2 = `/?k=${encodeURIComponent(distShort + '-' + urlTask)}`;
                hubHtml += `                    <a href="${url1}">${distName} ${s.serviceNameKo}</a>\n`;
                hubHtml += `                    <a href="${url2}">${distShort} ${s.serviceNameKo}</a>\n`;
            });
            hubHtml += `                </div>
            </details>\n`;
        });
    }

    // 3. Dong level links (과천은 2. 과천 동 단위 키워드 로 출력됨)
    const hasDistricts = region.districts && region.districts.length > 0;
    const dongSectionNum = hasDistricts ? "3" : "2";
    hubHtml += `            <h3 class="category-title">${dongSectionNum}. ${region.city} 동 단위 청소 키워드</h3>\n`;

    if (hasDistricts) {
        region.districts.forEach(dist => {
            dist.dongs.forEach(dong => {
                hubHtml += `            <details open>
                <summary>${dong}</summary>
                <div class="details-content">
            `;
                coreServices.forEach(s => {
                    const urlTask = s.serviceNameKo.replace(/\s+/g, '');
                    const url = `/?k=${encodeURIComponent(dong + '-' + urlTask)}`;
                    hubHtml += `                    <a href="${url}">${dong} ${s.serviceNameKo}</a>\n`;
                });
                hubHtml += `                </div>
            </details>\n`;
            });
        });
    } else {
        // 과chen (구가 없음, dongs만 존재)
        region.dongs.forEach(dong => {
            hubHtml += `            <details open>
                <summary>${dong}</summary>
                <div class="details-content">
            `;
            coreServices.forEach(s => {
                const urlTask = s.serviceNameKo.replace(/\s+/g, '');
                const url = `/?k=${encodeURIComponent(dong + '-' + urlTask)}`;
                hubHtml += `                    <a href="${url}">${dong} ${s.serviceNameKo}</a>\n`;
            });
            hubHtml += `                </div>
            </details>\n`;
        });
    }

    hubHtml += `        </section>\n`;
});

hubHtml += `
        <div style="text-align:center; margin-top: 50px;">
            <a href="./index.html" class="back-link" style="display:inline-block; border-color:var(--accent); color:var(--accent);">메인으로 돌아가기</a>
        </div>
    </div>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '../seo-hub.html'), hubHtml, 'utf8');

// Generate sitemap.xml
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
        <priority>0.9</priority>
    </url>
    ${links.map(l => `
    <url>
        <loc>${(SITE_URL + l.url).replace(/&/g, '&amp;')}</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>`).join('')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, '../sitemap.xml'), sitemapXml, 'utf8');

// Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(__dirname, '../robots.txt'), robotsTxt, 'utf8');

console.log('SEO Hub and Sitemap generation complete.');
console.log('Total Links Generated in seo-hub.html:', links.length);
