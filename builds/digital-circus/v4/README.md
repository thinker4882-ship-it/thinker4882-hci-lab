# 낙원 서비스 — v4 (한 장씩 끝까지)

> 스포일러 없음. 대사는 `../script/secret/`의 Ink 대본에만 있어. 게임 코드에는 대사가 없어.

v3 첫 판 후기 → 서사 깊이 파기(`../design/v3-why-chain.md`) → 말투 가이드(`../design/voice-guide.md`) 다음 단계. 장을 하나씩 이야기·대사·게임성·그림까지 끝낸다.

## 0장 · 일상 (11/28~)
**정웅 결정 (11/28)**
- 범위: 그림까지 (엔다코피아풍: 저폴리 3D 방 + 2D 캐릭터 판, 원색 벽, 진한 그림자, 화면 아래 큰 자막, 클릭으로 걷기)
- 문으로 들어가는 이유: 들어온 문이 잠기고 뒷문이 자연스럽게 열려서, "뒤로 나가는 데가 있겠지" 하고 자연스럽게 감.
- 구현: 대사는 Ink 대본(inkjs, MIT)으로 코드와 분리. 새 판은 `v4/`에 장별로.

**정웅 가설 (만들기 전)**: 일상 장면이라 크게 섬뜩하지는 않을 수도. 그래도 제일 섬뜩할 순간은 **문이 잠길 때, 또는 바깥에 이상한 풍경이 보일 때**.

## 0장 둘째 판 (11/28, 첫 판 후기 반영)
정웅 결정: 현실 파트 = **PS1~2풍 사실적 3D + 대화는 미연시**. 세계마다 형식이 바뀜(채팅창 2D, 들판은 그때 정함, 서커스·리미널 1인칭 3D). 후기: `../playtest/v4-ch0-user-review.md`.

- 비공개 아티팩트: https://claude.ai/artifact/KSGtnnYirAayiCikeJYVsB
- 로컬: 미리보기 `circus-v4` (서버 루트 = `builds/digital-circus`) → `localhost:8769/v4/ch0.html`. `?scene=laundry`면 빨래방부터(확인용).
- 조작: 끌어서 둘러보기, 눌러서 걷기·살펴보기 (패드 터치 가능), 대사는 누르거나 스페이스.
- 그림(힉스필드 gpt_image_2_6): 버스 배경, 바깥 두 장(평소 / 이상해진 거리), 바닥·세탁기·자판기 질감, 앉은 서아(서아 D 참조, 배경 제거). 미연시 얼굴은 기존 서아 D 표정 3장. 원본은 `../assets/v4src/`(로컬).

## 판별 지도: 결정 → 맡은 곳 (`ch0.html`에서 검색)
| 결정 | 맡은 곳 |
|---|---|
| 대사는 코드와 분리 (Ink) | `runKnot`, `handleTags`(# face/sfx/ev), 대본 `../script/secret/v4-ch0.ink` |
| 버스 = 미연시 (배경 + 서아 상반신 + 선명한 대화창·선택창) | `playBus`, `showLine`, `showStand`, `showChoices`, CSS `#box`·`#choices` |
| 빨래방 = 1인칭 PS1~2풍 3D | `buildLaundry`, `psx`(꼭짓점 떨림), 저해상도 `LOW_W/LOW_H`, 사진 질감 `TEX.*` |
| 걷기·둘러보기 (걷는 그림 문제를 1인칭으로 없앰) | `pointerdown/move/up` 핸들러, `walkTo`, `stepPlayer` |
| 서아는 자리마다 서 있거나 앉아 있음 (자판기 속·안 앉음 버그 해결) | `SEOA_SPOTS`, `placeSeoa`, `EV.sit` |
| 빨래방 대화도 미연시 창 | `runKnot`의 `mode==='laundry'` 부분(화면 어둡게 + 상반신) |
| 바깥 풍경 = 선명한 한 장면 그림 (가설 지점) | `showCG`, `EV.outside_1`(평소 거리) → `EV.outside_2`(이상해진 거리) |
| 뒷문이 열림 → 뒤로 나감 | `EV.backdoor_open`, `EV.go_through`, `finish` |
| 서사 1~3 수정 (세제는 자판기에서 / 건조기는 한 번만 / 꺼낸 뒤 의자 대사) | 대본 쪽 (`washer`, `vending`, `dryer`, `chair` 장면) |

## 해 본 결과
(체험 뒤 채움)
