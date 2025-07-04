import React, { useState } from "react";
import "./PictureUpLoad.css";
// 图片上传功能
export default function PictureUpLoad(props) {
  const { uploadImg, wordData ,generateAudio} = props;
  const [audio, setAudio] = useState("");
  const [imgPreview, setImgPreview] = useState(
    "https://res.bearbobo.com/resource/upload/W44yyxvl/upload-ih56twxirei.png"
  );
  // 上传图片
  const loadImg = (e) => {
    // 1. 获取用户选择的文件
    const file = e.target.files?.[0]; // 可选链运算符
    // 2. 将文件转换为路径
    if (!file) return;
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImgPreview(reader.result);
        // 调用父组件的函数
        uploadImg(reader.result);

        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
    });
    // const imgUrl = URL.createObjectURL(file);
    // setImgPreview(imgUrl);
    // setFile(file);
  };


  return (
    <div className="upload-container">
      {/* 绑定数据file */}
      <input
        id="selectImage"
        type="file"
        accept=".jpg, .png, .jpeg"
        onChange={loadImg}
      />
      <label htmlFor="selectImage" className="preview-container">
        {/* 图片预览 */}
        <img src={imgPreview} alt="preview" className="preview-image" />
        上传图片
      </label>
      {/* 响应式单词业务 */}
      <div className="preview-placeholder">{wordData}</div>
    </div>
  );
}
