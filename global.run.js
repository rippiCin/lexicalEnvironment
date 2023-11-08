
const ECStack = require('./ECStack');
const ExecutionContext = require('./ExecutionContext');
const LexicalEnvironment = require('./LexicalEnvironment');
const FunctionDeclaration = require('./FunctionDeclaration');
const CreateArgumentsObject = require('./CreateArgumentsObject');
const Reference = require('./Reference');
// 当控制流进入一个执行环境时
// 会设置该执行环境的this绑定，定义变量环境和初始词法环境，并执行定义绑定初始化过程
let thisArg = global;
// 定义变量环境和初始词法环境，并执行定义绑定初始化过程
const globalLexicalEnvironment = LexicalEnvironment.NewObjectEnvironment(global, null);
const globalEC = new ExecutionContext(
  globalLexicalEnvironment,
  thisArg,
);
// 全局执行上下文入栈
ECStack.push(globalEC);
// 准备执行代码，进行全局代码前的准备工作，注册全局变量
// 每个执行环境都有一个关联的变量环境。
// 当在一个执行环境下评估一段ECMA脚本时，变量和函数定义会以绑定的形式添加到这个变量环境的环境记录中。
// 对于函数 函数代码，参数也同样会以绑定的形式添加到这个变量环境的环境记录中。

// 选择使用哪一个、哪一类型的 环境记录 来绑定定义，是由执行环境下执行的ECMA脚本的类型决定的
// 而其他部分的逻辑是相同的。
// 而当进入一个执行环境时，会按一下步骤在变量环境上创建绑定
// 其中使用到调用者提供的代码设为code，如果执行的是函数代码，则设参数列表为args：arg=[3]

// 变量的初始化
// 1、令env为当前运行的执行环境的环境变量的环境记录
let env = ECStack.current.LexicalEnvironment.environmentRecords;
// 2、如果code是eval代码，则令configurableBindings为true，否则令configurableBindings为false
let configurableBindings = false;
// 3、如果代码是严格模式下的代码，则令strict为true否则为false
let strict = false;
// 4、按源码顺序遍历code，对于每一个VariableDeclaration：
//    4.1、令dn为d中的标识符。
//    4.2、以dn为参数，调用env的HasBinding具体方法，并令varAlreadyDeclared为调用的结果。
//    4.3、如果varAlreadyDeclared为false，则。
//         4.3.1、以dn和configurableBindings为参数，调用env的CreateMutableBinding具体方法。
//         4.3.1、以dn、undefined和strict为参数，调用env的SetMutableBinding具体方法。
let dn = 'a';
// 判断当前的环境记录中有没有定义过a这个变量
let varAlreadyDeclared = env.HasBinding(dn);
if (!varAlreadyDeclared) {
  // 先添加一个绑定 a
  env.CreateMutableBinding(dn, configurableBindings);
  // 给a赋值undefined
  env.SetMutableBinding(dn, undefined, strict);
}

// 函数的初始化
// 按照源码顺序遍历code，对于每一个FunctionDeclaration表达式f：
// 1、令fn为FunctionDeclaration表达式f中的标识符。
const fn = 'one';
// 2、初始化FunctionDeclaration表达式，并令fo为初始化的结果。
// 2.1、指定FormalParameterList为可选参数列表
let FormalParameterList = 'c';
// 2.2、指定FunctionBody为函数体，指定Scope为词法环境，strict为布尔标记。
let FunctionBody = `
  var b = 2;
  console.log(a, b, c);
`;
// 当前的词法环境会成为函数的作用域
let scope = ECStack.current.LexicalEnvironment;
strict = false;
let fo = FunctionDeclaration.newInstance(fn, FormalParameterList, FunctionBody, scope, strict);
varAlreadyDeclared = env.HasBinding(fn);
if (!varAlreadyDeclared) {
  // 先添加一个绑定 one
  env.CreateMutableBinding(fn, configurableBindings);
} else {
  // 如果env是全局环境的环境记录对象
  // 令go为全局对象
  let go = global;
  // 以fn为参数，调用go的获取属性的内部方法，并令existingProp为调用结果
  let existingProp = Object.getOwnPropertyDescriptor(go, fn);
  // 如果existingProp.configurable为true
  if (existingProp.configurable) {
    Object.defineProperty(go, fn, {
      value: undefined,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } else if (IsAccessorDescriptor(existingProp) || !existingProp.writable) {
    throw new Error('TypeError');
  }
}
env.SetMutableBinding(fn, fo, strict);
// console.log(env.GetBindingValue('one'));
// 以上，绑定阶段结束
// 开始从上到下执行代码

// a = 1;
env.SetMutableBinding('a', 1);

let F = fo;
// 执行one(3);
// 当控制流根据一个函数对象F、调用者提供的thisArg以及调用者提供的argumentList，进入函数代码的执行环境时，执行以下步骤；
// 1、如果函数代码是严格模式下的代码， 设this绑定为thisArg
// 2、否则如果thisArg是null或者undefined，则设this绑定为全局对象
thisArg = global;
// 3、否则如果Type(thisArg)的结果不为Object，则设this绑定为ToObject(thisArg)
// if (Type(thisArg) !== 'object') {
//   // 如果thisArg不是一个对象，就转成一个对象
//   thisArg = ToObject(thisArg);
// }
// 4、否则设this绑定为thisArg
// 5、以F的[[Scope]]内部属性为参数调用NewDeclarativeEnvironment，并令localEnv为调用的结果
// 函数执行是创建的词法环境的outer为函数定义时的Scope
let localEnv = LexicalEnvironment.NewDeclarativeEnvironment(F[`[[Scope]]`]);
// 6、设词法环境为localEnv
// 7、设变量环境为localEnv
let oneEC = new ExecutionContext(localEnv, thisArg);
ECStack.push(oneEC);
// 再次获取当前的环境记录（one词法环境的环境记录项）
env = ECStack.current.LexicalEnvironment.environmentRecords;
// 8、令code为F的[[Code]]内部属性的值
let code = F[`[[Code]]`];
dn = 'b';
// 判断当前的环境记录中有没有定义过a这个变量
varAlreadyDeclared = env.HasBinding(dn);
if (!varAlreadyDeclared) {
  // 先添加一个绑定 a
  env.CreateMutableBinding(dn, configurableBindings);
  // 给a赋值undefined
  env.SetMutableBinding(dn, undefined, strict);
}
// 9、使用函数代码code和argumentList执行定义绑定初始化步骤
// 如果代码为函数代码，则：
// 9.1、令func为通过[[Call]]内部属性初始化code的执行的函数对象，令names为func的[[FormalParameters]]内部属性
let func = F;
let names = func[`[[FormalParameters]]`];
let args = [3];
// 9.2、令argCount为args中元素数量
let argCount = args.length;
// 9.3、令n为数字类型，其值为0
let n = 0;
// 9.4、安列表顺序遍历names，对于每一个字符串argName：
// 9.4.1、令n的值为n当前值加1
// 9.4.2、如果n大于argCount，则令v为undefined，否则令v为args中的第n个元素
// 9.4.3、以argName为参数，调用env的HasBinding具体方法，并令argAlreadyDeclared为调用的结果
// 9.4.4、如果ArgAlreadyDeclared的值为false，以argName为参数调用env的CreateMutableBinding具体方法
// 9.4.5、以argName、v和strict为参数，调用env的SetMutableBinding具体方法
names.forEach((argName) => {
  n += 1;
  let v = n > argCount ? undefined : args[n - 1];
  let ArgAlreadyDeclared = env.HasBinding(argName);
  if (!ArgAlreadyDeclared) {
    env.CreateMutableBinding(argName);
  }
  env.SetMutableBinding(argName, v, strict);
});
// 以arguments为参数，调用env的HasBinding具体方法，并令argumentsAlreadyDeclared为调用结果
let argumentsAlreadyDeclared = env.HasBinding('arguments');
if (!argumentsAlreadyDeclared) {
  // 以fn、names、args、env和strict为参数，调用CreateArgumentsObject抽象运算函数，并令argsObj为调用结果
  let argsObj = CreateArgumentsObject(fn, names, args, env, strict);
  // 如果strict为true
  // 以字符串arguments为参数，调用env的CreateImmutableBinding具体方法
  // 以字符串arguments和argsObj为参数，调用env的InitializeImmutableBinding具体函数
  if (strict) {
    env.CreateMutableBinding('argument');
    env.InitializeImmutableBinding('arguments', argsObj);
  } else {
    // 否则：
    // 以字符串arguments为参数，调用env的CreateMutableBinding具体方法
    // 以字符串arguments、argsObj和false为参数，调用env的SetMutableBinding具体函数
    env.CreateMutableBinding('argument');
    env.SetMutableBinding('argument', argsObj);
  }
}
// 以上函数代码执行前的准备工作结束
env.SetMutableBinding('b', 2);
let referenceA = LexicalEnvironment.GetIdentifierReference(ECStack.current.LexicalEnvironment, 'a', strict);
let referenceB = LexicalEnvironment.GetIdentifierReference(ECStack.current.LexicalEnvironment, 'b', strict);
let referenceC = LexicalEnvironment.GetIdentifierReference(ECStack.current.LexicalEnvironment, 'c', strict);
console.log(
  Reference.GetValue(referenceA),
  Reference.GetValue(referenceB),
  Reference.GetValue(referenceC),
);