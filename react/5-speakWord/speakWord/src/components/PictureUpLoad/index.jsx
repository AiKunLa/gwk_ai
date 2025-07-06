import { useState } from "react";
import "./index.css";

export default function PictureUpLoad(props) {
  const { word, sentence, audio, uploadImg } = props;

  // 图片预览
  const [imgPreview, setImgPrview] = useState(
    "https://res.bearbobo.com/resource/upload/W44yyxvl/upload-ih56twxirei.png"
  );

  // 上传图片数据 并绑定imgPrive
  const uploadImgData = async (e) => {
    const imgPath = e.target?.files[0];

    if (!imgPath) {
      return;
    }
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      // 读取图片数据并转为base64格式
      reader.readAsDataURL(imgPath);
      reader.onload = () => {
        setImgPrview(reader.result);
        // 调用父组件的函数
        uploadImg(reader.result);

        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
    });

  };
  return (
    <div className="card">
      <input
        id="selectImage"
        type="file"
        accept=".jpg,.jeg,.png"
        onChange={uploadImgData}
      ></input>
      <label htmlFor="selectImage" className="upload">
        <img src={imgPreview} alt="preview" />
      </label>
      <div className="word">{word}</div>
    </div>
  );
}
