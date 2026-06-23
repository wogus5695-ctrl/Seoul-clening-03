const fs = require('fs');
const path = require('path');
const { SERVICES_DATA } = require('../js/data/services.js');
const { SITE_CONFIG } = require('../js/config.js');

module.exports = (req, res) => {
    // 최종 응답 전송 헬퍼 (연락처 치환 일원화)
    function sendHtml(htmlContent) {
        if (SITE_CONFIG && SITE_CONFIG.CONTACT_PHONE) {
            htmlContent = htmlContent.replace(/href="tel:1588-0000"/g, "href=\"tel:" + SITE_CONFIG.CONTACT_PHONE + "\"");
            htmlContent = htmlContent.replace(/1588-0000/g, SITE_CONFIG.CONTACT_PHONE);
        }
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(200).send(htmlContent);
    }
    // 1. URLSearchParams 또는 req.query.k 로 k 값을 가져옵니다.
    // Vercel Serverless Function 에서는 req.query.k 로 query parameter에 직접 접근할 수 있습니다.
    const keywordRaw = req.query.k || '';
    
    // template.html 파일을 동적으로 읽습니다.
    const htmlPath = path.join(process.cwd(), 'template.html');
    let html = '';
    try {
        html = fs.readFileSync(htmlPath, 'utf8');
    } catch (err) {
        return res.status(500).send('Error reading index.html');
    }

    if (!keywordRaw) {
        // k 값이 없으면 원본 index.html 에 canonical 과 og:url 을 원본 기준으로 추가하여 응답합니다.
        const host = req.headers.host || 'seoul-clening-03.vercel.app';
        const protocol = req.headers['x-forwarded-proto'] || 'https';
        const canonicalUrl = `${protocol}://${host}/`;
        
        let canonicalTags = `    <link rel="canonical" href="${canonicalUrl}">\n    <meta property="og:url" content="${canonicalUrl}">`;
        
        // head 닫는 태그 직전에 강제 삽입
        html = html.replace(/<\/head>/i, `${canonicalTags}\n</head>`);
        
        return sendHtml(html);
    }

    // k 값 디코딩 및 파싱
    const keyword = decodeURIComponent(keywordRaw);
    const hyphenIndex = keyword.indexOf('-');
    let loc = '수도권';
    let taskPart = '종합청소';

    if (hyphenIndex !== -1) {
        loc = keyword.substring(0, hyphenIndex).trim();
        taskPart = keyword.substring(hyphenIndex + 1).replace(/-/g, '').trim();
    } else {
        taskPart = keyword.trim();
    }

    // 작업명 매핑 규칙 적용
    const taskMap = {
        "외벽청소": "외벽청소",
        "유리창청소": "유리창청소",
        "화재청소": "화재청소",
        "바닥왁스코팅": "바닥왁스코팅",
        "바닥청소": "바닥청소",
        "어닝청소": "어닝청소",
        "간판청소": "간판청소",
        "인테리어후청소": "인테리어 후 청소",
        "준공청소": "준공청소",
        "후드청소": "후드청소",
        "쓰레기집청소": "쓰레기집청소",
        "특수청소": "특수청소",
        "종합청소": "종합청소"
    };

    const displayTask = taskMap[taskPart] || taskPart;
    const displayLoc = loc;

    // 조사 조사 선택 헬퍼
    function getTopicMarker(str) {
        if (!str) return '는';
        const lastChar = str.charAt(str.length - 1);
        const code = lastChar.charCodeAt(0);
        if (code < 0xAC00 || code > 0xD7A3) return '는';
        const batchim = (code - 0xAC00) % 28;
        return batchim === 0 ? '는' : '은';
    }

    function getSubjectMarker(str) {
        if (!str) return '가';
        const lastChar = str.charAt(str.length - 1);
        const code = lastChar.charCodeAt(0);
        if (code < 0xAC00 || code > 0xD7A3) return '가';
        const batchim = (code - 0xAC00) % 28;
        return batchim === 0 ? '가' : '이';
    }

    const host = req.headers.host || 'seoul-clening-03.vercel.app';
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const canonicalUrl = `${protocol}://${host}/?k=${encodeURIComponent(loc + '-' + taskPart.replace(/\s+/g, ''))}`;

    // 외부 매트릭스에서 데이터 추출
    const taskData = SERVICES_DATA.find(s => s.serviceNameKo === displayTask) || SERVICES_DATA.find(s => s.serviceNameKo === '종합청소');

    // 3. 작업명별 특화 설명 데이터
    const heroDescTemplate = {
        "외벽청소": "{loc} {task}는 외벽 오염, 먼지, 물때, 이끼 상태와 작업 높이에 따라 장비 구성이 달라집니다.",
        "유리창청소": "{loc} {task}는 빗물 자국, 물때, 먼지, 스티커 자국 및 고층 유리창 접근성에 맞춰 적합한 세정 공법이 수립됩니다.",
        "준공청소": "{loc} {task}는 신축 현장의 공사 분진, 시멘트 가루, 본드 자국, 마감 오염 분량에 맞춰 정밀 흡입 및 세정 작업이 진행됩니다.",
        "후드청소": "{loc} {task}는 주방 기름때, 후드 내부 오염, 악취 상태와 위생 관리 기준에 따라 작업 범위와 투입 약품이 달라집니다.",
        "화재청소": "{loc} {task}는 유해한 그을음, 분진, 탄 냄새, 잔여 오염 정도와 철거 범위에 맞춰 긴급 특수 케어로 복구합니다.",
        "쓰레기집청소": "{loc} {task}는 대량 폐기물 종류, 심각한 악취, 생활오염 상태와 방치 공간 정리 규모에 맞춰 단계별로 안전하게 진행됩니다.",
        "바닥청소": "{loc} {task}는 바닥재 재질, 찌든 때 고착 정도, 유분기 및 기름때 분포에 맞춰 기계 세척 범위가 결정됩니다.",
        "바닥왁스코팅": "{loc} {task}는 타일 마감재의 기존 왁스 박리 강도, 스크래치 상태와 코팅 도포 횟수에 맞춰 정밀 시공됩니다.",
        "어닝청소": "{loc} {task}는 어닝의 찌든 오염물, 매연 흔적, 곰팡이 유무에 맞춰 친환경 약품과 온수 스팀으로 오염원을 제거합니다.",
        "간판청소": "{loc} {task}는 외부 찌든 먼지, 글자 틈새 거미줄 상태 및 장비 접근성에 따라 작업 방식이 다릅니다.",
        "인테리어 후 청소": "{loc} {task}는 리모델링 과정의 미세 시멘트 분진, 도배 풀 흔적, 톱밥 가루 상태에 따라 디테일 클리닝이 진행됩니다.",
        "특수청소": "{loc} {task}는 하수 역류 오염, 동물 배설물 악취, 방역 수준에 맞춰 전문가용 강력 살균제와 보호구를 갖춰 해결합니다.",
        "종합청소": "{loc} {task}가 필요하다면 현장 사진, 면적, 오염도를 기준으로 작업 가능 여부와 견적 범위를 안내합니다."
    };

    const needDescTemplate = {
        "외벽청소": "{loc}에서 {task}는 산성비 and 대기 먼지로 노후화된 건물 외벽면을 세척하여 본연의 깨끗함을 회복하고, 장기적인 자산 가치 유지를 위해 필수적입니다.",
        "유리창청소": "{loc}에서 {task}는 상가와 사무실 내부로 드는 햇빛을 차단하는 유리창의 묵은 물때와 매연을 맑게 세정하여 투명한 전망을 선사합니다.",
        "준공청소": "{loc}에서 {task}는 신축 건물의 인도를 앞두고 거친 자갈과 공사용 쓰레기를 수거하며 미세 분진을 청소하는 최종 마감 단계입니다.",
        "후드청소": "{loc}에서 {task}는 식당 주방의 화재 위험을 예방하고 보건소 위생 점검 기준을 충족하기 위한 후드 갓 내부의 단단한 유지분 제거 작업입니다.",
        "화재청소": "{loc}에서 {task}는 화재로 인해 흡착된 해로운 그을음 탄소 가루를 정화하고, 구조체에 밴 매연 냄새를 저감하여 일상 복귀를 돕는 작업입니다.",
        "쓰레기집청소": "{loc}에서 {task}는 대량의 쓰레기와 음식물 오물로 초파리 및 악취가 발생한 거주 공간을 프라이버시 보호 하에 신속하고 깨끗하게 복구하는 청소입니다.",
        "바닥청소": "{loc}에서 {task}는 상가 바닥의 누적 오염이나 공장의 유분 얼룩을 재질 맞춤형 세척 장비(돌돌이 등)를 가동하여 말끔히 제거하는 전문 세척입니다.",
        "바닥왁스코팅": "{loc}에서 {task}는 데코타일 등 바닥재에 미세 스크래치와 변색이 생기지 않도록 보호막을 씌워 오염 방지와 손쉬운 관리를 제공합니다.",
        "어닝청소": "{loc}에서 {task}는 매장 외관의 첫인상을 좌우하는 어닝 천막 원단의 매연 먼지와 곰팡이 포자를 원단 훼손 없이 불려내는 스팀 클리닝입니다.",
        "간판청소": "{loc}에서 {task}는 브랜드 얼굴인 간판 외관과 채널 글자 틈새에 쌓인 오염을 고소작업 장비로 안전하게 정밀 세정하여 가독성을 높입니다.",
        "인테리어 후 청소": "{loc}에서 {task}는 실내 공사 후 눈에 보이지 않는 경첩 틈새, 서랍 밑바닥에 가라앉은 초미세 시멘트 톱밥 가루를 정밀 제거하는 청소입니다.",
        "특수청소": "{loc}에서 {task}는 일반 물청소로 지워지지 않는 동물 대소변 냄새, 침수 피해 뻘흙, 혈흔 등 고난도 오염원을 위생 소독하는 특수 대응 작업입니다.",
        "종합청소": "{loc}에서 {task}는 다양한 복합 오염 구역을 효율적으로 정돈하기 위해, 구조물의 특성과 고객님의 요구 사양에 맞춰 토탈 케어를 적용하는 맞춤형 클리닝입니다."
    };

    // FAQ 데이터는 SERVICES_DATA의 각 서비스별 faq 배열을 동적으로 참조하여 getDesc 헬퍼로 치환하므로 하드코딩 맵을 사용하지 않습니다.

    const titleStr = `${displayLoc} ${displayTask} 전문 클린폼 | ${displayLoc} ${displayTask} 견적 상담`;
    const descStr = `${displayLoc} ${displayTask}이 필요하다면 클린폼에서 현장 상태, 오염도, 면적 기준으로 작업 가능 여부와 견적 범위를 안내합니다. ${displayLoc} ${displayTask} 상담 가능.`;
    const h1Str = `${displayLoc} ${displayTask} 전문 클린폼`;

    const getDesc = (tmpl) => {
        if (!tmpl) return '';
        const marker = getTopicMarker(displayTask);
        const subjectMarker = getSubjectMarker(displayTask);
        return tmpl
            .replace(/{loc}/g, displayLoc)
            .replace(/{task}는/g, `${displayTask}${marker}`)
            .replace(/{task}은/g, `${displayTask}${marker}`)
            .replace(/{task}가/g, `${displayTask}${subjectMarker}`)
            .replace(/{task}이/g, `${displayTask}${subjectMarker}`)
            .replace(/{task}/g, displayTask);
    };

    const heroDesc = getDesc(heroDescTemplate[displayTask] || heroDescTemplate["종합청소"]);
    const needDesc = getDesc(needDescTemplate[displayTask] || needDescTemplate["종합청소"]);

    // 1. title 치환
    html = html.replace(/<title id="seo-title"[^>]*>([\s\S]*?)<\/title>/i, `<title id="seo-title" data-seo="target">${titleStr}</title>`);

    // 2. meta description 치환
    html = html.replace(/<meta name="description" id="seo-desc"[^>]*>/i, `<meta name="description" id="seo-desc" data-seo="target" content="${descStr}">`);

    // 3. og:title 치환
    html = html.replace(/<meta property="og:title" id="seo-og-title"[^>]*>/i, `<meta property="og:title" id="seo-og-title" data-seo="target" content="${titleStr}">`);

    // 4. og:description 치환
    html = html.replace(/<meta property="og:description" id="seo-og-desc"[^>]*>/i, `<meta property="og:description" id="seo-og-desc" data-seo="target" content="${descStr}">`);

    // 5. og:image 치환
    const imagePath = displayTask === '종합청소' ? `${protocol}://${host}/images/cleanforme/hero-cleaning.webp` : `${protocol}://${host}/images/cleanforme/${taskData.imageKey}`;
    html = html.replace(/<meta property="og:image"[^>]*>/i, `<meta property="og:image" content="${imagePath}">`);

    // 6. canonical 및 og:url 삽입 (head 닫는 태그 직전)
    const headInsert = `    <link rel="canonical" href="${canonicalUrl}">\n    <meta property="og:url" content="${canonicalUrl}">\n</head>`;
    html = html.replace(/<\/head>/i, headInsert);

    // 7. H1 (hero-heading) 치환
    html = html.replace(/<h1 id="hero-heading"[^>]*>([\s\S]*?)<\/h1>/i, `<h1 id="hero-heading" data-seo="target">${h1Str}</h1>`);

    // 8. hero-subtitle 치환
    html = html.replace(/<p class="hero-subtitle">([\s\S]*?)<\/p>/i, `<p class="hero-subtitle">${heroDesc}</p>`);

    // 9. hero-bg-img 치환
    const heroImgSrc = displayTask === '종합청소' ? '/images/cleanforme/hero-cleaning.webp' : `/images/cleanforme/${taskData.imageKey}`;
    html = html.replace(/<img id="hero-bg-img"[^>]*>/i, `<img id="hero-bg-img" class="hero-bg-img" src="${heroImgSrc}" alt="${h1Str}">`);

    // 10. hero-features 치환
    if (taskData.shortBullets) {
        const listHtml = taskData.shortBullets.map(point => `<li>${point}</li>`).join('\n                        ');
        html = html.replace(/<ul class="hero-features">([\s\S]*?)<\/ul>/i, `<ul class="hero-features">\n                        ${listHtml}\n                    </ul>`);
    }

    // 11. need-situation-heading 치환
    html = html.replace(/<h2 id="need-situation-heading"[^>]*>([\s\S]*?)<\/h2>/i, `<h2 id="need-situation-heading" class="section-title text-center">${displayLoc} ${displayTask}이 필요한 상황</h2>`);

    // 12. need-situation-desc 치환
    html = html.replace(/<p id="need-situation-desc">([\s\S]*?)<\/p>/i, `<p id="need-situation-desc">${needDesc}</p>`);

    // 13. pain-point-heading 치환
    const painLocStr = displayLoc ? `${displayLoc} ` : `수도권 전 지역, `;
    html = html.replace(/<h2 id="pain-point-heading"[^>]*>([\s\S]*?)<\/h2>/i, `<h2 id="pain-point-heading" class="section-title text-center">${painLocStr}청소 업체 선택 전 확인해야 할 3가지</h2>`);

    // 14. work-scope-heading 치환
    html = html.replace(/<h2 id="work-scope-heading"[^>]*>([\s\S]*?)<\/h2>/i, `<h2 id="work-scope-heading" class="section-title text-center">${displayLoc} ${displayTask} 작업 범위</h2>`);

    // 15. work-scope-list 치환
    if (taskData.workScope) {
        const scopeHtml = taskData.workScope.map(item => `<div class="work-scope-item">${item}</div>`).join('\n                    ');
        html = html.replace(/<div class="work-scope-grid" id="work-scope-list">([\s\S]*?)<\/div>/i, `<div class="work-scope-grid" id="work-scope-list">\n                    ${scopeHtml}\n                </div>`);
    }

    // 16. possible-works-heading / possible-works-subtitle / highlight-task / marquee alt 치환
    html = html.replace(/<h2 class="section-title text-center" id="possible-works-heading">([\s\S]*?)<\/h2>/i, `<h2 class="section-title text-center" id="possible-works-heading">${displayLoc}에서 가능한 청소 작업</h2>`);
    
    const worksSubtitle = `${displayLoc} ${displayTask} 외에도 외벽, 유리창, 바닥, 준공, 후드, 특수청소 등 현장 상태에 맞춰 상담이 가능합니다.`;
    html = html.replace(/<p class="section-subtitle text-center" id="possible-works-subtitle">([\s\S]*?)<\/p>/i, `<p class="section-subtitle text-center" id="possible-works-subtitle">${worksSubtitle}</p>`);

    const highlightKey = Object.keys(taskMap).find(k => taskMap[k] === displayTask);
    if (highlightKey) {
        const spanRegex = new RegExp(`data-task="${highlightKey}"`, 'g');
        html = html.replace(spanRegex, `data-task="${highlightKey}" class="highlight-task"`);
    }

    html = html.replace(/data-base-alt="([^"]*)"\s+alt="[^"]*"/g, `data-base-alt="$1" alt="${displayLoc} $1"`);

    // 17. process-heading 치환
    html = html.replace(/<h2 id="process-heading"[^>]*>([\s\S]*?)<\/h2>/i, `<h2 id="process-heading" class="section-title text-center">${displayLoc} ${displayTask} 케어 프로세스</h2>`);

    // 18. mid-cta-text 치환
    html = html.replace(/<p id="mid-cta-text">([\s\S]*?)<\/p>/i, `<p id="mid-cta-text">${displayLoc} ${displayTask} 견적 상담<br>오염도와 면적에 따라 투명하게 산정되는 맞춤 견적</p>`);

    // 19. pc-cta-btn 치환
    const fullCtaText = `${displayLoc} ${displayTask} 전화 상담 바로 연결`;
    html = html.replace(/<a href="tel:" id="pc-cta-btn"[^>]*>([\s\S]*?)<\/a>/i, `<a href="tel:" id="pc-cta-btn" class="btn-pc-cta phone-link" aria-label="${fullCtaText}" title="${fullCtaText}">전화 상담 바로 연결</a>`);

    // 20. mo-cta-text 치환
    html = html.replace(/<span id="mo-cta-text" class="mo-cta-title">([\s\S]*?)<\/span>/i, `<span id="mo-cta-text" class="mo-cta-title">${displayLoc} ${displayTask} 상담</span>`);

    // 21. FAQ 치환
    if (taskData.faq && taskData.faq.length >= 3) {
        const q1Text = getDesc(taskData.faq[0].q);
        const a1Text = getDesc(taskData.faq[0].a);
        const q2Text = getDesc(taskData.faq[1].q);
        const a2Text = getDesc(taskData.faq[1].a);
        const q3Text = getDesc(taskData.faq[2].q);
        const a3Text = getDesc(taskData.faq[2].a);

        html = html.replace(/<summary id="faq-q1">[\s\S]*?<\/summary>(\s*)<div class="faq-answer">[\s\S]*?<\/div>/i, 
            `<summary id="faq-q1">Q. ${q1Text}</summary>$1<div class="faq-answer">\n                            ${a1Text}\n                        </div>`);

        html = html.replace(/<summary id="faq-q2">[\s\S]*?<\/summary>(\s*)<div class="faq-answer">[\s\S]*?<\/div>/i, 
            `<summary id="faq-q2">Q. ${q2Text}</summary>$1<div class="faq-answer">\n                            ${a2Text}\n                        </div>`);

        html = html.replace(/<summary id="faq-q3">[\s\S]*?<\/summary>(\s*)<div class="faq-answer">[\s\S]*?<\/div>/i, 
            `<summary id="faq-q3">Q. ${q3Text}</summary>$1<div class="faq-answer">\n                            ${a3Text}\n                        </div>`);
    }

    // 22. Footer 관련 링크 치환
    const candidateTasks = ["준공청소", "바닥청소", "유리창청소", "특수청소", "외벽청소", "후드청소"];
    const selectedTasks = candidateTasks.filter(t => t !== displayTask).slice(0, 4);
    const linksList = [];
    selectedTasks.forEach(task => {
        linksList.push({
            label: `${displayLoc} ${task}`,
            url: `/?k=${encodeURIComponent(displayLoc + '-' + task.replace(/\s+/g, ''))}`
        });
    });

    const candidateLocs = ["성남", "과천", "수원", "안양", "용인", "고양", "인천", "분당"];
    const selectedLocs = candidateLocs.filter(l => l !== displayLoc && `${l}시` !== displayLoc && `${displayLoc}`.indexOf(l) === -1).slice(0, 3);
    selectedLocs.forEach(locVal => {
        linksList.push({
            label: `${locVal} ${displayTask}`,
            url: `/?k=${encodeURIComponent(locVal + '-' + displayTask.replace(/\s+/g, ''))}`
        });
    });

    let linksHtml = linksList.map(l => `<a href="${l.url}" class="footer-chip">${l.label}</a>`).join('\n                            ');
    linksHtml += `\n                            <a href="/seo-hub" class="footer-chip view-all-link">전체 서비스 지역 및 작업 보기</a>`;

    html = html.replace(/<div id="footer-related-links" class="footer-chips">([\s\S]*?)<\/div>/i, 
        `<div id="footer-related-links" class="footer-chips">\n                            ${linksHtml}\n                        </div>`);

    return sendHtml(html);
};
