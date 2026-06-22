// seo-engine.js
// 클린폼 동적 SEO 라우팅 및 데이터 렌더링 엔진 (Vanilla JS ES6+)
// 의존성: js/config.js, js/data/tasks.js, js/data/regions.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. URL 파라미터 파싱
    const urlParams = new URLSearchParams(window.location.search);
    let loc = urlParams.get('loc') || '';
    let taskName = urlParams.get('task') || '';
    
    // 디폴트 텍스트 매핑 (빈 값이면 수도권 종합청소)
    const displayLoc = loc || '수도권';
    const displayTask = taskName || '종합청소';
    
    // 외부 매트릭스(js/data/tasks.js)에서 데이터 추출
    const taskData = TASK_MATRIX[displayTask] || TASK_MATRIX['종합청소'];
    
    // 2. 변환 텍스트 셋업
    const titleStr = `${displayLoc} ${displayTask} 전문 ${SITE_CONFIG.BRAND_NAME} | 외벽·유리창·준공·특수청소`;
    const descStr = `${SITE_CONFIG.BRAND_NAME}은 ${displayLoc} 지역의 ${displayTask} 상담을 제공합니다. ${taskData.points.join(', ')}. 현장 상태와 오염도 기준으로 견적 범위를 안내합니다.`;
    const h1Str = `${displayLoc} ${displayTask} 전문 ${SITE_CONFIG.BRAND_NAME}`;
    const ctaStr = `👉 ${displayLoc} ${displayTask} 1분 직통 견적`;

    // 4. 실시간 동적 치환 (DOM Manipulation)
    
    // SEO & Headings
    const setInner = (id, text) => { const el = document.getElementById(id); if (el) el.innerText = text; };
    const setContent = (id, text) => { const el = document.getElementById(id); if (el) el.setAttribute('content', text); };

    setInner('seo-title', titleStr);
    setContent('seo-desc', descStr);
    setContent('seo-og-title', titleStr);
    setContent('seo-og-desc', descStr);
    setInner('hero-heading', h1Str);

    // Hero Features
    const heroFeatures = document.querySelector('.hero-features');
    if (heroFeatures) {
        heroFeatures.innerHTML = taskData.points.map(point => `<li>${point}</li>`).join('');
    }

    // Hero Background
    const heroImgEl = document.getElementById('hero-bg-img');
    if (heroImgEl) {
        const imagePath = displayTask === '종합청소' ? './hero_bg.png' : `./images/${taskData.image}`;
        heroImgEl.setAttribute('src', imagePath);
        heroImgEl.setAttribute('alt', `${displayLoc} ${displayTask} 전문 클린폼 작업 사례`);
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

    // 2. 프로세스 섹션
    setInner('process-heading', `${displayTask} 전문 케어 프로세스`);
    const processSteps = document.getElementById('process-steps');
    if (processSteps && taskData.process) {
        processSteps.innerHTML = taskData.process.map((step, idx) => `
            <div class="process-card">
                <div class="step-num">STEP ${idx + 1}</div>
                <div class="step-desc">${step}</div>
            </div>
        `).join('');
    }

    // 3. 미드 페이지 긴급 CTA
    setInner('mid-cta-text', `🚨 더 이상 비교하느라 시간 낭비하지 마세요. 지금 바로 전화하시면 ${displayLoc} 담당 팀장이 1분 만에 가견적을 뽑아드립니다.`);

    // 4. FAQ 섹션 동적 키워드
    setInner('faq-q1', `${displayLoc} ${displayTask} 비용 산정 기준은 어떻게 되나요?`);
    setInner('faq-q2', `야간이나 주말에도 ${displayLoc} 작업이 가능한가요?`);
});
