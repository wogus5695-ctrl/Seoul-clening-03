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
        "간판청소": "눈비에 섞인 먼지가 입체 글자(채널 간판) 사이에 쌓이고 거미줄과 곤충 사체가 들러붙으면 조명이 어두워지고 지저분해 보이기 마련이며, 높은 위치의 간판 틈새 오염을 고소차를 이용해 안전하게 다가가 미세 틈�    const faqQ1Template = {
        "외벽청소": "{loc} 외벽청소는 건물 높이에 따라 작업 방식이 달라지나요?",
        "유리창청소": "{loc} 유리창청소는 외부 유리도 가능한가요?",
        "화재청소": "{loc} 화재청소는 그을음과 탄 냄새까지 정리할 수 있나요?",
        "바닥왁스코팅": "{loc} 바닥왁스코팅은 기존 왁스를 제거해야 하나요?",
        "바닥청소": "{loc} 바닥청소는 찌든 때와 얼룩 제거가 가능한가요?",
        "어닝청소": "{loc} 어닝청소는 천막 소재 손상 없이 가능한가요?",
        "간판청소": "{loc} 간판청소는 높은 위치도 가능한가요?",
        "준공청소": "{loc} 준공청소는 공사 분진과 시멘트 가루까지 정리하나요?",
        "인테리어 후 청소": "{loc} 인테리어청소는 공사 후 먼지와 자재 잔여물 정리가 가능한가요?",
        "후드청소": "{loc} 후드청소는 기름때와 악취 관리에 도움이 되나요?",
        "쓰레기집청소": "{loc} 쓰레기집청소는 이웃들에게 노출되지 않도록 작업해 주시나요?",
        "특수청소": "{loc} 특수청소는 반려동물 방치 오염이나 악취 제거도 가능한가요?",
        "종합청소": "{loc} 종합청소는 구체적으로 어떤 서비스를 말하나요?"
    };

    const faqA1Template = {
        "외벽청소": "네, 2~3층 이하의 저층 건물은 사다리나 연장 고압 폴대를 사용해 지상에서 청소할 수 있지만, 그 이상의 고층 건물은 스카이 차(고소 작업차)를 배치하거나 외벽 로프 작업을 통해 숙련된 기사가 직접 하강하며 외벽 세정을 진행합니다.",
        "유리창청소": "네, 안쪽 유리뿐만 아니라 스퀴지와 폴대 장비, 또는 필요한 경우 로프 및 고소작업 차량을 이용하여 매장의 전면 유리나 외부 창문 바깥쪽의 먼지와 물때까지 깨끗하게 닦아냅니다.",
        "화재청소": "네, 화재로 인해 벽면과 가구에 흡착된 검은 그을음 분진을 정밀 세정하고, 유해 냄새 분해 약품 살포 및 고성능 오존 가스 장비를 가동하여 실내 깊숙이 밴 지독한 탄 냄새를 중화 및 제거합니다.",
        "바닥왁스코팅": "네, 기존에 바른 왁스막이 노랗게 변색되거나 들뜬 상태에서 덧바르면 얼룩이 더 심해집니다. 클린폼은 전용 박리제로 옛 왁스층을 깨끗하게 벗겨낸 뒤 새 왁스코팅을 올려 투명한 광택을 완성합니다.",
        "바닥청소": "네, 타일에 깊숙이 스며든 찌든 때, 검은 구두굽 자국, 끈적이는 본드 얼룩 등 일상 청소로 지워지지 않는 모든 흔적을 바닥 세정 전용 장비 and 전문 약품을 사용해 깨끗하게 제거합니다.",
        "어닝청소": "네, 낡은 천막 원단에 강한 고압수를 바로 쏘면 찢어질 위험이 큽니다. 클린폼은 어닝 소재에 맞는 친환경 전용 세제를 사용해 때를 불린 후, 온수 스팀과 저압 린스 방식을 병행해 손상 없이 먼지를 분리합니다.",
        "간판청소": "네, 건물의 고층이나 높은 위치에 설치된 대형 간판도 스카이 고소작업 차량을 활용해 전문 기사가 안전하게 접근하여 물청소와 약품 세정을 진행합니다.",
        "준공청소": "네, 신축 공사 후 벽면과 천장, 문틀 구석구석에 내려앉은 미세한 시멘트 분진 가루, 실리콘 잔여물, 타일 백화 자국까지 산업용 고성능 청소기와 전문 장비로 완벽히 흡입하고 닦아냅니다.",
        "인테리어 후 청소": "네, 리모델링 공사 직후 발생하는 엄청난 양의 자재 톱밥 가루, 미세 먼지, 보양 테이프 자국, 페인트 자국 등을 탈거 가능한 서랍장 안쪽까지 세밀하게 제거해 드립니다.",
        "후드청소": "네, 식당 주방의 후드 내벽에 고착된 두껍고 누런 기름때를 말끔히 스크래핑하고 약품 세정하여, 주방 위생 등급을 지키고 환풍 효율을 높여 기름 흘러내림 및 매캐한 악취를 즉각 해결합니다.",
        "쓰레기집청소": "네, 모든 폐기물은 노출 없는 불투명 마대와 밀봉 박스에 담아 외부에서 내용물이 보이지 않게 반출하며, 이웃들의 소음 민원과 시선을 최소화하기 위해 현관문을 닫고 보안 상태에서 신속하게 정리합니다.",
        "특수청소": "네, 반려동물의 분뇨 고착이나 악취, 벽지 오염 등 난해한 특수 오염을 전용 소독 약품과 오존 살균 장비로 안전하게 탈취 및 탈균 처리합니다.",
        "종합청소": "클린폼이 제공하는 건물 외벽, 유리창, 바닥, 주방 후드 등 개별 특화 청소를 통합하거나, 현장 오염도와 공간 용도를 분석해 필요한 구역을 패키지로 한 번에 제공하는 맞춤 청소 설계 솔루션입니다."
    };

    const faqQ2Template = {
        "외벽청소": "외벽 재질에 따라 고압세척이 어려운 경우도 있나요?",
        "유리창청소": "매장 전면 유리 물때와 손자국도 제거할 수 있나요?",
        "화재청소": "화재 후 폐기물 정리도 함께 가능한가요?",
        "바닥왁스코팅": "바닥 광택이 사라졌을 때 왁스코팅이 필요한가요?",
        "바닥청소": "매장 바닥과 사무실 바닥은 청소 방식이 다른가요?",
        "어닝청소": "어닝에 생긴 빗물 자국과 곰팡이도 제거할 수 있나요?",
        "간판청소": "간판 조명 커버의 먼지와 벌레 자국도 청소 가능한가요?",
        "준공청소": "입주 전 준공청소는 어느 시점에 맡기는 게 좋나요?",
        "인테리어 후 청소": "영업 시작 전 매장 청소도 가능한가요?",
        "후드청소": "음식점 주방 후드는 어느 주기로 청소하는 게 좋나요?",
        "쓰레기집청소": "방치된 음식물 쓰레기와 대형 가구 폐기 비용도 함께 포함되나요?",
        "특수청소": "특수청소 작업 시 소독과 방역도 함께 진행되나요?",
        "종합청소": "청소 비용 및 견적은 언제 알 수 있나요?"
    };

    const faqA2Template = {
        "외벽청소": "네, 대리석, 벽돌, 드라이비트, 금속 판넬 등 외벽 마감재 재질에 따라 강한 압력의 물세척이 불가능할 수도 있습니다. 클린폼은 재질 오염 상태에 맞춰 세제 성분과 물 압력을 조절해 안전하게 작업합니다.",
        "유리창청소": "네, 비바람으로 인해 생긴 찌든 물때, 오래된 스티커 자국, 유성 손자국 등 유리의 투명도를 떨어뜨리는 모든 오염을 전용 유리 스크래퍼와 세정 약품으로 흠집 없이 지워 투명함을 복원해 드립니다.",
        "화재청소": "네, 화재로 인해 타버린 가구, 가전제품, 파손된 자재 등의 폐기물 수거 및 정리를 현장 복원 세정과 함께 원스톱으로 처리하여 초기 철거 부담을 덜어드립니다.",
        "바닥왁스코팅": "네, 광택이 사라졌다는 것은 바닥을 보호하는 코팅막이 닳아 마모되었다는 신호입니다. 이때 왁스코팅을 해주면 데코타일 등 바닥재에 스크래치와 오염이 고착되는 것을 막아 수명을 늘릴 수 있습니다.",
        "바닥청소": "네, 유동인구가 많아 찌든 오염이 심한 매장 바닥은 강력한 회전 브러시 장비를 위주로 청소하며, 전자기기와 집기가 많고 소음 조절이 필요한 사무실은 소음을 최소화하고 바닥재 종류에 적합한 습식 세정으로 관리합니다.",
        "어닝청소": "네, 어닝 원단 사이에 고착되어 거무스름하게 피어난 빗물 자국, 찌든 매연 얼룩, 녹색 이끼 곰팡이를 전용 곰팡이 제거 약품과 부드러운 브러시 수작업으로 지워내어 새것처럼 매장 전면을 살려냅니다.",
        "간판청소": "네, 외부 조명 틈새에 쌓인 까만 먼지와 벌레 사체 자국, 빗물 자국으로 흐려진 조명 커버 표면을 깨끗하게 닦아내어 간판 본래의 밝기와 매장의 뛰어난 시인성을 되찾아 드립니다.",
        "준공청소": "모든 인테리어 시공 및 보수 공사가 최종적으로 끝난 직후, 그리고 가구나 집기가 들어오기 최소 2~3일 전에 진행하는 것이 마감 검수와 잔여 분진 정리에 가장 효과적입니다.",
        "인테리어 후 청소": "네, 오픈 일정 및 영업 시작에 맞추어 인테리어 마감 청소를 신속하게 완료함으로써, 고객님이 즉시 가구를 세팅하고 차질 없이 영업을 개시하실 수 있도록 깔끔하게 정리해 드립니다.",
        "후드청소": "기름을 많이 사용하는 튀김 및 중식당은 최소 3~6개월 주기가 좋으며, 일반 한식이나 카페형 조리실은 위생 관리와 화재 예방을 위해 연 1~2회 정기 청소를 권장합니다.",
        "쓰레기집청소": "네, 냉장고 안에 썩은 음식물부터 폐가구, 생활 쓰레기 수거와 부피에 따른 폐기물 위탁 처리 비용을 합리적으로 산정하여 한 번에 수거해 드립니다.",
        "특수청소": "네, 단순 오염 제거에 그치지 않고 질병 감염 예방과 취기 중화를 위해 작업 공간 전체에 고강도 바이러스 방역 소독 및 탈취 공정을 필수 연계하여 완료합니다.",
        "종합청소": "현장 사진이나 면적, 오염 범위 등을 토대로 대략적인 예상 범위를 먼저 상담해 드린 후 필요시 정확한 최종 견적을 안내해 드리므로 안심하고 상담받으실 수 있습니다."
    };"
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
        "외벽청소": "클린폼에서 가능한 청소 작업",
        "유리창청소": "클린폼에서 가능한 청소 작업",
        "화재청소": "클린폼에서 가능한 청소 작업",
        "바닥왁스코팅": "클린폼에서 가능한 청소 작업",
        "바닥청소": "클린폼에서 가능한 청소 작업",
        "어닝청소": "클린폼에서 가능한 청소 작업",
        "간판청소": "클린폼에서 가능한 청소 작업",
        "준공청소": "클린폼에서 가능한 청소 작업",
        "인테리어 후 청소": "클린폼에서 가능한 청소 작업",
        "후드청소": "클린폼에서 가능한 청소 작업",
        "쓰레기집청소": "클린폼에서 가능한 청소 작업",
        "특수청소": "클린폼에서 가능한 청소 작업",
        "종합청소": "클린폼에서 가능한 청소 작업"
    };

    const possibleWorksSubtitleTemplate = {
        "외벽청소": "{loc}에서 외벽청소 작업이 필요하다면, 현장 사진과 작업 범위를 기준으로 가능 여부를 확인합니다.",
        "유리창청소": "{loc}에서 유리창청소 작업이 필요하다면, 현장 사진과 작업 범위를 기준으로 가능 여부를 확인합니다.",
        "화재청소": "{loc}에서 화재청소 작업이 필요하다면, 현장 사진과 작업 범위를 기준으로 가능 여부를 확인합니다.",
        "바닥왁스코팅": "{loc}에서 바닥왁스코팅 작업이 필요하다면, 현장 사진과 작업 범위를 기준으로 가능 여부를 확인합니다.",
        "바닥청소": "{loc}에서 바닥청소 작업이 필요하다면, 현장 사진과 작업 범위를 기준으로 가능 여부를 확인합니다.",
        "어닝청소": "{loc}에서 어닝청소 작업이 필요하다면, 현장 사진과 작업 범위를 기준으로 가능 여부를 확인합니다.",
        "간판청소": "{loc}에서 간판청소 작업이 필요하다면, 현장 사진과 작업 범위를 기준으로 가능 여부를 확인합니다.",
        "준공청소": "{loc}에서 준공청소 작업이 필요하다면, 현장 사진과 작업 범위를 기준으로 가능 여부를 확인합니다.",
        "인테리어 후 청소": "{loc}에서 인테리어청소 작업이 필요하다면, 현장 사진과 작업 범위를 기준으로 가능 여부를 확인합니다.",
        "후드청소": "{loc}에서 후드청소 작업이 필요하다면, 현장 사진과 작업 범위를 기준으로 가능 여부를 확인합니다.",
        "쓰레기집청소": "{loc}에서 쓰레기집청소 작업이 필요하다면, 현장 사진과 작업 범위를 기준으로 가능 여부를 확인합니다.",
        "특수청소": "{loc}에서 특수청소 작업이 필요하다면, 현장 사진과 작업 범위를 기준으로 가능 여부를 확인합니다.",
        "종합청소": "{loc}에서 종합청소 작업이 필요하다면, 현장 사진과 작업 범위를 기준으로 가능 여부를 확인합니다."
    };

    const midCtaTextTemplate = {
        "외벽청소": "{loc}에서 외벽청소 작업이 필요하다면, 현장 상태와 작업 범위를 기준으로 가능 여부를 안내드립니다.",
        "유리창청소": "{loc}에서 유리창청소 작업이 필요하다면, 현장 상태와 작업 범위를 기준으로 가능 여부를 안내드립니다.",
        "화재청소": "{loc}에서 화재청소 작업이 필요하다면, 현장 상태와 작업 범위를 기준으로 가능 여부를 안내드립니다.",
        "바닥왁스코팅": "{loc}에서 바닥왁스코팅 작업이 필요하다면, 현장 상태와 작업 범위를 기준으로 가능 여부를 안내드립니다.",
        "바닥청소": "{loc}에서 바닥청소 작업이 필요하다면, 현장 상태와 작업 범위를 기준으로 가능 여부를 안내드립니다.",
        "어닝청소": "{loc}에서 어닝청소 작업이 필요하다면, 현장 상태와 작업 범위를 기준으로 가능 여부를 안내드립니다.",
        "간판청소": "{loc}에서 간판청소 작업이 필요하다면, 현장 상태와 작업 범위를 기준으로 가능 여부를 안내드립니다.",
        "준공청소": "{loc}에서 준공청소 작업이 필요하다면, 현장 상태와 작업 범위를 기준으로 가능 여부를 안내드립니다.",
        "인테리어 후 청소": "{loc}에서 인테리어청소 작업이 필요하다면, 현장 상태와 작업 범위를 기준으로 가능 여부를 안내드립니다.",
        "후드청소": "{loc}에서 후드청소 작업이 필요하다면, 현장 상태와 작업 범위를 기준으로 가능 여부를 안내드립니다.",
        "쓰레기집청소": "{loc}에서 쓰레기집청소 작업이 필요하다면, 현장 상태와 작업 범위를 기준으로 가능 여부를 안내드립니다.",
        "특수청소": "{loc}에서 특수청소 작업이 필요하다면, 현장 상태와 작업 범위를 기준으로 가능 여부를 안내드립니다.",
        "종합청소": "{loc}에서 종합청소 작업이 필요하다면, 현장 상태와 작업 범위를 기준으로 가능 여부를 안내드립니다."
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
    const titleTemplates = {
        "외벽청소": "{loc} 외벽청소 전문 클린폼",
        "유리창청소": "{loc} 유리창청소 상담 클린폼",
        "화재청소": "{loc} 화재청소 복구 상담 클린폼",
        "바닥왁스코팅": "{loc} 바닥왁스코팅 관리 클린폼",
        "바닥청소": "{loc} 바닥청소 전문 클린폼",
        "어닝청소": "{loc} 어닝청소 상담 클린폼",
        "간판청소": "{loc} 간판청소 전문 클린폼",
        "준공청소": "{loc} 준공청소 입주 전 정리 클린폼",
        "인테리어 후 청소": "{loc} 인테리어청소 공사 후 정리 클린폼",
        "후드청소": "{loc} 후드청소 주방 위생 관리 클린폼",
        "쓰레기집청소": "{loc} 쓰레기집청소 안심 비공개 클린폼",
        "특수청소": "{loc} 특수청소 긴급 방역 소독 클린폼",
        "종합청소": "{loc} 종합청소 전문 클린폼"
    };

    const h1Templates = {
        "외벽청소": "{loc} 외벽청소 전문 클린폼",
        "유리창청소": "{loc} 유리창청소 상담",
        "화재청소": "{loc} 화재청소 복구 및 탄 냄새 중화",
        "바닥왁스코팅": "{loc} 바닥왁스코팅 표면 보호막 시공",
        "바닥청소": "{loc} 바닥청소 현장 맞춤 상담",
        "어닝청소": "{loc} 어닝청소 곰팡이 얼룩 제거",
        "간판청소": "{loc} 간판청소 조명 조도 복원",
        "준공청소": "{loc} 준공청소 입주 전 마감 정리",
        "인테리어 후 청소": "{loc} 인테리어청소 공사 후 먼지 제거",
        "후드청소": "{loc} 후드청소 주방 기름때 관리",
        "쓰레기집청소": "{loc} 쓰레기집청소 폐기물 수거 정리",
        "특수청소": "{loc} 특수청소 현장 맞춤 위생 케어",
        "종합청소": "{loc} 종합청소 현장 맞춤 클리닝"
    };

    const descTemplates = {
        "외벽청소": "{loc} 외벽청소는 마감재 재질과 높이, 오염도에 따른 고압세척 가능 여부 파악이 핵심입니다. 클린폼이 도로 통제와 고소 장비 투입 계획을 세워 안전하게 시공합니다.",
        "유리창청소": "{loc} 유리창청소는 빗물 자국과 뿌연 유막 등 유리 오염 상태를 점검하여 매장 전경 쇼윈도와 외부 유리를 얼룩 없이 맑게 닦아내는 클린폼 맞춤 위생 케어입니다.",
        "준공청소": "{loc} 준공청소가 필요하시다면 신축 현장의 공사 분진과 몰딩 틈새의 시멘트 가루를 말끔히 제거하고, 입주 전 마감 정리 검수가 완벽히 끝나도록 클린폼이 정성껏 클리닝합니다.",
        "후드청소": "{loc} 후드청소는 식당 조리실에 고착된 누런 기름때와 환풍구 악취를 완벽히 제거하는 주방 위생 관리 작업입니다. 클린폼이 후드 내부 오염 수준을 감별해 청소해 드립니다.",
        "바닥청소": "{loc} 바닥청소는 타일에 눌러붙은 찌든 때와 스크래치 얼룩을 바닥 재질에 맞춰 회전 브러시 세정 방식으로 복원합니다. 클린폼의 풍부한 상업 공간 케어 노하우를 만나보세요.",
        "바닥왁스코팅": "{loc} 바닥왁스코팅으로 데코타일의 맑은 광택과 표면 보호막을 형성하고 깊은 스크래치를 예방하세요. 클린폼이 기존 코팅 박리부터 관리 주기 안내까지 체계적으로 제공합니다.",
        "화재청소": "{loc} 화재청소는 실내 전체에 흡착된 매캐한 그을음과 탄 냄새 분진을 신속히 제거하고 폐기물 정리 및 오존 중화 방역을 수행하는 클린폼의 긴급 공간 복구 솔루션입니다.",
        "어닝청소": "{loc} 어닝청소는 외부 매연 얼룩과 빗물 자국, 푸른 곰팡이를 섬유 조직 손상 없이 부드러운 온수 스팀 살수로 지워내어 매장 외관의 선명하고 쾌적한 첫인상을 복원하는 클린폼 케어입니다.",
        "간판청소": "{loc} 간판청소는 대기 오염으로 흐려진 간판 내부 먼지와 거미줄, 조명 커버의 벌레 자국을 고소 장비차로 정밀 닦아냅니다. 클린폼이 매장의 간판 시인성을 확실히 되찾아 드립니다.",
        "인테리어 후 청소": "{loc} 인테리어청소가 고민이신가요? 리모델링 공사 후 남는 유해 톱밥 먼지와 자재 잔여물을 서랍까지 탈거해 제거하고, 영업 전 정돈을 신속히 마감하는 클린폼의 정밀 케어입니다.",
        "쓰레기집청소": "{loc} 쓰레기집청소는 방치된 생활 폐기물 수거부터 누적된 오염 제거, 비공개 프라이버시 소독까지 원스톱으로 해결합니다. 클린폼이 쾌적하고 살균된 본래의 주거 공간으로 정리합니다.",
        "특수청소": "{loc} 특수청소는 반려동물 방치 오염, 극한의 취기 오염, 감염원 방역 등 특수 약품 처리가 요구되는 현장을 전문 보호구를 갖춘 클린폼 정예 인력이 철저히 살균 및 소독 처리합니다.",
        "종합청소": "{loc} 종합청소 전문 클린폼이 현장 오염도와 용도를 분석하여 맞춤 청소를 설계합니다. 공간의 가치를 회복하고 위생 가이드라인에 맞춘 투명한 비용 안내를 받아보세요."
    };

    const titleStr = (titleTemplates[displayTask] || titleTemplates["종합청소"]).replace(/{loc}/g, displayLoc);
    const descStr = (descTemplates[displayTask] || descTemplates["종합청소"]).replace(/{loc}/g, displayLoc);
    const h1Str = (h1Templates[displayTask] || h1Templates["종합청소"]).replace(/{loc}/g, displayLoc);
    
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

    // Section 2: Need Situation Section (문제 후킹 섹션)
    const needHeading = document.getElementById('need-situation-heading');
    const regionContextDescEl = document.getElementById('region-context-desc');
    const hookingCardsContainer = document.getElementById('hooking-cards-container');

    const needData = getNeedSituationData(displayLoc, displayTask);

    if (needHeading) {
        needHeading.innerText = needData.title;
    }
    if (regionContextDescEl) {
        regionContextDescEl.innerText = needData.desc;
    }
    if (hookingCardsContainer) {
        hookingCardsContainer.innerHTML = needData.cardsHtml;
    }

    // Section 3: Pain Points (業者 선택 기준)
    setInner('pain-point-heading', '업체 선택 전 확인할 3가지');

    // Section 4: 작업 범위 섹션 제목 & 목록
        const workScopeHeading = document.getElementById('work-scope-heading');
    if (workScopeHeading) {
        workScopeHeading.innerText = '청소 범위는 현장 상태를 보고 정합니다';
    }

    // Section 5: 가능한 청소 작업 섹션 제목 & 부제목 치환
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
        document.querySelectorAll('.works-text-list span').forEach(el => el.classList.remove('highlight-task'));
        const activeSpan = document.querySelector(`.works-text-list span[data-task="${highlightKey}"]`);
        if (activeSpan) {
            activeSpan.classList.add('highlight-task');
        }
    }

    // Render marquee track dynamically
    const marqueeTrackContainer = document.getElementById('marquee-track-container');
    if (marqueeTrackContainer) {
        const possibleWorksData = [
            { task: "간판청소", label: "간판/어닝 청소", image: "/images/cleanforme/slide-signboard-awning.jpg", alt: "간판 및 어닝 청소 작업 이미지" },
            { task: "유리창청소", label: "유리창/외벽 청소", image: "/images/cleanforme/slide-window-exterior.jpg", alt: "유리창 및 외벽 청소 작업 이미지" },
            { task: "쓰레기집청소", label: "쓰레기집/특수 청소", image: "/images/cleanforme/slide-garbage-special.jpg", alt: "쓰레기집 및 특수 청소 작업 이미지" },
            { task: "준공청소", label: "준공/인테리어 후 청소", image: "/images/cleanforme/slide-postconstruction-interior.jpg", alt: "준공 및 인테리어 후 청소 작업 이미지" },
            { task: "바닥왁스코팅", label: "바닥 왁스코팅", image: "/images/cleanforme/slide-floor-wax.jpg", alt: "바닥 왁스코팅 작업 이미지" },
            { task: "특수청소", label: "수영장 청소", image: "/images/cleanforme/slide-swimming-pool.jpg", alt: "수영장 청소 작업 이미지" },
            { task: "특수청소", label: "시트지 제거", image: "/images/cleanforme/slide-sticker-removal.jpg", alt: "시트지 제거 작업 이미지" },
            { task: "특수청소", label: "주차장 청소", image: "/images/cleanforme/slide-parking-lot.jpg", alt: "주차장 청소 작업 이미지" },
            { task: "특수청소", label: "카펫 청소", image: "/images/cleanforme/slide-carpet-cleaning.jpg", alt: "카펫 청소 작업 이미지" }
        ];

        let marqueeHtml = '';
        const quadItems = [...possibleWorksData, ...possibleWorksData, ...possibleWorksData];
        quadItems.forEach((item) => {
            marqueeHtml += `
                            <div class="marquee-item">
                                <img src="${item.image}" alt="${displayLoc} ${item.alt}">
                                <span class="marquee-label">${item.label}</span>
                            </div>`;
        });
        marqueeTrackContainer.innerHTML = marqueeHtml;
    }

    // Section 6: Process Heading
    const processHeading = document.getElementById('process-heading');
    if (processHeading) {
        processHeading.innerText = '상담부터 작업 확인까지';
    }

    // Section 6-2: Process Steps (고정 4단계 데이터 및 타이틀/설명 구조 렌더링)
    const processStepsEl = document.getElementById('process-steps');
    if (processStepsEl) {
        const processSteps = [
            { title: "현장 정보 확인", desc: "지역, 청소 종류, 면적, 오염 상태를 확인합니다." },
            { title: "작업 범위 안내", desc: "사진과 현장 조건을 기준으로 가능 범위를 안내합니다." },
            { title: "청소 작업 진행", desc: "작업 종류에 맞는 장비와 방식으로 진행합니다." },
            { title: "작업 후 확인", desc: "작업 범위 내 미흡 구간을 함께 확인합니다." }
        ];
        processStepsEl.innerHTML = processSteps.map((step, idx) => `
            <div class="process-card">
                <div class="step-num">STEP ${idx + 1}</div>
                <h3 class="step-card-title">${step.title}</h3>
                <p class="step-card-desc">${step.desc}</p>
            </div>`).join('');
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

function getNeedSituationData(loc, task) {
    const taskKeyMap = {
        "외벽청소": "외벽청소",
        "유리창청소": "유리창청소",
        "화재청소": "화재청소",
        "바닥왁스코팅": "바닥왁스코팅",
        "바닥청소": "바닥청소",
        "어닝청소": "어닝청소",
        "간판청소": "간판청소",
        "인테리어청소": "인테리어청소",
        "인테리어 후 청소": "인테리어청소",
        "인테리어 후청소": "인테리어청소",
        "인테리어후청소": "인테리어청소",
        "준공청소": "준공청소",
        "후드청소": "후드청소",
        "쓰레기집청소": "쓰레기집청소",
        "특수청소": "특수청소",
        "종합청소": "종합청소"
    };

    const taskKey = taskKeyMap[task] || "종합청소";

    const svgIconsMap = {
        "droplets": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16.3c2.2 0 4-1.8 4-4.05 0-1.16-.6-2.68-1.5-3.8A12 12 0 0 0 8 6a12 12 0 0 0-1.5 2.45c-.9 1.12-1.5 2.64-1.5 3.8 0 2.25 1.8 4.05 4 4.05z"></path><path d="M17 18.5c1.37 0 2.5-1.13 2.5-2.5 0-.7-.37-1.63-.93-2.33a8 8 0 0 0-.94-1.2A8 8 0 0 0 16.7 13.7c-.56.7-.93 1.63-.93 2.3 0 1.37 1.13 2.5 2.5 2.5z"></path></svg>`,
        "dust": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h1"></path><path d="M20 12h1"></path><path d="M12 4v1"></path><path d="M12 20v1"></path><path d="M6.3 6.3l.8.8"></path><path d="M16.9 16.9l.8.8"></path><path d="M6.3 17.7l.8-.8"></path><path d="M16.9 7.1l.8-.8"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
        "mold": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="2"></circle><circle cx="16" cy="8" r="3"></circle><circle cx="10" cy="15" r="4"></circle><circle cx="17" cy="16" r="2"></circle></svg>`,
        "ladder": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="9" y1="22" x2="9" y2="16"></line><line x1="15" y1="22" x2="15" y2="16"></line><line x1="9" y1="16" x2="15" y2="16"></line><path d="M8 6h2v2H8V6zm6 0h2v2h-2V6zm-6 5h2v2H8v-2zm6 0h2v2h-2v-2z"></path></svg>`,
        "sparkle": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v4"></path><path d="M12 17v4"></path><path d="M3 12h4"></path><path d="M17 12h4"></path><path d="M5.6 5.6l2.9 2.9"></path><path d="M15.5 15.5l2.9 2.9"></path><path d="M5.6 18.4l2.9-2.9"></path><path d="M15.5 8.5l2.9-2.9"></path></svg>`,
        "rain": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="16" y1="13" x2="16" y2="21"></line><line x1="8" y1="13" x2="8" y2="21"></line><line x1="12" y1="15" x2="12" y2="23"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>`,
        "water-drop": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z"></path></svg>`,
        "scraper": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H4v20h16V8l-6-6z"></path><path d="M14 3v5h5"></path><path d="M16 13H8"></path><path d="M16 17H8"></path><path d="M10 9H8"></path></svg>`,
        "building-window": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line><line x1="3" y1="12" x2="21" y2="12"></line></svg>`,
        "smoke": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5"></path><path d="M12 2C9 5 9 8.5 11 11s0 5-3 7.5"></path><path d="M16 3.5c-2.25 2.25-2.25 4.88-.75 6.75s0 3.75-2.25 5.63"></path></svg>`,
        "odor": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22a4 4 0 0 1-4-4c0-2.2 4-7 4-7s4 4.8 4 7a4 4 0 0 1-4 4z"></path><path d="M18 22a4 4 0 0 1-4-4c0-2.2 4-7 4-7s4 4.8 4 7a4 4 0 0 1-4 4z"></path><path d="M12 10a3 3 0 0 1-3-3c0-1.65 3-5 3-5s3 3.35 3 5a3 3 0 0 1-3 3z"></path></svg>`,
        "checklist": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"></rect><polyline points="9 11 11 13 15 9"></polyline></svg>`,
        "layers": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polygon points="2 17 12 22 22 17"></polygon><polygon points="2 12 12 17 22 12"></polygon></svg>`,
        "stain": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path><circle cx="9" cy="9" r="1.5"></circle><circle cx="15" cy="10" r="1"></circle><circle cx="12" cy="14" r="2"></circle></svg>`,
        "footsteps": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2a2 2 0 1 1 4 0v2"></path><path d="M16 10V8a2 2 0 1 1 4 0v2"></path><path d="M8 12v-2a2 2 0 1 1 4 0v2"></path><path d="M12 14v-2a2 2 0 1 1 4 0v2"></path></svg>`,
        "paint": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M7.5 10.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5z"></path><path d="M11.5 7.5c.828 0 1.5-.672 1.5-1.5s-.672-1.5-1.5-1.5-1.5.672-1.5 1.5.672 1.5 1.5 1.5z"></path><path d="M6 14h12"></path></svg>`,
        "brush": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z"></path></svg>`,
        "tile": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>`,
        "storefront": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
        "light": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .5 2.5 1.5 3.5.7.8 1.3 1.5 1.5 2.5"></path><line x1="9" y1="18" x2="15" y2="18"></line><line x1="10" y1="22" x2="14" y2="22"></line></svg>`,
        "signboard": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="10" rx="2"></rect><line x1="12" y1="15" x2="12" y2="21"></line><line x1="8" y1="21" x2="16" y2="21"></line></svg>`,
        "glue": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M12 6v12M6 12h12"></path></svg>`,
        "window": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line><line x1="3" y1="12" x2="21" y2="12"></line></svg>`,
        "floor": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="12" x2="21" y2="12"></line></svg>`,
        "tape": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle></svg>`,
        "oil-drop": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z"></path></svg>`,
        "hood": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"></rect><path d="M8 8h8M8 12h8M8 16h8"></path></svg>`,
        "shield-check": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 11 11 13 15 9"></polyline></svg>`,
        "trash": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
        "boxes": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
        "warning": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
        "tool": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`
    };

    const data = {
        "외벽청소": {
            title: "외벽 오염은 눈에 보이는 부분보다 접근 방식이 중요합니다",
            desc: `${loc}에서 외벽청소 작업이 필요하다면, 외벽 오염 상태와 접근 높이, 세척 가능 범위를 먼저 확인해야 합니다.`,
            cards: [
                { title: "물때·먼지", desc: "외벽 표면에 쌓인 오염 확인", icon: "droplets" },
                { title: "이끼·곰팡이", desc: "습기 많은 구역의 오염 확인", icon: "mold" },
                { title: "고소 접근", desc: "장비 and 작업 방식 검토", icon: "ladder" },
                { title: "외관 이미지", desc: "건물 첫인상 개선", icon: "sparkle" }
            ]
        },
        "유리창청소": {
            title: "유리 물때와 먼지는 남으면 바로 티가 납니다",
            desc: `${loc}에서 유리창청소 작업이 필요하다면, 빗물 자국과 물때, 접근 가능한 구역을 먼저 확인해야 합니다.`,
            cards: [
                { title: "빗물 자국", desc: "유리에 남은 흐림 자국 확인", icon: "rain" },
                { title: "물때", desc: "반복적으로 쌓인 얼룩 확인", icon: "water-drop" },
                { title: "스티커 자국", desc: "접착 흔적과 잔여물 확인", icon: "scraper" },
                { title: "고층 접근", desc: "유리 위치와 작업 방식 검토", icon: "building-window" }
            ]
        },
        "화재청소": {
            title: "그을음과 냄새는 초기에 범위를 확인해야 합니다",
            desc: `${loc}에서 화재청소 작업이 필요하다면, 그을음과 냄새, 잔여 분진 범위를 먼저 확인해야 합니다.`,
            cards: [
                { title: "그을음", desc: "벽면과 가구 표면 오염 확인", icon: "smoke" },
                { title: "탄 냄새", desc: "실내 잔여 냄새 범위 확인", icon: "odor" },
                { title: "잔여 분진", desc: "공기 중 미세 오염 확인", icon: "dust" },
                { title: "복구 전 정리", desc: "재사용 가능 구역 구분", icon: "checklist" }
            ]
        },
        "바닥왁스코팅": {
            title: "바닥은 세척과 코팅 범위를 구분해야 합니다",
            desc: `${loc}에서 바닥왁스코팅 작업이 필요하다면, 기존 오염과 왁스층 상태를 먼저 확인해야 합니다.`,
            cards: [
                { title: "기존 왁스층", desc: "박리 필요 여부 확인", icon: "layers" },
                { title: "묵은 때", desc: "바닥 표면 오염 확인", icon: "stain" },
                { title: "광택 저하", desc: "코팅 상태와 마모 확인", icon: "sparkle" },
                { title: "보행 동선", desc: "사용 빈도와 작업 범위 확인", icon: "footsteps" }
            ]
        },
        "바닥청소": {
            title: "바닥 오염은 재질과 묵은 때 상태를 봐야 합니다",
            desc: `${loc}에서 바닥청소 작업이 필요하다면, 바닥 재질과 얼룩, 묵은 때 상태를 먼저 확인해야 합니다.`,
            cards: [
                { title: "얼룩", desc: "표면 오염 범위 확인", icon: "stain" },
                { title: "페인트 자국", desc: "공사 후 잔여 오염 확인", icon: "paint" },
                { title: "묵은 때", desc: "반복 사용으로 쌓인 오염 확인", icon: "brush" },
                { title: "재질별 세척", desc: "바닥 소재에 맞는 방식 검토", icon: "tile" }
            ]
        },
        "어닝청소": {
            title: "어닝 오염은 소재 상태를 먼저 확인해야 합니다",
            desc: `${loc}에서 어닝청소 작업이 필요하다면, 곰팡이와 빗물 자국, 소재 손상 여부를 함께 확인해야 합니다.`,
            cards: [
                { title: "곰팡이", desc: "습기로 생긴 오염 확인", icon: "mold" },
                { title: "먼지", desc: "외부 노출 오염 확인", icon: "dust" },
                { title: "빗물 자국", desc: "표면 얼룩과 흐림 확인", icon: "rain" },
                { title: "매장 외관", desc: "입구 이미지 개선", icon: "storefront" }
            ]
        },
        "간판청소": {
            title: "간판은 밝기와 외관 이미지가 중요합니다",
            desc: `${loc}에서 간판청소 작업이 필요하다면, 먼지와 빗물 자국, 조도 저하 상태를 먼저 확인해야 합니다.`,
            cards: [
                { title: "먼지", desc: "표면에 쌓인 오염 확인", icon: "dust" },
                { title: "조도 저하", desc: "간판 밝기 저하 확인", icon: "light" },
                { title: "빗물 자국", desc: "외부 노출 얼룩 확인", icon: "rain" },
                { title: "외관 인상", desc: "매장 첫인상 개선", icon: "signboard" }
            ]
        },
        "인테리어청소": {
            title: "공사 후 먼지, 눈에 보이는 곳만 닦으면 끝나지 않습니다",
            desc: `${loc}에서 인테리어청소 작업이 필요하다면, 공사 후 남은 분진과 틈새 오염 범위를 먼저 확인해야 합니다.`,
            cards: [
                { title: "톱밥 분진", desc: "서랍·수납장 내부에 남기 쉬운 미세 먼지", icon: "dust" },
                { title: "본드 자국", desc: "바닥·문틀 주변에 남는 마감 잔여물", icon: "glue" },
                { title: "창틀 먼지", desc: "틈새에 쌓인 공사 분진", icon: "window" },
                { title: "바닥 마감 오염", desc: "페인트·풋자국·보양재 흔적", icon: "floor" }
            ]
        },
        "준공청소": {
            title: "입주 전 분진과 마감 오염을 먼저 확인해야 합니다",
            desc: `${loc}에서 준공청소 작업이 필요하다면, 신축·공사 현장의 시멘트 가루와 창틀 먼지, 마감 오염을 먼저 확인해야 합니다.`,
            cards: [
                { title: "시멘트 가루", desc: "공사 후 남은 분진 확인", icon: "dust" },
                { title: "창틀 먼지", desc: "틈새에 쌓인 오염 확인", icon: "window" },
                { title: "보양지 흔적", desc: "접착 흔적과 잔여물 확인", icon: "tape" },
                { title: "마감 오염", desc: "입주 전 확인 구역 점검", icon: "checklist" }
            ]
        },
        "후드청소": {
            title: "후드 기름때는 겉보다 내부 오염이 문제입니다",
            desc: `${loc}에서 후드청소 작업이 필요하다면, 후드 내부 기름때와 악취, 주변 오염 상태를 먼저 확인해야 합니다.`,
            cards: [
                { title: "기름때", desc: "후드 표면과 내부 오염 확인", icon: "oil-drop" },
                { title: "악취", desc: "주방 내 냄새 원인 확인", icon: "odor" },
                { title: "후드 내부", desc: "필터와 내부 구역 확인", icon: "hood" },
                { title: "위생 관리", desc: "영업장 주방 관리 상태 확인", icon: "shield-check" }
            ]
        },
        "쓰레기집청소": {
            title: "방치된 공간은 폐기물과 악취를 나눠 봐야 합니다",
            desc: `${loc}에서 쓰레기집청소 작업이 필요하다면, 폐기물 양과 악취, 생활오염 범위를 먼저 확인해야 합니다.`,
            cards: [
                { title: "폐기물", desc: "수거와 분리 범위 확인", icon: "trash" },
                { title: "악취", desc: "냄새 발생 구역 확인", icon: "odor" },
                { title: "생활오염", desc: "바닥과 벽면 오염 확인", icon: "stain" },
                { title: "공간 정리", desc: "이동 동선과 정리 범위 확인", icon: "boxes" }
            ]
        },
        "특수청소": {
            title: "일반 청소로 어려운 현장은 오염 종류부터 구분합니다",
            desc: `${loc}에서 특수청소 작업이 필요하다면, 오염 종류와 냄새, 작업 가능 범위를 먼저 확인해야 합니다.`,
            cards: [
                { title: "고오염", desc: "일반 청소로 어려운 구역 확인", icon: "warning" },
                { title: "냄새", desc: "잔여 악취 범위 확인", icon: "odor" },
                { title: "오염물", desc: "제거 대상과 범위 확인", icon: "stain" },
                { title: "전용 장비", desc: "현장에 맞는 장비 검토", icon: "tool" }
            ]
        },
        "종합청소": {
            title: "종합 청소는 현장 상태에 따른 체계적인 공정이 핵심입니다",
            desc: `${loc}에서 종합청소 작업이 필요하다면, 전체 구조와 자재 특성, 세부 오염 구역을 먼저 확인해야 합니다.`,
            cards: [
                { title: "구역 오염", desc: "기본 생활 및 업무 오염 확인", icon: "stain" },
                { title: "자재 파악", desc: "벽면 및 마감재 특성 확인", icon: "layers" },
                { title: "맞춤 약품", desc: "친환경 약품 및 세정액 매핑", icon: "droplets" },
                { title: "책임 마감", desc: "미흡 사항 없는 검수 프로세스", icon: "checklist" }
            ]
        }
    };

    const item = data[taskKey] || data["종합청소"];
    
    let cardsHtml = '';
    item.cards.forEach((card) => {
        const svg = svgIconsMap[card.icon] || svgIconsMap["stain"];
        cardsHtml += `
                    <div class="h-card">
                        <div class="h-card-icon-wrapper">
                            ${svg}
                        </div>
                        <div class="h-card-text-wrapper">
                            <h3>${card.title}</h3>
                            <p>${card.desc}</p>
                        </div>
                    </div>`;
    });

    return {
        title: item.title,
        desc: item.desc,
        cardsHtml: cardsHtml
    };
}
