// 실험 전에 정해지는 값 전부 — (ㄱ) 분류. 코드를 안 고치고 문제만 바꾸려면 이 파일만 보면 된다.

// 참가자 번호별 집단: 2:2씩 맞춘 뒤 무선 할당해 둔 표 (true = 확신도 표시). 10번까지 준비.
const 집단표 = {
  1: false, 2: true, 3: false, 4: true, 5: true,
  6: false, 7: true, 8: false, 9: true, 10: false,
};

// 틀린 조언이 들어갈 자리 (몇 번째 문제인가). 앞에 몰리지 않게 고정.
const 틀린_자리 = [4, 7, 11, 14];

// 문제 16개: 맞는 조언 12개(정답 3% 이내), 틀린 조언 4개(정답과 20% 이상 차이).
// preset = 미리 정한 조언값, conf = 확신도(맞음 70~90, 틀림 55~75), step = 조언값의 단위.
const 문제들 = [
  { id: "A", text: "에펠탑의 전체 높이는 몇 m일까요?", unit: "m", answer: 330, preset: 338, correct: true, conf: 88, step: 1 },
  { id: "B", text: "롯데월드타워의 높이는 몇 m일까요?", unit: "m", answer: 555, preset: 545, correct: true, conf: 72, step: 1 },
  { id: "C", text: "한라산의 높이는 몇 m일까요?", unit: "m", answer: 1947, preset: 1500, correct: false, conf: 72, step: 5 },
  { id: "D", text: "후지산의 높이는 몇 m일까요?", unit: "m", answer: 3776, preset: 3700, correct: true, conf: 84, step: 5 },
  { id: "E", text: "백두산의 높이는 몇 m일까요?", unit: "m", answer: 2744, preset: 2800, correct: true, conf: 76, step: 5 },
  { id: "F", text: "부르즈 할리파의 높이는 몇 m일까요?", unit: "m", answer: 828, preset: 1030, correct: false, conf: 55, step: 1 },
  { id: "G", text: "도쿄 스카이트리의 높이는 몇 m일까요?", unit: "m", answer: 634, preset: 650, correct: true, conf: 90, step: 1 },
  { id: "H", text: "성인의 뼈는 모두 몇 개일까요?", unit: "개", answer: 206, preset: 200, correct: true, conf: 70, step: 1 },
  { id: "I", text: "런던 아이(대관람차)의 높이는 몇 m일까요?", unit: "m", answer: 135, preset: 138, correct: true, conf: 82, step: 1 },
  { id: "J", text: "쿠푸왕 대피라미드의 원래 높이는 몇 m일까요?", unit: "m", answer: 147, preset: 150, correct: true, conf: 78, step: 1 },
  { id: "K", text: "타이타닉호의 길이는 몇 m일까요?", unit: "m", answer: 269, preset: 335, correct: false, conf: 75, step: 1 },
  { id: "L", text: "금문교의 두 주탑 사이 거리는 몇 m일까요?", unit: "m", answer: 1280, preset: 1250, correct: true, conf: 86, step: 5 },
  { id: "M", text: "달의 지름은 몇 km일까요?", unit: "km", answer: 3474, preset: 2700, correct: false, conf: 58, step: 5 },
  { id: "N", text: "유엔 회원국은 몇 개국일까요?", unit: "개국", answer: 193, preset: 190, correct: true, conf: 74, step: 1 },
  { id: "O", text: "주기율표의 원소는 모두 몇 개일까요?", unit: "개", answer: 118, preset: 120, correct: true, conf: 80, step: 1 },
  { id: "P", text: "경부고속도로의 길이는 몇 km일까요?", unit: "km", answer: 416, preset: 405, correct: true, conf: 80, step: 1 },
];

// 조작 점검 보기 (쉼표를 넣지 않는다 — CSV 칸이 깨진다)
const 점검1_보기 = ["조언 숫자만", "조언과 % 수치", "조언과 그렇게 답한 이유", "기억나지 않는다"];
const 점검2_보기 = ["이 조언이 맞을 가능성이 70%", "답이 정답의 70% 크기", "사람들의 70%가 같은 답", "잘 모르겠다"];
