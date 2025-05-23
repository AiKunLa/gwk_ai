// 获取按钮元素
const changeBtn = document.getElementById('changeBtn');
const restoreBtn = document.getElementById('restoreBtn');
/**
 * @description: 改变背景色
 * @author: gwk
 * @date 2025/5/10 16:46
 */

// 改变背景色事件
changeBtn.addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    // 获取当前页面背景色并保存
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      func: () => {
        return document.body.style.backgroundColor;
      }
    }, (results) => {
      const originalColor = results[0].result;
      chrome.storage.local.set({originalColor: originalColor});
      // 设置背景色为绿色
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        func: () => {
          document.body.style.backgroundColor = '#4caf50';
        }
      });
    });
  });
});

// 还原背景色事件
restoreBtn.addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.storage.local.get(['originalColor'], (result) => {
      const originalColor = result.originalColor || '';
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        func: (color) => {
          document.body.style.backgroundColor = color;
        },
        args: [originalColor]
      });
    });
  });
});