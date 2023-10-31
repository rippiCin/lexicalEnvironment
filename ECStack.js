
class ECStack {
  constructor() {
    this.contexts = [];
  }
  push(EC) {
    this.contexts.push(EC);
  }
  pop() {
    this.contexts.pop();
  }
  // 获取栈顶，也就是执行上下文栈当前的运行中的执行上下文
  get current() {
    return this.contexts[this.contexts.length - 1];
  }
}

module.exports = new ECStack();
