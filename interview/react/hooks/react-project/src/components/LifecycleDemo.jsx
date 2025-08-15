import { Component } from "react";
class LifecycleDemo extends Component {
  componentDidMount() {
    console.log("组件挂载");
  }
  componentDidUpdate() {
    console.log("组件更新");
  }
  
  componentWillUnmount() {
    console.log("组件卸载");
  }

  constructor(props) {
    super(props); //
    // proxy 拦截
    this.state = {
      count: 0,
    };
  }
  doIncreamer = () => {
    // Propx set拦截
    console.log(this);
    console.log("doIncreamer");
  };
  // 状态和生命周期
  // 必须有这个方法
  render() {
    return (
      <>
        <h1>Lifecycle Demo</h1>
        <p>Count: {this.state.count}</p>
        <button onClick={this.doIncreamer}>+</button>
      </>
    );
  }
}

export default LifecycleDemo;
