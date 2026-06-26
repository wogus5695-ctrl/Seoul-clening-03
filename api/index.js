const fs = require('fs');
const path = require('path');
const { SERVICES_DATA } = require('../js/data/services.js');
const { SITE_CONFIG } = require('../js/config.js');

module.exports = (req, res) => {
    // 최종 응답 전송 헬퍼 (연락처 치환 일원화)
    function sendHtml(htmlContent) {
        if (SITE_CONFIG && SITE_CONFIG.CONTACT_PHONE) {
            htmlContent = htmlContent.replace(/href="tel:010-8189-6900"/g, "href=\"tel:" + SITE_CONFIG.CONTACT_PHONE + "\"");
            htmlContent = htmlContent.replace(/010-8189-6900/g, SITE_CONFIG.CONTACT_PHONE);
        }
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(200).send(htmlContent);
    }
    // 1. URLSearchParams 또는 req.query.k 로 k 값을 가져옵니다.
    // Vercel Serverless Function 에서는 req.query.k 로 query parameter에 직접 접근할 수 있습니다.
    const keywordRaw = (req.query && req.query.k) || '';
    
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
        const host = req.headers.host || 'www.cleanforme.co.kr';
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
    let loc = '성남·과천·수원';
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

    const host = req.headers.host || 'www.cleanforme.co.kr';
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

    const needSituationHeadingTemplate = {
        "외벽청소": "외부 오염은 접근 방식부터 달라야 합니다",
        "유리창청소": "유리 상태에 맞춰 물때와 먼지를 제거합니다",
        "화재청소": "그을음과 냄새는 초기 확인이 중요합니다",
        "바닥왁스코팅": "바닥 상태에 맞춰 세척과 코팅을 구분합니다",
        "바닥청소": "바닥 재질과 오염도에 따라 방식이 달라집니다",
        "어닝청소": "외부 노출 오염은 소재 상태를 먼저 확인합니다",
        "간판청소": "간판은 밝기와 외관 이미지가 중요합니다",
        "인테리어 후 청소": "공사 후 남는 미세 분진까지 확인합니다",
        "준공청소": "입주 전 마감 상태를 기준으로 정리합니다",
        "후드청소": "기름때와 악취는 내부 오염 확인이 먼저입니다",
        "쓰레기집청소": "폐기물과 악취를 단계별로 정리합니다",
        "특수청소": "일반 청소로 어려운 현장을 구분해 대응합니다",
        "종합청소": "이런 상황이라면 전문 청소가 필요합니다"
    };

    const faqSpecialKeywordMap = {
        "외벽청소": "건물 높이와 외벽 재질",
        "유리창청소": "고층 유리창 및 외부 창 접근 여부",
        "화재청소": "그을음 범위와 냄새 오염",
        "바닥왁스코팅": "바닥 타일 종류 및 보행 동선",
        "바닥청소": "바닥 재질과 찌든 얼룩",
        "어닝청소": "어닝 크기와 곰팡이 오염",
        "간판청소": "간판 종류와 조도 저하 상태",
        "인테리어 후 청소": "공사 후 남은 분진이나 본드 자국",
        "준공청소": "신축 빌딩의 마감 상태와 창틀 먼지",
        "후드청소": "주방 기름때와 후드 내부 오염",
        "쓰레기집청소": "방치 폐기물 부피와 악취 수준",
        "특수청소": "오염물의 종류와 냄새 범위",
        "종합청소": "청소가 필요한 주된 구역"
    };

    const needDescTemplate = {
        "외벽청소": "{loc} {task}는 외벽 오염, 물때, 이끼처럼 직접 닦기 어려운 구역을 깨끗하게 관리하고 건물 노후화를 방지하기 위해 현장 상태에 맞는 전문 장비 구성과 세척을 적용합니다.",
        "유리창청소": "{loc} {task}는 오래된 물때, 유막, 매연 얼룩처럼 직접 닦기 어려운 고층 건물 및 상가의 외부 유리를 전문 세정제와 정밀 스퀴지 작업으로 맑게 복원해 드립니다.",
        "준공청소": "{loc} {task}는 신축·공사 현장의 거친 먼지, 시멘트 가루, 창틀 오염을 입주 및 인도 전에 확인하여 깨끗하게 정돈하는 마감 작업입니다.",
        "후드청소": "{loc} {task}는 식당 주방 후드 내부에 단단히 굳어버린 유증기 기름때와 악취를 용해하여 화재 위험을 예방하고 필요한 범위를 확인해 단계적으로 관리하는 위생 관리 공정입니다.",
        "화재청소": "{loc} {task}는 화재로 인해 실내 구조물에 흡착된 매캐한 그을음 분진과 유독 탄 냄새를 특수 화학적 중화제 및 오존 장비로 복구하는 긴급 대응 서비스입니다.",
        "쓰레기집청소": "{loc} {task}는 대량의 폐기물과 음식물 오물로 악취와 해충이 발생한 공간을 철저한 프라이버시 보호 아래 포장 반출부터 고강도 방역 살균까지 종합 정리합니다.",
        "바닥청소": "{loc} {task}는 매장이나 사무실 바닥의 묵은 유분기, 찌든 발자국, 타이어 자국 등을 바닥재 특성에 알맞은 기계 세척(돌돌이 등)으로 제거하여 쾌적한 보행 환경을 만듭니다.",
        "바닥왁스코팅": "{loc} {task}는 데코타일 등 바닥재의 스크래치와 변색을 예방하기 위해 표면을 정밀 기계로 박리 세척한 뒤 최고급 수지 왁스를 도포하여 표면 보호막과 광택을 입히는 시공입니다.",
        "어닝청소": "{loc} {task}는 외부 대기 오염과 매연으로 얼룩진 어닝 천막 원단의 묵은 때와 검은 곰팡이를 섬유 손상 없이 온수 고압수 및 특수 스팀으로 불려내 지워내는 스팀 클리닝입니다.",
        "간판청소": "{loc} {task}는 브랜드의 얼굴인 간판 외관과 채널 글자 틈새에 고착된 매연 먼지와 거미줄을 고소작업 차량(스카이차)을 활용해 안전하고 선명하게 고압 약품 세척합니다.",
        "인테리어 후 청소": "{loc} {task}는 실내 인테리어 공사 후 수납장 경첩 틈새, 레일 밑바닥, 몰딩 주변에 얇게 밀착되어 건강을 위협하는 미세 시멘트와 톱밥 가루를 디테일하게 정밀 흡입해 드립니다.",
        "특수청소": "{loc} {task}는 반려동물 방치 오염, 하수구 역류, 혈흔 등 일반적인 물청소나 화학 세제로 제거하기 힘든 악성 오염원과 바이러스를 전문 약품으로 긴급 방역 소독합니다.",
        "종합청소": "{loc} {task}가 필요하다면 공사 후 분진이 남아 있거나, 유리창·바닥·후드·외벽처럼 직접 청소하기 어려운 구역을 전문 장비와 인력을 투입해 합리적으로 토탈 케어해 드립니다."
    };

    // FAQ 데이터는 SERVICES_DATA의 각 서비스별 faq 배열을 동적으로 참조하여 getDesc 헬퍼로 치환하므로 하드코딩 맵을 사용하지 않습니다.

    const titleStr = `${displayLoc} ${displayTask} 전문 클린폼 | ${displayLoc} ${displayTask} 견적 상담`;
    const descStr = `${displayLoc}에서 ${displayTask}가 필요하다면 클린폼에서 현장 상태, 오염도, 면적 기준으로 작업 가능 여부와 견적 범위를 안내합니다. ${displayLoc} ${displayTask} 상담 가능.`;
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
    const needHeadingText = needSituationHeadingTemplate[displayTask] || needSituationHeadingTemplate["종합청소"];
    html = html.replace(/<h2 id="need-situation-heading"[^>]*>([\s\S]*?)<\/h2>/i, `<h2 id="need-situation-heading" class="section-title text-center">${needHeadingText}</h2>`);

    // 12. need-situation-desc 치환
    html = html.replace(/<p id="need-situation-desc">([\s\S]*?)<\/p>/i, `<p id="need-situation-desc">${needDesc}</p>`);

    // 13. pain-point-heading 치환
    html = html.replace(/<h2 id="pain-point-heading"[^>]*>([\s\S]*?)<\/h2>/i, `<h2 id="pain-point-heading" class="section-title text-center">업체 선택 전 확인할 3가지</h2>`);

    // 14. work-scope-heading 치환
    html = html.replace(/<h2 id="work-scope-heading"[^>]*>([\s\S]*?)<\/h2>/i, `<h2 id="work-scope-heading" class="section-title text-center">청소 범위는 현장 상태를 보고 정합니다</h2>`);

    // 15. work-scope-list 치환 제거 (템플릿의 정적 벤다이어그램 및 모바일 단계 카드 구조를 유지하기 위해 비활성화)

    // 16. possible-works-heading / possible-works-subtitle / highlight-task / marquee alt 치환
    html = html.replace(/<h2 class="section-title text-center" id="possible-works-heading">([\s\S]*?)<\/h2>/i, `<h2 class="section-title text-center" id="possible-works-heading">클린폼에서 상담 가능한 청소 작업</h2>`);
    
    const worksSubtitle = `${displayLoc} ${displayTask} 외에도 외벽, 유리창, 바닥, 준공, 후드, 특수청소 등 현장 상태에 맞춰 상담이 가능합니다.`;
    html = html.replace(/<p class="section-subtitle text-center" id="possible-works-subtitle">([\s\S]*?)<\/p>/i, `<p class="section-subtitle text-center" id="possible-works-subtitle">${worksSubtitle}</p>`);

    const highlightKey = Object.keys(taskMap).find(k => taskMap[k] === displayTask);
    if (highlightKey) {
        const spanRegex = new RegExp(`data-task="${highlightKey}"`, 'g');
        html = html.replace(spanRegex, `data-task="${highlightKey}" class="highlight-task"`);
    }

    html = html.replace(/data-base-alt="([^"]*)"\s+alt="[^"]*"/g, `data-base-alt="$1" alt="${displayLoc} $1"`);

    // 17. process-heading 치환
    html = html.replace(/<h2 id="process-heading"[^>]*>([\s\S]*?)<\/h2>/i, `<h2 id="process-heading" class="section-title text-center">상담부터 작업 확인까지</h2>`);

    // 18. mid-cta-text 치환
    html = html.replace(/<p id="mid-cta-text">([\s\S]*?)<\/p>/i, `<p id="mid-cta-text">정확히 설명하지 않으셔도 됩니다. 지역과 청소 종류만 말씀해주시면 상담 중 확인해 드립니다.<br>전화로 작업 가능 여부를 빠르게 안내받으세요.</p>`);

    // 19. pc-cta-btn 치환
    const fullCtaText = `${displayLoc} ${displayTask} 전화 상담 바로 연결`;
    html = html.replace(/<a href="tel:[^"]*" id="pc-cta-btn"[^>]*>([\s\S]*?)<\/a>/i, `<a href="tel:010-8189-6900" id="pc-cta-btn" class="btn-pc-cta phone-link" aria-label="${fullCtaText}" title="${fullCtaText}">전화 상담 바로 연결</a>`);

    // 20. mo-cta-text 치환
    html = html.replace(/<span id="mo-cta-text" class="mo-cta-title">([\s\S]*?)<\/span>/i, `<span id="mo-cta-text" class="mo-cta-title">${displayLoc} ${displayTask} 상담</span>`);

    // 21. FAQ 치환
    if (taskData.faq && taskData.faq.length >= 3) {
        const specialKeyword = faqSpecialKeywordMap[displayTask] || faqSpecialKeywordMap["종합청소"];
        
        const q1Text = `${displayLoc} ${displayTask} 상담 시 무엇을 먼저 알려드리면 되나요?`;
        const a1Text = `지역, 공간 규모, ${specialKeyword} 상태를 알려주시면 작업 가능 여부부터 안내합니다. 정확히 설명하지 않으셔도 상담 중 필요한 내용을 순서대로 확인합니다.`;
        
        const q2Text = `원하는 청소 작업이 가능한지 어떻게 확인하나요?`;
        const a2Text = `외벽, 유리창, 바닥, 준공, 후드, 특수청소 등 작업 종류와 현장 상태를 기준으로 가능 여부를 확인합니다. 필요한 경우 사진이나 현장 조건을 추가로 확인할 수 있습니다.`;
        
        const q3Text = `비용은 언제 안내받을 수 있나요?`;
        const a3Text = `현장 상태와 작업 범위를 확인한 뒤 전화 상담에서 예상 범위를 안내합니다. 무리하게 정해진 금액을 제시하기보다 필요한 범위를 먼저 확인합니다.`;

        const q4Text = `작업 전 준비해야 할 것이 있나요?`;
        const a4Text = `가능하다면 작업 위치, 면적, 오염 상태, 출입 가능 시간 정도를 알려주시면 상담이 빨라집니다. 현장 상황에 따라 별도 준비가 필요 없는 경우도 있습니다.`;

        const q5Text = `야간이나 주말 작업도 가능한가요?`;
        const a5Text = `작업 종류와 지역, 일정에 따라 야간·주말 작업 가능 여부를 확인합니다. 상담 시 희망 일정을 함께 알려주시면 조율 가능 여부를 안내합니다.`;

        html = html.replace(/<summary id="faq-q1">[\s\S]*?<\/summary>(\s*)<div class="faq-answer">[\s\S]*?<\/div>/i, 
            `<summary id="faq-q1">Q. ${q1Text}</summary>$1<div class="faq-answer">\n                            ${a1Text}\n                        </div>`);

        html = html.replace(/<summary id="faq-q2">[\s\S]*?<\/summary>(\s*)<div class="faq-answer">[\s\S]*?<\/div>/i, 
            `<summary id="faq-q2">Q. ${q2Text}</summary>$1<div class="faq-answer">\n                            ${a2Text}\n                        </div>`);

        html = html.replace(/<summary id="faq-q3">[\s\S]*?<\/summary>(\s*)<div class="faq-answer">[\s\S]*?<\/div>/i, 
            `<summary id="faq-q3">Q. ${q3Text}</summary>$1<div class="faq-answer">\n                            ${a3Text}\n                        </div>`);

        html = html.replace(/<summary id="faq-q4">[\s\S]*?<\/summary>(\s*)<div class="faq-answer">[\s\S]*?<\/div>/i, 
            `<summary id="faq-q4">Q. ${q4Text}</summary>$1<div class="faq-answer">\n                            ${a4Text}\n                        </div>`);

        html = html.replace(/<summary id="faq-q5">[\s\S]*?<\/summary>(\s*)<div class="faq-answer">[\s\S]*?<\/div>/i, 
            `<summary id="faq-q5">Q. ${q5Text}</summary>$1<div class="faq-answer">\n                            ${a5Text}\n                        </div>`);
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

    const candidateLocs = ["성남", "과천", "수원", "분당"];
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
