// modify(v2) 문제 파일. 실험 전에 정해지는 값 전부 — (ㄱ) 분류.
// v1(questions.js)과 다른 점: 생활 물가 문제, 틀린 조언은 미리 정하지 않음(preset 없음), 맞는 조언 = 정답.

// 참가자 번호별 집단: v1과 같은 표 (true = 확신도 표시).
const 집단표 = {
  1: false, 2: true, 3: false, 4: true, 5: true,
  6: false, 7: true, 8: false, 9: true, 10: false,
};

// 틀린 조언이 들어갈 자리 (몇 번째 문제인가). v1과 같다.
const 틀린_자리 = [4, 7, 11, 14];

// 틀린 조언을 초기값에서 얼마나 떨어뜨릴지 (M-5 결정: 20%).
const 틀린_거리 = 0.2;

// 가격 기준 시점. 시작 화면에 보여 준다.
const 기준_시점 = "2026년 11월";

// 문제 16개. 가격대별로 틀린 조언 1개씩 (M-15, 무작위 배정).
// answer = 정답(원), conf = 확신도, step = 조언값을 반올림할 단위(원).
// checked = 정웅 님이 공식 출처에서 가격을 확인했는가. false인 answer는 Claude 추정 임시값이다.
const 문제들 = [
  // 천 원대
  { id: "S01", text: "편의점 빙그레 바나나맛우유(240ml) 1개", answer: 1700, correct: true, conf: 84, step: 10, checked: false },
  { id: "S02", text: "편의점 코카콜라(500ml 페트) 1병", answer: 2300, correct: false, conf: 75, step: 10, checked: false },
  { id: "S03", text: "편의점 참이슬 후레쉬(360ml) 1병", answer: 1950, correct: true, conf: 78, step: 10, checked: false },
  { id: "S04", text: "서울 중형택시 기본요금(낮)", answer: 4800, correct: true, conf: 86, step: 10, checked: false },
  { id: "S05", text: "메가MGC커피 아메리카노(HOT) 1잔", answer: 1700, correct: true, conf: 80, step: 10, checked: false },
  { id: "S06", text: "맥도날드 빅맥 단품 1개", answer: 5700, correct: true, conf: 76, step: 10, checked: false },
  // 만 원대
  { id: "S07", text: "넷플릭스 스탠다드 요금제 한 달", answer: 13500, correct: false, conf: 58, step: 100, checked: false },
  { id: "S08", text: "유튜브 프리미엄(개인) 한 달", answer: 14900, correct: true, conf: 80, step: 100, checked: false },
  { id: "S09", text: "교촌치킨 허니콤보 1마리", answer: 23000, correct: true, conf: 90, step: 100, checked: false },
  // 십만 원대
  { id: "S10", text: "애플 에어팟 프로(최신 모델)", answer: 369000, correct: true, conf: 74, step: 1000, checked: false },
  { id: "S11", text: "닌텐도 스위치(최신 모델)", answer: 648000, correct: false, conf: 55, step: 1000, checked: false },
  { id: "S12", text: "다이슨 에어랩(기본 모델)", answer: 699000, correct: true, conf: 72, step: 1000, checked: false },
  { id: "S13", text: "플레이스테이션 5(디지털 에디션)", answer: 628000, correct: true, conf: 82, step: 1000, checked: false },
  // 백만 원대 전후
  { id: "S14", text: "애플 아이패드(기본 모델, 최저 용량)", answer: 529000, correct: true, conf: 70, step: 1000, checked: false },
  { id: "S15", text: "애플 아이폰(최신 기본 모델, 최저 용량)", answer: 1290000, correct: false, conf: 72, step: 1000, checked: false },
  { id: "S16", text: "애플 맥북 에어 13(기본 사양)", answer: 1590000, correct: true, conf: 88, step: 1000, checked: false },
];

// 조작 점검 보기 (v1과 같다. 쉼표를 넣지 않는다 — CSV 칸이 깨진다)
const 점검1_보기 = ["조언 숫자만", "조언과 % 수치", "조언과 그렇게 답한 이유", "기억나지 않는다"];
const 점검2_보기 = ["이 조언이 맞을 가능성이 70%", "답이 정답의 70% 크기", "사람들의 70%가 같은 답", "잘 모르겠다"];
