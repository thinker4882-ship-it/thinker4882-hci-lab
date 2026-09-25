"""
루프 1 - 5번 항목: 참가자 3명(본인/가족1/가족2)의 포인팅 데이터에
Fitts의 법칙(MT = a + b*ID)을 각각 따로 회귀로 적합해 비교한다.
Colab에서 이 파일 코드와 CSV 3개를 같은 폴더에 두고 실행한다.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt  # 산점도와 회귀선을 함께 그리는 표준 라이브러리라 채택


def add_id_column(df):
    """A/W 비율로 난이도 지수 ID = log2(A/W + 1) 컬럼을 추가한다."""
    df = df.copy()
    df["ID"] = np.log2(df["A"] / df["W"] + 1)
    return df


def fit_fitts_law(df):
    """ID~mt_ms에 최소자승 직선을 맞춰 a, b, R², IP(=1/b, bit/s)를 계산한다."""
    x = df["ID"].values
    y = df["mt_ms"].values
    b, a = np.polyfit(x, y, 1)  # 1차식 fit -> [기울기, 절편] 순서로 반환됨
    y_pred = a + b * x
    ss_res = np.sum((y - y_pred) ** 2)
    ss_tot = np.sum((y - y.mean()) ** 2)
    r2 = 1 - ss_res / ss_tot
    ip = 1000 / b  # b는 ms/bit 단위라 1000을 나눠 bit/s로 변환
    return {"a": a, "b": b, "r2": r2, "ip": ip}


# 참가자 이름표 -> CSV 파일명
participants = {
    "본인 (20대, 마우스)": "fitts_trials.csv",
    "가족1 (50대, 폰)": "fitts_trials_family1.csv",
    "가족2 (10대, 폰)": "fitts_trials_family2.csv",
}

dataframes = {}   # 참가자별로 ID 컬럼까지 추가된 데이터
results = {}      # 참가자별 a/b/r2/ip 결과

for label, filename in participants.items():
    df = add_id_column(pd.read_csv(filename))
    dataframes[label] = df
    results[label] = fit_fitts_law(df)

summary = pd.DataFrame(results).T
summary.index.name = "참가자"
print(summary)

# 참가자별 산점도 + 회귀선을 한 그래프에 겹쳐 그리기
plt.figure(figsize=(7, 5))
for label, df in dataframes.items():
    stats = results[label]
    plt.scatter(df["ID"], df["mt_ms"], alpha=0.4, label=label)
    x_line = np.linspace(df["ID"].min(), df["ID"].max(), 50)
    y_line = stats["a"] + stats["b"] * x_line
    plt.plot(x_line, y_line)

plt.xlabel("ID (bit)")
plt.ylabel("MT (ms)")
plt.legend()
plt.title("참가자별 Fitts 법칙 회귀선 비교")
plt.show()
