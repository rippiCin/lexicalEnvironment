const EnvironmentRecords = require("./EnvironmentRecords");

class Reference {
  constructor(base, name, strict) {
    this.base = base;
    this.name = name;
    this.strict = strict;
  }

  static GetBase(V) {
    return V.base;
  }

  static GetReferencedName(V) {
    return V.name;
  }

  static IsStrictReference(V) {
    return V.strict;
  }

  // 如果基值是Bool，String，Number，那么返回true
  static HasPrimitiveBase(V) {
    return V.base.toString() === '[Object Boolean]'
    || V.base.toString() === '[Object String]'
    || V.base.toString() === '[Object Number]'
  }

  // 如果基值是个对象或HasPrimitiveBase(V)是true，那么返回true，否则返回false
  static IsPropertyReference(V) {
    return (typeof V.base === 'object' && (!(V.base instanceof EnvironmentRecords))) || Reference.HasPrimitiveBase(V);
  }

  // 如果基值是undefined就返回true，否则返回false
  static IsUnresolvableReference(V) {
    return typeof V.base === undefined;
  }

  static GetValue(V) {
    // 如果V不是引用，返回V
    if (!(V instanceof Reference)) return V;
    // 令base为调用GetBase(V)的返回值
    let base = Reference.GetBase(V);
    // 如果IsUnresolvableReference(V)，抛出一个 ReferenceError异常
    if (Reference.IsUnresolvableReference(V)) throw new Error('ReferenceError');
    if (Reference.IsPropertyReference(V)) {
      if (!Reference.HasPrimitiveBase(V)) {
        let name = Reference.GetReferencedName(V);
        return base[name];
      } else {
        // TODO
      }
    } else if (base instanceof EnvironmentRecords) {
      return base.GetBindingValue(Reference.GetReferencedName(V), Reference.IsStrictReference(V));
    }
  }
}

module.exports = Reference;
