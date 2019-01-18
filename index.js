

const cache = {};
const getVersion = (major = 1, minor = 0) => {
  const strVersion = `${major}.${minor}`
  if (cache[strVersion]) return cache[strVersion];

  const grammar = require(`./external/SPIRV-Headers/include/spirv/${strVersion}/spirv.core.grammar`);


  const kinds = {}

  grammar.operand_kinds.forEach(kind => {
    if (kind.enumerants) {  // only kinds with enumerants
      if (!kinds[kind.kind]) kinds[kind.kind] = {};

      kind.enumerants.forEach(enumerant => {
        kinds[kind.kind][enumerant.enumerant] = function(...args) {
          let argCount = 0;
          if (typeof enumerant.value === 'string') {
            // some string hex value
            throw new Error('TODO');
          } else {
            this.code.push(enumerant.value);
          }

          if (enumerant.parameters) {
            enumerant.parameters.forEach(parameter => {
              const arg = args[argCount++];
              if (arg === undefined || arg === null) throw new Error(`Missing operand value (argument #${argCount}), list of allowed values:\n${Object.keys(kinds[enumerant.kind]).join('\n')}`);

              if (kinds[enumerant.kind]) {
                toExecute = kinds[enumerant.kind][arg];
                if (!toExecute) throw new Error(`Unrecognized operand value - "${arg}" (argument #${argCount}). List of allowed values for ${kind.kind}.${enumerant.enumerant}:\n${Object.keys(kinds[enumerant.kind]).join('\n')}`);
                argCount += toExecute.apply(this, args.slice(argCount));
              } else if (typeof arg === 'number') {                
                this.code.push(arg);
              } else {
                throw new Error(`Unexpected operand value type - "${arg}" (argument #${argCount}), expected ${parameter.kind}`);
              }
            });
          }

          return argCount;
        }
      });
    }
  });


  const methods = {}

  grammar.instructions.forEach(instruction => {
    const methodName = instruction.opname[2].toLowerCase() + instruction.opname.substring(3);
    methods[methodName] = methods[instruction.opname] = // keep oroginal name too
      function(...args) {
        let argCount = 0;
        const instructionAddress = this.code.length;
        this.code.push(0); //reservation for instruction

        if (instruction.operands) {
          instruction.operands.forEach(operand => {
            const arg = args[argCount++];
            if (arg === undefined || arg === null) throw new Error(`Missing operand value (argument #${argCount}) in instruction ${instruction.opname}`);

            if (kinds[operand.kind]) {
              toExecute = kinds[operand.kind][arg];
              if (!toExecute) throw new Error(`Unrecognized operand value - "${arg}" (argument #${argCount}) in instruction ${instruction.opname}.\nList of allowed values: \n${Object.keys(kinds[operand.kind]).join('\n')}`);
              argCount += toExecute.apply(this, args.slice(argCount));
            } else if (typeof arg === 'number') {                
              this.code.push(arg);
            } else {
                throw new Error(`Unexpected operand value type - "${arg}" (argument #${argCount}) in instruction ${instruction.opname}, expected ${operand.kind}`);
            }

          });
        }

        this.code[instructionAddress] = instruction.opcode | (argCount + 1) << 16;
        return this;        
      }    
  })

  const ObjectConstructor = function() {
    this.code = [];
  }
  ObjectConstructor.prototype = methods;

  return ObjectConstructor;
}




module.exports = getVersion;