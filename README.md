# vulkan-spirv
Package that makes working with SPIR-V code much easier


Example usage:
```javascript
 const Spirv = require('vulkan-spirv')(1, 0) // require version 1.0

const spirv = (new Spirv())
  .nop()
  .undef(1, 2)
  .decorate(1, 'Binding', 3)
  .decorate(2, 'Binding', 2)
  .source("ESSL", 2, 0, 1)

console.log(spirv.code);
```

#Still a lot of things on a TODO list, but gives some impresion how will it work