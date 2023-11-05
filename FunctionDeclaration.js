class FunctionDeclaration {
  static newInstance(fn, FormalParameterList, FunctionBody, Scope, strict) {
    let F = { name: fn };
    // 设定F的[[Class]]内部属性为Function
    F[`[[Class]]`] = 'Function';
    // 设定F的[[Prototype]]内部属性为内置Function对象的prototype属性
    F[`[[Prototype]]`] = Function.prototype;
    // 设定F的[[Scope]]内部属性为Scope的值
    F[`[[Scope]]`] = Scope;
    // 令names为一个列表容器，其中元素是以从左到右的文本顺序对应FormalParameterList的标识符的字符串
    let names = FormalParameterList.split(',');
    // 设定F的[[FormalParameters]]内部属性为names
    F[`[[FormalParameters]]`] = names;
    // 设定F的[[Code]]内部属性为FunctionBody
    F[`[[Code]]`] = FunctionBody;
    // 设定F的[[Extensible]]的内部属性为true
    F[`[[Extensible]]`] = true;
    // 函数的length属性就是形参的长度
    const len = names.length;
    Object.defineProperty(F, 'length', {
      value: len,
      writable: false,
      enumerable: false,
      configurable: false,
    });
    // 令proto为new Object
    let proto = new Object();
    // 定义构造器
    Object.defineProperty(proto, 'construction', {
      value: F,
      writable: true,
      enumerable: false,
      configurable: false,
    });
    // 定义F的原型
    Object.defineProperty(F, 'prototype', {
      value: proto,
      writable: true,
      enumerable: false,
      configurable: false,
    });
    return F;
  }
}

module.exports = FunctionDeclaration;
