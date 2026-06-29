const fs = require('fs');
const path = require('path');
const { SERVICES_DATA } = require('../js/data/services.js');
const { GYEONGGI_REGIONS } = require('../js/data/regions-gyeonggi.js');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cleanforme.co.kr';

// 12 core services (종합청소 제외)
const coreServices = SERVICES_DATA.filter(s => s.serviceSlug !== 'general-cleaning');
const links = [];
const seenUrls = new Set();

function addLink(url, label, regionName) {
    if (seenUrls.has(url)) {
        return false;
    }
    seenUrls.add(url);
    links.push({ url, label, regionName });
    return true;
}

GYEONGGI_REGIONS.forEach(region => {
    // 1. City level variants
    region.cityVariants.forEach(cVar => {
        coreServices.forEach(s => {
            const displayName = s.serviceNameKo === '인테리어 후 청소' ? '인테리어청소' : s.serviceNameKo;
            const urlTask = displayName.replace(/\s+/g, '');
            const url = `/?k=${encodeURIComponent(cVar + '-' + urlTask)}`;
            addLink(url, `${cVar} ${displayName}`, region.city);
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
                    addLink(url, `${dVar} ${displayName}`, region.city);
                });
            });
        });
    }

    // 3. Dong level variants (including Gwacheon's extraDongs)
    let allDongs = [];
    if (region.districts && region.districts.length > 0) {
        region.districts.forEach(dist => {
            allDongs = allDongs.concat(dist.dongs);
        });
    }
    if (region.dongs && region.dongs.length > 0) {
        allDongs = allDongs.concat(region.dongs);
    }
    if (region.extraDongs && region.extraDongs.length > 0) {
        allDongs = allDongs.concat(region.extraDongs);
    }

    const uniqueDongs = [...new Set(allDongs)];

    uniqueDongs.forEach(dong => {
        coreServices.forEach(s => {
            const displayName = s.serviceNameKo === '인테리어 후 청소' ? '인테리어청소' : s.serviceNameKo;
            const urlTask = displayName.replace(/\s+/g, '');
            const url = `/?k=${encodeURIComponent(dong + '-' + urlTask)}`;
            addLink(url, `${dong} ${displayName}`, region.city);
        });
    });
});

// Generate seo-hub.html content
let hubHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>클린폼 지역별 종합청소 키워드 허브</title>
    <meta name="description" content="클린폼 SEO Hub는 성남·과천·수원 지역의 외벽청소, 유리창청소, 준공청소, 바닥청소, 후드청소 등 지역별 상담 페이지를 한 번에 확인할 수 있도록 구성한 페이지입니다.">
    <meta name="robots" content="index, follow">
    
    <!-- 일반 브라우저(사람) 진입 시 메인홈으로 튕겨내는 리다이렉트 스크립트 (네이버/구글 등 검색봇 및 관리자만 허용) -->
    <script>
        (function() {
            var ua = navigator.userAgent.toLowerCase();
            var isBot = /yeti|googlebot|bingbot|daumoa|yahoo|duckduckgo|baiduspider/i.test(ua);
            var isAdmin = window.location.search.indexOf('admin=true') !== -1;
            if (!isBot && !isAdmin) {
                window.location.href = "/";
            }
        })();
    </script>
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
        <h1>클린폼 지역별 종합청소 키워드 허브</h1>
        <p class="desc">클린폼 SEO Hub는 성남·과천·수원 지역의 외벽청소, 유리창청소, 화재청소, 바닥왁스코팅, 바닥청소, 어닝청소, 간판청소, 준공청소, 인테리어청소, 후드청소 상담 페이지를 한 번에 확인할 수 있도록 구성한 통합 키워드 허브입니다.</p>
        
        <!-- 등록 지역 및 작업 목록 안내 박스 -->
        <div style="background: #fff; padding: 25px; border-radius: 12px; border: 1px solid var(--card-border); margin-bottom: 40px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.01);">
            <h2 style="margin-top: 0; font-size: 1.3rem; color: var(--accent-dark); border-bottom: 2px solid var(--accent); padding-bottom: 8px;">1. 서비스 대상 지역</h2>
            <p style="margin-bottom: 20px; color: var(--text-muted); font-size: 1rem; line-height: 1.6;">
                <strong>성남시</strong> (분당구 · 수정구 · 중원구) &nbsp;|&nbsp; 
                <strong>과천시</strong> (갈현동 · 과천동 · 막계동 · 문원동 · 별양동 · 부림동 · 원문동 · 주암동 · 중앙동) &nbsp;|&nbsp; 
                <strong>수원시</strong> (장안구 · 권선구 · 팔달구 · 영통구)
            </p>
            <h2 style="font-size: 1.3rem; color: var(--accent-dark); border-bottom: 2px solid var(--accent); padding-bottom: 8px; margin-top: 20px;">2. 서비스 작업 범위</h2>
            <p style="margin-bottom: 0; color: var(--text-muted); font-size: 1rem; line-height: 1.6;">
                외벽청소 · 유리창청소 · 화재청소 · 바닥왁스코팅 · 바닥청소 · 어닝청소 · 간판청소 · 준공청소 · 인테리어청소 · 후드청소 · 쓰레기집청소 · 특수청소
            </p>
        </div>
`;

const renderedHtmlUrls = new Set();
const seenDongs = new Set();

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
        const displayName = s.serviceNameKo === '인테리어 후 청소' ? '인테리어청소' : s.serviceNameKo;
        const urlTask = displayName.replace(/\s+/g, '');
        const url1 = `/?k=${encodeURIComponent(cityName + '-' + urlTask)}`;
        const url2 = `/?k=${encodeURIComponent(cityShort + '-' + urlTask)}`;
        const absUrl1 = `${SITE_URL}${url1}`;
        const absUrl2 = `${SITE_URL}${url2}`;

        if (!renderedHtmlUrls.has(absUrl1)) {
            renderedHtmlUrls.add(absUrl1);
            hubHtml += `                <a href="${absUrl1}">${cityName} ${displayName}</a>\n`;
        }
        if (!renderedHtmlUrls.has(absUrl2)) {
            renderedHtmlUrls.add(absUrl2);
            hubHtml += `                <a href="${absUrl2}">${cityShort} ${displayName}</a>\n`;
        }
    });

    hubHtml += `            </div>\n`;

    // 2. District level links
    if (region.districts && region.districts.length > 0) {
        hubHtml += `            <h3 class="category-title">2. 구 단위 키워드</h3>\n`;
        region.districts.forEach(dist => {
            const distName = dist.variants[0]; // 수정구
            const distShort = dist.variants[1]; // 수정
            
            hubHtml += `            <details>
                <summary>${distName} / ${distShort}</summary>
                <div class="details-content">
            `;
            coreServices.forEach(s => {
                const displayName = s.serviceNameKo === '인테리어 후 청소' ? '인테리어청소' : s.serviceNameKo;
                const urlTask = displayName.replace(/\s+/g, '');
                const url1 = `/?k=${encodeURIComponent(distName + '-' + urlTask)}`;
                const url2 = `/?k=${encodeURIComponent(distShort + '-' + urlTask)}`;
                const absUrl1 = `${SITE_URL}${url1}`;
                const absUrl2 = `${SITE_URL}${url2}`;

                if (!renderedHtmlUrls.has(absUrl1)) {
                    renderedHtmlUrls.add(absUrl1);
                    hubHtml += `                    <a href="${absUrl1}">${distName} ${displayName}</a>\n`;
                }
                if (!renderedHtmlUrls.has(absUrl2)) {
                    renderedHtmlUrls.add(absUrl2);
                    hubHtml += `                    <a href="${absUrl2}">${distShort} ${displayName}</a>\n`;
                }
            });
            hubHtml += `                </div>
            </details>\n`;
        });
    }

    // 3. Dong level links (과천은 2. 과천 동 단위 키워드 로 출력됨)
    const hasDistricts = region.districts && region.districts.length > 0;
    const dongSectionNum = hasDistricts ? "3" : "2";
    hubHtml += `            <h3 class="category-title">${dongSectionNum}. ${region.city} 동 단위 청소 키워드</h3>\n`;

    // Collect all dongs for this region to render in HTML
    let localDongs = [];
    if (hasDistricts) {
        region.districts.forEach(dist => {
            localDongs = localDongs.concat(dist.dongs);
        });
    } else {
        if (region.dongs && region.dongs.length > 0) {
            localDongs = localDongs.concat(region.dongs);
        }
        if (region.extraDongs && region.extraDongs.length > 0) {
            localDongs = localDongs.concat(region.extraDongs);
        }
    }
    const uniqueLocalDongs = [...new Set(localDongs)];

    uniqueLocalDongs.forEach(dong => {
        // Skip duplicate dongs completely to avoid duplicate accordion sections and links
        if (seenDongs.has(dong)) {
            return;
        }
        seenDongs.add(dong);

        hubHtml += `            <details>
                <summary>${dong}</summary>
                <div class="details-content">
            `;
        coreServices.forEach(s => {
            const displayName = s.serviceNameKo === '인테리어 후 청소' ? '인테리어청소' : s.serviceNameKo;
            const urlTask = displayName.replace(/\s+/g, '');
            const url = `/?k=${encodeURIComponent(dong + '-' + urlTask)}`;
            const absUrl = `${SITE_URL}${url}`;

            if (!renderedHtmlUrls.has(absUrl)) {
                renderedHtmlUrls.add(absUrl);
                hubHtml += `                    <a href="${absUrl}">${dong} ${displayName}</a>\n`;
            }
        });
        hubHtml += `                </div>
            </details>\n`;
    });

    hubHtml += `        </section>\n`;
});

hubHtml += `
        <div style="text-align:center; margin-top: 50px;">
            <a href="${SITE_URL}/" class="back-link" style="display:inline-block; border-color:var(--accent); color:var(--accent);">메인으로 돌아가기</a>
        </div>
    </div>
    <!-- 데스크톱에서 아코디언 자동 열기 스크립트 -->
    <script>
        if (window.innerWidth >= 768) {
            document.querySelectorAll('details').forEach(el => el.setAttribute('open', ''));
        }
    </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '../seo-hub.html'), hubHtml, 'utf8');

// Generate sitemap.xml
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${SITE_URL}/</loc>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${SITE_URL}/seo-hub</loc>
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

User-agent: Yeti
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

fs.writeFileSync(path.join(__dirname, '../robots.txt'), robotsTxt, 'utf8');

console.log('SEO Hub and Sitemap generation complete.');
console.log('Total Links Generated in seo-hub.html (unique dynamic URLs):', renderedHtmlUrls.size);
console.log('Total Links in links array:', links.length);
