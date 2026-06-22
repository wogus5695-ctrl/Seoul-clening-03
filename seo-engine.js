// seo-engine.js
// 클린폼 동적 SEO 라우팅 및 데이터 렌더링 엔진 (Vanilla JS ES6+)

document.addEventListener('DOMContentLoaded', () => {
    // 임시 Slug 역맵핑 헬퍼
    const slugMap = {
        "수정구": "sujeong", "중원구": "jungwon", "분당구": "bundang",
        "장안구": "jangan", "권선구": "gwonseon", "팔달구": "paldal", "영통구": "yeongtong",
        "정자동": "jeongja-dong", "판교동": "pangyo-dong", "광교동": "gwanggyo-dong", "중앙동": "jungang-dong",
        "분당동": "bundang-dong", "서현동": "seohyeon-dong", "영통동": "yeongtong-dong"
    };
    function getSlug(koreanStr) {
        if (slugMap[koreanStr]) return slugMap[koreanStr];
        return koreanStr.replace(/[동구시]$/, '').toLowerCase() + (koreanStr.endsWith('동') ? '-dong' : '');
    }

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

    function getKeywordUrl(locStr, taskStr) {
        const urlTask = taskStr.replace(/\s+/g, '');
        return `/?k=${encodeURIComponent(locStr + '-' + urlTask)}`;
    }

    // 1. 기존 ?k= 파라미터 기반 추출 (우선 적용)
    const urlParams = new URLSearchParams(window.location.search);
    const keywordRaw = urlParams.get('k');
    let loc = null;
    let taskName = null;

    if (keywordRaw) {
        const keyword = decodeURIComponent(keywordRaw);
        const hyphenIndex = keyword.indexOf('-');
        if (hyphenIndex !== -1) {
            loc = keyword.substring(0, hyphenIndex).trim();
            const taskPart = keyword.substring(hyphenIndex + 1).replace(/-/g, '').trim();
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
            taskName = taskMap[taskPart] || taskPart;
        } else {
            loc = "수도권";
            taskName = keyword.trim();
        }
    }

    // 백업용 기존 파라미터 추출
    if (!loc && !taskName) {
        loc = urlParams.get('loc');
        taskName = urlParams.get('task');
    }

    // 2. 패스 기반 동적 라우팅 추출 (백업용)
    const pathParts = window.location.pathname.split('/').filter(p => p);
    if (!loc && pathParts.length >= 3 && pathParts[0] === 'gyeonggi') {
        const citySlug = pathParts[1];
        const serviceSlug = pathParts[pathParts.length - 1];

        if (typeof SERVICES_DATA !== 'undefined') {
            const foundService = SERVICES_DATA.find(s => s.serviceSlug === serviceSlug);
            if (foundService) taskName = foundService.serviceNameKo;
        }

        if (typeof GYEONGGI_REGIONS !== 'undefined') {
            const region = GYEONGGI_REGIONS.find(r => r.citySlug === citySlug);
            if (region) {
                if (pathParts.length === 3) {
                    loc = region.cityVariants[0]; // 시 단위
                } else if (pathParts.length === 4) {
                    const midSlug = pathParts[2];
                    const dist = region.districts.find(d => (d.slug || getSlug(d.name)) === midSlug);
                    if (dist) loc = dist.name; // 구 단위
                    else loc = region.dongs.find(d => getSlug(d) === midSlug); // 구가 없는 직속 동
                } else if (pathParts.length === 5) {
                    const dongSlug = pathParts[3];
                    loc = region.districts.flatMap(d => d.dongs || []).find(d => getSlug(d) === dongSlug);
                }
            }
        }
    }
    
    // 디폴트 텍스트 매핑 (빈 값이면 수도권 종합청소)
    const displayLoc = loc || '수도권';
    const displayTask = taskName || '종합청소';
    
    // 외부 매트릭스(js/data/services.js)에서 데이터 추출
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
        "외벽청소": "{loc}에서 {task}는 산성비와 대기 먼지로 노후화된 건물 외벽면을 세척하여 본연의 깨끗함을 회복하고, 장기적인 자산 가치 유지를 위해 필수적입니다.",
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
        // 4. 변환 텍스트 셋업 (명시적 SEO 템플릿 적용)
    const titleStr = `${displayLoc} ${displayTask} 전문 클린폼 | ${displayLoc} ${displayTask} 견적 상담`;
    const descStr = `${displayLoc} ${displayTask}이 필요하다면 클린폼에서 현장 상태, 오염도, 면적 기준으로 작업 가능 여부와 견적 범위를 안내합니다. ${displayLoc} ${displayTask} 상담 가능.`;
    const h1Str = `${displayLoc} ${displayTask} 전문 클린폼`;
    
    // Subtitle & First Paragraph Text
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

    // 5. 실시간 동적 치환 (DOM Manipulation)
    const setInner = (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; };
    const setContent = (id, text) => { const el = document.getElementById(id); if (el) el.setAttribute('content', text); };

    // Set title directly to document
    document.title = titleStr;
    const seoTitleEl = document.getElementById('seo-title');
    if (seoTitleEl) seoTitleEl.innerText = titleStr;

    setContent('seo-desc', descStr);
    setContent('seo-og-title', titleStr);
    setContent('seo-og-desc', descStr);

    // Canonical & URL injection
    let canonicalUrl = window.location.origin + window.location.pathname;
    if (keywordRaw) {
        canonicalUrl = window.location.origin + '/?k=' + encodeURIComponent(decodeURIComponent(keywordRaw));
    } else if (urlParams.get('loc') && urlParams.get('task')) {
        canonicalUrl = window.location.origin + '/?k=' + encodeURIComponent(decodeURIComponent(urlParams.get('loc')) + '-' + decodeURIComponent(urlParams.get('task')).replace(/\s+/g, ''));
    }
    
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
        canonicalTag = document.createElement('link');
        canonicalTag.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', canonicalUrl);
    
    let ogUrlTag = document.querySelector('meta[property="og:url"]');
    if (!ogUrlTag) {
        ogUrlTag = document.createElement('meta');
        ogUrlTag.setAttribute('property', 'og:url');
        document.head.appendChild(ogUrlTag);
    }
    ogUrlTag.setAttribute('content', canonicalUrl);

    let ogImageTag = document.querySelector('meta[property="og:image"]');
    if (!ogImageTag) {
        ogImageTag = document.createElement('meta');
        ogImageTag.setAttribute('property', 'og:image');
        document.head.appendChild(ogImageTag);
    }
    const imagePath = displayTask === '종합청소' ? `${window.location.origin}/hero_bg.png` : `${window.location.origin}/images/${taskData.imageKey}`;
    ogImageTag.setAttribute('content', imagePath);
    
    // H1
    setInner('hero-heading', h1Str);

    // Hero 보조문구 (Subtitle)
    const subtitleEl = document.querySelector('.hero-subtitle');
    if (subtitleEl) subtitleEl.innerText = heroDesc;

    // Image alt
    const heroImgEl = document.getElementById('hero-bg-img');
    if (heroImgEl) {
        const imagePath = displayTask === '종합청소' ? './hero_bg.png' : `./images/${taskData.imageKey}`;
        heroImgEl.setAttribute('src', imagePath);
        heroImgEl.setAttribute('alt', `${displayLoc} ${displayTask} 전문 클린폼`);
    }

    // Hero Features
    const heroFeatures = document.querySelector('.hero-features');
    if (heroFeatures && taskData.shortBullets) {
        heroFeatures.innerHTML = taskData.shortBullets.map(point => `<li>${point}</li>`).join('');
    }

    // Section 2: Need Situation Section (첫 번째 본문 설명)
    const needHeading = document.getElementById('need-situation-heading');
    const needDescEl = document.getElementById('need-situation-desc');
    if (needHeading && needDescEl) {
        needHeading.innerText = `${displayLoc} ${displayTask}이 필요한 상황`;
        needDescEl.innerText = needDesc;
    }

    // Section 3: Pain Points (業者 선택 기준)
    const painLocStr = displayLoc ? `${displayLoc} ` : `수도권 전 지역, `;
    setInner('pain-point-heading', `${painLocStr}청소 업체 선택 전 확인해야 할 3가지`);

    // Section 4: 작업 범위 섹션 제목 & 목록
    const workScopeHeading = document.getElementById('work-scope-heading');
    if (workScopeHeading) {
        workScopeHeading.innerText = `${displayLoc} ${displayTask} 작업 범위`;
    }
    const workScopeList = document.getElementById('work-scope-list');
    if (workScopeList && taskData.workScope) {
        workScopeList.innerHTML = taskData.workScope.map(item => `<div class="work-scope-item">${item}</div>`).join('');
    }

    // Section 5: Task Specific Factors List
    const factorsList = document.getElementById('task-specific-factors-list');
    if (factorsList && taskData.estimateFactors) {
        factorsList.innerHTML = taskData.estimateFactors.map(item => `<li>${item}</li>`).join('');
    }

    // Section 6: Process Heading
    const processHeading = document.getElementById('process-heading');
    if (processHeading) {
        processHeading.innerText = `${displayLoc} ${displayTask} 케어 프로세스`;
    }

    // Section 7: FAQs (Dynamic conversion)
    if (taskData.faq && taskData.faq.length >= 3) {
        const faqQ1 = document.getElementById('faq-q1');
        const faqQ2 = document.getElementById('faq-q2');
        const faqQ3 = document.getElementById('faq-q3');

        if (faqQ1 && faqQ2 && faqQ3) {
            faqQ1.innerText = `Q. ${getDesc(taskData.faq[0].q)}`;
            faqQ1.nextElementSibling.innerText = getDesc(taskData.faq[0].a);

            faqQ2.innerText = `Q. ${getDesc(taskData.faq[1].q)}`;
            faqQ2.nextElementSibling.innerText = getDesc(taskData.faq[1].a);

            faqQ3.innerText = `Q. ${getDesc(taskData.faq[2].q)}`;
            faqQ3.nextElementSibling.innerText = getDesc(taskData.faq[2].a);
        }
    }

    // Section 8: Related Links (Footer related links)
    const footerRelatedContainer = document.getElementById('footer-related-links');
    if (footerRelatedContainer) {
        let linksList = [];
        
        // 1. Current location + 4 other related tasks
        const candidateTasks = ["준공청소", "바닥청소", "유리창청소", "특수청소", "외벽청소", "후드청소"];
        const selectedTasks = candidateTasks.filter(t => t !== displayTask).slice(0, 4);
        selectedTasks.forEach(task => {
            linksList.push({
                label: `${displayLoc} ${task}`,
                url: getKeywordUrl(displayLoc, task)
            });
        });
        
        // 2. 3 key regions + current task
        const candidateLocs = ["성남", "과천", "수원"];
        const selectedLocs = candidateLocs.filter(l => l !== displayLoc && `${l}시` !== displayLoc);
        selectedLocs.forEach(locVal => {
            linksList.push({
                label: `${locVal} ${displayTask}`,
                url: getKeywordUrl(locVal, displayTask)
            });
        });
        
        // 3. Construct HTML
        let linksHtml = linksList.map(l => `<a href="${l.url}" class="footer-chip">${l.label}</a>`).join('');
        linksHtml += `<a href="./seo-hub.html" class="footer-chip view-all-link">전체 서비스 지역 및 작업 보기</a>`;
        footerRelatedContainer.innerHTML = linksHtml;
    }

    // 중간 CTA
    const midCtaText = document.getElementById('mid-cta-text');
    if (midCtaText) {
        midCtaText.innerHTML = `${displayLoc} ${displayTask} 견적 상담<br>오염도와 면적에 따라 투명하게 산정되는 맞춤 견적`;
    }

    // PC 신규 CTA 버튼 aria-label/title 동적 치환
    const pcCtaBtn = document.getElementById('pc-cta-btn');
    if (pcCtaBtn) {
        const fullCtaText = `${displayLoc} ${displayTask} 전화 상담 바로 연결`;
        pcCtaBtn.setAttribute('aria-label', fullCtaText);
        pcCtaBtn.setAttribute('title', fullCtaText);
    }
    const moCtaText = document.getElementById('mo-cta-text');
    if (moCtaText) {
        moCtaText.innerText = `${displayLoc} ${displayTask} 상담`;
    }

    // 연락처 하드코딩 제거 및 치환
    if (SITE_CONFIG.CONTACT_PHONE) {
        document.querySelectorAll('a[href^="tel:"]').forEach(el => el.setAttribute('href', `tel:${SITE_CONFIG.CONTACT_PHONE}`));
        document.querySelectorAll('.phone-display').forEach(el => el.innerText = SITE_CONFIG.CONTACT_PHONE);
    }
    if (SITE_CONFIG.CONTACT_SMS) {
        document.querySelectorAll('a[href^="sms:"]').forEach(el => {
            if (el.classList.contains('sms-photo-link')) {
                const smsBody = `[사진 견적 요청] 주소: / 평수: / 희망일정: / 문의내용: (${displayLoc} ${displayTask} 사진을 첨부해 주세요)`;
                el.setAttribute('href', `sms:${SITE_CONFIG.CONTACT_SMS}?body=${encodeURIComponent(smsBody)}`);
            } else {
                el.setAttribute('href', `sms:${SITE_CONFIG.CONTACT_SMS}`);
            }
        });
    }

    // ----------------------------------------------------
    // [서비스 그룹 동적 렌더링 로직]
    // ----------------------------------------------------
    const servicesContainer = document.getElementById('services-container');
    if (servicesContainer && typeof SERVICES_DATA !== 'undefined') {
        const groupsInfo = {
            "건물 외부 청소": {
                desc: "외벽·유리창·어닝·간판처럼 외부 노출이 많은 구역은 오염이 빠르게 쌓이고, 접근 방식에 따라 장비 구성이 달라집니다.",
                bg: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop"
            },
            "바닥·상업공간 청소": {
                desc: "상가, 사무실, 매장 바닥은 오염도와 재질에 따라 세척 방식과 코팅 여부를 구분해야 합니다.",
                bg: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=1974&auto=format&fit=crop"
            },
            "공사·이전 청소": {
                desc: "준공·인테리어 후 공간은 공사 분진, 본드 자국, 마감 오염을 일반 청소와 다르게 확인해야 합니다.",
                bg: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop"
            },
            "고난도 특수 청소": {
                desc: "화재, 쓰레기집, 고오염 현장은 일반 청소보다 악취·폐기물·오염도 기준을 먼저 확인해야 합니다.",
                bg: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2000&auto=format&fit=crop"
            }
        };

        let servicesHtml = '';
        const groupNames = Object.keys(groupsInfo);
        
        groupNames.forEach(groupName => {
            const groupServices = SERVICES_DATA.filter(s => s.groupName === groupName);
            if(groupServices.length === 0) return;
            
            const info = groupsInfo[groupName];
            
            let cardsHtml = '<div class="service-cards-grid">';
            groupServices.forEach(s => {
                const url = getKeywordUrl(displayLoc, s.serviceNameKo);

                cardsHtml += `
                    <div class="s-card">
                        <h3><a href="${url}" style="color:var(--color-accent); text-decoration:none;">${s.serviceNameKo}</a></h3>
                        <p>${s.heroDescription}</p>
                    </div>
                `;
            });
            cardsHtml += '</div>';

            servicesHtml += `
                <article class="service-block group-block">
                    <div class="service-bg" style="background-image: url('${info.bg}');"></div>
                    <div class="service-content">
                        <h2 class="service-title">${groupName}</h2>
                        <p class="service-group-desc">${info.desc}</p>
                        ${cardsHtml}
                    </div>
                </article>
            `;
        });
        
        servicesContainer.innerHTML = servicesHtml;
    }
});
