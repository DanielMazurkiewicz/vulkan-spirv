//const json = require('./external/SPIRV-Headers/include/spirv/1.2/spirv');
//const jsonCore = require('./external/SPIRV-Headers/include/spirv/1.2/spirv.core.grammar');

//jsonCore.instructions.forEach(i => console.log(i.opname));


function SpirvConstructor({major, minor} = {major: 1, minor: 0}) {
  const me = this;
  const grammar = require(`./external/SPIRV-Headers/include/spirv/${major}.${minor}/spirv.core.grammar`);
  const code = [];

  const operandKinds = {}

  grammar.operand_kinds.forEach(opKind => {
    if (opKind.enumerants) {  
      if (!operandKinds[opKind.category]) operandKinds[opKind.category] = {};
      if (!operandKinds[opKind.category][opKind.kind]) operandKinds[opKind.category][opKind.kind] = {};
      if (opKind.category === "BitEnum") {
        // TODO: figure out bit enumerants
      } else {
        opKind.enumerants.forEach(enumerant => {
          operandKinds[opKind.category][opKind.kind][enumerant.enumerant] = enumerant.value
        });
      }
    }
  });

  console.log(operandKinds);


  grammar.instructions.forEach(instruction => {
    me[instruction.opname[2].toLowerCase() + instruction.opname.substring(3)] =
           me[instruction.opname] = 

      function() {


        if (instruction.operands) {
          let error = '';
          
          for (let i = 0; i < instruction.operands.length; i++) {
            if (arguments[i] === undefined || arguments[i] === null) {
              error += `Missing operand ${i} of ${instruction.opname}\n`
            }
          }

          if (error) throw new Error(error);
        }

        code.push(instruction.opcode);
        return me;
      }
  })

  this.getCode = () => code; // todo return U32 array
}



const spirv = (new SpirvConstructor()).
  nop().
  undef(1, 1)

console.log(spirv.getCode());

module.exports = SpirvConstructor;