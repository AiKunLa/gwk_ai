import { useState, useRef } from "react";

export default function MusicPlayer() {
  // 火山引擎TTS配置
  const TOKEN = "YDgGbGpuwGqjIOOkNdyz0xS9GJ9eTtZp";
  const APP_ID = "8613094311";
  const CLUSTRE_ID = "volcano_tts";
  const SERECT_KEY = "Niw00iviAlZ-CYo0bWROupC13xbCG4-j";

  const [prompt, setPrompt] = useState("播放音乐");
  const [promptTTs, setPromptTTs] = useState("一刀999");
  const audioRef = useRef(null);

  const playMusic = () => {
    console.log(audioRef); // 绑定了audio
    if (audioRef.current.paused) {
      audioRef.current.play();
      setPrompt("暂停音乐");
    } else {
      audioRef.current.pause();
      setPrompt("播放音乐");
    }
  };

  const generateAudion = () => {
    const voiceName = "zh_male_sunwukong_mars_bigtts";
    const endpoint = "/tts/api/v1/tts";
    
    const headers = {
        'Content-Type':'application/json',
        Authorization:`Bearer;${TOKEN}`
    }
  };

  return (
    <div className="container">
      <div>
        <label>Prompt</label>
        <button onClick={generateAudion}>生成并播放</button>
        <textarea
          className="input"
          type="text"
          value={promptTTs}
          onChange={(e) => setPromptTTs(e.target.value)}
        ></textarea>
      </div>
      <audio ref={audioRef} controls>
        <source src="/music/荒 - 潘小明.ogg" type="audio/mpeg" />
      </audio>
      <button onClick={playMusic}>{prompt}</button>
    </div>
  );
}
