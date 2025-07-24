
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Style from './index.module.css';
import Loading from '@/components/Loading';
import NavBar from '@/components/NavBar';

export default function Home() {
  const [userInfo, setUserInfo] = useState(null);
  const [hobbyList, setHobbyList] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // 获取用户信息和爱好列表
  const fetchUserInfo = async () => {
    try {
    //   const res = await request.get('/getLikeList');
        const res = {
            code:0,
            data:{
                hobbyList:[
                    {id:1,name:'学习'},
                    {id:2,name:'运动'},
                    {id:3,name:'游戏'},
                ]
            }
        }
      if (res.code === 0 && res.data) {
        setHobbyList(res.data.hobbyList || []);
        // 从token中解析用户信息（实际项目中应从后端获取）
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUserInfo(payload);
        }
      }
    } catch (error) {
      console.error('获取用户信息失败:', error);
      // token无效或过期，重定向到登录页
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserInfo();
  }, [navigate]);

  if (loading) {
    return (
     <Loading/>
    );
  }

  return (
    <div className={Style.container}>
      {/* 导航栏 */}
      <header className={Style.header}>
        <NavBar/>
      </header>

      {/* 主内容区 */}
      <main className={Style.main}>
        <h1 className={Style.title}>欢迎回来，{userInfo?.username}！</h1>

        <section className={Style.card}>
          <h2 className={Style.sectionTitle}>你的爱好</h2>
          {hobbyList.length > 0 ? (
            <ul className={Style.hobbyList}>
              {hobbyList.map(hobby => (
                <li key={hobby.id} className={Style.hobbyItem}>
                  {hobby.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className={Style.emptyText}>暂无爱好数据</p>
          )}
        </section>
      </main>

      {/* 页脚 */}
      <footer className={Style.footer}>
        <p>© 2023 JWT Demo 项目</p>
      </footer>
    </div>
  );
}