const Spirv = require('../index')(1, 1); // require spirv 1.1

const spirv = new Spirv()
  .nop()
  .undef(1, 2)
  .decorate(1, 'Binding', 3)
  .decorate(2, 'Binding', 2)
  .source("ESSL", 2, 0, 1)

console.log(spirv.code);
