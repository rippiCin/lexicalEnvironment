const DeclarativeEnvironmentRecords = require('./DeclarativeEnvironmentRecords');
const ObjectEnvironmentRecords = require('./ObjectEnvironmentRecords');

// 词法环境
class LexicalEnvironment {
  /**
   * Description
   * @param {any} environmentRecords 当前此法环境对应的环境记录项
   * @param {any} outer 外部此法环境
   */
  // constructor(environmentRecords, outer) {
  //   this.LexicalEnvironment = environmentRecords;
  //   this.outer = outer;
  // }

  /**
   * 根据现在的词法环境创建一个子词法环境
   * 当调用NewDeclarativeEnvironment抽象运算时，需指定一个词法环境E，其值可以为null，此时按一下步骤进行
   * 1、令env为一个新建的词法环境
   * 2、令envRec为一个新建的声明式环境数据，该环境数据不包含任何绑定
   * 3、令env的环境数据为envRec
   * 4、令env的外部词法环境引用至E
   * 5、返回env
   */
  static NewDeclarativeEnvironment(E) {
    let env = new LexicalEnvironment();
    const envRec = new DeclarativeEnvironmentRecords();
    env.environmentRecords = envRec;
    env.outer = E;
    return env;
  }

  /**
   * 当调用NewObjectEnvironment抽象运算时，需指定一个对象O及一个词法环境E（其值可为null）
   * 1、令env为一个新建的词法环境
   * 2、令envRec为一个新建的对象环境数据，该环境数据包含O作为绑定对象
   * 3、令env的环境数据为envRec
   * 4、令env的外部词法环境引用至E
   * 5、返回env
   */
  static NewObjectEnvironment(O, E) {
    let env = new LexicalEnvironment();
    const envRec = new ObjectEnvironmentRecords(O);
    env.environmentRecords = envRec;
    env.outer = E;
    return env;
  }
}

module.exports = LexicalEnvironment;
