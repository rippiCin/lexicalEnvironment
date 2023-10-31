
class ExecutionContext {
  /**
   * @param {any} lexicalEnvironment 当前的执行上下文环境中的词法环境
   * @param {any} thisBindings this对象指针
   * @returns {any}
   */
  constructor(lexicalEnvironment, thisBindings) {
    // 词法环境和变量环境现在可看成是一样的，后面会写分开
    // 变量环境用于存放var function声明的变量
    // 词法环境用于存放let const声明的变量
    this.variableEnvironment = this.lexicalEnvironment = lexicalEnvironment;
    this.thisBindings = thisBindings;
  }
}

module.exports = ExecutionContext;
