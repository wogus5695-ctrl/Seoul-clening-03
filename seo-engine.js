// seo-engine.js
// 클린폼 동적 SEO 라우팅 및 데이터 렌더링 엔진 (Vanilla JS ES6+)

document.addEventListener('DOMContentLoaded', () => {
    // 1. 작업명 매트릭스 (12개 핵심 데이터 + 기본값 + 프로세스 확장)
    const taskMatrix = {
        "외벽청소": {
            points: ["고소작업차 및 로프 전문 인력 투입", "외벽 재질별 맞춤 특수 약품 세척", "건물 수명 연장 및 가치 상승 보장"],
            process: ["건물 외벽 재질 및 오염도 진단", "로프/스카이차 배치 및 안전망 확보", "고압 세척 및 전용 약품 도포", "잔수 제거 및 외벽 코팅(옵션)"],
            image: "exterior-wall.jpg"
        },
        "화재청소": {
            points: ["화재 그을음 및 유독가스 완벽 제거", "특수 장비 활용 잔여 악취 탈취", "신속한 복구를 위한 체계화된 프로세스"],
            process: ["현장 화재 피해 규모 파악 및 안전 진단", "폐기물 반출 및 1차 그을음 제거", "유독가스 및 냄새 탈취 특수 시공", "오존 살균 및 최종 공기질 개선"],
            image: "fire-damage.jpg"
        },
        "어닝청소": {
            points: ["천막 손상 없는 고압 스팀 살균", "묵은 찌든 때 및 곰팡이 완벽 제거", "방수 코팅 옵션으로 내구성 강화"],
            process: ["어닝 원단 및 오염 상태 점검", "고온 스팀을 이용한 1차 찌든 때 분해", "전용 세제 브러싱 및 고압 세척", "건조 및 발수/방수 코팅 처리"],
            image: "awning.jpg"
        },
        "인테리어 후 청소": {
            points: ["시공 후 발생한 미세 분진 완벽 흡입", "본드, 실리콘 자국 정밀 제거", "새집증후군 예방을 위한 피톤치드 시공"],
            process: ["공사 잔해물 및 보양지 제거", "벽면, 천장 미세 분진 고성능 진공 흡입", "본드, 시멘트, 실리콘 자국 특수 제거", "피톤치드 분사 및 환기 마무리"],
            image: "post-interior.jpg"
        },
        "후드청소": {
            points: ["식당/상업용 대형 닥트 기름때 완벽 분해", "화재 예방을 위한 내부 정밀 세척", "위생 검사 즉시 통과 수준의 청결함"],
            process: ["주방 기기 보양 및 후드 상태 진단", "후드 분해 및 전용 기름때 제거제 도포", "고온 스팀 세척 및 스크래퍼 정밀 작업", "재조립 및 주변 스텐 광택 작업"],
            image: "hood.jpg"
        },
        "바닥청소": {
            points: ["바닥재질(대리석, 타일, 데코) 맞춤 장비 세척", "묵은 오염물 및 스크래치 완화", "미끄럼 방지 및 쾌적한 보행 환경 조성"],
            process: ["바닥재 종류 식별 및 약품 선정", "표면 이물질 건식 흡입", "기계차/돌돌이 습식 세척 및 오수 흡입", "건조 및 표면 린스 작업"],
            image: "floor.jpg"
        },
        "유리창청소": {
            points: ["외부 유리창 물때 및 매연 자국 제거", "내부 유리창 투명도 극대화 닦기", "프리미엄 세정제로 코팅 효과 부여"],
            process: ["내/외부 유리창 오염도 및 유막 점검", "유리 전용 세정제 및 스퀴지 1차 세척", "미세 물때 긁어내기 및 고압 린스", "발수 코팅 도포 및 모서리 잔수 제거"],
            image: "window.jpg"
        },
        "바닥왁스코팅": {
            points: ["기존 낡은 왁스층 완벽 박리(제거) 작업", "고광택 프리미엄 수지 왁스 2코팅", "일상 관리의 편리함과 바닥재 수명 연장"],
            process: ["기존 왁스층 박리제 도포 및 기계 세척", "완벽한 오수 제거 및 바닥 건조", "프리미엄 수지 왁스 1차 베이스 코팅", "충분한 건조 후 2차 탑 코팅 마감"],
            image: "wax-coating.jpg"
        },
        "간판청소": {
            points: ["외부 먼지, 매연으로 얼룩진 간판 복원", "조명 밝기 회복 및 매장 첫인상 상승", "고소작업 차량을 이용한 안전한 시공"],
            process: ["간판 재질 확인 및 전원 차단 안전 조치", "거미줄 및 큰 이물질 1차 브러싱", "전용 약품 도포 후 물때/매연 스팀 세척", "얼룩 방지 린스 및 마른 수건 광택"],
            image: "signboard.jpg"
        },
        "준공청소": {
            points: ["신축 빌딩/상가 공사 분진 완전 흡입", "친환경 세제 기반 미세 시멘트 가루 제거", "준공 검사 즉시 통과 보장 퀄리티"],
            process: ["현장 폐기물 수거 및 보양재 철거", "천장/벽면/바닥 미세 시멘트 가루 1차 흡입", "창틀, 유리, 내부 구조물 정밀 세척", "하자 체크 및 준공 검사 대비 퀄리티 마감"],
            image: "post-construction.jpg"
        },
        "특수청소": {
            points: ["일반 청소로 해결 힘든 악성 오염 구역 케어", "고도화된 화학 약품 및 첨단 장비 가동", "감염 예방을 위한 완벽 살균 소독"],
            process: ["특수 오염(혈흔, 부패, 화학물질) 현장 진단", "전신 보호구 착용 및 1차 오염원 물리적 제거", "병원급 특수 약품 살균 및 오염 구역 세척", "강력 탈취 및 자외선(UV) 소독 마무리"],
            image: "specialty.jpg"
        },
        "쓰레기집청소": {
            points: ["대량 방치 폐기물 신속하고 비밀스러운 수거", "오랜 방치로 인한 심각한 악취 완벽 탈취", "구더기, 해충 박멸 및 주거 공간 정상화"],
            process: ["비밀 보장 원칙하에 폐기물 종류별 분류/수거", "방치된 음식물 및 해충/구더기 1차 방역", "바닥 및 벽면 눌어붙은 오염물 특수 세척", "강력 오존 살균 및 악취 영구 탈취 작업"],
            image: "hoarding.jpg"
        },
        "종합청소": { // 예외 처리 및 기본 접속 시 렌더링 값
            points: ["프리미엄 장비와 친환경 세제 사용", "10년 이상의 전문 인력 투입", "수도권 전역 신속 출장 서비스"],
            process: ["현장 맞춤형 전문 진단 및 견적 산출", "각 구역별 오염도에 따른 특수 장비 투입", "구조물 손상 없는 안전하고 완벽한 세척", "고객 검수 및 불만족 시 즉각적인 AS 진행"],
            image: "hero_bg.png"
        }
    };

    // 2. URL 파라미터 파싱
    const urlParams = new URLSearchParams(window.location.search);
    let loc = urlParams.get('loc') || '';
    let taskName = urlParams.get('task') || '';
    
    // 디폴트 텍스트 매핑 (빈 값이면 수도권 종합청소)
    const displayLoc = loc || '수도권';
    const displayTask = taskName || '종합청소';
    
    // 매트릭스에서 데이터 추출
    const taskData = taskMatrix[displayTask] || taskMatrix['종합청소'];
    
    // 3. 변환 텍스트 셋업
    const titleStr = `${displayLoc} ${displayTask} 전문 클린폼 | 프리미엄 청소 대행`;
    const descStr = `${displayLoc} 지역 최고 수준의 ${displayTask} 서비스. ${taskData.points.join(', ')}. 완벽한 공간을 만드는 클린폼(CLEAN FORME).`;
    const h1Str = `${displayLoc} ${displayTask}의 기준, 클린폼`;
    const ctaStr = `📞 ${displayLoc} ${displayTask} 1분 직통 견적 (클릭)`;

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
    if (heroFeatures && taskData.points.length === 3) {
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
    const moCta = document.getElementById('mo-cta-dynamic');
    if (moCta) moCta.innerHTML = `<span class="cta-text">${ctaStr}</span>`;
    
    document.querySelectorAll('.pc-only.cta-text, .pc-only .cta-text').forEach(el => el.innerText = ctaStr);

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
