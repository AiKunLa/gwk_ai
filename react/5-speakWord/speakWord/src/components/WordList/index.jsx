import { useState } from "react";

export default function WordList(props) {
  const { sentence, explaination, explainationReplys, imgPreview } = props;
  const [detailExpand, setDetailExpand] = useState(false);
  return (
    <div className="output">
      <div>{sentence}</div>
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
            <img src={imgPreview} alt="preview" />
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
  );
}
