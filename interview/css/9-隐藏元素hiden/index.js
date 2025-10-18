
const myElement = document.getElementById('myElemtn');
myElement.addEventListener('click', ()=> {
    alert('clicked');
})
const btton1 = document.getElementById('toggle-btn1');
const btton2 = document.getElementById('toggle-btn2');
const btton3 = document.getElementById('toggle-btn3');

btton1.addEventListener('click', ()=> {
    myElement.style.display = 'none';
})
btton2.addEventListener('click', ()=> {
    myElement.style.visibility = 'hidden';
})
btton3.addEventListener('click', ()=> {
    myElement.style.opacity = '0';
})