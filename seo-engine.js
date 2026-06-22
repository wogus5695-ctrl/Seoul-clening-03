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

    const faqData = {
        "외벽청소": [
            { q: "비용은 어떻게 산정되나요?", a: "건물 층고, 작업 면적, 외벽 마감재 종류(유리, 석재, 판넬 등) 및 고소작업 차량(스카이차) 진입 여부에 따라 결정됩니다." },
            { q: "고소작업도 가능한가요?", a: "네, 고소작업차 진입이 어려운 현장도 전문 로프 작업팀이 투입되어 안전하게 세척을 진행합니다." },
            { q: "작업 전 확인할 사항은 무엇인가요?", a: "고압 세척을 위해 외부 수도 및 전력 공급 상태를 확인해야 하며, 작업 구역 하부 보행자 통제 여건을 점검해야 합니다." }
        ],
        "유리창청소": [
            { q: "비용은 어떻게 산정되나요?", a: "유리창 전체 면적, 창호 종류(이중창/단창), 외부 접근성(로프/장비 필요 여부) 및 찌든 물때 상태에 따라 산정됩니다." },
            { q: "고층 유리창 접근성도 해결되나요?", a: "네, 아파트 고층 유리창이나 빌딩 외부 창도 전용 툴과 로프 작업을 통해 안전하게 클리닝이 가능합니다." },
            { q: "작업 전 준비해야 할 것이 있나요?", a: "창틀 주변에 놓인 개인 가구 등 집기들을 미리 이동시켜 주시면 더 신속한 작업이 가능합니다." }
        ],
        "준공청소": [
            { q: "비용은 어떻게 산정되나요?", a: "건축물 연면적, 층수, 잔해 폐기물 반출량 및 진척 상태(전기/수도 정상 작동 여부)에 따라 견적이 결정됩니다." },
            { q: "승인 검사 전까지 완료되나요?", a: "네, 사전에 약정된 기한 내에 신속히 작업을 끝마쳐 준공 승인 검사에 차질이 없도록 조율합니다." },
            { q: "작업 전 확인할 사항은 무엇인가요?", a: "가설 전기 및 수도 공급이 정상적으로 이루어지는지 사전에 현장 점검이 필요합니다." }
        ],
        "후드청소": [
            { q: "비용은 어떻게 산정되나요?", a: "식당 주방 후드의 가로 길이, 개수, 배기 닥트 구조 및 기름때 누적 오염도에 따라 산정됩니다." },
            { q: "후드 내부 기름때도 제거되나요?", a: "네, 후드 내부 갓 표면과 필터망은 물론, 손이 닿는 닥트 입구 안쪽까지 약품과 고온 스팀으로 오염을 녹여냅니다." },
            { q: "작업 전 준비해야 할 것이 있나요?", a: "주방 가전이나 조리도구 등에 세제가 튀지 않도록 사전 보양을 완료한 후 진행하므로 별도 준비는 필요치 않습니다." }
        ],
        "화재청소": [
            { q: "비용은 어떻게 산정되나요?", a: "화재 피해 규모(전소/반소/부분), 그을음 분진이 퍼진 실내 면적, 폐기 처리량에 따라 견적이 산출됩니다." },
            { q: "그을음 냄새도 제거되나요?", a: "네, 그을음 제거 후 보이지 않는 벽체 틈새의 탄 냄새는 전용 탈취제 도포 및 오존 살균기를 수일간 가동하여 저감합니다." },
            { q: "작업 전 확인할 사항은 무엇인가요?", a: "소방서의 현장 보존 및 조사 절차가 완전히 끝나고 폐기물 반출이 가능한 상태여야 합니다." }
        ],
        "쓰레기집청소": [
            { q: "비용은 어떻게 산정되나요?", a: "쌓여 있는 방치 폐기물의 톤수, 음식물 쓰레기 유무, 소독 방역 수준에 따라 합리적으로 산정됩니다." },
            { q: "이웃 모르게 조용한 작업이 가능한가요?", a: "네, 고객님의 사생활 보호를 위해 불투명 마대에 쓰레기를 담아 소음 없이 신속하게 외부로 반출합니다." },
            { q: "작업 전 따로 정리해야 하나요?", a: "아닙니다. 그냥 두시면 귀중품이나 중요 서류, 현금 등을 분류 과정에서 꼼꼼히 찾아 따로 보관해 드립니다." }
        ],
        "바닥청소": [
            { q: "비용은 어떻게 산정되나요?", a: "바닥 면적(평수), 마감재 종류(데코타일, 타일, 에폭시 등) 및 오염 원인(기름때, 타이어 자국 등)에 따라 결정됩니다." },
            { q: "찌든 유분기나 기름때도 지워지나요?", a: "네, 공장이나 주방 바닥의 미끄러운 유분기도 전용 유분 용해제와 돌돌이 기계 세척으로 깨끗하게 세정합니다." },
            { q: "작업 전 준비할 것이 있나요?", a: "바닥 세척을 위해 바닥에 놓인 가구 및 집기들을 미리 올려두시거나 치워주시면 세밀한 구석 청소에 도움됩니다." }
        ],
        "바닥왁스코팅": [
            { q: "비용은 어떻게 산정되나요?", a: "바닥 평수, 기존 왁스층 박리 작업 필요 여부 및 왁스 코팅 횟수에 따라 다르게 결정됩니다." },
            { q: "코팅 완료 후 즉시 통행이 가능한가요?", a: "코팅액 도포 후 약 1~2시간의 표면 건조 작업이 끝나면 가벼운 통행이 가능하나, 무거운 집기 배치는 하루 뒤를 권장합니다." },
            { q: "작업 전 확인할 사항이 있나요?", a: "기존 왁스 표면에 고착된 스크래치 상태와 오염을 깨끗하게 박리하기 위해 수도 및 전기 공급 여부를 확인합니다." }
        ],
        "어닝청소": [
            { q: "비용은 어떻게 산정되나요?", a: "어닝 가로 너비와 돌출 폭, 고정식/접이식 종류, 설치 층수 및 오염도에 따라 산정됩니다." },
            { q: "오래 방치되어 딱딱해진 어닝도 펴지나요?", a: "네, 고온 스팀 분사로 뻣뻣해진 원단을 충분히 이완시킨 다음 곰팡이와 찌든 때를 안전하게 세척합니다." },
            { q: "작업 전 준비할 사항이 있나요?", a: "상가 앞 보행자 통제를 위한 임시 안전선을 확보하며, 어닝 하부에 설치된 야외 집기들을 미리 이동시켜 주셔야 합니다." }
        ],
        "간판청소": [
            { q: "비용은 어떻게 산정되나요?", a: "간판의 가로 크기, 간판 재질(플렉스/채널), 설치 높이 및 스카이차 등 장비 투입 유무에 따라 책정됩니다." },
            { q: "LED 조명 내부의 거미줄도 청소되나요?", a: "네, 외부 외벽면뿐 아니라 분리가 가능한 입체 글자(채널) 내부의 먼지와 벌레 사체까지 정교하게 닦아냅니다." },
            { q: "작업 전 확인할 사항은 무엇인가요?", a: "작업 중 누전을 예방하기 위해 간판 조명 전용 차단기 위치를 사전에 파악하여 차단 협조가 필요합니다." }
        ],
        "인테리어 후 청소": [
            { q: "비용은 어떻게 산정되나요?", a: "공간 실평수, 공사 보양재 철거 유무, 분진 발생 시공(목공/타일) 범위에 따라 산정됩니다." },
            { q: "초미세 시멘트 가루와 분진도 제거되나요?", a: "네, 벽면, 천장, 전등갓, 수납장 서랍 내부 레일까지 흡입하여 인테리어 화학 냄새와 먼지를 지워냅니다." },
            { q: "작업 전 준비할 사항이 있나요?", a: "인테리어 하자 보수가 진행 중인지 점검하시어, 청소 완료 후 재오염이 일어나지 않도록 일정을 잡는 것을 권장합니다." }
        ],
        "특수청소": [
            { q: "비용은 어떻게 산정되나요?", a: "오염 원인(하수 역류, 반려동물 방치 오물 등), 피해 면적, 폐기물 양과 살균제 투입 강도에 따라 합리적으로 견적을 산출합니다." },
            { q: "소독 후 악취가 완전히 잡히나요?", a: "네, 악취를 단순 향료로 덮는 것이 아니라 냄새 분자를 파괴하는 살균 약품과 오존 방역기를 가동하여 악취를 분해합니다." },
            { q: "작업 전 준비해야 할 것이 있나요?", a: "오염 구역에 대한 2차 감염 방지를 위해 전문가가 방호구를 착용하고 현장 확인 후 즉각 진입하므로 별도 준비는 필요 없습니다." }
        ],
        "종합청소": [
            { q: "비용은 어떻게 산정되나요?", a: "작업이 필요한 전체 면적, 세부 청소 항목(바닥, 유리창 등), 투입 인력 및 전용 장비 필요 여부에 따라 맞춤형으로 견적이 산출됩니다." },
            { q: "주말 작업도 가능한가요?", a: "네, 평일 영업시간에 지장이 없도록 사전에 일정을 조율해 주시면 주말 및 야간 작업도 얼마든지 가능합니다." },
            { q: "전 준비해야 할 것이 있나요?", a: "특별히 준비하실 것은 없으나, 귀중품이나 파손 우려가 있는 특수 물품은 미리 안전한 곳에 보관해 주시기 바랍니다." }
        ]
    };

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
    const taskFaq = faqData[displayTask] || faqData["종합청소"];
    const faqQ1 = document.getElementById('faq-q1');
    const faqQ2 = document.getElementById('faq-q2');
    const faqQ3 = document.getElementById('faq-q3');

    if (faqQ1 && faqQ2 && faqQ3 && taskFaq) {
        const marker = getTopicMarker(displayTask);
        faqQ1.innerText = `Q. ${displayLoc} ${displayTask} ${taskFaq[0].q}`;
        faqQ1.nextElementSibling.innerText = taskFaq[0].a;

        faqQ2.innerText = `Q. ${displayLoc} ${displayTask}${marker} ${taskFaq[1].q}`;
        faqQ2.nextElementSibling.innerText = taskFaq[1].a;

        faqQ3.innerText = `Q. ${displayLoc} ${displayTask} ${taskFaq[2].q}`;
        faqQ3.nextElementSibling.innerText = taskFaq[2].a;
    }

    // Section 8: Related Links
    let currentCity = null;
    let currentDistrict = null;
    let currentDong = null;

    if (typeof GYEONGGI_REGIONS !== 'undefined') {
        for (const region of GYEONGGI_REGIONS) {
            if (region.cityVariants.includes(displayLoc)) {
                currentCity = region;
                break;
            }
            const dist = region.districts.find(d => d.variants.includes(displayLoc));
            if (dist) {
                currentCity = region;
                currentDistrict = dist;
                break;
            }
            const distWithDong = region.districts.find(d => d.dongs && d.dongs.includes(displayLoc));
            if (distWithDong) {
                currentCity = region;
                currentDistrict = distWithDong;
                currentDong = displayLoc;
                break;
            }
            if (region.dongs && region.dongs.includes(displayLoc)) {
                currentCity = region;
                currentDong = displayLoc;
                break;
            }
        }
    }

    const nearbyLinks = document.getElementById('nearby-regions-links');
    if (nearbyLinks && currentCity) {
        let linksList = [];
        
        if (currentDong) {
            const siblingDongs = currentDistrict 
                ? currentDistrict.dongs.filter(d => d !== currentDong)
                : currentCity.dongs.filter(d => d !== currentDong);
            
            siblingDongs.slice(0, 6).forEach(dong => {
                const url = getKeywordUrl(dong, displayTask);
                linksList.push({ label: `${dong} ${displayTask}`, url });
            });
        } else if (currentDistrict) {
            const siblingDistricts = currentCity.districts.filter(d => d.name !== currentDistrict.name);
            siblingDistricts.forEach(dist => {
                const url = getKeywordUrl(dist.variants[0], displayTask);
                linksList.push({ label: `${dist.variants[0]} ${displayTask}`, url });
            });
            
            if (currentDistrict.dongs) {
                currentDistrict.dongs.slice(0, 4).forEach(dong => {
                    const url = getKeywordUrl(dong, displayTask);
                    linksList.push({ label: `${dong} ${displayTask}`, url });
                });
            }
        } else {
            const siblingCities = GYEONGGI_REGIONS.filter(r => r.citySlug !== currentCity.citySlug);
            siblingCities.forEach(city => {
                const url = getKeywordUrl(city.cityVariants[0], displayTask);
                linksList.push({ label: `${city.cityVariants[0]} ${displayTask}`, url });
            });

            if (currentCity.districts && currentCity.districts.length > 0) {
                currentCity.districts.slice(0, 4).forEach(dist => {
                    const url = getKeywordUrl(dist.variants[0], displayTask);
                    linksList.push({ label: `${dist.variants[0]} ${displayTask}`, url });
                });
            } else if (currentCity.dongs) {
                currentCity.dongs.slice(0, 4).forEach(dong => {
                    const url = getKeywordUrl(dong, displayTask);
                    linksList.push({ label: `${dong} ${displayTask}`, url });
                });
            }
        }

        const nearbyTitle = document.getElementById('nearby-links-title');
        if (nearbyTitle) nearbyTitle.innerText = `📍 주변 지역 ${displayTask} 추천`;
        
        let linksHtml = linksList.map(l => `<a href="${l.url}">${l.label}</a>`).join('');
        nearbyLinks.innerHTML = linksHtml;
    } else if (nearbyLinks) {
        let linksHtml = '';
        if (typeof GYEONGGI_REGIONS !== 'undefined') {
            GYEONGGI_REGIONS.forEach(city => {
                const url = getKeywordUrl(city.cityVariants[0], displayTask);
                linksHtml += `<a href="${url}">${city.cityVariants[0]} ${displayTask}</a>`;
            });
        }
        nearbyLinks.innerHTML = linksHtml;
    }

    const relatedTasksLinks = document.getElementById('related-tasks-links');
    if (relatedTasksLinks && typeof SERVICES_DATA !== 'undefined') {
        const currentServiceSlug = taskData.serviceSlug;
        const otherServices = SERVICES_DATA.filter(s => s.serviceSlug !== 'general-cleaning' && s.serviceSlug !== currentServiceSlug).slice(0, 5);
        
        const relatedTitle = document.getElementById('related-tasks-title');
        if (relatedTitle) relatedTitle.innerText = `🛠️ ${displayLoc} 추천 연관 작업`;

        let linksHtml = '';
        otherServices.forEach(s => {
            const url = getKeywordUrl(displayLoc, s.serviceNameKo);
            linksHtml += `<a href="${url}">${displayLoc} ${s.serviceNameKo}</a>`;
        });
        relatedTasksLinks.innerHTML = linksHtml;
    }

    // Section 9: 최종 CTA
    const finalCtaHeading = document.getElementById('final-cta-heading');
    if (finalCtaHeading) {
        finalCtaHeading.innerText = `${displayLoc} ${displayTask} 견적 상담`;
    }

    // 중간 CTA
    const midCtaText = document.getElementById('mid-cta-text');
    if (midCtaText) {
        midCtaText.innerHTML = `${displayLoc} ${displayTask} 견적 상담<br>오염도와 면적에 따라 투명하게 산정되는 맞춤 견적`;
    }

    // CTA Texts
    const moCta = document.getElementById('cta-dynamic-text');
    if (moCta) moCta.innerText = `${displayLoc} ${displayTask}`;

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
