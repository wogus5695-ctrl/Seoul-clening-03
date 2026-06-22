// js/data/regions-gyeonggi.js
// 클린폼 경기 지역 데이터 매트릭스 (1차: 성남, 과천, 수원)
// 모든 숫자 동(예: 정자1동, 정자2동)은 대표 동명(예: 정자동)으로 통합 관리합니다.

const GYEONGGI_REGIONS = [
    {
        province: "경기",
        city: "성남",
        citySlug: "seongnam",
        cityVariants: ["성남시", "성남"],
        districts: [
            { 
                name: "수정구", 
                slug: "sujeong",
                variants: ["수정구", "수정"],
                dongs: ["신흥동", "태평동", "수진동", "단대동", "산성동", "양지동", "복정동", "창곡동", "위례동", "신촌동", "오야동", "심곡동", "고등동", "상적동", "둔전동", "시흥동", "금토동", "사송동"]
            },
            { 
                name: "중원구", 
                slug: "jungwon",
                variants: ["중원구", "중원"],
                dongs: ["성남동", "금광동", "은행동", "상대원동", "여수동", "도촌동", "갈현동", "하대원동"]
            },
            { 
                name: "분당구", 
                slug: "bundang",
                variants: ["분당구", "분당"],
                dongs: ["분당동", "수내동", "정자동", "율동", "서현동", "이매동", "야탑동", "판교동", "삼평동", "백현동", "금곡동", "궁내동", "동원동", "구미동", "운중동", "대장동", "석운동", "하산운동"]
            }
        ],
        // 시 직속 동 (과천처럼 구가 없는 경우 사용, 성남은 비워둠)
        dongs: []
    },
    {
        province: "경기",
        city: "과천",
        citySlug: "gwacheon",
        cityVariants: ["과천시", "과천"],
        districts: [], // 과천시는 구 단위가 없음
        dongs: [
            "관문동", "문원동", "갈현동", "막계동", "과천동", "주암동", "중앙동", "원문동", "별양동", "부림동"
        ]
    },
    {
        province: "경기",
        city: "수원",
        citySlug: "suwon",
        cityVariants: ["수원시", "수원"],
        districts: [
            { 
                name: "장안구", 
                slug: "jangan",
                variants: ["장안구", "장안"],
                dongs: ["파장동", "정자동", "이목동", "율전동", "천천동", "영화동", "송죽동", "조원동", "연무동", "상광교동", "하광교동"]
            },
            { 
                name: "권선구", 
                slug: "gwonseon",
                variants: ["권선구", "권선"],
                dongs: ["세류동", "평동", "고색동", "오목천동", "평리동", "서둔동", "구운동", "탑동", "금곡동", "호매실동", "곡반정동", "권선동", "장지동", "대황교동", "입북동", "당수동"]
            },
            { 
                name: "팔달구", 
                slug: "paldal",
                variants: ["팔달구", "팔달"],
                dongs: ["팔달로1가", "팔달로2가", "팔달로3가", "남창동", "영동", "중동", "구천동", "남수동", "매향동", "북수동", "신풍동", "장안동", "교동", "매교동", "매산로1가", "매산로2가", "매산로3가", "고등동", "화서동", "지동", "우만동", "인계동"]
            },
            { 
                name: "영통구", 
                slug: "yeongtong",
                variants: ["영통구", "영통"],
                dongs: ["매탄동", "원천동", "이의동", "하동", "영통동", "신동", "망포동"]
            }
        ],
        dongs: []
    }
];

// export for frontend vanilla js environments if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GYEONGGI_REGIONS };
}
