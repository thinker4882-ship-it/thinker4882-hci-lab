# 낙원 서비스 — v4 (한 장씩 끝까지)

> 스포일러 없음. 대사는 `../script/secret/`의 Ink 대본에만 있어. 게임 코드에는 대사가 없어.

v3 첫 판 후기 → 서사 깊이 파기(`../design/v3-why-chain.md`) → 말투 가이드(`../design/voice-guide.md`) 다음 단계. 장을 하나씩 이야기·대사·게임성·그림까지 끝낸다.

## 0장 · 일상 (11/28~)
**정웅 결정 (11/28)**
- 범위: 그림까지 (엔다코피아풍: 저폴리 3D 방 + 2D 캐릭터 판, 원색 벽, 진한 그림자, 화면 아래 큰 자막, 클릭으로 걷기)
- 문으로 들어가는 이유: 들어온 문이 잠기고 뒷문이 자연스럽게 열려서, "뒤로 나가는 데가 있겠지" 하고 자연스럽게 감.
- 구현: 대사는 Ink 대본(inkjs, MIT)으로 코드와 분리. 새 판은 `v4/`에 장별로.

**정웅 가설 (만들기 전)**: 일상 장면이라 크게 섬뜩하지는 않을 수도. 그래도 제일 섬뜩할 순간은 **문이 잠길 때, 또는 바깥에 이상한 풍경이 보일 때**.

## 0장 실행
- 비공개 아티팩트: https://claude.ai/artifact/KSGtnnYirAayiCikeJYVsB (아티팩트에서는 도트 글꼴 Galmuri가 막혀서 기본 글꼴로 보임)
- 로컬: 미리보기 `circus-v4` (`.claude/launch.json`, 서버 루트 = `builds/digital-circus`) → `localhost:8769/v4/ch0.html`. 대본을 `../script/secret/`에서 읽어서 루트가 이 폴더여야 해. `?scene=laundry`면 빨래방부터(확인용).
- 그림: 주인공·서아 전신은 힉스필드 gpt_image_2_6(서아 D를 참조) → 배경 제거 → 256px로 줄임. 원본 job ID: 서아 1b49da68-a499-4dc4-a4e3-53de41573ece, 주인공 8bc5ae7c-fc9e-4d38-9f16-776e3c8ddaab.

## 판별 지도: 결정 → 맡은 곳 (`ch0.html`에서 검색)
| 결정 | 맡은 곳 |
|---|---|
| 대사는 코드와 분리 (Ink) | `runKnot`(대본 한 장면 돌리기), `handleTags`(# face/sfx/ev 태그 → 연출), 대본은 `../script/secret/v4-ch0.ink` |
| 말투 가이드 → 다른 모델 다듬기 | 대본 쪽 (Claude 초안 → Sonnet이 가이드대로 다듬음) |
| 엔다코피아풍: 저폴리 방 + 2D 판 캐릭터 | `buildBus`, `buildLaundry`, `makePerson`(카메라를 바라보는 판 + 발밑 그림자), 저해상도 `LOW_W/LOW_H` |
| 화면 아래 큰 자막, 서아 얼굴 | `showLine`, `#box`, `#portrait` |
| 클릭으로 걷기, 물건 누르기 | `click` 핸들러, `clickable`(이름표·다가설 자리·대본 장면), `walkTo`, `stepPerson` |
| 앞문 잠김 → 바깥이 이상해짐 (가설 지점) | `EV.outside_1`·`EV.outside_2`, `buildOutside(stage)`, 창밖 카메라 `lookOut` |
| 뒷문이 자연스럽게 열림 → 뒤로 나감 | `EV.backdoor_open`(문이 돌쩌귀로 열리고 빛), `EV.go_through`, `finish` |
| 혼자 도는 건조기, 형광등 깜빡 | `loop`의 `W.dryerSpin`, `EV.flicker` |
| 소리 (합성음) | `SFX`, `hum`, `tone`, `noise` |

## 해 본 결과
(체험 뒤 채움)
