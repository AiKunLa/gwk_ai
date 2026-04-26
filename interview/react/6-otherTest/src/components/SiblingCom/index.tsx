import ParentPattern from './Parent'
import ContextPattern from './ContextPattern'
import EventBusPattern from './EventBusPattern'

export function SiblingCommunication() {
  return (
    <div className="sibling-communication">
      <h2>React 兄弟组件通信案例</h2>

      <ParentPattern />
      <ContextPattern />
      <EventBusPattern />

      <div className="summary">
        <h3>三种通信方式对比</h3>
        <table>
          <thead>
            <tr>
              <th>方式</th>
              <th>适用场景</th>
              <th>优点</th>
              <th>缺点</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>父组件作为中间件</td>
              <td>父子/兄弟组件，状态简单</td>
              <td>简单直接，React 默认模式</td>
              <td>层级深时繁琐，需逐层传递</td>
            </tr>
            <tr>
              <td>Context API</td>
              <td>跨层级组件通信</td>
              <td>无需逐层传递，可跨多层</td>
              <td>频繁更新会影响性能</td>
            </tr>
            <tr>
              <td>发布订阅模式</td>
              <td>无关联组件解耦通信</td>
              <td>完全解耦，灵活度高</td>
              <td>调试困难，状态管理复杂</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SiblingCommunication
