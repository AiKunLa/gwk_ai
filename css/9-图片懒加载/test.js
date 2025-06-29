// document.documentElemt 表示获取文档根元素 html
// 获取视口高度
const viewHeight = document.documentElement.clientHeight;
// 获取所有的懒加载img
const images = document.querySelectorAll('img[data-original][lazyload="true"]');

const lazyLoad = function () {
  Array.prototype.forEach.call(images, function (item) {
    // 若没有值，直接返回
    if (item.dataset.original === "") return;
    // 获取图片距离视窗顶部的距离
    const rectTop = item.getBoundingClientRect().top;

    // 获取图片距离视窗底部的距离
    const reactBottom = item.getBoundingClientRect().bottom;

    if (rectTop <= viewHeight && reactBottom >= 0) {
      (function () {
        //这种设计的核心目的是 避免页面闪烁和破碎图片占位符

        // 预加载 其作用是创建一个内存中的图片对象，
        // 然后 img.src = item.dataset.original 触发图片资源的 后台加载
        // 此时图片不会显示在页面中，仅在浏览器后台缓存图片数据。当再次请求该图片地址的时候会从缓存区中拿图片
        // 这样做的好处
        // 1. 避免页面闪烁和破碎图片占位符
        // 2. 避免图片加载顺序问题
        let img = new Image();
        img.src = item.dataset.original;

        // 当临时图片对象 img 触发 onload 事件（表示图片已完全加载完成）
        img.onload = function () {
          item.src = item.dataset.original;
          
          // 垃圾回收
          item.removeAttribute("data-original");
          // 移除自定义属性
          item.removeAttribute("lazyload");
        };
      })();
    }
  });
};
window.addEventListener("scroll", lazyLoad);
document.addEventListener("DOMContentLoaded", lazyLoad);
