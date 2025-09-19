class Circle {
  constructor(radius) {
    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius * this.radius;
  }
}

class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }
  area() {
    return this.width * this.height;
  }
}

class ShapFactory {
  static createShap(type, option) {
    switch (type) {
      case "circle":
        return new Circle(option.radius);
      case "rectangle":
        return new Rectangle(option.height, option.width);
      default:
        throw new Error("Unkonwn");
    }
  }
}

// 统一的工厂接口
const example = ShapFactory.createShap("circle", { radius: 5 });
console.log(example.area())