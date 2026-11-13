# 루프 2 — 조언 수용량(WOA) × AI 확신도 표시

**질문**: 잘 보정된 AI의 확신도를 보여주면 조언을 더 적절하게 따르게 될까?

- H1: 틀린 조언에서 표시 조건의 WOA가 미표시 조건보다 낮다.
- H2: 맞는 조언에서 표시 조건의 WOA가 미표시 조건보다 높다.
- 설계: 혼합 설계. 확신도 표시(참가자 간) × 조언 맞음/틀림(참가자 내), 16문항.
- 지표: 1차 WOA, 2차 최종 오차.

## 파일
| 파일 | 내용 |
|---|---|
| `DESIGN.md` | 설계 문답 기록과 최종 설계 |
| `EXPLAIN.md` | 코드 설명서 |
| `woa_task.html`, `questions.js` | 실험 페이지. 두 파일이 같은 폴더에 있어야 돌아간다 |
| `woa_task_v2.html`, `questions_v2.js` | modify 실험 (생활 물가, 틀린 조언 = 초기값에서 정답 반대쪽 20%). 가격 확인 전이라 시작 화면에 경고가 뜬다 |
| `woa_analysis.py` | CSV 분석 스크립트 |
| `microworld.html` | WOA 놀이터 |
| `QUIZ.md` | 이해 확인 퀴즈 |
| `pilot_p1.csv`, `pilot_p2.csv` | 정웅 님 시험 데이터 (설계자가 직접 푼 것이라 결과에 넣지 않는다) |
| `data_1a.csv`, `data_1b.csv` | 본 수집 원본. 두 사람이 모두 1번을 입력했다 (둘 다 미표시 집단, 배정표의 1·3번 몫으로 친다) |
| `data_2a.csv` | 본 수집 원본. 표시 집단 2번 (pilot_p2와 번호만 같고 다른 사람). 문제 M 초기값 385000 |
| `data_2b.csv` | 본 수집 원본. 표시 집단, 역시 2번을 입력한 다른 사람 (배정표의 2·4번 몫으로 친다). 문제 M 초기값 600000 |

문제 M(달의 지름)은 4명 모두 분석에서 뺀다 (11/13). 3명이 이상한 값을 냈고, 지구–달 거리로 잘못 읽게 만드는 문항으로 보았다.

## 실행
- 실험: https://thinker4882-ship-it.github.io/thinker4882-hci-lab/02-woa/woa_task.html
- modify 실험: https://thinker4882-ship-it.github.io/thinker4882-hci-lab/02-woa/woa_task_v2.html
- 놀이터: https://thinker4882-ship-it.github.io/thinker4882-hci-lab/02-woa.html
- 분석: `py woa_analysis.py data_1a.csv data_1b.csv data_2a.csv data_2b.csv`

코드를 고치면 `docs/02-woa/`에도 복사해야 링크에 반영된다.

## 상태
빌드, 시험, 본 수집(2:2), 분석, modify 설계·구현까지 완료. modify 가격 확인, modify 수집·분석, 회고가 남았다. (체크리스트는 Notion 트래커)
