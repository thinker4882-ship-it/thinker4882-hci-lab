# CSV를 읽어 WOA와 오차를 조건별로 요약한다.
# 실행: py woa_analysis.py 파일1.csv 파일2.csv ...
# 외부 라이브러리 없이 표준 라이브러리만 쓴다 (평균 계산 정도라 pandas가 필요 없다).
import csv
import sys
from statistics import mean


def 읽기(경로들):
    """여러 CSV를 읽어 한 목록으로 합친다."""
    줄들 = []
    for 경로 in 경로들:
        with open(경로, encoding="utf-8-sig") as f:  # utf-8-sig: 다운로드 CSV 앞의 표시 문자를 없앤다
            줄들 += list(csv.DictReader(f))
    return 줄들


def 잘린_woa(줄):
    """WOA를 계산해 0~1로 자른다 (Schultze 등 2015와 같은 처리)."""
    초기, 최종, 조언 = float(줄["초기응답값"]), float(줄["최종응답값"]), float(줄["보여준조언값"])
    return min(max((최종 - 초기) / (조언 - 초기), 0), 1)


def 오차(값, 줄):
    """정답과의 거리를 정답 대비 비율로 돌려준다."""
    정답 = float(줄["정답"])
    return abs(float(값) - 정답) / 정답


def 칸별_요약(줄들):
    """확신도 표시 × 조언 맞음/틀림 네 칸의 평균을 출력한다."""
    print(f"{'조건':<20}{'시행':>5}{'WOA':>8}{'초기오차':>10}{'최종오차':>10}")
    for 표시 in ["true", "false"]:
        for 맞음 in ["true", "false"]:
            칸 = [줄 for 줄 in 줄들 if 줄["확신도표시여부"] == 표시 and 줄["조언맞음여부"] == 맞음]
            이름 = ("표시" if 표시 == "true" else "미표시") + " / " + ("맞는 조언" if 맞음 == "true" else "틀린 조언")
            if not 칸:
                print(f"{이름:<20}{0:>5}{'-':>8}{'-':>10}{'-':>10}")
                continue
            w = mean(잘린_woa(줄) for 줄 in 칸)
            초기 = mean(오차(줄["초기응답값"], 줄) for 줄 in 칸)
            최종 = mean(오차(줄["최종응답값"], 줄) for 줄 in 칸)
            print(f"{이름:<20}{len(칸):>5}{w:>8.2f}{초기:>10.1%}{최종:>10.1%}")


def 점검_요약(줄들):
    """집단별 조작 점검 답을 참가자 단위로 센다."""
    참가자 = {줄["참가자번호"]: 줄 for 줄 in 줄들}
    for 번호, 줄 in sorted(참가자.items()):
        집단 = "표시" if 줄["확신도표시여부"] == "true" else "미표시"
        print(f"참가자 {번호} ({집단}): 점검1 = {줄['점검1']} / 점검2 = {줄['점검2']}")


def 빠른_시행(줄들):
    """최종 화면 2초 이하 + 안 움직임 시행을 센다 (2-6 규칙, 확정 전이라 빼지는 않는다)."""
    return sum(int(줄["최종화면시간ms"]) <= 2000 and 줄["슬라이더움직임여부"] == "false" for 줄 in 줄들)


if __name__ == "__main__":
    데이터 = 읽기(sys.argv[1:])
    print(f"참가자 {len({줄['참가자번호'] for 줄 in 데이터})}명, 시행 {len(데이터)}개\n")
    칸별_요약(데이터)
    print()
    점검_요약(데이터)
    print(f"\n최종 화면 2초 이하 + 안 움직임: {빠른_시행(데이터)}시행")
