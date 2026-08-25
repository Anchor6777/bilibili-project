// 格式化播放量
export const formatPlayCount = (count: number | undefined) => {
  if (!count) {
    return 0;
  }
  return count >= 10000 ? `${(count / 10000).toFixed(1)}万` : count.toString();
};

// 格式化播放时长
export const formatPlayTime = (playTime: number | undefined) => {
  const totalSeconds = playTime ? playTime : 0;

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor(totalSeconds / 60) % 60;
  const s = totalSeconds % 60;

  // 补零到两位
  const pad = (n: number) => String(n).padStart(2, "0");
  if (h > 0) {
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  } else {
    return `${pad(m)}:${pad(s)}`;
  }
};