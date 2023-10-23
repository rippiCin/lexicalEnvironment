const EnvironmentRecords = require('./EnvironmentRecords');   
// 对象式环境记录项 用于定义那些将标识符与具体对象的属性绑定的ECMAScript元素，例如程序以及with表达式。
// 对象式环境记录项直接将一系列标识符与其绑定对象的属性名称建议一一对应关系
// 也就是说对象的属性就是我们记录的标识符
class ObjectEnvironmentRecords extends EnvironmentRecords {
  /**
   * Description
   * @param {any} bindingObject 全局的话就global with的话就是传给with的那个对象
   */
  constructor(bindingObject) {
    super();
    this.bindingObject = bindingObject;
    this.provideThis = false;
  }

  /**
   * 判断其关联的绑定对象是否有名为N的属性
   * 1、令envRec为函数调用时对应的声明式环境记录项
   * 2、令binding为envRec的绑定对象
   * 3、以N为属性名，调用bindings的[[HasProperty]]内部方法，并返回调用的结果
   */
  HasBinding(N) {
    const envRec = this;
    const bindings = envRec.bindingObject;
    return Object.hasOwnProperty(bindings, N);
  }

  /**
   * 会在其关联的绑定对象上创建一个名称为N的属性，并初始化其值为undefined。调用方法时，绑定对象不得包含名称为N的属性。如果调用方法时提供了
   * 布尔类型的参数D且其值为true，则设置新创建的属性的[[configurable]]特性的值为true，否则设置为false
   * 1、令envRec为函数调用时对应的声明式环境记录项
   * 2、令bindings为envRec的绑定对象
   * 3、执行断言：以N为属性名，调用bindings的[[HasProperty]]内部方法，调用的结果为false。
   * 4、如果D的值为true，则令configValue的值为true，否则令configValue的值为false
   * 5、以N、属性描述符{
   *   value: undefined,
   *   writable: true,
   *   enumerable: true,
   *   configurable: configValue
   * }和布尔值true为参数，调用bindings的DefineOwnProperty内部方法。
   */
  CreateMutableBinding(N, D) {
    const envRec = this;
    const bindings = envRec.bindingObject;
    console.assert(!this.HasBinding(N), `此环境记录项中不能有${N}绑定`);
    Object.defineProperty(bindings, N, {
      value: undefined,
      writable: true,
      enumerable: true,
      configurable: D
    });
  }

  /**
   * 尝试设置其关联的绑定对象中名为N的属性的值为V，方法调用时，绑定对象中应当存在该属性，如果该属性不存在或属性不可写，则根据S参数的值来执行错误处理
   * 1、令envRec为函数调用时对应的声明式环境记录项
   * 2、令bindings为envRec的绑定对象
   * 3、以N、V和S为参数，调用bindings的put内部方法
   */
  SetMutableBinding(N, V, S) {
    const envRec = this;
    const bindings = envRec.bindingObject;
    const propertyDescriptor = Object.getOwnPropertyDescriptor(envRec, N);
    if (S && !propertyDescriptor.writable) {
      throw new Error('typeError，不能给只读属性赋值');
    }
    binding[N] = V;
  }

  /**
   * 返回其关联的绑定对象中名为N的属性的值。
   * 方法调用时，绑定对象中应当存在该属性，如果该属性不存在，则方法的返回值由S参数决定。
   * 1、令envRec为函数调用时对应的声明式环境记录项
   * 2、令bindings为envRec的绑定对象
   * 3、以N为属性名，调用bindings的hasProperty的内部方法，并令value为调用的结果。
   * 4、如果value的值为false，则：
   * 如果S的值为false，则返回undefined，否则抛出一个ReferenceError异常。
   * 5、以N为参数，调用bindings的get内部方法，并返回调用的结果。
   * 
   */
  GetBindingValue(N, S) {
    const envRec = this;
    const bindings = envRec.bindingObject;
    let value = this.HasBinding(N);
    if (!value) {
      if (!S) {
        return undefined;
      } else {
        throw new Error('ReferenceError');
      }
    }
    return bindings[N];
  }

  /**
   * 只能用于删除其关联的绑定对象上，configurable特性的值为true的属性所对应的绑定。
   * 1、令envRec为函数调用时对应的声明式环境记录项
   * 2、令bindings为envRec的绑定对象
   * 3、以N和布尔值false为参数，调用bindings的delete内部方法
   */
  DeleteBinding(N) {
    const envRec = this;
    const bindings = envRec.bindingObject;
    const propertyDescriptor = Object.hasOwnPropertyDescriptor(envRec, N);
    if (!propertyDescriptor.configurable) return false;
    delete bindings[N];
    return true;
  }

  /**
   * 通常返回undefined，除非其provideThis标识的值为true。
   * 1、令envRec为函数调用时对应的声明式环境记录项
   * 2、如果envRec的provideThis标识的值为true，返回envRec的绑定对象。
   * 3、否则返回undefined
   */
  ImplicitThisValue() {
    let envRec = this;
    const bindings = envRec.bindingObject;
    if (this.provideThis) {
      return bindings;
    } else {
      return undefined;
    }
  }
}

module.exports = ObjectEnvironmentRecords;
