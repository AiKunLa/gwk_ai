/**
 *  @jsx Didact.createElement
 */

const element = (
    <div id="foo">
        <a href="">bar</a>
        <b></b>
    </div>
)

// 上面的注释表示：告诉 Babel 在编译时使用``Didact.createElement`` 而不是默认的``React.createElement``