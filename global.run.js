
const ECStack = require('./ECStack');
const ExecutionContext = require('./ExecutionContext');
const LexicalEnvironment = require('./LexicalEnvironment');
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

// 1、令env为当前运行的执行环境的环境变量的环境记录
const env = ECStack.current.LexicalEnvironment.environmentRecords;
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

console.log(env.HasBinding(dn));
console.log(env.GetBindingValue(dn));