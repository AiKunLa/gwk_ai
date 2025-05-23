// 依次获取用户输入
const productName = prompt('请输入商品名称');
const price = parseFloat(prompt('请输入商品价格'));
const quantity = parseInt(prompt('请输入商品数量'));
const address = prompt('请输入收货地址');

// 验证输入有效性
if (!productName || isNaN(price) || isNaN(quantity) || !address) {
    alert('输入内容不合法，请重新填写');
    window.location.reload();
}

// 计算总价
const totalPrice = (price * quantity).toFixed(2);

// 获取表格tbody并添加新行
const tableBody = document.getElementById('tableBody');
const newRow = document.createElement('tr');
newRow.innerHTML = `\
    <td>${productName}</td>\
    <td>${price.toFixed(2)}</td>\
    <td>${quantity}</td>\
    <td>${address}</td>\
    <td>${totalPrice}</td>\
`;
tableBody.appendChild(newRow);