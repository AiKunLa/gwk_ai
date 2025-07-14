export default function AudioPlay(props) {
  const { audioUrl } = props;
  function playAudio() {
    const audio = new Audio(audioUrl);
    audio.play();
  }
  return (
    <div>
      {audioUrl && (
        <div className="playAudio" onClick={playAudio}>
          <img
            width="20px"
            src="https://res.bearbobo.com/resource/upload/Omq2HFs8/playA-3iob5qyckpa.png"
            alt="logo"
          />
        </div>
      )}
    </div>
  );
}
