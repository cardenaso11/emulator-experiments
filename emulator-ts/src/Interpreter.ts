import { match, P} from 'ts-pattern'
import { Lens } from 'monocle-ts';
import * as L from 'monocle-ts/Lens';
import { constant, identity, increment, pipe, } from 'fp-ts/lib/function';
import { randomInt } from 'fp-ts/lib/Random';

export type UInt4 = number; // 4 bit uint, unenforced
export type UInt8 = number; // 8 bit uint, unenforced
export type UInt12 = number; // 8 bit uint, unenforced
export type UInt16 = number; // 16 bit uint, unenforced
export type Memory = Uint8Array; //unenforced, 4KB
export type FrameBuffer = BigUint64Array; // 64 x 32, so each uint64 represents a whole row
export const memoryLength = 0xFFF
export const frameBufferHeight = 32;

type Hz = number;

export const newMemory: () => Memory = () => new Uint8Array(memoryLength);


export function newRegisters
  ( i: UInt16 = 0
  , st: UInt8 = 0
  , dt: UInt8 = 0
  , sp: UInt8 = 0 // for now SP will be a memory ptr, but itd be worht it to make stack separate from memory
  , pc: UInt16 = 0x200
  , V0: UInt8 = 0
  , V1: UInt8 = 0
  , V2: UInt8 = 0
  , V3: UInt8 = 0
  , V4: UInt8 = 0
  , V5: UInt8 = 0
  , V6: UInt8 = 0
  , V7: UInt8 = 0
  , V8: UInt8 = 0
  , V9: UInt8 = 0
  , VA: UInt8 = 0
  , VB: UInt8 = 0
  , VC: UInt8 = 0
  , VD: UInt8 = 0
  , VE: UInt8 = 0
  , VF: UInt8 = 0
  ): Registers{
    return { i, st, dt, sp, pc, V0, V1, V2, V3, V4, V5, V6, V7, V8, V9,
             VA, VB, VC, VD, VE, VF};
};

export type Registers = {
    [key in Vx]: UInt8;
} & {
    i: UInt16;
    st: UInt8;
    dt: UInt8;
    sp: UInt8;
    pc: UInt16;
};

export function newCPU
    ( regs: Registers = newRegisters()
    , mem: Memory = new Uint8Array(memoryLength)
    , frameBuf: FrameBuffer = new BigUint64Array(frameBufferHeight)): CPU {
  return {regs, mem, frameBuf};
}

export type CPU = {
  regs: Registers;
  mem: Memory;
  frameBuf: FrameBuffer;
}

export type Vx = // V0 - VF
  | "V0"
  | "V1"
  | "V2"
  | "V3"
  | "V4"
  | "V5"
  | "V6"
  | "V7"
  | "V8"
  | "V9"
  | "VA"
  | "VB"
  | "VC"
  | "VD"
  | "VE"
  | "VF"

// TODO: use Uint8Array instead
// wow typescript is even less expressive than i thought

export type OpCode =
  | { type: "SYS"; addr: UInt12} //jump to host addr, unused
  | { type: "CLS";} // clear display
  | { type: "RET";} // pop SP into PC & return
  | { type: "JP"; addr: UInt12} // PC=addr
  | { type: "CALL"; addr: UInt12} // bump SP, stack[SP]=PC, PC=addr
  | { type: "SE_b"; vx: Vx; byte: UInt8} //PC+=2 if Vx = byte
  | { type: "SNE_b"; vx: Vx; byte: UInt8} // PC+=2 if Vx /= byte
  | { type: "SE"; vx: Vx; vy: Vx}//PC+=2 if Vx = Vy
  | { type: "LD_b"; vx: Vx; byte: UInt8}// Vx = byte
  | { type: "ADD_b"; vx: Vx; byte: UInt8}// Vx += byte
  | { type: "LD"; vx: Vx; vy: Vx} // Vx = Vy
  | { type: "OR"; vx: Vx; vy: Vx} // Vx = Vx | Vy
  | { type: "AND"; vx: Vx; vy: Vx} // Vx = Vx & Vy
  | { type: "XOR"; vx: Vx; vy: Vx} // Vx = Vx ^ Vy
  | { type: "ADD"; vx: Vx; vy: Vx}// Vx += Vy. VF=carry
  | { type: "SUB"; vx: Vx; vy: Vx}// Vx -= Vy. VF=!(borrow)
  | { type: "SHR"; vx: Vx; vy?: Vx} // shiftr Vx by 1, ignore Vy. VF= dropped bit
  | { type: "SUBN"; vx: Vx; vy: Vx} // Vx -= Vy. VF=!(borrow)
  | { type: "SHL"; vx: Vx; vy?: Vx} // shiftl Vx by 1, ignore Vy. VF= dropped bit
  | { type: "SNE"; vx: Vx; vy: Vx} // PC+=2 if Vx /= Vy
  | { type: "LD_i"; addr: UInt12} // I = addr
  | { type: "JP_v0"; addr: UInt12} // PC = addr + v0
  | { type: "RND"; vx: Vx; byte: UInt8} // Vx = (random byte) & (byte)
  | { type: "DRW"; vx: Vx; vy: Vx; nibble: UInt4}
  | { type: "SKP"; vx: Vx} // PC += 2 if key with value of Vx is depressed
  | { type: "SKNP"; vx: Vx} // PC += 2 if key with value of Vx is NOT depressed
  | { type: "LD_vx_dt"; vx: Vx} // Vx = dt
  | { type: "LD_k"; vx: Vx} // block until key press, then store it in Vx
  | { type: "LD_dt_vx"; vx: Vx} // dt = Vx
  | { type: "LD_st_vx"; vx: Vx} // st = Vx
  | { type: "ADD_i_vx"; vx: Vx} // I += Vx
  | { type: "LD_sprite"; vx: Vx} // I = address of sprite for digit/char stored in Vx
  | { type: "LD_bcd"; vx: Vx} // turn Vx into decimal, put hundreds digit at [I], tens at [I+1], ones at [I]
  | { type: "LD_save"; vx: Vx} // save registers V0 thru Vx, starting at [I]
  | { type: "LD_recall"; vx: Vx} // recall registers V0 thru Vx, starting at [I]
  // this does not include Super Chip-48 opcodes

export function fromMaybe<T>(def: T, x?: T): T {
  if (x === undefined) { return def; } else { return x; }
};

export function fromJust<T>(x?: T): T {
  return x!;
}

export function split16BitBy4 (encoded: UInt16): UInt4[] {
  const firstNibble: UInt4 = (encoded & 0xF000) >> 12;
  const secondNibble: UInt4 = (encoded & 0x0F00) >> 8;
  const thirdNibble: UInt4 = (encoded & 0x00F0) >> 4;
  const fourthNibble: UInt4 = (encoded & 0x000F) >> 0;
  return [firstNibble, secondNibble, thirdNibble, fourthNibble];
}

export function split16BitBy2 (encoded: UInt16): UInt8[] {
  const firstByte: UInt8 =  (encoded & 0xFF00) >> 8;
  const secondByte: UInt8 = (encoded & 0x00FF) >> 0;
  return [firstByte, secondByte];
}
//TODO: figure out if i can write a generic version of combineNNibbles
//TODO: javascript number semantics are making me really nervous,
// investigate alternatives. If theres no good fixed point ts libraries,
// then i guess BigInt is probably supported anywhere webassembly is?
export function combine4Nibbles (nibbles: [UInt4, UInt4, UInt4, UInt4]): UInt16 {
  return nibbles[0] << 12 | nibbles[1] << 8 | nibbles[2] << 4 | nibbles[3] << 0;
}

export function combine3Nibbles (nibbles: [UInt4, UInt4, UInt4]): UInt12 {
  return nibbles[0] << 8 | nibbles[1] << 4 | nibbles[2] << 0;
}
export function combine2Nibbles (nibbles: [UInt4, UInt4]): UInt8 {
  return nibbles[0] << 4 | nibbles[1] << 0;
}

export const combine2Bytes: (bytes: [UInt8, UInt8]) => UInt16 = (bytes) =>
  (bytes[0] << 8) | (bytes[1] << 0);

export function decodeOpCode(encoded: UInt16): OpCode | undefined {
  
  return match(split16BitBy4(encoded))
    .with([0x0, 0x0, 0xE, 0x0], ()         => <OpCode>{type: 'CLS'})
    .with([0x0, 0x0, 0xE, 0xE], ()         => <OpCode>{type: 'RET'})
    .with([0x0, P._, P._, P._], ([,a,b,c]) => <OpCode>{type: 'SYS'  , addr: combine3Nibbles([a,b,c])}) // unused instruction
    .with([0x1, P._, P._, P._], ([,a,b,c]) => <OpCode>{type: 'JP'   , addr: combine3Nibbles([a,b,c])})
    .with([0x2, P._, P._, P._], ([,a,b,c]) => <OpCode>{type: 'CALL' , addr: combine3Nibbles([a,b,c])})
    .with([0x3, P._, P._, P._], ([,x,b,c]) => <OpCode>{type: 'SE_b' , vx: x.toString() , byte: combine2Nibbles([b,c])})
    .with([0x4, P._, P._, P._], ([,x,b,c]) => <OpCode>{type: 'SNE_b', vx: x.toString() , byte: combine2Nibbles([b,c])})
    .with([0x5, P._, P._, 0x0], ([,x,  y]) => <OpCode>{type: 'SE'   , vx: x.toString() , vy: y.toString()})
    .with([0x6, P._, P._, P._], ([,x,b,c]) => <OpCode>{type: 'LD_b' , vx: x.toString() , byte: combine2Nibbles([b,c])})
    .with([0x7, P._, P._, P._], ([,x,b,c]) => <OpCode>{type: 'ADD_b', vx: x.toString() , byte: combine2Nibbles([b,c])})
    .with([0x8, P._, P._, 0x0], ([,x,  y]) => <OpCode>{type: 'LD'   , vx: x.toString() , vy: y.toString()})
    .with([0x8, P._, P._, 0x1], ([,x,  y]) => <OpCode>{type: 'OR'   , vx: x.toString() , vy: y.toString()})
    .with([0x8, P._, P._, 0x2], ([,x,  y]) => <OpCode>{type: 'AND'  , vx: x.toString() , vy: y.toString()})
    .with([0x8, P._, P._, 0x3], ([,x,  y]) => <OpCode>{type: 'XOR'  , vx: x.toString() , vy: y.toString()})
    .with([0x8, P._, P._, 0x4], ([,x,  y]) => <OpCode>{type: 'ADD'  , vx: x.toString() , vy: y.toString()})
    .with([0x8, P._, P._, 0x5], ([,x,  y]) => <OpCode>{type: 'SUB'  , vx: x.toString() , vy: y.toString()})
    .with([0x8, P._, P._, 0x6], ([,x,  y]) => <OpCode>{type: 'SHR'  , vx: x.toString() , vy: y.toString()}) // vy is ignored
    .with([0x8, P._, P._, 0x7], ([,x,  y]) => <OpCode>{type: 'SUBN' , vx: x.toString() , vy: y.toString()})
    .with([0x8, P._, P._, 0xE], ([,x,  y]) => <OpCode>{type: 'SHL'  , vx: x.toString() , vy: y.toString()}) // vy is ignored
    .with([0x9, P._, P._, 0x0], ([,x,  y]) => <OpCode>{type: 'SNE'  , vx: x.toString() , vy: y.toString()})
    .with([0xA, P._, P._, P._], ([,a,b,c]) => <OpCode>{type: 'LD_i' , addr: combine3Nibbles([a,b,c])})
    .with([0xB, P._, P._, P._], ([,a,b,c]) => <OpCode>{type: 'JP_v0', addr: combine3Nibbles([a,b,c])})
    .with([0xC, P._, P._, P._], ([,x,b,c]) => <OpCode>{type: 'RND'  , vx: x.toString() , byte: combine2Nibbles([b,c])})
    .with([0xD, P._, P._, P._], ([,x,y,c]) => <OpCode>{type: 'DRW'  , vx: x.toString() , vy: y.toString(), nibble: c})
    .with([0xE, P._, 0x9, 0xE], ([,x    ]) => <OpCode>{type: 'SKP'  , vx: x.toString()})
    .with([0xE, P._, 0xA, 0x1], ([,x    ]) => <OpCode>{type: 'SKNP' , vx: x.toString()})
    .with([0xF, P._, 0x0, 0x7], ([,x    ]) => <OpCode>{type: 'LD_vx_dt', vx: x.toString()})
    .with([0xF, P._, 0x1, 0x5], ([,x    ]) => <OpCode>{type: 'LD_dt_vx', vx: x.toString()})
    .with([0xF, P._, 0x1, 0x8], ([,x    ]) => <OpCode>{type: 'LD_st_vx', vx: x.toString()})
    .with([0xF, P._, 0x1, 0xE], ([,x    ]) => <OpCode>{type: 'ADD_i_vx', vx: x.toString()})
    .with([0xF, P._, 0x2, 0x9], ([,x    ]) => <OpCode>{type: 'LD_sprite', vx: x.toString()})
    .with([0xF, P._, 0x3, 0x3], ([,x    ]) => <OpCode>{type: 'LD_bcd', vx: x.toString()})
    .with([0xF, P._, 0x5, 0x5], ([,x    ]) => <OpCode>{type: 'LD_save', vx: x.toString()})
    .with([0xF, P._, 0x6, 0x5], ([,x    ]) => <OpCode>{type: 'LD_recall', vx: x.toString()})
    .otherwise(()=>undefined)
};

//TODO: would be cool to make these generic, but typescript's type system is giving me trouble
// maybe try ArrayLike instead? 
//export function copyAndSet<T, S extends RelativeIndexable<T>>(array: S, val: [T], loc: number): S {
//  new S()
//};
export function write8(loc: number, vals: UInt8[], array: Uint8Array): Uint8Array {
  let newMem = newMemory();
  newMem.set(vals, loc);
  return newMem;
};

export function copyAndSet64(loc: number, vals: bigint[], array: BigUint64Array) : BigUint64Array {
  let newArray = new BigUint64Array(array);
  newArray.set(vals, loc);
  return newArray;
};

export function getPC(cpu: CPU): Registers['pc'] {
  return Lens.fromPath<CPU>()(['regs', 'pc']).get(cpu);
};

export const incrementPC : (cpu: CPU) => CPU =
  Lens.fromPath<CPU>()(['regs', 'pc']).modify((pc)=>pc+2);
    //return pipe(
    //L.id<CPU>(),
    //L.prop('regs'),
    //L.prop('pc'),
    //L.modify((pc)=>pc+2)
    //)(s);

export const incrementSP: (cpu: CPU) => CPU =
    Lens.fromPath<CPU>()(['regs', 'sp']).modify(
      (sp) => sp+2);
export const decrementSP: (cpu: CPU) => CPU =
    Lens.fromPath<CPU>()(['regs', 'sp']).modify(
      (sp) => sp-2);
// TODO: change 2 to 1
// the spec officially says to increment SP by 1
// however pointers are 12bit = 2bytes wide
// so i think longterm solution is stack gets its own separate memory
// in the meantime however it'll just be a pointer into memory, to make things simpler
export function regL<R extends keyof Registers>(reg: R): Lens<CPU, Registers[R]> {
  return Lens.fromPath<CPU>()(['regs', reg]);
}
//export const regLens : (reg: keyof Registers) => Lens<CPU, Registers[typeof reg]> = (reg) => Lens.fromProp<CPU>()('regs').compose(Lens.fromProp<CPU>()(reg))
//export function regLens(reg: keyof Registers): Lens<CPU, Registers[typeof reg]> {
//  return undefined;
//}

export const read8bit: (addr: UInt8) => (cpu: CPU) => UInt8 = (addr) => (cpu) =>
  cpu.mem.at(addr)!;

export const read16bit: (addr: UInt16) => (cpu: CPU) => UInt16 = (addr) => (cpu) =>
  combine2Bytes([cpu.mem.at(addr)!, cpu.mem.at(addr)!]);

export const write16bit: (addr: UInt16) => (val: UInt16) => (cpu: CPU) => CPU = (addr)=>(val)=>(cpu)=> {
  const newMem = new Uint8Array(cpu.mem);
  newMem.set(split16BitBy2(val), addr);

  return Lens.fromProp<CPU>()('mem').set(newMem)(cpu);
}

export const push16: (val: UInt16) => (cpu: CPU) => CPU = (val) =>(cpu)=>
  pipe( cpu
      , Lens.fromProp<CPU>()('mem').modify( (mem) =>
          write8(cpu.regs.sp, split16BitBy2(val), mem))
      , incrementSP
      );

export const pop16: (cpu: CPU) => [CPU, UInt16] = (cpu)=>
  [ decrementSP(cpu)
  , combine2Bytes( [ cpu.mem.at(cpu.regs.sp)!
                 , cpu.mem.at(cpu.regs.sp+1)! ]) // we dont clear stack for perf
  ]

export const jump: (addr: UInt12) => (cpu: CPU) => CPU = (addr) => (cpu) =>
  Lens.fromPath<CPU>()(['regs', 'pc']).modify(()=>addr)(cpu);

export const call: (addr: UInt12) => (cpu: CPU) => CPU = (addr) => (cpu) =>
  pipe (cpu, push16(addr), incrementSP);

export const ret: (cpu: CPU) => CPU = (cpu) => {
  const [newCpu, spAddr] = pop16(cpu);
  return jump(spAddr)(newCpu);
}
export const clearFramebuf: (cpu: CPU) => CPU =
  Lens.fromProp<CPU>()('frameBuf').modify( (frameBuf) =>
    copyAndSet64(0, [0x0n], frameBuf)
  );

// not sure how good javascript immutability performance is, this is likely to need a second draft
export function executeOpCode(op: OpCode, cpu: CPU): CPU {
    return match(op)
      .with({type: 'SYS'}  , ()           => pipe(cpu, identity)) //unimplemented in modern implementations
      .with({type: 'CLS'}  , ()           => pipe(cpu, clearFramebuf, incrementPC))
      .with({type: 'RET'}  , ()           => pipe(cpu, ret))
      .with({type: 'JP'}   , ({addr})     => pipe(cpu, jump(addr)))
      .with({type: 'CALL'} , ({addr})     => pipe(cpu, call(addr)))
      .with({type: 'SE_b'} , ({vx, byte}) => pipe(cpu,
        match(cpu.regs[vx] === byte)
          .with(true, () => incrementPC)
          .with(false, () => identity)
          .exhaustive()
        ))
      .with({type: 'SNE_b'} , ({vx, byte}) => pipe(cpu,
        match(cpu.regs[vx] !== byte)
          .with(true, () => incrementPC)
          .with(false, () => identity)
          .exhaustive()
        ))
      .with({type: 'SE'}  , ({vx, vy})      => pipe(cpu,
        match(cpu.regs[vx] === cpu.regs[vy])
          .with(true, () => incrementPC)
          .with(false, () => identity)
          .exhaustive()
        ))
      .with({type: 'LD_b'}, ({vx, byte})    => pipe(cpu, regL(vx).set(byte), incrementPC))
      .with({type: 'ADD_b'}, ({vx, byte})   => pipe(cpu, regL(vx).modify((r)=>r+ byte), incrementPC))
      //TODO: IMPORTANT: clamp to 8bits
      //TODO: IMPORTANT: handle overflow
      .with({type: 'LD'}, ({vx, vy})        => pipe(cpu, regL(vx).set(regL(vy).get(cpu)), incrementPC))
      .with({type: 'OR'}, ({vx, vy})        => pipe(cpu, regL(vx).modify((r)=>r | regL(vy).get(cpu)), incrementPC))
      .with({type: 'AND'}, ({vx, vy})       => pipe(cpu, regL(vx).modify((r)=>r & regL(vy).get(cpu)), incrementPC))
      .with({type: 'XOR'}, ({vx, vy})       => pipe(cpu, regL(vx).modify((r)=>r ^ regL(vy).get(cpu)), incrementPC))
      .with({type: 'ADD'}, ({vx, vy})       => pipe(cpu, regL(vx).modify((r)=>r + regL(vy).get(cpu)), incrementPC))
      //TODO: IMPORTANT: clamp to 8bits
      //TODO: IMPORTANT: handle overflow
      .with({type: 'SUB'}, ({vx, vy})       => pipe(cpu, regL(vx).modify((r)=>r - regL(vy).get(cpu)), incrementPC))
      //TODO: IMPORTANT: handle overflow
      //TODO: IMPORTANT: clamp to 8bits
      .with({type: 'SHR'}, ({vx, })         => pipe(cpu, regL(vx).modify((r)=>r >> 1), incrementPC))
      //TODO: IMPORTANT: clamp to 8bits
      .with({type: 'SUBN'}, ({vx, vy})      => pipe(cpu, regL(vx).modify((r)=>r - regL(vy).get(cpu)), incrementPC))
      //TODO: IMPORTANT: clamp to 8bits
      //TODO: IMPORTANT: handle overflow
      .with({type: 'SHL'}, ({vx, })         => pipe(cpu, regL(vx).modify((r)=>r << 1), incrementPC))
      //TODO: IMPORTANT: clamp to 8bits
      .with({type: 'SNE'}  , ({vx, vy})      => pipe(cpu,
        match(cpu.regs[vx] !== cpu.regs[vy])
          .with(true, () => incrementPC)
          .with(false, () => identity)
          .exhaustive()
        ))
      .with({type: 'LD_i'}, ({addr})        => pipe(cpu, regL('i').set(addr), incrementPC))
      .with({type: 'JP_v0'}   , ({addr})     => pipe(cpu, jump(addr+regL('V0').get(cpu))))
      .with({type: 'RND'} , ({vx, byte})     => pipe(cpu, regL(vx).set(randomInt(0, 0xFFFF)() & byte)))
      .with({type: 'DRW'}, ({vx, vy, nibble})=> pipe(cpu, identity))
      //TODO: IMPORTANT: drawing unimplemented
      .with({type: 'SKP'}, ({vx})=> pipe(cpu, identity))
      //TODO: IMPORTANAT: keyboard unimplemented
      .with({type: 'SKNP'}, ({vx})=> pipe(cpu, identity))
      //TODO: IMPORTANAT: keyboard unimplemented
      .with({type: 'LD_vx_dt'}, ({vx})        => pipe(cpu, regL(vx).set(regL('dt').get(cpu)), incrementPC))
      .with({type: 'LD_k'}, ({vx})=> pipe(cpu, identity))
      //TODO: IMPORTANAT: keyboard unimplemented
      .with({type: 'LD_dt_vx'}, ({vx})        => pipe(cpu, regL('dt').set(regL(vx).get(cpu)), incrementPC))
      .with({type: 'LD_st_vx'}, ({vx})        => pipe(cpu, regL('st').set(regL(vx).get(cpu)), incrementPC))
      .with({type: 'ADD_i_vx'}, ({vx})       => pipe(cpu, regL('i').modify((i)=>i + regL(vx).get(cpu)), incrementPC))
      //TODO: IMPORTANT: handle overflow
      //TODO: IMPORTANT: clamp to 8bits
      .with({type: 'LD_sprite'}, ({vx})=> pipe(cpu, identity))
      //TODO: IMPORTANT: drawing unimplemented
      .with({type: 'LD_bcd'}, ({vx}) => pipe(cpu, identity))
      //TODO: unimplemented
      .with({type: 'LD_save'}, ({vx}) => pipe(cpu, identity))
      //TODO: unimplemented
      .with({type: 'LD_recall'}, ({vx}) => pipe(cpu, identity))
      //TODO: unimplemented

      .otherwise(constant(cpu)) //TODO: make this explicitly partial instead of just a nop
}