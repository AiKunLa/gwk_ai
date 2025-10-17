class PromptTemplete {
  constructor(template) {
    this.template = template;
  }

  format(variables) {
    let result = this.template;
    // 一个个替换
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{${key}}`, "g"), value);
    }
    return result;
  }
}
const tourismTemplate = new PromptTemplete(`
    你是一位专业的旅游顾问。
    请帮用户规划{city}的{days}天旅游
    要求：突出{preference}，并给出每天详细的安排
    `);

const userInput = {
  city: "上海",
  days: "3",
  preference: "历史文化",
};
const finalPrompt = tourismTemplate.format(userInput);
console.log(finalPrompt);
