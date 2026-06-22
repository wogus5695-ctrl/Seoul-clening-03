const fs = require('fs');
const path = require('path');
const { SERVICES_DATA } = require('../js/data/services.js');

module.exports = (req, res) => {
    // 1. URLSearchParams 또는 req.query.k 로 k 값을 가져옵니다.
    // Vercel Serverless Function 에서는 req.query.k 로 query parameter에 직접 접근할 수 있습니다.
    const keywordRaw = req.query.k || '';
    
    // index.html 파일을 동적으로 읽습니다.
    const htmlPath = path.join(__dirname, '../index.html');
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
        
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        return res.status(200).send(html);
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
            { q: "작업 전 준비해야 할 것이 있나요?", a: "오염 구역에 대한 2차 감염 방지를 위해 전문가가 방호구를 착용하고 현장 확인 후 즉각 진입하므로 별도 준비는 없습니다." }
        ],
        "종합청소": [
            { q: "비용은 어떻게 산정되나요?", a: "작업이 필요한 전체 면적, 세부 청소 항목(바닥, 유리창 등), 투입 인력 및 전용 장비 필요 여부에 따라 맞춤형으로 견적이 산출됩니다." },
            { q: "주말 작업도 가능한가요?", a: "네, 평일 영업시간에 지장이 없도록 사전에 일정을 조율해 주시면 주말 및 야간 작업도 얼마든지 가능합니다." },
            { q: "전 준비해야 할 것이 있나요?", a: "특별히 준비하실 것은 없으나, 귀중품이나 파손 우려가 있는 특수 물품은 미리 안전한 곳에 보관해 주시기 바랍니다." }
        ]
    };

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
    const imagePath = displayTask === '종합청소' ? `${protocol}://${host}/hero_bg.png` : `${protocol}://${host}/images/${taskData.imageKey}`;
    html = html.replace(/<meta property="og:image"[^>]*>/i, `<meta property="og:image" content="${imagePath}">`);

    // 6. canonical 및 og:url 삽입 (head 닫는 태그 직전)
    const headInsert = `    <link rel="canonical" href="${canonicalUrl}">\n    <meta property="og:url" content="${canonicalUrl}">\n</head>`;
    html = html.replace(/<\/head>/i, headInsert);

    // 7. H1 (hero-heading) 치환
    html = html.replace(/<h1 id="hero-heading"[^>]*>([\s\S]*?)<\/h1>/i, `<h1 id="hero-heading" data-seo="target">${h1Str}</h1>`);

    // 8. hero-subtitle 치환
    html = html.replace(/<p class="hero-subtitle">([\s\S]*?)<\/p>/i, `<p class="hero-subtitle">${heroDesc}</p>`);

    // 9. hero-bg-img 치환
    const heroImgSrc = displayTask === '종합청소' ? './hero_bg.png' : `./images/${taskData.imageKey}`;
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

    // 16. task-specific-factors-list 치환
    if (taskData.estimateFactors) {
        const factorsHtml = taskData.estimateFactors.map(item => `<li>${item}</li>`).join('\n                        ');
        html = html.replace(/<ul id="task-specific-factors-list">([\s\S]*?)<\/ul>/i, `<ul id="task-specific-factors-list">\n                        ${factorsHtml}\n                    </ul>`);
    }

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
    const marker = getTopicMarker(displayTask);
    const faqDataForTask = faqData[displayTask] || faqData["종합청소"];

    html = html.replace(/<summary id="faq-q1">[\s\S]*?<\/summary>(\s*)<div class="faq-answer">[\s\S]*?<\/div>/i, 
        `<summary id="faq-q1">Q. ${displayLoc} ${displayTask} ${faqDataForTask[0].q}</summary>$1<div class="faq-answer">\n                            ${faqDataForTask[0].a}\n                        </div>`);

    html = html.replace(/<summary id="faq-q2">[\s\S]*?<\/summary>(\s*)<div class="faq-answer">[\s\S]*?<\/div>/i, 
        `<summary id="faq-q2">Q. ${displayLoc} ${displayTask}${marker} ${faqDataForTask[1].q}</summary>$1<div class="faq-answer">\n                            ${faqDataForTask[1].a}\n                        </div>`);

    html = html.replace(/<summary id="faq-q3">[\s\S]*?<\/summary>(\s*)<div class="faq-answer">[\s\S]*?<\/div>/i, 
        `<summary id="faq-q3">Q. ${displayLoc} ${displayTask} ${faqDataForTask[2].q}</summary>$1<div class="faq-answer">\n                            ${faqDataForTask[2].a}\n                        </div>`);

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

    const candidateLocs = ["성남", "과천", "수원"];
    const selectedLocs = candidateLocs.filter(l => l !== displayLoc && `${l}시` !== displayLoc);
    selectedLocs.forEach(locVal => {
        linksList.push({
            label: `${locVal} ${displayTask}`,
            url: `/?k=${encodeURIComponent(locVal + '-' + displayTask.replace(/\s+/g, ''))}`
        });
    });

    let linksHtml = linksList.map(l => `<a href="${l.url}" class="footer-chip">${l.label}</a>`).join('\n                            ');
    linksHtml += `\n                            <a href="./seo-hub.html" class="footer-chip view-all-link">전체 서비스 지역 및 작업 보기</a>`;

    html = html.replace(/<div id="footer-related-links" class="footer-chips">([\s\S]*?)<\/div>/i, 
        `<div id="footer-related-links" class="footer-chips">\n                            ${linksHtml}\n                        </div>`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
};