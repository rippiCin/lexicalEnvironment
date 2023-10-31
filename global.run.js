
const ECStack = require('./ECStack');
const ExecutionContext = require('./ExecutionContext');
const LexicalEnvironment = require('./LexicalEnvironment');
// 当控制流进入一个执行环境时
// 会设置该执行环境的this绑定，定义变量环境和初始词法环境，并执行定义绑定初始化过程
let thisArg = global;
// 定义变量环境和初始词法环境，并执行定义绑定初始化过程
const globalLexicalEnvironment = new LexicalEnvironment();
const globalExecutionContext = new ExecutionContext(
  globalLexicalEnvironment,
  thisArg,
);