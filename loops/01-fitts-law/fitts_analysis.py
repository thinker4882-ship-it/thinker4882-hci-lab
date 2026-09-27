"""
루프 1 - 5번 항목 분석: 조건별 hit 비율, hit=0/1 MT 비교, ID 매칭 조건 비교, 회귀 2회.
pandas/numpy 설치가 안 된 환경에서도 바로 돌아가도록 표준 라이브러리(csv, math, statistics)만 쓴다.
"""

import csv
import math
import statistics as stats

# 참가자 이름표 -> CSV 파일명
PARTICIPANTS = {
    "본인": "fitts_trials.csv",
    "가족1": "fitts_trials_family1.csv",
    "가족2": "fitts_trials_family2.csv",
}


def load_trials(filename):
    """CSV를 읽어 각 행을 딕셔너리로 담은 리스트로 반환하고 숫자 컬럼을 형변환한다."""
    rows = []
    with open(filename, encoding="utf-8") as f:
        for row in csv.DictReader(f):
            row["A"] = int(row["A"])
            row["W"] = int(row["W"])
            row["mt_ms"] = float(row["mt_ms"])
            row["hit"] = int(row["hit"])
            rows.append(row)
    return rows


def compute_id(a, w):
    """난이도 지수 ID = log2(A/W + 1)을 계산한다."""
    return math.log2(a / w + 1)


def group_by_aw(rows):
    """행들을 (A, W) 조합별로 묶어 딕셔너리로 반환한다."""
    groups = {}
    for r in rows:
        key = (r["A"], r["W"])
        groups.setdefault(key, []).append(r)
    return groups


def hit_rate_table(all_data):
    """참가자 x (A,W)조건별 hit 비율 표를 출력한다. hit 비율이 낮을수록 오류율이 높다는 뜻. (1/5단계)"""
    print("\n=== 1단계/5단계: 조건별 hit 비율 (낮을수록 오류율 높음) ===")
    aw_keys = sorted({key for rows in all_data.values() for key in group_by_aw(rows)},
                      key=lambda k: compute_id(*k))
    header = f"{'A,W (ID)':<16}" + "".join(f"{name:>10}" for name in all_data)
    print(header)
    for a, w in aw_keys:
        id_ = compute_id(a, w)
        line = f"{a},{w} ({id_:.2f})".ljust(16)
        for name, rows in all_data.items():
            grp = group_by_aw(rows)[(a, w)]
            rate = stats.mean(r["hit"] for r in grp)
            line += f"{rate:>10.0%}"
        print(line)


def hit_mt_comparison(all_data):
    """조건(A,W)별로 hit=0과 hit=1 시행의 평균 MT를 비교한다. (2단계)"""
    print("\n=== 2단계: 조건별 hit=0 vs hit=1 평균 MT(ms) ===")
    for name, rows in all_data.items():
        print(f"-- {name} --")
        for (a, w), grp in sorted(group_by_aw(rows).items(), key=lambda kv: compute_id(*kv[0])):
            hit0 = [r["mt_ms"] for r in grp if r["hit"] == 0]
            hit1 = [r["mt_ms"] for r in grp if r["hit"] == 1]
            m0 = f"{stats.mean(hit0):.0f}ms (n={len(hit0)})" if hit0 else "n=0"
            m1 = f"{stats.mean(hit1):.0f}ms (n={len(hit1)})" if hit1 else "n=0"
            print(f"  A{a},W{w}: hit=0 -> {m0}  |  hit=1 -> {m1}")


def id_matched_pair(all_data, pair_aw):
    """ID가 같은 두 (A,W) 조건의 평균 MT를 비교한다. (3단계)"""
    (a1, w1), (a2, w2) = pair_aw
    print(f"\n=== 3단계: ID 동일 쌍 비교 - (A{a1},W{w1}) vs (A{a2},W{w2}), ID={compute_id(a1, w1):.2f} ===")
    for name, rows in all_data.items():
        g1 = group_by_aw(rows).get((a1, w1), [])
        g2 = group_by_aw(rows).get((a2, w2), [])
        mt1 = stats.mean(r["mt_ms"] for r in g1) if g1 else float("nan")
        mt2 = stats.mean(r["mt_ms"] for r in g2) if g2 else float("nan")
        print(f"  {name}: A{a1}W{w1} 평균 {mt1:.0f}ms  vs  A{a2}W{w2} 평균 {mt2:.0f}ms  (차이 {mt2 - mt1:+.0f}ms)")


def mt_by_amplitude(all_data):
    """W를 고정한 채 A(150/300/450)가 커질 때 MT가 계속 커지는지 확인한다. 안 커지면 표시한다."""
    print("\n=== 추가: W 고정, A 증가에 따른 MT 변화 (Fitts 법칙이면 계속 증가해야 함) ===")
    w_levels = [20, 50, 100]
    a_levels = [150, 300, 450]
    for name, rows in all_data.items():
        print(f"-- {name} --")
        groups = group_by_aw(rows)
        for w in w_levels:
            mts = [stats.mean(r["mt_ms"] for r in groups[(a, w)]) for a in a_levels]
            flag = "" if mts[0] < mts[1] < mts[2] else "  <- 비단조(증가 안 함)"
            line = "  ".join(f"A{a}={mt:.0f}ms" for a, mt in zip(a_levels, mts))
            print(f"  W{w}: {line}{flag}")


def fit_fitts_law(rows):
    """ID~mt_ms에 최소자승 직선을 맞춰 a, b, R², IP(=1000/b, bit/s)를 계산한다."""
    xs = [compute_id(r["A"], r["W"]) for r in rows]
    ys = [r["mt_ms"] for r in rows]
    n = len(xs)
    x_mean, y_mean = stats.mean(xs), stats.mean(ys)
    b = (sum((x - x_mean) * (y - y_mean) for x, y in zip(xs, ys))
         / sum((x - x_mean) ** 2 for x in xs))
    a = y_mean - b * x_mean
    y_pred = [a + b * x for x in xs]
    ss_res = sum((y - yp) ** 2 for y, yp in zip(ys, y_pred))
    ss_tot = sum((y - y_mean) ** 2 for y in ys)
    r2 = 1 - ss_res / ss_tot
    ip = 1000 / b  # b는 ms/bit 단위라 1000을 나눠 bit/s로 변환
    return {"a": a, "b": b, "r2": r2, "ip": ip, "n": n}


def regression_twice(all_data):
    """전체 데이터 회귀와 hit=1만 회귀를 참가자별로 각각 돌려 비교한다. (4단계)"""
    print("\n=== 4단계: 회귀 결과 — 전체 데이터 vs hit=1만 ===")
    for name, rows in all_data.items():
        full = fit_fitts_law(rows)
        hit1_only = fit_fitts_law([r for r in rows if r["hit"] == 1])
        print(f"-- {name} --")
        print(f"  전체(n={full['n']}):     a={full['a']:.1f}  b={full['b']:.1f}  "
              f"R2={full['r2']:.3f}  IP={full['ip']:.2f}bit/s")
        print(f"  hit=1만(n={hit1_only['n']}): a={hit1_only['a']:.1f}  b={hit1_only['b']:.1f}  "
              f"R2={hit1_only['r2']:.3f}  IP={hit1_only['ip']:.2f}bit/s")


if __name__ == "__main__":
    all_data = {name: load_trials(fn) for name, fn in PARTICIPANTS.items()}
    hit_rate_table(all_data)
    hit_mt_comparison(all_data)
    id_matched_pair(all_data, ((300, 100), (150, 50)))
    mt_by_amplitude(all_data)
    regression_twice(all_data)
