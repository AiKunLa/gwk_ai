function Button(id){
    this.element = document.querySelector(`#${id}`)
    console.log(this.element);
    this.bindEvent();
}
Button.prototype.bindEvent = function(){
    // this 事件是异步的 这里会导致丢失问题 
    this.element.addEventListener('click', () => {
        this.element.style.backgroundColor = 'red';
    })
    // this.element.addEventListener('mouseout', function(){
    //     this.style.backgroundColor = 'green';
    // })
    this.element.addEventListener('mouseout', function(){
        this.setBgColor('yellow');
    })

}

Button.prototype.setBgColor = function(color){
    this.element.style.backgroundColor = color;
}