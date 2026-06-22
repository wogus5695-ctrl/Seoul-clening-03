const fs = require('fs');
const path = require('path');
const { generateRoutes } = require('./generate-routes.js');
const { GYEONGGI_REGIONS } = require('../js/data/regions-gyeonggi.js');
const { SERVICES_DATA } = require('../js/data/services.js');

const routes = generateRoutes();

// 라우팅 맵을 더 쉽게 찾기 위해 구조화
const routeMap = {};
routes.forEach(r => {
    routeMap[`${r.locStr}_${r.taskStr}`] = r.path;
});

const getPath = (locStr, taskStr) => {
    return routeMap[`${locStr}_${taskStr}`] || '#';
};

// 12개 서비스 목록 (종합청소 제외)
const coreServices = SERVICES_DATA.filter(s => s.serviceSlug !== 'general-cleaning');

// 렌더링 헬퍼
const renderLinks = (locStr, variantStr) => {
    return coreServices.map(s => {
        const url = getPath(locStr, s.serviceNameKo);
        const label = variantStr ? `${locStr} ${s.serviceNameKo} / ${variantStr} ${s.serviceNameKo}` : `${locStr} ${s.serviceNameKo}`;
        return `<a href="${url}">${label}</a>`;
    }).join('\n                ');
};

const renderDongLinks = (dongStr) => {
    return coreServices.map(s => {
        const url = getPath(dongStr, s.serviceNameKo);
        return `<a href="${url}">${dongStr} ${s.serviceNameKo}</a>`;
    }).join('\n                ');
};

let htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>경기 지역 종합청소 서비스 키워드 맵 | 클린폼</title>
    <meta name="description" content="클린폼이 제공하는 성남·과천·수원 지역의 외벽청소, 유리창청소, 준공청소, 바닥청소, 특수청소 등 지역별 청소 서비스를 한눈에 확인할 수 있습니다.">
    <meta name="robots" content="index, follow">
    <style>
        :root {
            --bg-color: #111;
            --text-main: #f5f5f7;
            --text-muted: #888;
            --accent: #00E5FF;
            --card-bg: rgba(255, 255, 255, 0.05);
            --card-border: rgba(255, 255, 255, 0.1);
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
            color: var(--accent);
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
        }
        .city-title {
            font-size: 2rem;
            color: var(--accent);
            margin-top: 0;
            margin-bottom: 30px;
            border-bottom: 1px solid var(--card-border);
            padding-bottom: 15px;
        }

        .category-title {
            font-size: 1.4rem;
            color: #fff;
            margin-top: 30px;
            margin-bottom: 20px;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 15px;
        }

        a {
            display: block;
            color: var(--text-muted);
            text-decoration: none;
            font-size: 0.95rem;
            padding: 12px 15px;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--card-border);
            border-radius: 6px;
            transition: all 0.2s ease;
        }
        a:hover {
            background: rgba(0, 229, 255, 0.1);
            color: var(--accent);
            border-color: var(--accent);
        }

        /* Accordion for mobile */
        details {
            margin-bottom: 15px;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid var(--card-border);
            border-radius: 6px;
            overflow: hidden;
        }
        summary {
            padding: 15px;
            cursor: pointer;
            font-size: 1.1rem;
            font-weight: bold;
            color: #fff;
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
            color: var(--accent);
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
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 15px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>경기 지역 종합청소 서비스 키워드 맵</h1>
        <p class="desc">클린폼이 제공하는 성남·과천·수원 지역의 외벽청소, 유리창청소, 준공청소, 바닥청소, 특수청소 등 지역별 청소 서비스를 한눈에 확인할 수 있습니다.</p>

`;

GYEONGGI_REGIONS.forEach(region => {
    const cityName = region.cityVariants[0]; // ex: 성남시
    const cityShort = region.cityVariants[1]; // ex: 성남

    htmlContent += `
        <section class="city-section">
            <h2 class="city-title">${region.city} 섹션</h2>
            
            <h3 class="category-title">1. ${cityName} 통합 키워드</h3>
            <div class="grid">
                ${renderLinks(cityName, cityShort)}
            </div>
    `;

    if (region.districts.length > 0) {
        htmlContent += `
            <h3 class="category-title">2. 구 단위 키워드</h3>
        `;
        region.districts.forEach(dist => {
            const distName = dist.variants[0]; // 분당구
            const distShort = dist.variants[1]; // 분당
            htmlContent += `
            <details open>
                <summary>${distName} / ${distShort}</summary>
                <div class="details-content">
                    ${renderLinks(distName, distShort)}
                </div>
            </details>
            `;
        });

        htmlContent += `
            <h3 class="category-title">3. 동 단위 키워드</h3>
        `;
        region.districts.forEach(dist => {
            if (dist.dongs && dist.dongs.length > 0) {
                dist.dongs.forEach(dong => {
                    htmlContent += `
                    <details>
                        <summary>${dong}</summary>
                        <div class="details-content">
                            ${renderDongLinks(dong)}
                        </div>
                    </details>
                    `;
                });
            }
        });
    } else {
        // 과천시 같이 구가 없는 경우
        htmlContent += `
            <h3 class="category-title">2. 동 단위 키워드</h3>
        `;
        region.dongs.forEach(dong => {
            htmlContent += `
            <details>
                <summary>${dong}</summary>
                <div class="details-content">
                    ${renderDongLinks(dong)}
                </div>
            </details>
            `;
        });
    }

    htmlContent += `
        </section>
    `;
});

htmlContent += `
        <div style="text-align:center; margin-top: 50px;">
            <a href="./index.html" style="display:inline-block; border-color:var(--accent); color:var(--accent);">메인페이지로 돌아가기</a>
        </div>
    </div>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '../sitemap-gyeonggi.html'), htmlContent, 'utf8');
console.log('✅ sitemap-gyeonggi.html 생성 완료!');
