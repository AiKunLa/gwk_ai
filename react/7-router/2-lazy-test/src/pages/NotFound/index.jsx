import './index.css';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="error-card">
        <h1 className="error-code">404</h1>
        <p className="error-message">页面不存在</p>
        <a href="/" className="home-link">
          返回首页
        </a>
      </div>
    </div>
  );
}