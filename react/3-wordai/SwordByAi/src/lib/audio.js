// 可以有多个直接输出，但是只能有一个默认输出
export const gererateAudio = async (text) => {
  const { VITE_TOKEN, VITE_APP_ID, VITE_CLUSTER_ID } = import.meta.env;

  const voiceName = "zh_female_tianmeixiaoyuan_moon_bigtts"; // 角色
  const endpoint = "/tts/api/v1/tts"; // api 地址

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${VITE_TOKEN}`,
  };

  const payload = {
    app: {
      appid: VITE_APP_ID,
      token: VITE_TOKEN,
      cluster: VITE_CLUSTER_ID,
    },
    user: {
      uid: "bearbobo",
    },
    audio: {
      voice_type: voiceName,
      encoding: "ogg_opus", // 编码
      compression_rate: 1, // 压缩的比例
      rate: 24000,
      speed_ratio: 1.0,
      volume_ratio: 1.0,
      pitch_ratio: 1.0,
      emotion: "happy", // 情绪
    },
    request: {
      reqid: Math.random().toString(36).substring(7),
      text: prompt,
      text_type: "plain",
      operation: "query",
      silence_duration: "125",
      with_frontend: "1",
      frontend_type: "unitTson",
      pure_english_opt: "1",
    },
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  const url = createBlobURL(data.data); // 返回一个可以播放声音的url
  audioRef.current.src = url;
  audioRef.current.play();
  
};
