import { useRef, useState } from "react";
import "./App.css";

function App() {
  // react 内置的hook函数 钩子 数据绑定
  const [content, setContent] = useState("");
  const [imgBase64Data, setImgBase64Data] = useState("");
  // 状态 原始为禁用 文件读取并预览后启用
  const [isValid, setIsValid] = useState(false);
  // DOM对象绑定
  const inputRef = useRef(null);

  const [VITE_API_KEY, setVITE_API_KEY] = useState(
    import.meta.env.VITE_API_KEY
  );

  console.log("VITE_API_KEY", VITE_API_KEY);
  // base64编码
  const updateBase64Data = (e) => {
    // 获取文件 - html js本地文件操作
    const file = e.target.files[0];
    if (file == null) return;

    const reader = new FileReader();
    // 读取文件并将 将 file 对象转换为 Data URL 格式 （Base64 编码的字符串）
    reader.readAsDataURL(file);
    // 异步操作 图片转base64编码 后上传
    reader.onload = () => {
      setImgBase64Data(reader.result);
      setIsValid(true);
      // 将图片显示到页面上
      // 调用接口


    };
  };
  const update = async () => {
    if(!imgBase64Data) return
    const endpoint = "https://api.moonshot.cn/v1/chat/completions";
    const headers = {
      'Content-Type':'application/json',
      // 授权 Bearer标记后面是token
      'Authorization':`Bearer ${VITE_API_KEY}`
    }
    // 让用户感知系统正在干什么，提高用户体验
    setContent('正在请求中...')
    // 发起请求
    const res = await fetch(endpoint,{
      method:'POST',
      // 当key与变量名相同时可以省略
      headers,
      body:JSON.stringify({
        // 选择模型
        model:'moonshot-v1-8k-vision-preview',
        // 模型的角色 user 助理 system
        messages:[
          {
            role:'user',
            content:[
              // 内容
              {
                type:'image_url',
                image_url:{
                  url:imgBase64Data,
                }
              },
              // 要求
              {
                type:'text',
                text:'请描述图片的内容'
              }
            ]
          }
        ]
      })
    })

    // 服务器返回的是二进制流 这里是解析二进制流 反序列化   原本是异步的通过await 变成同步
    const data = await res.json()
    setContent(data.choices[0].message.content)

  };
  return (
    <>
      <div className="container">
        {/* 无障碍访问 */}
        <label htmlFor="fileInput">文件</label>
        <input
          id="fileInput"
          type="file"
          className="input"
          accept=".jpg,.jpeg,.png,.gif"
          onChange={updateBase64Data}
        />
        <button onClick={update} disabled={!isValid}>
          提交
        </button>
        <div className="output">
          <div className="preview">
            {imgBase64Data && <img src={imgBase64Data} alt="" />}
          </div>
        </div>
        <div>{content}</div>
      </div>
    </>
  );
}

export default App;
