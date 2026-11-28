// NK 지형에서 연결 방식에 따른 장단기 역전이 나오는지 확인하는 실험 (Lazer & Friedman 2007 설정을 따름)
// 실행: node nk-check.js
// 레시피 = 예/아니오 선택 20개. 선택마다 다른 선택 K개와 얽혀 점수가 정해진다.

/** 시드가 같으면 같은 난수 (mulberry32, 공개 도메인) */
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

const N = 20, K = 5, PEOPLE = 60, NKS = new Map();

/** NK 지형: 선택 i의 기여는 자기와 이웃 K개(바로 오른쪽 K개, 원형)의 값 조합으로 정해진다 */
function makeNK(rng) {
  const table = [];
  for (let i = 0; i < N; i++) { const t = new Float64Array(1 << (K + 1)); for (let j = 0; j < t.length; j++) t[j] = rng(); table.push(t); }
  const raw = s => { let sum = 0; for (let i = 0; i < N; i++) { let idx = 0; for (let k = 0; k <= K; k++) idx = (idx << 1) | ((s >>> ((i + k) % N)) & 1); sum += table[i][idx]; } return sum / N; };
  // 2^20개 전부 계산해 최고점을 찾는다: 점수를 0~1로 맞추고, 논문처럼 8제곱해 차이를 벌린다
  let max = 0; for (let s = 0; s < (1 << N); s++) max = Math.max(max, raw(s));
  return s => Math.pow(raw(s) / max, 8);
}

/** 연결망: 누가 누구의 점수를 볼 수 있나 (이웃 목록) */
function makeNet(kind, rng) {
  const nb = Array.from({ length: PEOPLE }, () => []);
  const link = (a, b) => { if (a !== b && !nb[a].includes(b)) { nb[a].push(b); nb[b].push(a); } };
  if (kind === 'full') for (let a = 0; a < PEOPLE; a++) for (let b = a + 1; b < PEOPLE; b++) link(a, b);
  if (kind === 'line') for (let a = 0; a + 1 < PEOPLE; a++) link(a, a + 1);
  if (kind === 'rooms') { // 6명씩 10개 방, 방 안은 모두 연결, 방끼리는 한 줄씩 (통로·광장에 해당)
    for (let a = 0; a < PEOPLE; a++) for (let b = a + 1; b < PEOPLE; b++) if (Math.floor(a / 6) === Math.floor(b / 6)) link(a, b);
    for (let r = 0; r < 10; r++) link(r * 6, ((r + 1) % 10) * 6 + 1 + Math.floor(rng() * 5));
  }
  return nb;
}

/** 한 판: 매 라운드 각자 이웃 중 최고가 나보다 나으면 따라 하고, 아니면 선택 하나를 바꿔 보고 나으면 채택 */
function run(kind, seed, T = 300, rhythm = 0) {
  // 같은 시드면 네 연결 방식이 같은 지형·같은 출발점을 쓰도록 지형은 따로 만들어 재사용 (최고점 계산이 무거움)
  if (!NKS.has(seed)) NKS.set(seed, makeNK(mulberry32(seed)));
  const rng = mulberry32(seed + 1e6), f = NKS.get(seed), nb = makeNet(kind, rng);
  let sol = Array.from({ length: PEOPLE }, () => Math.floor(rng() * (1 << N)));
  const out = [];
  for (let t = 0; t < T; t++) {
    const sc = sol.map(f), next = sol.slice();
    const connected = !rhythm || t % rhythm === rhythm - 1; // 리듬: rhythm 라운드에 한 번만 서로 본다
    for (let a = 0; a < PEOPLE; a++) {
      let best = -1;
      if (connected) for (const b of nb[a]) if (best < 0 || sc[b] > sc[best]) best = b;
      if (best >= 0 && sc[best] > sc[a]) next[a] = sol[best];
      else { const c = sol[a] ^ (1 << Math.floor(rng() * N)); if (f(c) > sc[a]) next[a] = c; }
    }
    sol = next;
    const s = sol.map(f);
    out.push({ mean: s.reduce((x, y) => x + y) / PEOPLE, best: Math.max(...s), distinct: new Set(sol).size });
  }
  return out;
}

// 같은 지형 여러 개에서 네 연결 방식을 비교
const KINDS = [['모두 연결', 'full', 0], ['느슨한 줄', 'line', 0], ['방 + 통로', 'rooms', 0], ['모두 연결 + 리듬(5라운드에 한 번)', 'full', 5]];
const SEEDS = +(process.argv[2] || 40), T = 300, marks = [5, 10, 20, 40, 80, 150, 299];
const res = KINDS.map(([name, kind, rh]) => {
  const acc = marks.map(() => ({ mean: 0, best: 0, distinct: 0 })), finals = [];
  for (let s = 0; s < SEEDS; s++) { const r = run(kind, 7000 + s, T, rh); marks.forEach((m, k) => { for (const key in acc[k]) acc[k][key] += r[m][key] / SEEDS; }); finals.push(r[T - 1].mean); }
  return { name, acc, finals };
});
console.log(`지형 ${SEEDS}개 평균. 칸 = 평균 점수 / 최고 점수 / 서로 다른 레시피 수`);
console.log('라운드'.padEnd(26) + marks.map(m => String(m + 1).padStart(18)).join(''));
for (const r of res) console.log(r.name.padEnd(24) + r.acc.map(a => `${a.mean.toFixed(3)}/${a.best.toFixed(3)}/${a.distinct.toFixed(0)}`.padStart(18)).join(''));
// 끝 점수에서 '모두 연결'과의 차이와 표준오차
const base = res[0].finals;
for (const r of res.slice(1)) { const d = r.finals.map((v, i) => v - base[i]), m = d.reduce((x, y) => x + y) / d.length, se = Math.sqrt(d.reduce((x, y) => x + (y - m) ** 2, 0) / (d.length - 1) / d.length); console.log(`끝 평균 점수: ${r.name} − 모두 연결 = ${m.toFixed(3)} ± ${se.toFixed(3)}`); }
