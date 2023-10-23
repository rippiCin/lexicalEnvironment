// 词法环境
class LexicalEnvironment {
  /**
   * Description
   * @param {any} environmentRecords 当前此法环境对应的环境记录项
   * @param {any} outer 外部此法环境
   */
  constructor(environmentRecords, outer) {
    this.LexicalEnvironment = environmentRecords;
    this.outer = outer;
  }
}

module.exports = LexicalEnvironment;
