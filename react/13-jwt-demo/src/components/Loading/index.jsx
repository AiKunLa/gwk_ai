import Style from './index.module.css';

export default function Loading() {
  return (
    <div className={Style.loading}>
      <div className={Style.spinner}></div>
      <p>加载中...</p>
    </div>
  );
}
