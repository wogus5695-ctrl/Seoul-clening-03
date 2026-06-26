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
        "인테리어청소": "인테리어 후 청소",
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
        "외벽청소": "건물 외벽의 재질(석재, 판넬, 유리, 벽돌)을 고려하여 고유의 손상 없는 세척 약품과 로프 기사의 정밀 고압 분사 기술로 외부 세척을 계획합니다.",
        "유리창청소": "쇼윈도와 전면 창에 누적된 뿌연 유막과 고착된 물때를 제거해 매장의 개방감을 극대화하고 외부 시야를 맑게 회복해 드립니다.",
        "화재청소": "화재 후 발생하는 끈적한 그을음과 매매한 탄 냄새를 긴급 중화하고, 건강을 위협하는 유독 분진을 안전하게 살균 세정합니다.",
        "바닥왁스코팅": "오염된 기존 코팅층을 완벽히 깎아내는 박리 작업을 거쳐 최고급 수지 왁스를 도포하여 맑은 광택과 바닥 보호막을 형성합니다.",
        "바닥청소": "매장이나 사무실 타일에 눌러붙은 찌든 오염과 고무 자국을 바닥 마감재별 전용 세제와 기계 브러싱 공법으로 복원합니다.",
        "어닝청소": "매장 얼굴인 어닝 천막에 묵은 검은 때와 녹색 곰팡이를 원단 손상 없이 부드러운 온수 스팀 살수 기법으로 맑게 지워냅니다.",
        "간판청소": "매장의 신용도를 좌우하는 간판의 찌든 물때와 벌레 사체를 스카이 장비를 투입해 안전하고 선명하게 복원해 드립니다.",
        "준공청소": "준공 승인과 최종 인도를 앞둔 신축 건물 내부에 가득한 위험한 시멘트 가루와 건축 잔여 오염물을 완벽히 걷어냅니다.",
        "인테리어 후 청소": "리모델링 공사 직후 가구 내부와 서랍 경첩 틈새에 안착한 유해 미세 톱밥과 도배 풀을 디테일하게 제거해 즉시 영업을 시작할 수 있게 정돈합니다.",
        "후드청소": "식당 주방 후드와 필터 틈새에 딱딱하게 굳은 노란 유지분 기름때를 고온 고압 스팀 분해 기법으로 완전 박리하여 소방 안전과 위생을 지킵니다.",
        "쓰레기집청소": "{loc} 방치된 대량 폐기물 분류 반출부터 찌든 오염 제거, 유독 가스 방역 소독까지 안심 비공개로 완전 정리합니다.",
        "특수청소": "{loc} 하수 역류, 반려동물 방치 오염, 극한의 악취 현장에 맞춰 고성능 중화제와 강밀도 탈취 방역 공정을 투입합니다.",
        "종합청소": "{loc} 외벽청소부터 유리창청소, 바닥관리, 특수청소까지 현장 상태와 목적에 최적화된 맞춤형 솔루션을 안내합니다."
    };

    const needSituationHeadingTemplate = {
        "외벽청소": "대기 매연과 미세 먼지로 건물 마감재가 오염되어 복원이 필요한 상태인가요?",
        "유리창청소": "빗물 자국과 유막으로 창문이 뿌옇게 변해 매장 전면의 가시성이 답답하신가요?",
        "화재청소": "실내 전체에 흡착된 매캐한 탄 냄새와 유독성 그을음 분진으로 초동 대처가 급선무이신가요?",
        "바닥왁스코팅": "데코타일의 코팅이 마모되어 흠집이 생기고 일상 물걸레질로 때가 지지 않으신가요?",
        "바닥청소": "사무실이나 상가 바닥에 구두 자국과 찌든 오염이 누적되어 기계 세정이 필요하신가요?",
        "어닝청소": "매장 천막에 검은 빗물 얼룩과 푸른 곰팡이가 피어 매장 전면 이미지를 해치고 있나요?",
        "간판청소": "외부에 노출된 상가 간판에 먼지와 곤충 사체가 가득해 조명이 어둡고 칙칙해 보이나요?",
        "준공청소": "신축 공사가 끝나고 미세 시멘트 가루와 본드 자국이 가득해 최종 마감 검수를 앞두고 계신가요?",
        "인테리어 후 청소": "리모델링 목공 작업 후 서랍 내부와 가구 틈새에 미세 톱밥 먼지가 뿌옇게 쌓여 걱정이신가요?",
        "후드청소": "주방 환풍기 필터와 후드 내벽에 끈적한 누런 기름때가 고여 화재 위험과 위생이 걱정되시나요?",
        "쓰레기집청소": "오랜 방치로 인한 심한 악취와 위생 위협을 신속히 해결하고 싶으신가요?",
        "특수청소": "일반적인 물청소나 화학 세제로 해결되지 않는 악성 오염원과 바이러스 방역이 필요하신가요?",
        "종합청소": "직접 청소하기 어렵고 전문 장비가 필요한 까다로운 공간 관리를 고민하고 계신가요?"
    };

    const needDescTemplate = {
        "외벽청소": "외벽에 고착된 대기 매연, 이끼, 백화 현상은 방치할 경우 자재 부식의 원인이 되므로, 표면에 손상을 주지 않는 전용 약품과 정밀 고압 살수로 복원해야 건물의 본래 가치와 수명을 유지할 수 있습니다.",
        "유리창청소": "비바람으로 쌓인 황사 먼지와 매연, 실내외 온도 차로 고착된 유리 물때는 일반적인 물걸레 청소로는 지워지지 않으며, 유리 전용 스퀴지와 특수 약품 세정으로 유막을 벗겨내야 얼룩 없는 시야 확보가 가능합니다.",
        "화재청소": "화재 현장에 남은 그을음과 탄소 먼지는 발암 물질을 포함하여 공기 중에 떠돌고, 벽지와 가구 깊숙이 냄새가 흡착되므로 일반 세척이 아닌 특수 화학 세정과 강제 오존 탈취 공정으로 유해 물질을 완전히 소독해야 합니다.",
        "바닥왁스코팅": "바닥재 표면의 보호 코팅이 닳아 미세한 흠집이 생기면 오염물이 타일 틈과 기공에 깊게 스며들어 물걸레질만으로는 얼룩이 지지 않으므로, 찌든 오염을 기계 세정으로 깎아낸 뒤 보호 코팅막을 덮어 오염 고착을 원천 예방해야 합니다.",
        "바닥청소": "보행이 잦은 상업 및 사무 공간 바닥은 미세 먼지, 신발 고무 자국, 유분 기름때가 결합되어 타일 표면에 단단한 오염층을 형성하므로, 바닥재를 손상시키지 않는 전용 세정 약품을 투입해 회전 브러시 기계로 때를 씻어내야 합니다.",
        "어닝청소": "외부 노출 시간이 긴 어닝 원단은 매연 분진과 빗물이 섞여 변색을 일으키고 습기에 따른 푸른 곰팡이가 피기 쉬워, 강한 솔질 대신 섬유 조직을 보호하는 온수 연화제 살포 및 정밀 저압 스팀 살수로 때를 지워야 원단 찢어짐을 예방할 수 있습니다.",
        "간판청소": "눈비에 섞인 먼지가 입체 글자(채널 간판) 사이에 쌓이고 거미줄과 곤충 사체가 들러붙으면 조명이 어두워지고 지저분해 보이기 마련이며, 높은 위치의 간판 틈새 오염을 고소차를 이용해 안전하게 다가가 미세 틈새까지 정밀 약품 세정으로 복구해야 합니다.",
        "준공청소": "신축 건물 내부에는 도배 풀, 시멘트 가루, 타일 본드, 페인트 튄 흔적 등 호흡기 질환을 유발하는 다량의 건축 분진이 몰딩과 문틀에 박혀 있어, 일반적인 입주 청소 수준을 넘어 산업용 헤파 흡입 장비와 전용 박리제로 건축 잔여 오염물을 철저히 준공 세척해야 합니다.",
        "인테리어 후 청소": "리모델링 공사 후에는 톱질 미세 먼지, 본드 가루, 페인트 얼룩이 서랍 레일, 수납장 경첩, 유리창 가구 틈새마다 파고들어 공기 중에 잔류하므로, 정밀 진공 헤파 장비로 틈새 분진을 다각도로 흡입하고 수작업으로 마감 잔여물을 닦아내야 영업 오픈에 지장이 없습니다.",
        "후드청소": "주방 후드 안쪽과 환풍기 틈에 고착된 끈적한 노란 기름때는 환기 성능을 떨어뜨려 악취의 원인이 될 뿐 아니라, 조리 중 불꽃이 튀어 후드 내 기름 층에 붙으면 대형 주방 화재로 이어지므로 고온 고압 스팀 분해 기법으로 기름때 누적층을 완전히 녹여내야 합니다.",
        "쓰레기집청소": "오랜 방치로 인한 심한 악취와 위생 위협을 해결하기 위해, 프라이버시를 지키는 불투명 폐기 처분 대행과 살균 탈취 약품 분사 공정이 필수적으로 뒤따라야 본래의 주거 가치를 되찾습니다.",
        "특수청소": "하수 역류, 반려동물 방치 오염, 누적된 냄새 등 일반적인 물청소나 화학 세제로 제거하기 힘든 악성 오염원과 유해 세균을 전문 약품으로 정밀 분해 세척하여 원래의 깨끗한 환경을 제공합니다.",
        "종합청소": "공사 후 분진이 남아 있거나, 유리창·바닥·후드·외벽처럼 직접 청소하기 어려운 구역을 전문 장비와 인력을 투입해 합리적으로 토탈 케어해 드립니다."
    };

    const processStepsTemplate = {
        "외벽청소": [
            "현장 방문 및 드론/망원을 통한 건물 마감재 종류와 크랙 상태 사전 분석",
            "스카이차 진입로 확보 및 고소 로프 고정용 옥상 앵커 포인트 안전 점검",
            "외벽 전용 연화 세제를 분사하여 오염층을 불린 후 고압 온수 살수로 세척",
            "창틀 주변 실리콘 점검, 낙수 구역 안전 차단막 해제 및 주변 정리 정돈"
        ],
        "유리창청소": [
            "유리창의 프레임 소재 확인 및 고착된 오염(시트지, 본드, 물때) 범위 파악",
            "유리 자재 보호 및 유막 분해용 전용 세정 약제 도포",
            "스크래퍼로 이물질을 긁어내고 전문가용 스퀴지로 잔여 세제와 물기 밀착 제거",
            "유리창 테두리 고무 몰딩의 오염 제거 및 얼룩 유무 정밀 마감 버핑"
        ],
        "화재청소": [
            "화재 피해 규모 확인, 재사용 집기 분류 및 유독성 탄화물 반출 준비",
            "헤파 필터가 적용된 정밀 집진 장비를 사용하여 공간 내 미세 그을음 분진 흡입",
            "벽면 and 천장 등에 들러붙은 그을음 및 타르 성분을 전용 특수 약품으로 습식 세척",
            "공간 내 가스 소독 및 전문 오존 정화기를 가동하여 콘크리트 속 잔류 탄 냄새 중화"
        ],
        "바닥왁스코팅": [
            "데코타일 및 아스타일의 기존 코팅 마모 상태와 들뜸 현상 파악",
            "강력 박리제를 균일하게 살포하여 굳어 있던 옛날 왁스 코팅층 완벽 연화",
            "바닥 세척기(돌돌이)에 박리 패드를 장착해 오래된 묵은 때와 노란 코팅층 연마 세정",
            "습식 청소기로 폐수 흡입 후 바닥을 건조시키고 고급 수지 왁스를 2회 균일 도포"
        ],
        "바닥청소": [
            "바닥 재질(데코타일, 대리석, 에폭시 등) 및 오염원(기름때, 구두 자국) 종류 판별",
            "바닥재 표면 강도에 맞는 알칼리 또는 중성 세척 전용 약품 혼합 분사",
            "고속 회전 마루광택기를 이용해 바닥 기공 사이사이에 고착된 찌든 때 기계 브러싱",
            "오염물이 섞여 나온 탁한 폐수를 스퀴지와 대형 습식 청소기로 완전히 흡입하여 건조"
        ],
        "어닝청소": [
            "어닝 천막 원단 상태 진단 및 고사, 탈색 우려 구역 사전 체크",
            "원단 조직 내 묵은 매연과 곰팡이를 불리는 전용 중성 살균제 저압 살포",
            "천막 원단의 결에 맞추어 부드러운 수작업 솔 브러싱 및 고온 온수 스팀 분사",
            "원단 하단으로 떨어지는 잔여 오염물 린스 세정 및 주변 보도 물청소 정리"
        ],
        "간판청소": [
            "간판 설치 높이, 조명 장치 종류 및 보행 도로 차량 진입로 안전 분석",
            "사고 예방을 위한 조명 전원 완전 차단 및 전선부 방수 비닐 팩 테이핑",
            "스카이차 탑승 후 간판 틈새 거미줄 제거 및 전용 세정제를 이용한 부드러운 스펀지 연마",
            "틈새 오염수 저압 살수 린스 처리 및 조명 점등 작동 여부 최종 확인"
        ],
        "준공청소": [
            "건물 내부의 몰딩, 바닥, 유리창 등의 공사 흔적 및 건축 페인트 오염 분포도 파악",
            "산업용 대용량 헤파 필터 청소기로 실내 천장부터 바닥 구석까지 날리는 건식 미세 먼지 1차 제거",
            "창틀에 낀 시멘트 찌꺼기 긁어내기 및 유리창 백화 필름 자국 전용 박리제로 세척",
            "실내 가구 내부 톱밥 제거 및 바닥 회전 기계 정밀 습식 세정으로 마감 인도 승인 대기"
        ],
        "인테리어 후 청소": [
            "인테리어 가구 내 서랍장, 선반 분리 및 도배 풀, 실리콘 마감 얼룩 범위 파악",
            "가구 서랍 및 선반을 전체 탈거하여 가구 안쪽 레일 틈에 안착한 톱밥 미세 가루 고압 진공 청소",
            "유리창 창틀의 본드 가루 및 몰딩 부분 도배 풀 스팀 정밀 닦기",
            "가구 표면 마감 먼지 흡입 및 실내 환기 가이드 전달"
        ],
        "후드청소": [
            "후드 안쪽 유지 필터 분해 및 주방 하단 가스 튀김기 오염 방지용 전체 비닐 텐트 카바링 보양",
            "후드 내벽 전체에 기름때 분해용 전용 고동도 알칼리 약품 도포 및 굳어 있던 기름층 연화",
            "특수 스크래퍼로 굳어 있던 끈적한 기름 타르층을 1차로 깎아내고, 고온 고압 스팀 세척기로 잔여 오염물 고열 세정",
            "주방 후드 필터 약품 삶기 세척 후 조립, 집수 구역 정리 정돈 및 주방 바닥 린스 세척"
        ],
        "쓰레기집청소": [
            "방치 폐기물의 부피, 분류 기준 및 정밀 소독 범위 확인",
            "비공개 작업을 위한 불투명 특수 포장 마대 및 방역 장비 준비",
            "생활 쓰레기 분류 반출 및 찌든 타일/벽면 오염 약품 습식 세정",
            "살균 탈취 탈탄제 분사 가동 및 최종 안심 인도"
        ],
        "특수청소": [
            "하수구 역류 범위, 누적된 오염 및 악성 취기 오염 진단",
            "안전 가이드라인 수립 및 고강도 중화제/방역 장비 세팅",
            "오염된 잔여물 완전 반출 및 특수 세제 브러시 약품 세척",
            "공간 바이러스 살균 중화제 연무 및 최종 탈취 오존 가동"
        ],
        "종합청소": [
            "현장 상태 진단 및 오염 구역별 견적 범위 확인",
            "오염 종류에 적합한 전용 약제와 전문 기기 세팅",
            "구조물 손상 없이 안전하고 세밀한 특화 세척 실시",
            "고객 최종 검수 및 보완 정리 마감"
        ]
    };

    const possibleWorksHeadingTemplate = {
        "외벽청소": "{loc} 외벽 고소 로프 및 스카이 세척 작업 사례",
        "유리창청소": "{loc} 상가 쇼윈도 및 외부 유리창 유막 세정 사례",
        "화재청소": "{loc} 화재 현장 그을음 제거 및 탄 냄새 유독성 분진 탈취 사례",
        "바닥왁스코팅": "{loc} 데코타일 바닥 박리 작업 및 수지 왁스 보호막 코팅 사례",
        "바닥청소": "{loc} 사무실 및 상가 바닥 기계 브러싱 정밀 세정 사례",
        "어닝청소": "{loc} 상가 전면 어닝 천막 온수 스팀 및 곰팡이 제거 사례",
        "간판청소": "{loc} 매장 전면 조명 간판 및 스티커 벌레 자국 세정 사례",
        "준공청소": "{loc} 신축 빌딩 및 대형 상가 준공 마감 분진 세척 사례",
        "인테리어 후 청소": "{loc} 리모델링 상가 가구 내부 톱밥 먼지 및 도배 풀 제거 사례",
        "후드청소": "{loc} 식당 주방 대형 후드 및 필터 찌든 기름때 고온 스팀 박리 사례",
        "쓰레기집청소": "{loc} 방치 폐기물 수거 및 고강도 소독 작업 사례",
        "특수청소": "{loc} 특수 감염원 제거 및 공간 방역 소독 작업 사례",
        "종합청소": "{loc} 종합청소 현장 사례 및 상담"
    };

    const possibleWorksSubtitleTemplate = {
        "외벽청소": "매연 얼룩과 이끼로 어두워진 건물 외관을 재질 손상 없이 복원하고, 고소 작업 매뉴얼을 준수해 안전하게 완료한 현장 모습입니다.",
        "유리창청소": "오래 방치되어 불투명해진 매장 유리창의 고착 물때와 찌든 때를 제거하고 내부가 훤히 보이도록 복원한 실제 세정 전후 모습입니다.",
        "화재청소": "화재 피해로 손상된 실내 공간의 그을음을 정밀 약품 세정으로 복구하고, 고농도 오존 소독을 통해 냄새까지 잡아낸 긴급 복구 전후 현장입니다.",
        "바닥왁스코팅": "묵은 때로 얼룩지고 광택을 잃은 타일 바닥을 깨끗이 깎아내고 고광택 코팅제를 균일하게 입혀 반짝이는 바닥으로 복원한 실사입니다.",
        "바닥청소": "오랜 통행으로 검게 변한 매장 및 사무실 바닥의 고유 색상과 청결함을 기계 세척을 통해 완벽히 찾아드린 전후 모습입니다.",
        "어닝청소": "검은 빗물 얼룩과 푸른 이끼 곰팡이로 오염되었던 매장 어닝을 원단 손상 없이 고유의 색상으로 맑게 정화한 실제 현장 전후입니다.",
        "간판청소": "대기 오염과 매연 얼룩으로 명도가 저하되었던 상가 간판을 정밀 클리닝하여 본래의 선명한 밝기와 깨끗함을 복원한 실제 사진입니다.",
        "준공청소": "공사 완료 직후 덮여 있던 시멘트 분말 및 보호 보양 필름을 완벽히 수거하고 구석구석 정교하게 닦아 즉시 입주 가능하도록 세팅한 모습입니다.",
        "인테리어 후 청소": "리모델링 개업을 앞두고 목공 공사로 인해 뿌옇게 덮여 있던 가구 구석구석의 미세 톱가루와 유리 본드 자국을 정밀 닦아내 매장 오픈 준비를 완료한 현장 모습입니다.",
        "후드청소": "식당 영업으로 시커멓고 노랗게 기름이 고여 흘러내리던 환풍 후드 안쪽과 필터를 주방 화재 예방을 위해 완벽히 세척 마감한 현장입니다.",
        "쓰레기집청소": "방치된 대량의 쓰레기와 악취 오염을 신속 분류하고 고강도 소독으로 정돈한 전후 현장입니다.",
        "특수청소": "일반 청소로 해소할 수 없는 바이러스성 오염과 고착 악취를 정밀 분해 세척하여 복구한 현장입니다.",
        "종합청소": "외벽, 바닥, 유리창, 특수 구역 등 찌든 먼지와 얼룩을 지워내어 공간의 청결함과 고유 자재 가치를 복원 완료한 현장입니다."
    };

    const midCtaTextTemplate = {
        "외벽청소": "설명하기 어려운 건물의 높이나 주변 도로 통제 여부도 걱정하지 마세요.<br>{loc} 현장 전경 사진과 도로 상태를 공유해주시면 장비 투입 계획과 견적을 안내해 드리겠습니다.",
        "유리창청소": "시야가 흐릿해진 창문은 내부 공간까지 어둡게 만듭니다.<br>{loc} 현장 유리창의 높이와 대략적인 수량을 사진과 함께 보내주시면 최적의 세정 방안을 안내해 드리겠습니다.",
        "화재청소": "화재 청소는 초기 처리가 늦어질수록 유독 성분이 고착되어 복구 비용이 늘어납니다.<br>{loc} 피해 구역의 면적과 상태를 알려주시면 긴급 전문 팀을 배정해 신속하게 복구를 돕겠습니다.",
        "바닥왁스코팅": "물걸레질을 해도 바닥이 계속 칙칙하고 때가 지지 않는다면 코팅막이 수명을 다한 것입니다.<br>{loc} 공간의 바닥 재질과 전체 평수를 알려주시면 정직한 작업 일정을 안내해 드리겠습니다.",
        "바닥청소": "일상적인 청소만으로는 타일 틈새에 낀 오염을 제거하기 어렵습니다.<br>{loc} 현장의 바닥 전체 사진과 업종을 알려주시면 바닥재에 손상을 주지 않는 전용 세정 방식을 맞춤 설계해 드리겠습니다.",
        "어닝청소": "어닝 청소 시 아래쪽 유리창이나 입구 주변 오염도 말끔히 해결해 드립니다.<br>{loc} 매장 전면 사진과 어닝 크기를 가늠할 수 있는 전경을 보내주시면 최적의 견적을 제공해 드리겠습니다.",
        "간판청소": "거리에 달린 간판은 매장을 알리는 첫 신호등입니다.<br>{loc} 간판의 대략적인 높이와 디자인 형태가 보이도록 정면 사진을 찍어 보내주시면 안전 장비 배치 계획을 포함한 예상 비용을 안내해 드리겠습니다.",
        "준공청소": "발주처 검수 시 지적 사항이 없도록 준공 매뉴얼에 맞춰 꼼꼼히 정리합니다.<br>{loc} 신축 현장의 도면 평수와 희망하시는 완료 시점을 알려주시면 대규모 전문 인력 배치 일정을 조율해 드리겠습니다.",
        "인테리어 후 청소": "가구를 열었을 때 뿌연 톱밥 가루가 묻어나지 않도록 선반 밑과 경첩 구석까지 닦아냅니다.<br>{loc} 매장 인테리어 공사 마감 시점과 영업 시작 예정일을 말씀해주시면 차질 없는 일정을 확정해 드리겠습니다.",
        "후드청소": "위생 등급 기준 준수와 화재 예방을 위한 핵심적인 주방 관리 영역입니다.<br>{loc} 조리실 후드의 전체 가로 길이(미터)와 내부 사진을 보내주시면 상세한 약품 청소 범위와 예상 비용을 알려드리겠습니다.",
        "쓰레기집청소": "혼자서 해결하기 힘든 방치 오염도 걱정하지 마세요.<br>{loc} 현장 공간 구조와 짐의 대략적인 부피를 알려주시면 철저한 보안 하에 깔끔한 정리 계획을 안내합니다.",
        "특수청소": "까다롭고 난해한 악성 오염 현장도 안심하고 맡기세요.<br>{loc} 오염의 종류와 범위 사진을 보내주시면 가장 안전하고 적법한 복구 계획을 상담해 드립니다.",
        "종합청소": "공간의 가치를 높이는 올바른 선택입니다.<br>{loc} 청소가 필요한 주소와 사진을 편하게 전해주시면 신속히 일정 및 예상 견적 범위를 상담해 드리겠습니다."
    };

    const faqQ1Template = {
        "외벽청소": "작업 시 주변 통행 안전이나 주차된 차량 오염 방지는 어떻게 진행되나요?",
        "유리창청소": "외부 유리창 청소는 창문을 완전히 떼어내서 양면을 다 닦는 방식인가요?",
        "화재청소": "화재 피해를 입은 실내에서 불에 타지 않은 가전이나 집기류도 탄 냄새가 나는데 재사용 가능하게 닦아주나요?",
        "바닥왁스코팅": "기존에 잘못 발라서 노랗게 변색되고 일어난 옛날 왁스도 다 벗겨내고 새로 발라주나요?",
        "바닥청소": "의자 끄는 자국이나 검은 타이어 얼룩, 본드 자국 같은 바닥의 찌든 때도 다 지워지나요?",
        "어닝청소": "어닝 청소를 할 때 강한 수압을 사용하면 천막 원단이 찢어지거나 구멍이 나지 않나요?",
        "간판청소": "간판 물청소를 할 때 내부에 있는 LED 전구나 전기 배선에 물이 들어가서 고장 날까 봐 걱정돼요.",
        "준공청소": "일반적인 이사 전 입주청소와 상업 건물의 준공청소는 구체적으로 무엇이 다른가요?",
        "인테리어 후 청소": "새로 설치한 붙박이장이나 수납 가구 내부의 서랍장도 전부 빼내서 닦아주나요?",
        "후드청소": "후드 깊숙이 연결된 원통형 덕트 환풍기 배관 안쪽까지 들어가서 다 닦아주시나요?",
        "쓰레기집청소": "이웃들에게 노출되지 않도록 작업해 주시나요?",
        "특수청소": "특수청소 작업 시 작업원들의 안전 장비나 방호구 착용이 필요한가요?",
        "종합청소": "전화 상담 시 무엇을 먼저 준비해서 말씀드리면 되나요?"
    };

    const faqA1Template = {
        "외벽청소": "보행자 이동 동선에 안전 펜스를 설치하고 신호수를 배치하며, 하강 라인 아래 주차된 차량은 사전에 안전한 곳으로 이동시키거나 방수 비닐로 덮어 보양한 후 안심하고 작업합니다.",
        "유리창청소": "유리창 탈거는 안전사고 위험과 창틀 변형 우려가 있어 탈거하지 않습니다. 대신 전용 익스텐션 폴대 장비나 외부 하강 기법을 사용해 고무 실링 손상 없이 내부와 외부를 안전하게 양면 청소합니다.",
        "화재청소": "네, 불길이 닿지 않았더라도 그을음과 유독 가스가 침투한 집기류는 표면 화학 분해 세척과 고온 스팀 처리를 거쳐 탄 냄새를 중화하고 살균하여 다시 사용하실 수 있도록 복구해 드립니다.",
        "바닥왁스코팅": "네, 박리 공정을 거치지 않고 왁스를 덧바르면 오히려 얼룩이 더 심해집니다. 클린폼은 전용 박리제와 바닥 세척 기계를 이용하여 낡은 변색 왁스막을 완전히 깎아내고 새 도포 작업을 시작하므로 투명하고 깨끗합니다.",
        "바닥청소": "네, 고무나 본드 자국 등은 일반 세제로는 분해되지 않으므로 고효율 용제 수작업 케어와 기계 솔 세정을 병행하여 타일 면의 손상 없이 깊은 오염까지 안전하게 용해하여 씻어냅니다.",
        "어닝청소": "네, 노후화된 원단에 초고압수를 가까이 분사하면 섬유 조직이 찢어질 위험이 매우 큽니다. 클린폼은 고온 온수 스팀과 직물 보호 전용 연화제를 사용해 때를 충분히 불려낸 뒤 부드럽게 세척하므로 원단 훼손 없이 안전하게 오염만 분리해 냅니다.",
        "간판청소": "작업 시작 전에 반드시 매장 내부 누전 차단기를 내리고, 물 유입이 쉬운 전선 결선 부위는 미리 내열 방수 필름으로 이중 래핑 조치합니다. 또한 강한 고압수가 아닌 안개 분사식 저압 살수로 방수 가이드를 준수하므로 합선 걱정이 없습니다.",
        "준공청소": "입주청소는 이전 거주자의 생활 먼지를 닦는 홈 케어 성격인 반면, 준공청소는 건설·건축 과정에서 생긴 시멘트 백화, 타일 본드, 페인트 튄 자국 등 자재 표면에 단단히 고착된 공업용 건축 폐기 흔적을 산업용 장비와 전문 특수 화학 용제를 사용해 마감 세척하는 건설업 최종 마감 공정입니다.",
        "인테리어 후 청소": "네, 겉만 닦으면 서랍을 여닫을 때마다 가구 안쪽에 고여 있던 톱가루가 옷이나 물건 위에 계속 가라앉게 됩니다. 클린폼은 슬라이딩 레일 서랍과 내부 분리형 선반을 모두 안전하게 탈거하여 보이지 않는 안쪽 사각지대 분진까지 완벽하게 진공 소독합니다.",
        "후드청소": "손과 도구가 닿는 후드 내벽 및 배기구 초입(덕트 초입 구간)의 찌든 기름 고착층을 특수 스크래퍼와 약품 스팀으로 깨끗하게 긁어내 세척해 드립니다. 꺾여서 올라가는 배관 내부는 별도 청소 공정이 필요합니다.",
        "쓰레기집청소": "네, 모든 폐기물은 노출 없는 박스와 불투명 마대로 꼼꼼히 밀봉하여 신속히 반출하며 작업 시 현관문을 닫고 프라이버시를 철저히 보장합니다.",
        "특수청소": "네, 감염 우려나 악성 가스로부터 작업 기사의 안전을 지키고 외부 유출을 막기 위해 전문 방독면 및 전신 방호구를 갖추고 매뉴얼을 준수해 세정합니다.",
        "종합청소": "지역, 공간 면적, 오염 영역(유리창, 바닥, 후드 등)을 알려주시면 작업 가능 여부부터 차근차근 확인해 드립니다."
    };

    const faqQ2Template = {
        "외벽청소": "로프 기사님이 작업할 때 추락 등 안전 예방 조치는 어떻게 되어 있나요?",
        "유리창청소": "쇼윈도나 전면 유리에 붙은 오래된 시트지와 썬팅 필름 자국도 제거가 되나요?",
        "화재청소": "벽이나 천장 콘크리트 깊숙이 배어 있는 지독한 탄 냄새도 완전히 없앨 수 있나요?",
        "바닥왁스코팅": "바닥 코팅 작업을 마친 후에 언제부터 밟고 다닐 수 있나요?",
        "바닥청소": "청소할 때 사무실 책상이나 매장 테이블, 대형 집기가 많은데 모두 치우고 작업해야 하나요?",
        "어닝청소": "청소 작업 중 어닝에서 흘러내린 더러운 땟물이 매장 전면 유리창이나 입구 바닥에 묻어 지저분해지지 않나요?",
        "간판청소": "높이가 4층 이상으로 아주 높은 빌딩 측면에 달린 대형 간판도 안전하게 청소가 가능한가요?",
        "준공청소": "신축 아파트 단지나 지식산업센터 빌딩 전체처럼 대규모 면적도 약속된 짧은 공기 내 완료가 가능한가요?",
        "인테리어 후 청소": "인테리어 공사 직후에 나는 매캐한 자재 냄새나 접착제 화학 냄새도 어느 정도 환기가 가능한가요?",
        "후드청소": "후드 청소를 할 때 주방 아래에 있는 튀김기, 오븐기, 싱크대에 약품이나 물이 들어가면 어쩌죠?",
        "쓰레기집청소": "방치된 음식물 쓰레기와 대형 가구 폐기 비용도 함께 포함되나요?",
        "특수청소": "동물 분뇨나 누적된 배설물 냄새도 탈취가 되나요?",
        "종합청소": "작업 비용 및 정확한 견적은 언제 알 수 있나요?"
    };

    const faqA2Template = {
        "외벽청소": "클린폼은 철저히 검증된 고소 작업 라이선스를 보유한 기사만 투입하며, 주 로프 외에 독립적인 구명줄(보조 로프)을 이중 체결하고 작업 전 모든 하네스 장비를 엄격히 검수합니다.",
        "유리창청소": "네, 전용 열풍기나 스티커 제거용 약품을 도포하여 유리에 미세한 스크래치도 남지 않도록 섬세하게 스크래핑 작업을 진행하여 말끔하게 지워드립니다.",
        "화재청소": "표면 세정 작업 후 유해 성분을 분해하는 특수 탈취제를 분사하고, 고성능 오존 발생 장비를 24시간 이상 가동하는 밀폐 공간 공기 정화 공정을 통해 콘크리트 기공 속 탄 취기를 극대화하여 중화합니다.",
        "바닥왁스코팅": "보통 도포 후 약 1시간 정도면 1차 건조가 완료되어 가벼운 통행이 가능합니다. 다만 완전히 경화되어 스크래치 방지 성능을 다하려면 최소 반나절 정도 양생하는 것이 좋아 퇴근 시간 이후나 주말 시공을 권장합니다.",
        "바닥청소": "개인 집기나 서류 같은 작은 소품들은 미리 책상 위로 정리해 주시면 좋으며, 대형 책상이나 무거운 집기는 무리하게 옮기지 않고 동선을 나눠 이동 가능한 의자나 집기들을 조금씩 밀어내며 구역별로 꼼꼼하게 진행합니다.",
        "어닝청소": "어닝 청소를 진행하면서 아래로 흐른 오염수는 전면 보양 필름 작업을 선행하여 방지하며, 어닝 작업을 마친 즉시 매장 입구 전면 유리창과 바닥 데크까지 연계 물청소로 깨끗이 마감 정돈하므로 오염이 남지 않습니다.",
        "간판청소": "네, 스카이차 고소 작업 차량을 적절한 도로 동선에 맞춰 배차하여, 아무리 높은 위치에 달린 건물 간판일지라도 전문 안전 기사가 탑승하여 깨끗하게 세정합니다.",
        "준공청소": "네, 현장 규모에 적합하도록 고소작업 차량, 대형 습식 집수기 및 대규모 전문 청소 인력을 동시에 투입하여 발주처의 준공 승인 및 준공식 일정에 맞춰 정밀 완수합니다.",
        "인테리어 후 청소": "공사 먼지 정밀 제거를 완료한 후, 자재 냄새 완화를 도울 수 있도록 환기 세정 가이드를 드리고 필요시 친환경 피톤치드 오존 공간 케어 상담도 제공합니다.",
        "후드청소": "네, 주방 후드와 함께 기름때가 달라붙기 쉬운 튀김기 외벽, 배수 트렌치, 주방 미끄러운 타일 바닥까지 주방 전체 패키지 위생 관리를 맞춤식으로 상담해 드립니다.",
        "쓰레기집청소": "기본 청소 외에 대형 폐기물 수수료 및 오물 처리 비용은 수량과 부피에 따라 실비 기준으로 정밀 산정하여 안내해 드립니다.",
        "특수청소": "표면 오염 제거 후, 냄새 입자를 파괴하는 특수 중화 탈취제를 다단 살포하고 공기질 개선 기기를 연속 가동하여 최대한 냄새 고착을 해결합니다.",
        "종합청소": "현장의 대략적인 사진과 평수를 토대로 유선상 예상 견적을 안내해 드리며, 필요시 사전 현장 점검을 거쳐 무리함 없이 최적의 범위를 안내합니다."
    };

    const heroImgAltTemplate = {
        "외벽청소": "{loc} 외벽 고압 세척 및 고소 로프 하강 작업을 진행하는 모습",
        "유리창청소": "{loc} 전면 쇼윈도 유리 유막 제거 및 스퀴지 작업을 하는 모습",
        "화재청소": "{loc} 화재 현장 내부 벽면 그을음 제거 및 공기 정화 작업을 하는 모습",
        "바닥왁스코팅": "{loc} 사무실 바닥의 오래된 왁스 박리 및 새 왁스 코팅 도포를 진행하는 모습",
        "바닥청소": "{loc} 상가 매장 바닥을 기계 브러싱 장비로 세정하여 찌든 오염을 제거하는 모습",
        "어닝청소": "{loc} 상가 어닝 천막의 곰팡이와 빗물 자국을 온수 스팀으로 제거하는 모습",
        "간판청소": "{loc} 스카이 크레인을 타고 높은 상가 건물 간판의 이물질을 제거하는 모습",
        "준공청소": "{loc} 신축 건물 준공 검사를 위해 벽면 시멘트 가루와 보양지를 제거하는 모습",
        "인테리어 후 청소": "{loc} 인테리어 완공 후 서랍장을 탈거하여 내부 톱밥 먼지를 꼼꼼히 청소하는 모습",
        "후드청소": "{loc} 주방 후드 필터에 고착된 시커먼 유증기 기름때를 스팀으로 씻어내는 모습",
        "쓰레기집청소": "{loc} 방치 폐기물 수거 및 고강도 소독 작업 중인 클린폼",
        "특수청소": "{loc} 특수 감염원 제거 및 공간 방역 소독 작업 중인 클린폼",
        "종합청소": "{loc} 전문 청소 장비와 인력으로 작업 중인 클린폼"
    };

    // FAQ 데이터는 SERVICES_DATA의 각 서비스별 faq 배열을 동적으로 참조하여 getDesc 헬퍼로 치환하므로 하드코딩 맵을 사용하지 않습니다.
        // 4. 변환 텍스트 셋업 (명시적 SEO 템플릿 적용)
    const titleStr = `${displayLoc} ${displayTask} 전문 브랜드, 클린폼 | 견적 상담`;
    const descStr = `${displayLoc} 현장에 최적화된 맞춤 클린 서비스와 정직한 비용 제안. 클린폼에서 안심하고 진행하세요.`;
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
        heroImgEl.setAttribute('alt', getDesc(heroImgAltTemplate[displayTask] || heroImgAltTemplate["종합청소"]));
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
        needHeading.innerText = needSituationHeadingTemplate[displayTask] || needSituationHeadingTemplate["종합청소"];
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
        possibleWorksHeading.innerText = getDesc(possibleWorksHeadingTemplate[displayTask] || possibleWorksHeadingTemplate["종합청소"]);
    }
    const possibleWorksSubtitle = document.getElementById('possible-works-subtitle');
    if (possibleWorksSubtitle) {
        possibleWorksSubtitle.innerText = getDesc(possibleWorksSubtitleTemplate[displayTask] || possibleWorksSubtitleTemplate["종합청소"]);
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

    // Section 6-2: Process Steps
    const processStepsEl = document.getElementById('process-steps');
    if (processStepsEl) {
        const stepsData = processStepsTemplate[displayTask] || processStepsTemplate["종합청소"];
        processStepsEl.innerHTML = stepsData.map((stepDesc, idx) => 
            `<div class="process-card"><div class="step-num">STEP ${idx + 1}</div><div class="step-desc">${stepDesc}</div></div>`
        ).join('');
    }

    // Section 7: FAQs (Dynamic conversion)
    if (taskData.faq && taskData.faq.length >= 3) {
        const faqQ1 = document.getElementById('faq-q1');
        const faqQ2 = document.getElementById('faq-q2');
        const faqQ3 = document.getElementById('faq-q3');
        const faqQ4 = document.getElementById('faq-q4');
        const faqQ5 = document.getElementById('faq-q5');

        if (faqQ1) {
            faqQ1.innerText = `Q. ` + getDesc(faqQ1Template[displayTask] || faqQ1Template["종합청소"]);
            faqQ1.nextElementSibling.innerText = getDesc(faqA1Template[displayTask] || faqA1Template["종합청소"]);
        }
        if (faqQ2) {
            faqQ2.innerText = `Q. ` + getDesc(faqQ2Template[displayTask] || faqQ2Template["종합청소"]);
            faqQ2.nextElementSibling.innerText = getDesc(faqA2Template[displayTask] || faqA2Template["종합청소"]);
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
        midCtaText.innerHTML = getDesc(midCtaTextTemplate[displayTask] || midCtaTextTemplate["종합청소"]);
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
