import { useState } from "react";
import "./App.css";
import PictureUpLoad from "./components/PictureUpLoad";
import AudioPlay from "./components/AudioPlay";
import {generateAudio} from './lib/audio'

function App() {
  // es6 模板字符串支持多行
  const picPrompt = `
  分析图片内容，找出最能描述图片的一个英文单词，尽量选择更加简单的A1~A2的词汇。
  返回JSON数据：
  {
  "image_description":"图片描述",
  "representative_word":"图片代表的英文单词",
  "example_sentence":"结合英文单词和图片描述，给出一个简单的例句",
  "explaination":"结合图片解释英文单词, 段落以Look at...开头，将段落分句，每一句单独一行，解释的最后给一个日常生活有关的问句？",
  "explaination_replys":["根据explaination给出的回复1","根据explaination给出的回复2"]
  }
  `;

  // 单词
  const [word, setWord] = useState("");
  // 例句
  const [sentence, setSentence] = useState("");
  // 音频
  const [audioUrl, setAudioUrl] = useState("");

  // 详情内容是否展开
  const [detailExpand, setDetailExpand] = useState(false);

  const [explaination, setExplaination] = useState([]);
  const [explainationReplys, setExplainationReplys] = useState([]);

  // 图片预览
  const [imgPrive, setImgPrive] = useState(
    "https://res.bearbobo.com/resource/upload/W44yyxvl/upload-ih56twxirei.png"
  );

  // 上传图片方法
  const uploadImg = async (imgBase64Data) => {
    // 设置预览

    if (!imgBase64Data) return;
    setImgPrive(imgBase64Data);

    const endpoint = "https://api.moonshot.cn/v1/chat/completions";
    const headers = {
      Authorization: `Bearer ${import.meta.env.VITE_KIMI_API_KEY}`,
      "Content-Type": "application/json",
    };
    // 让用户感知系统正在干什么，提高用户体验
    setWord("正在识别中...");
    // 发起请求
    const res = await fetch(endpoint, {
      method: "POST",
      // 当key与变量名相同时可以省略
      headers: headers,
      body: JSON.stringify({
        // 选择模型
        model: "moonshot-v1-8k-vision-preview",
        // 模型的角色 user 助理 system
        messages: [
          {
            role: "user",
            content: [
              // 内容
              {
                type: "image_url",
                image_url: {
                  url: imgBase64Data,
                },
              },
              // 要求
              {
                type: "text",
                text: picPrompt,
              },
            ],
          },
        ],
      }),
    });

    // 服务器返回的是二进制流 这里是解析二进制流 反序列化   原本是异步的通过await 变成同步
    const data = await res.json();
    const jsonData = JSON.parse(data.choices[0].message.content);
    setWord(jsonData.representative_word);
    setSentence(jsonData.example_sentence);
    setExplaination(jsonData.explaination.split("\n"));
    setExplainationReplys(jsonData.explaination_replys);

    // 大模型返回的是base64编码的音频，这样的数据比较小，能接受token消耗
    // 调用音频接口，返回音频的url
    const audioUrl = await generateAudio(jsonData.example_sentence);

    setAudioUrl(audioUrl);
    console.log(explaination);
    console.log(explainationReplys);
  };

  return (
    <div className="container">
      <PictureUpLoad
        word={word}
        sentence={sentence}
        uploadImg={uploadImg}
      />
      <AudioPlay audioUrl={audioUrl}/>
      {/* <WordList /> */}
      <div className="output">
        <div>
          {sentence}
        </div>
        <div className="details">
          <button
            onClick={() => {
              setDetailExpand(!detailExpand);
            }}
          >
            Talk about
          </button>
          {detailExpand ? (
            <div className="expand">
              <img src={imgPrive} alt="preview" />
                {explaination.map((ex, index) => (
                  <div key={index} className="explanation">
                    {ex}
                  </div>
                ))}

                {explainationReplys.map((reply, index) => (
                  <div key={index} className="explanation-reply">
                    {reply}
                  </div>
                ))}
            </div>
          ) : (
            <div className="fold" />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
