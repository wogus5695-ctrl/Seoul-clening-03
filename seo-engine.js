// seo-engine.js
// 클린폼 동적 SEO 라우팅 및 데이터 렌더링 엔진 (Vanilla JS ES6+)

function getRegionContext(loc, task) {
    function getTopicMarker(str) {
        if (!str) return '는';
        const lastChar = str.charAt(str.length - 1);
        const code = lastChar.charCodeAt(0);
        if (code < 0xAC00 || code > 0xD7A3) return '는';
        const batchim = (code - 0xAC00) % 28;
        return batchim === 0 ? '는' : '은';
    }

    function getObjectMarker(str) {
        if (!str) return '를';
        const lastChar = str.charAt(str.length - 1);
        const code = lastChar.charCodeAt(0);
        if (code < 0xAC00 || code > 0xD7A3) return '를';
        const batchim = (code - 0xAC00) % 28;
        return batchim === 0 ? '를' : '을';
    }

    const topicMarker = getTopicMarker(loc);
    const locTopic = loc + topicMarker;
    
    let regionKey = 'default';
    
    const bundangDongs = ["분당동", "수내동", "정자동", "율동", "서현동", "이매동", "야탑동", "금곡동", "궁내동", "동원동", "구미동", "판교동", "삼평동", "백현동", "운중동", "대장동", "석운동", "하산운동"];
    const sujeongDongs = ["신흥동", "태평동", "수진동", "단대동", "산성동", "양지동", "복정동", "창곡동", "신촌동", "오야동", "심곡동", "고등동", "상적동", "둔전동", "시흥동", "금토동", "사송동"];
    const jungwonDongs = ["성남동", "중앙동", "금광동", "은행동", "상대원동", "하대원동", "여수동", "도촌동", "갈현동"];
    const janganDongs = ["파장동", "이목동", "율전동", "천천동", "정자동", "영화동", "송죽동", "조원동", "연무동", "상광교동", "하광교동"];
    const gwonseonDongs = ["세류동", "평동", "고색동", "오목천동", "평리동", "서둔동", "탑동", "구운동", "금곡동", "호매실동", "권선동", "장지동", "대황교동", "곡반정동", "입북동", "당수동"];
    const paldalDongs = ["팔달로1가", "팔달로2가", "팔달로3가", "남창동", "영동", "중동", "구천동", "남수동", "매향동", "북수동", "신풍동", "장안동", "교동", "매교동", "매산로1가", "매산로2가", "매산로3가", "고등동", "화서동", "지동", "우만동", "인계동"];
    const yeongtongDongs = ["매탄동", "원천동", "이의동", "하동", "영통동", "신동", "망포동", "광교동"];
    const gwacheonDongs = ["중앙동", "갈현동", "원문동", "별양동", "부림동", "과천동", "문원동", "관문동", "막계동", "주암동"];
    
    function locationMatch(l, arr) {
        return arr.some(x => l.includes(x) || x.includes(l));
    }
    
    if (loc.includes('분당') || bundangDongs.includes(loc)) {
        regionKey = 'bundang';
    } else if (loc.includes('수정') || loc.includes('복정') || loc.includes('창곡') || loc.includes('고등') || loc.includes('산성') || loc.includes('태평') || loc.includes('신흥') || loc.includes('위례') || locationMatch(loc, sujeongDongs)) {
        regionKey = 'sujeong';
    } else if (loc.includes('중원') || locationMatch(loc, jungwonDongs)) {
        regionKey = 'jungwon';
    } else if (loc.includes('성남')) {
        regionKey = 'seongnam';
    } else if (loc.includes('장안') || locationMatch(loc, janganDongs)) {
        regionKey = 'jangan';
    } else if (loc.includes('권선') || locationMatch(loc, gwonseonDongs)) {
        regionKey = 'gwonseon';
    } else if (loc.includes('팔달') || locationMatch(loc, paldalDongs)) {
        regionKey = 'paldal';
    } else if (loc.includes('영통') || locationMatch(loc, yeongtongDongs)) {
        regionKey = 'yeongtong';
    } else if (loc.includes('수원')) {
        regionKey = 'suwon';
    } else if (loc.includes('과천') || locationMatch(loc, gwacheonDongs)) {
        regionKey = 'gwacheon';
    }
    
    const templates = {
        seongnam: `${locTopic} 분당·수정·중원 생활권을 포함하는 지역으로 상가, 업무용 건물, 주거형 건물의 청소 수요가 함께 발생하며 각 건축물의 자재와 관리 이력에 따른 맞춤 처방이 중요합니다. 클린폼은 풍부한 임상 경험을 가진 전문 기사들이 직접 현장을 방문하여 용도에 최적화된 특수 약품과 세척 공정을 설계해 ${task}${getObjectMarker(task)} 완성합니다.`,
        
        bundang: `${locTopic} 대형 오피스 빌딩, 밀집 상가 상권, 요식업종, 학원가 및 의료시설처럼 청결 이미지 유지가 영업과 직결되어 정밀하고 수준 높은 위생 관리가 핵심인 공간들이 밀집해 있습니다. 클린폼은 공간 고유의 동선과 통행 시간대를 종합적으로 고려하여 고객이나 근무자에게 불편을 주지 않는 체계적인 무소음/야간 ${task} 공정을 수행합니다.`,
        
        sujeong: `${locTopic} 오랜 기간 자리를 지켜온 전통적 상가, 다가구 주거형 빌라, 그리고 연식이 다소 오래되어 복원 세정이 요구되는 건축물이 많아 찌든 물때나 외벽 노후화 관리가 시급합니다. 클린폼은 건축 원장재가 손상되거나 변색되지 않도록 표면 오염 특성을 꼼꼼하게 감별한 뒤 맞춤형 완화 약제와 저압 클리닝 기법으로 안전하게 ${task}${getObjectMarker(task)} 처리합니다.`,
        
        jungwon: `${locTopic} 활발한 상업지구와 아파트 주거 밀집 구역, 그리고 공장 및 물류 시설이 밀집한 산업용 공간이 넓게 포괄되어 공장형 바닥 오염, 식당 후드 기름때 제거 등의 복합적인 청소 작업이 이루어집니다. 클린폼은 각 작업 공간의 용도와 면적, 고압수 세척 요건을 면밀히 충족시키며 안전 가이드라인에 맞추어 전문적인 ${task}${getObjectMarker(task)} 완성합니다.`,
        
        gwacheon: `${locTopic} 저층 위주의 조용한 상가 건물, 공공기관 및 주요 행정 업무시설, 주거지 주변의 상업 시설들이 조화롭게 있어 쾌적한 가시성과 청결한 건물 외관 유지를 위한 상시 관리가 주로 선호됩니다. 클린폼은 보행자와 방문객의 통행 동선을 차단하고 친환경 세제를 사용하여 건물과 환경에 해가 가지 않도록 정교하게 ${task}${getObjectMarker(task)} 제공합니다.`,
        
        suwon: `${locTopic} 장안·권선·팔달·영통 생활권을 축으로 다양한 오피스텔 단지, 근린 상가 빌딩, 프랜차이즈 매장 및 학원 등 생활 밀착형 상업시설의 정밀 위생 케어가 필수적입니다. 클린폼은 현장 구조, 창문 접근 형태, 묵은 오염의 깊이를 꼼꼼하게 실사 기준으로 판단하여 가장 효율적인 공정과 견적 범위로 ${task}${getObjectMarker(task)} 진행합니다.`,
        
        jangan: `${locTopic} 유서 깊은 전통 상권과 학교, 주택가가 결합된 구도심 지역으로 건물의 창문 물때와 빗물 자국, 매장 본드 및 페인트 흔적 등 복잡하게 얽힌 세정 케어 요구가 꾸준히 이어집니다. 클린폼은 축적된 자재 복원 노하우를 바탕으로 낡고 취약해진 마감 틈새까지 정성을 다해 안전하게 찌든 때를 분해하여 ${task}${getObjectMarker(task)} 마무리합니다.`,
        
        gwonseon: `${locTopic} 대형 마트 및 유통점, 대규모 아파트형 공장, 창고형 물류 공간 등 산업 인접 구역이 조화되어 넓은 기계식 바닥 물청소나 고온 유증기 기름때 분해 세정이 주로 요청됩니다. 클린폼은 찌든 오일과 먼지가 누적된 고착층을 불려내어 용해하는 특수 연화제 세정을 투입해 바닥 미끄러움과 화재 요인을 동시에 해소하는 ${task}${getObjectMarker(task)} 시공합니다.`,
        
        paldal: `${locTopic} 대규모 재래시장과 번화한 역세권 중심가로서 유동 인구가 상시 많으므로 고객들의 첫 시선이 머무는 외부 쇼윈도 유리창, 선명한 전면 간판, 입구 대리석 등의 청결도가 매우 중요합니다. 클린폼은 혼잡한 낮 시간을 피해 심야 또는 이른 새벽 작업을 최적 조율하여 유동 인구의 영업 방해를 완전히 통제하고 선명한 ${task} 결과를 선사합니다.`,
        
        yeongtong: `${locTopic} 정보기술(IT) 테크노 밸리 오피스 단지, 고급 입시 학원가, 브랜드 프랜차이즈, 대형 병원 등 위생 등급과 청결 점검 기준이 엄격하게 관리되는 최신형 다목적 공간들이 많습니다. 클린폼은 미세 분진과 도배 풀을 완벽 청소하는 준공 작업부터, 타일 보존력을 극대화하는 왁스 코팅까지 하자 없는 디테일 ${task}${getObjectMarker(task)} 보장합니다.`,
        
        default: `${locTopic} 지역의 고유한 현장 구조와 오염물 축적 수준, 작업 높이에 맞춤형으로 청소 방식을 조합하여 제공하고 있습니다. 클린폼은 오염의 종류와 자재 특성을 정확히 분석하여 안전하고 차별화된 ${task} 공정을 조율합니다.`
    };
    
    return templates[regionKey] || templates.default;
}

document.addEventListener('DOMContentLoaded', () => {
    // 임시 Slug 역맵핑 헬퍼
    const slugMap = {
        "수정구": "sujeong", "중원구": "jungwon", "분당구": "bundang",
        "장안구": "jangan", "권선구": "gwonseon", "팔달구": "paldal", "영통구": "yeongtong",
        "정자동": "jeongja-dong", "판교동": "pangyo-dong", "광교동": "gwanggyo-dong", "중앙동": "jungang-dong",
        "분당동": "bundang-dong", "서현동": "seohyeon-dong", "영통동": "yeongtong-dong"
    };
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
            taskName = taskMap[taskPart] || taskPart;
        } else {
            loc = "성남·과천·수원";
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
    const displayLoc = loc || '성남·과천·수원';
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
        "외벽청소": "외벽 오염, 물때, 이끼처럼 접근이 어려운 구역은 건물 노후화를 방지하고 가치를 유지하기 위해 현장 상태에 맞는 전문 장비 구성과 세척이 필요합니다.",
        "유리창청소": "유리창의 오래된 물때, 유막, 매연 얼룩처럼 직접 닦기 어려운 외부 유리는 안전 장비를 갖춘 전문가의 정밀 세정 및 스퀴지 작업이 필요합니다.",
        "준공청소": "신축·공사 현장의 시멘트 가루, 창틀 먼지, 마감 오염은 입주 전 공간의 청결도를 높이기 위해 꼼꼼한 분진 제거와 마감 확인이 필요합니다.",
        "후드청소": "식당이나 급식실 주방 후드 내부의 누적된 기름때와 유증기 굳은 자국은 화재 위험을 방지하고 위생 검사 기준을 충족하기 위해 고온 스팀 분해 세척이 필요합니다.",
        "화재청소": "화재로 인한 매캐한 그을음과 탄소 가루는 호흡기를 위협하므로 특수 진공 청소 및 화학적 탄 냄새 소독 공정이 신속하게 투입되어야 복구가 가능합니다.",
        "쓰레기집청소": "방치 기간이 길어져 악취, 해충, 음식물 오염이 심한 주거 공간은 철저한 프라이버시 보호 하에 폐기물 신속 분류 수거와 고강도 소독을 진행해야 합니다.",
        "바닥청소": "사무실이나 매장의 묵은 기름때, 찌든 발자국, 타이어 자국 등은 바닥재 맞춤 전용 세제와 정밀 회전 세척기를 활용해 세정해야 본연의 청결함을 회복합니다.",
        "바닥왁스코팅": "데코타일이나 아스타일 표면의 스크래치와 찌든 때를 기계로 정밀 박리하고 새 수지 왁스를 입혀 오염 침투를 예방하고 일상 관리 편의성을 높여야 합니다.",
        "어닝청소": "매장 어닝에 쌓인 매연 때, 먼지, 빗물 자국과 곰팡이는 원단 손상을 방지하기 위해 친환경 약품과 온수 스팀을 활용한 전문 클리닝이 필요합니다.",
        "간판청소": "간판 틈새의 미세 먼지, 거미줄, 조류 분비물 등은 매장의 이미지를 저해하므로 스카이차 등 고소작업 장비로 안전하고 정교한 고압 약품 세척을 진행해야 합니다.",
        "인테리어 후 청소": "공사 분진, 본드 자국, 도배 풀 흔적처럼 일반 청소로 해결되지 않고 서랍 내부나 경첩 틈새에 남기 쉬운 오염을 정밀 기기 작업으로 먼저 제거해야 합니다.",
        "특수청소": "반려동물 다수 방치 오염, 혈흔, 침수 피해 뻘흙 등 악성 냄새와 세균 번식이 심한 극한의 구역은 바이러스 중화제와 소독 방역 공정이 필수적입니다.",
        "종합청소": "공사 후 분진이 남아 있거나, 유리창·바닥·후드·외벽처럼 직접 청소하기 어려운 구역이 있다면 전문 장비 및 인력이 필요합니다."
    };

    // FAQ 데이터는 SERVICES_DATA의 각 서비스별 faq 배열을 동적으로 참조하여 getDesc 헬퍼로 치환하므로 하드코딩 맵을 사용하지 않습니다.
        // 4. 변환 텍스트 셋업 (명시적 SEO 템플릿 적용)
    const titleStr = `${displayLoc} ${displayTask} 전문 클린폼 | ${displayLoc} ${displayTask} 견적 상담`;
    const descStr = `${displayLoc}에서 ${displayTask}가 필요하다면 클린폼에서 현장 상태, 오염도, 면적 기준으로 작업 가능 여부와 견적 범위를 안내합니다. ${displayLoc} ${displayTask} 상담 가능.`;
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
    const imagePath = displayTask === '종합청소' ? `${window.location.origin}/images/cleanforme/hero-cleaning.webp` : `${window.location.origin}/images/cleanforme/${taskData.imageKey}`;
    ogImageTag.setAttribute('content', imagePath);
    
    // H1
    setInner('hero-heading', h1Str);

    // Hero 보조문구 (Subtitle)
    const subtitleEl = document.querySelector('.hero-subtitle');
    if (subtitleEl) subtitleEl.innerText = heroDesc;

    // Image alt
    const heroImgEl = document.getElementById('hero-bg-img');
    if (heroImgEl) {
        const imagePath = displayTask === '종합청소' ? '/images/cleanforme/hero-cleaning.webp' : `/images/cleanforme/${taskData.imageKey}`;
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
        needHeading.innerText = '이런 상황이라면 전문 청소가 필요합니다';
        needDescEl.innerText = needDesc;
    }

    const regionContextDescEl = document.getElementById('region-context-desc');
    if (regionContextDescEl) {
        regionContextDescEl.innerText = getRegionContext(displayLoc, displayTask);
    }

    // Section 3: Pain Points (業者 선택 기준)
    setInner('pain-point-heading', '업체 선택 전 확인할 3가지');

    // Section 4: 작업 범위 섹션 제목 & 목록
        const workScopeHeading = document.getElementById('work-scope-heading');
    if (workScopeHeading) {
        workScopeHeading.innerText = '청소 범위는 현장 상태를 보고 정합니다';
    }

    // Section 5: 가능한 청소 작업 제목/부제목 치환 & 타겟 작업 하이라이트 & 이미지 alt 치환
    const possibleWorksHeading = document.getElementById('possible-works-heading');
    if (possibleWorksHeading) {
        possibleWorksHeading.innerText = '클린폼에서 상담 가능한 청소 작업';
    }
    const possibleWorksSubtitle = document.getElementById('possible-works-subtitle');
    if (possibleWorksSubtitle) {
        possibleWorksSubtitle.innerText = `${displayLoc} ${displayTask} 외에도 외벽, 유리창, 바닥, 준공, 후드, 특수청소 등 현장 상태에 맞춰 상담이 가능합니다.`;
    }

    const highlightKey = Object.keys(taskMap).find(k => taskMap[k] === displayTask);
    if (highlightKey) {
        // 기존 highlight 제거 후 새로 설정
        document.querySelectorAll('.works-text-list span').forEach(el => el.classList.remove('highlight-task'));
        const activeSpan = document.querySelector(`.works-text-list span[data-task="${highlightKey}"]`);
        if (activeSpan) {
            activeSpan.classList.add('highlight-task');
        }
    }

    document.querySelectorAll('.marquee-item img').forEach(img => {
        const baseAlt = img.getAttribute('data-base-alt');
        if (baseAlt) {
            img.setAttribute('alt', `${displayLoc} ${baseAlt}`);
        }
    });

    // Section 6: Process Heading
    const processHeading = document.getElementById('process-heading');
    if (processHeading) {
        processHeading.innerText = '상담부터 작업 확인까지';
    }

    // Section 7: FAQs (Dynamic conversion)
    if (taskData.faq && taskData.faq.length >= 3) {
        const faqSpecialKeywordMap = {
            "외벽청소": "외벽 재질 및 오염",
            "유리창청소": "창문 개수 및 층수",
            "바닥청소": "바닥 소재 및 상태",
            "준공청소": "공사 후 잔여물",
            "후드청소": "후드 크기 및 기름때",
            "특수청소": "현장 오염",
            "종합청소": "전반적인 현장"
        };
        const specialKeyword = faqSpecialKeywordMap[displayTask] || faqSpecialKeywordMap["종합청소"];

        const faqQ1 = document.getElementById('faq-q1');
        const faqQ2 = document.getElementById('faq-q2');
        const faqQ3 = document.getElementById('faq-q3');
        const faqQ4 = document.getElementById('faq-q4');
        const faqQ5 = document.getElementById('faq-q5');

        if (faqQ1) {
            faqQ1.innerText = `Q. ${displayLoc} ${displayTask} 상담 시 무엇을 먼저 알려드리면 되나요?`;
            faqQ1.nextElementSibling.innerText = `지역, 공간 규모, ${specialKeyword} 상태를 알려주시면 작업 가능 여부부터 안내합니다. 정확히 설명하지 않으셔도 상담 중 필요한 내용을 순서대로 확인합니다.`;
        }
        if (faqQ2) {
            faqQ2.innerText = `Q. 원하는 청소 작업이 가능한지 어떻게 확인하나요?`;
            faqQ2.nextElementSibling.innerText = `외벽, 유리창, 바닥, 준공, 후드, 특수청소 등 작업 종류와 현장 상태를 기준으로 가능 여부를 확인합니다. 필요한 경우 사진이나 현장 조건을 추가로 확인할 수 있습니다.`;
        }
        if (faqQ3) {
            faqQ3.innerText = `Q. 비용은 언제 안내받을 수 있나요?`;
            faqQ3.nextElementSibling.innerText = `현장 상태와 작업 범위를 확인한 뒤 전화 상담에서 예상 범위를 안내합니다. 무리하게 정해진 금액을 제시하기보다 필요한 범위를 먼저 확인합니다.`;
        }
        if (faqQ4) {
            faqQ4.innerText = `Q. 작업 전 준비해야 할 것이 있나요?`;
            faqQ4.nextElementSibling.innerText = `가능하다면 작업 위치, 면적, 오염 상태, 출입 가능 시간 정도를 알려주시면 상담이 빨라집니다. 현장 상황에 따라 별도 준비가 필요 없는 경우도 있습니다.`;
        }
        if (faqQ5) {
            faqQ5.innerText = `Q. 야간이나 주말 작업도 가능한가요?`;
            faqQ5.nextElementSibling.innerText = `작업 종류와 지역, 일정에 따라 야간·주말 작업 가능 여부를 확인합니다. 상담 시 희망 일정을 함께 알려주시면 조율 가능 여부를 안내합니다.`;
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
        const candidateLocs = ["성남", "과천", "수원", "분당"];
        const selectedLocs = candidateLocs.filter(l => l !== displayLoc && `${l}시` !== displayLoc && `${displayLoc}`.indexOf(l) === -1).slice(0, 3);
        selectedLocs.forEach(locVal => {
            linksList.push({
                label: `${locVal} ${displayTask}`,
                url: getKeywordUrl(locVal, displayTask)
            });
        });
        
        // 3. Construct HTML
        let linksHtml = linksList.map(l => `<a href="${l.url}" class="footer-chip">${l.label}</a>`).join('');
        linksHtml += `<a href="/seo-hub" class="footer-chip view-all-link">전체 서비스 지역 및 작업 보기</a>`;
        footerRelatedContainer.innerHTML = linksHtml;
    }

    // 중간 CTA
    const midCtaText = document.getElementById('mid-cta-text');
    if (midCtaText) {
        midCtaText.innerHTML = '전화로 작업 가능 여부를 확인하세요<br>오염도와 면적에 따라 투명하게 산정되는 맞춤 견적';
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
                bg: "/images/cleanforme/exterior-cleaning.webp"
            },
            "바닥·상업공간 청소": {
                desc: "상가, 사무실, 매장 바닥은 오염도와 재질에 따라 세척 방식과 코팅 여부를 구분해야 합니다.",
                bg: "/images/cleanforme/floor-cleaning.webp"
            },
            "공사·이전 청소": {
                desc: "준공·인테리어 후 공간은 공사 분진, 본드 자국, 마감 오염을 일반 청소와 다르게 확인해야 합니다.",
                bg: "/images/cleanforme/post-construction-cleaning.webp"
            },
            "고난도 특수 청소": {
                desc: "화재, 쓰레기집, 고오염 현장은 일반 청소보다 악취·폐기물·오염도 기준을 먼저 확인해야 합니다.",
                bg: "/images/cleanforme/special-cleaning.webp"
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
