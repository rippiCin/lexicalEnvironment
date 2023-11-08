const DeclarativeEnvironmentRecords = require('./DeclarativeEnvironmentRecords');
const ObjectEnvironmentRecords = require('./ObjectEnvironmentRecords');
const Reference = require('./Reference');

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

  /**
   * 当调用GetIdentifierReference抽象运算时，需要制定一个词法环境lex，一个标识符字符串name以及一个布尔型标示strict。lex的值可为null
   * 1、如果lex的值为null，则返回一个类型为引用的对象，其基值为undefined，引用的名称为name，严格模式标示的值为strict
   * 2、令envRec为lex的环境数据
   * 3、以name为参数N，调用envRec的HasBinding(N)具体方法，并令exists为调用结果
   * 4、如果exists为true，则返回一个类型为引用的对象，其基值为envRec，引用的名称为name，严格模式标识的值为strict
   * 5、否则令outer为lex的外部环境引用，以outer、name和strict为参数，调用GetIdentifierReference，并返回调用的结果
   */
  static GetIdentifierReference(lex, name, strict) {
    if (!lex) {
      return new Reference(undefined, name, strict);
    } else {
      let envRev = lex.environmentRecords;
      let exists = envRev.HasBinding(name, strict);
      if (exists) {
        return new Reference(envRev, name, strict);
      } else {
        return LexicalEnvironment.GetIdentifierReference(lex.outer, name, strict);
      }
    }
  }
}

module.exports = LexicalEnvironment;
