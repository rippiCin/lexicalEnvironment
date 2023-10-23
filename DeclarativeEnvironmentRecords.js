const EnvironmentRecords = require('./EnvironmentRecords');
// 声明式环境记录项 用于定义那些将标识符与语言值直接绑定的ECMAScript语法元素，例如函数定义，变量定义以及catch语句
class DeclarativeEnvironmentRecords extends EnvironmentRecords {
  /**
   * 声明式环境记录项的HasBinding具体方法用于简单地判断作为参数的标识符是否是当前对象绑定的标识符之一；
   * 1、令envRec为函数调用时对应的声明式环境记录项。
   * 2、如果envRec有一个名称为N的绑定，返回true
   * 3、如果没有该绑定，返回false。
   */
  HasBinding(N) {
    const envRec = this;
    return N in encRec;
  }

  /**
   * 声明式环境记录项的CreateMutableBinding具体方法会创建一个名称为N的绑定，并初始化其值为undefined，方法调用时，当前环境记录项中不能
   * 存在N的绑定。如果调用时提供了布尔类型的参数D且其值为true，则新建的绑定被标记为可删除。
   * 1、令envRec为函数调用时对应的声明式环境记录项
   * 2、执行断言：envRec没有N的绑定
   * 3、在envRec中为N创建一个可变绑定，并将绑定的值设置为undefined，如果D为true则新创建的绑定可在后续操作中通过调用DeleteBinding删除
   */
  CreateMutableBinding(N, D) {
    const envRec = this;
    console.assert(!this.HasBinding(N), `当前记录中已经有${N}的绑定了`);
    Object.defineProperty(envRec, N, {
      value: undefined,
      writable: true,
      configurable: D, // 如果configurable为true，表示此属性可删除
      initialization: false,
    });
  }

  /**
   * 尝试将当前名称为参数N的绑定的值修改为参数V指定的值
   * 方法调用时，必须存在N的绑定，如果该绑定为不可变绑定，并且S的值为true，则抛出一个TypeError异常。
   * 1、令envRec为函数调用时对应的声明式环境记录项
   * 2、执行断言：envRec必须有N的绑定
   * 3、如果envRec中N的绑定为可变绑定，将其值修改为V
   * 否则该才做会尝试修改一个不可变绑定的值，因此如果S的值为true，则抛出一个TypeError异常。
   * s：是否为严格模式
   */
  SetMutableBinding(N, V, S) {
    const envRec = this;
    console.assert(this.HasBinding(N), `当前环境中尚未定义${N}这个变量`);
    const propertyDescriptor = Object.getOwnPropertyDescriptor(envRec, N);
    if (S && !propertyDescriptor.writable) {
      throw new Error('TypeError 给一个不可变的属性赋值');
    }
    envRev[N] = V;
    propertyDescriptor.initialization = true;
  }

  /**
   * 简单地返回名称为参数N的绑定的值
   * 方法调用时，该绑定必须存在。如果S的值为true且该绑定是一个未初始化的不可变绑定，则抛出一个ReferenceError异常
   * 1、令envRec为函数调用时的对应的声明式环境记录项
   * 2、执行断言：envRec必须有N的绑定
   * 3、如果envRec中N的绑定是一个未初始化的不可变绑定，则如果S为false返回undefined，否则抛出一个ReferenceError异常。否则返回envRec中与N绑定的值
   */
  GetBindingValue(N, S) {
    const envRec = this;
    console.assert(this.HasBinding(N), `当前环境中尚未定义${N}这个变量`);
    const propertyDescriptor = Object.getOwnPropertyDescriptor(envRec, N);
    if (!propertyDescriptor.initialization) {
      if (S) {
        throw new Error('ReferenceError');
      } else {
        return undefined;
      }
    }
    return envRec[N];
  }

  /**
   * 只能删除显示指定可被删除的那些绑定
   * 1、令envRec为函数调用时对用的声明式环境记录项
   * 2、如果envRec不包含名称为N的绑定，返回true
   * 3、如果envRec中N的绑定不能删除，返回false
   * 4、移除envRec中N的绑定
   * 5、返回true
   */
  DeleteBinding(N) {
    const envRec = this;
    if (!this.HasBinding(N)) return true;
    const propertyDescriptor = Object.getOwnPropertyDescriptor(envRec, N);
    if (!propertyDescriptor.configurable) return false;
    delete envRec[N];
    return true;
  }

  /**
   * 声明式环境记录项永远将undefined作为其ImplicitThisValue返回
   * 1、返回undefined
   */
  ImplicitThisValue() {
    return undefined;
  }

  /**
   * 创建一个不可变绑定，其名称为N且初始化其值为undefined，调用方法时，该环境记录项中不得存在N的绑定。
   * 1、令envRec为函数调用时对应的声明式环境记录项
   * 2、执行断言：envRec不存在N的绑定
   * 3、在envRec中为N创建一个不可变绑定，并记录为未初始化
   */
  CreateImmutableBinding(N) {
    const envRec = this;
    console.assert(!this.HasBinding(N), `当前记录中已经有${N}的绑定了`);
    Object.defineProperty(envRec, N, {
      value: undefined,
      writable: false,
      initialization: false,
    });
  }

  /**
   * 将当前名称为参数N的绑定的值修改为参数V指定的值。
   * 方法调用时，必须存在N对应的未初始化的不可变绑定。
   * 1、令envRec为函数调用时对应的声明式环境记录项
   * 2、执行断言：envRec存在一个与N对应的未初始化的不可变绑定。
   * 3、在envRec中将N的绑定的值设置为V
   * 4、在envRec中将N的不可变绑定记录为已初始化。
   */
  InitializeImmutableBinding(N, V) {
    const envRec = this;
    console.assert(this.HasBinding(N), `当前环境中尚未定义${N}这个变量`);
    envRec[N] = V;
    const propertyDescriptor = Object.getOwnPropertyDescriptor(envRec, N);
    propertyDescriptor.initialization = true;
  }
}

module.exports = DeclarativeEnvironmentRecords;
