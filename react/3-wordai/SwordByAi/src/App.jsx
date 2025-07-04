import { useState } from "react";
import "./App.css";
import PictureUpLoad from "./components/PictureUpLoad/PictureUpLoad";

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

  const [wordData, setWordData] = useState("请上传图片");

  const uploadImg = async (imgBase64Data) => {
    if (!imgBase64Data) return;

    const endpoint = "https://api.moonshot.cn/v1/chat/completions";
    const headers = {
      Authorization: `Bearer ${import.meta.env.VITE_KIMI_API_KEY}`,
      "Content-Type": "application/json",
    };
    // 让用户感知系统正在干什么，提高用户体验
    setWordData("正在识别中...");
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
    setWordData(jsonData.representative_word);
  };

  const gererateAudio = () => {
    
  };

  // 组件化：将html css js 像积木一样组成。
  // JSX 语法 是React的优势
  return (
    <div className="container">
      <PictureUpLoad uploadImg={uploadImg} wordData={wordData} />
    </div>
  );
}

export default App;
