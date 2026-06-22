// seo-engine.js
// 클린폼 동적 SEO 라우팅 및 데이터 렌더링 엔진 (Vanilla JS ES6+)
// 의존성: js/config.js, js/data/tasks.js, js/data/regions.js

document.addEventListener('DOMContentLoaded', () => {
    // 임시 Slug 역맵핑 헬퍼 (실제 프로덕션에서는 매핑 테이블 객체로 분리 권장)
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

    // 1. 기존 파라미터 기반 추출
    const urlParams = new URLSearchParams(window.location.search);
    let loc = urlParams.get('loc');
    let taskName = urlParams.get('task');

    // 2. 패스 기반 동적 라우팅 추출 (예: /gyeonggi/seongnam/bundang/exterior-cleaning)
    const pathParts = window.location.pathname.split('/').filter(p => p);
    if (pathParts.length >= 3 && pathParts[0] === 'gyeonggi') {
        const citySlug = pathParts[1];
        const serviceSlug = pathParts[pathParts.length - 1];

        if (typeof SERVICES_DATA !== 'undefined') {
            const foundService = SERVICES_DATA.find(s => s.serviceSlug === serviceSlug);
            if (foundService) taskName = foundService.serviceNameKo;
            else console.error("404 Not Found: Service slug doesn't exist");
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
                if (!loc) console.error("404 Not Found: Region slug doesn't exist");
            } else {
                console.error("404 Not Found: City slug doesn't exist");
            }
        }
    }
    
    // 디폴트 텍스트 매핑 (빈 값이면 수도권 종합청소)
    const displayLoc = loc || '수도권';
    const displayTask = taskName || '종합청소';
    
    // 외부 매트릭스(js/data/services.js)에서 데이터 추출
    const taskData = SERVICES_DATA.find(s => s.serviceNameKo === displayTask) || SERVICES_DATA.find(s => s.serviceNameKo === '종합청소');
    
    // 2. 변환 텍스트 셋업 (명시적 SEO 템플릿 적용)
    const titleStr = `${displayLoc} ${displayTask} 전문 클린폼 | 수도권 종합청소 견적 상담`;
    const descStr = `${displayLoc} ${displayTask}이 필요하다면 클린폼에서 현장 상태, 오염도, 면적 기준으로 작업 가능 여부와 견적 범위를 안내합니다. 서울·경기·인천 수도권 종합청소 상담 가능.`;
    const h1Str = taskData.heroTitle;
    const subtitleStr = taskData.heroDescription;
    const ctaStr = `👉 ${displayLoc} ${displayTask} 1분 직통 견적`;

    // 4. 실시간 동적 치환 (DOM Manipulation)
    
    // SEO & Headings
    const setInner = (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; };
    const setContent = (id, text) => { const el = document.getElementById(id); if (el) el.setAttribute('content', text); };

    // Set title directly to document (since some browsers don't observe id on title tag)
    document.title = titleStr;
    const seoTitleEl = document.getElementById('seo-title');
    if (seoTitleEl) seoTitleEl.innerText = titleStr;

    setContent('seo-desc', descStr);
    setContent('seo-og-title', titleStr);
    setContent('seo-og-desc', descStr);

    // Canonical & URL injection
    const canonicalUrl = window.location.origin + window.location.pathname;
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
    setInner('hero-heading', h1Str);

    const subtitleEl = document.querySelector('.hero-subtitle');
    if (subtitleEl) subtitleEl.innerText = subtitleStr;

    // Hero Features
    const heroFeatures = document.querySelector('.hero-features');
    if (heroFeatures) {
        heroFeatures.innerHTML = taskData.shortBullets.map(point => `<li>${point}</li>`).join('');
    }

    // Hero Background
    const heroImgEl = document.getElementById('hero-bg-img');
    if (heroImgEl) {
        const imagePath = displayTask === '종합청소' ? './hero_bg.png' : `./images/${taskData.imageKey}`;
        heroImgEl.setAttribute('src', imagePath);
        heroImgEl.setAttribute('alt', `${displayLoc} ${displayTask} 전문 클린폼 작업 사례`);
    }

    // Process Cards (workScope mapping)
    const processCards = document.querySelectorAll('.process-card .step-desc');
    if (processCards.length === 4 && taskData.workScope && taskData.workScope.length >= 4) {
        processCards.forEach((card, index) => {
            card.innerText = taskData.workScope[index];
        });
    }

    // FAQ mapping
    if (taskData.faq && taskData.faq.length >= 2) {
        const faqQ1 = document.getElementById('faq-q1');
        const faqQ2 = document.getElementById('faq-q2');
        if (faqQ1) {
            faqQ1.innerText = taskData.faq[0].q;
            faqQ1.nextElementSibling.innerText = taskData.faq[0].a;
        }
        if (faqQ2) {
            faqQ2.innerText = taskData.faq[1].q;
            faqQ2.nextElementSibling.innerText = taskData.faq[1].a;
        }
    }

    // CTA Texts
    const moCta = document.getElementById('cta-dynamic-text');
    if (moCta) moCta.innerText = `${displayLoc} ${displayTask}`;

    // 연락처 하드코딩 제거 및 치환
    document.querySelectorAll('a[href^="tel:"]').forEach(el => el.setAttribute('href', `tel:${SITE_CONFIG.CONTACT_PHONE}`));
    document.querySelectorAll('a[href^="sms:"]').forEach(el => el.setAttribute('href', `sms:${SITE_CONFIG.CONTACT_SMS}`));
    document.querySelectorAll('.phone-display').forEach(el => el.innerText = SITE_CONFIG.CONTACT_PHONE);

    // ----------------------------------------------------
    // [고도화 섹션 동적 변환 로직]
    // ----------------------------------------------------

    // 1. Pain Point 섹션 (지역명 결합)
    // "수도권 전 지역, [지역명] 사장님들이 클린폼만 고집하는 3가지 이유"
    const painLocStr = loc ? `${loc} 사장님들이` : `수도권 고객님들이`;
    setInner('pain-point-heading', `수도권 전 지역, ${painLocStr} 클린폼만 고집하는 3가지 이유`);

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
                cardsHtml += `
                    <div class="s-card">
                        <h3>${s.serviceNameKo}</h3>
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
