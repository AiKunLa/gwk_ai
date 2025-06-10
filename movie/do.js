// 配置项
const API_URL =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=3fd2be6f0c70a2a598f084ddfb75487c&page=1";
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCH_API =
  'https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query="';

//返回的是一个DOM节点对象
const oForm = document.querySelector("#form");
console.log(oForm);
//获取oForm的具体类型  所有父类的使用原型对象的toString方法
console.log(Object.prototype.toString(oForm)); // 获取oForm的对象

oForm.addEventListener("submit", function (e) {
  // console.log(e);
  // console.log(e.target[0].value)
  // 这里的e是指的事件对象  事件对象是由浏览器创建的  我们可以通过事件对象来获取事件的信息
  // 阻止表单的默认行为  阻止表单的默认行为就是阻止表单的提交
  e.preventDefault();
  const searchVal = e.target[0].value;
  if (searchVal.trim()) {
    //trim()方法可以去除字符串的前后空格
    console.log(searchVal.trim());
    // 根据searchVal搜索电影
    getMovie(searchVal.trim());
  } else {
    alert("请输入搜索内容");
  }
});

// 封装一个函数  用来获取电影信息
const getMovie = (searchVal) => {
  // console.log(searchVal);
  // 使用fetch获取
  // 构建地址
  let reqUrl = "";
  if (searchVal) {
    // 有搜索内容  就使用搜索接口
    reqUrl = SEARCH_API + searchVal;
  } else {
    // 没有搜索内容  就使用默认接口
    reqUrl = API_URL;
  }
  fetch(reqUrl)
    .then((res) => res.json()) // 返回的是一个promise对象 将二进制流转为json  我们可以使用then方法来获取数据
    .then((data) => {
      showMovies(data.results);
    });
};

const showMovies = (movies) => {
  let main = document.querySelector("#main");
  main.innerHTML = movies.map((movie) => {
    const { backdrop_path, title, original_title, overview } = movie;
    return `
        <div class="movie">
            <img src='${IMG_PATH + backdrop_path}' alt="${title}">
            <div class="movie-info">
                <h3>${original_title}</h3>
            </div>
            <div class="overview">
                <h3>${overview}</h3>
            </div>
        </div>
    `
  }).join("");
};

window.onload = () => {
  // 页面加载完成后  就获取电影信息
  getMovie();
};
