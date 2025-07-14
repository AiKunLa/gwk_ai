import { useState } from "react";
import "./App.css";
import PictureUpLoad from "./components/PictureUpLoad";
import WordList from "./components/WordList";
import { generateAudio } from "./lib/audio";
import { getImgWord } from "./lib/picture";
import originImg from "./assets/origin.png";

function App() {
  const [lessonData, setLessonData] = useState({
    word: "", // 单词
    sentence: "", // 例句
    audioUrl: "", // 音频url
    explaination: [], // 解释
    explainationReplys: [], // 解释回复
  });
  //提示
  const [tips, setTips] = useState("请上传图片");
  // 图片预览
  const [imgPreview, setImgPreview] = useState(originImg);

  // 上传图片方法
  const uploadImg = async (imgBase64Data) => {
    // 上传图片预览
    setImgPreview(imgBase64Data);

    // 调用mootshot识别图片
    try {
      setTips("正在识别图片...");
      const data = await getImgWord(imgBase64Data);
      const wordData = JSON.parse(data.choices[0].message.content);
      console.log(wordData);
      
      // 更新数据
      setLessonData((prev) => ({
        ...prev,
        word: wordData.representative_word || "", // 默认空字符串
        sentence: wordData.example_sentence || "",
        explaination: wordData.explaination?.split("\n") || [], // 安全拆分
        explainationReplys: wordData.explaination_replys || [],
        audioUrl: wordData.audio_url || prev.audioUrl, // 保留旧值或更新
      }));

    } catch (error) {
      setTips("图片识别失败");
    }

    // 大模型返回的是base64编码的音频，这样的数据比较小，能接受token消耗
    // 调用音频接口，返回音频的url
    try {
      setTips("正在生成音频...");
      console.log(lessonData.sentence);
      const audioUrl = await generateAudio(lessonData.sentence);
      setTips("");
      setLessonData((prev) => ({
        ...prev,
        audioUrl: audioUrl,
      }));
    } catch (error) {
      setTips("音频生成失败");
    }
  };

  return (
    <div className="container">
      <PictureUpLoad
        word={lessonData.word}
        audioUrl={lessonData.audioUrl}
        uploadImg={uploadImg}
        originImg={imgPreview}
      />
      {tips && <div>{tips}</div>}
      <WordList
        imgPreview={imgPreview}
        word={lessonData.word}
        sentence={lessonData.sentence}
        explaination={lessonData.explaination}
        explainationReplys={lessonData.explainationReplys}
      />
    </div>
  );
}

export default App;
