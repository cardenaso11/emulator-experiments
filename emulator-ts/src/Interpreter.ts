import { match, P} from 'ts-pattern'

export type UInt4 = number; // 4 bit uint, unenforced
export type UInt8 = number; // 8 bit uint, unenforced
export type UInt12 = number; // 8 bit uint, unenforced
export type UInt16 = number; // 16 bit uint, unenforced
export type Memory = UInt8[][]; // not enforced for now
export type FrameBuffer = UInt8[][]; // 64 x 32
//TODO: change to Uint8Array

type Hz = number;

export class Registers {
  regI: UInt16;
  regST: UInt8;
  regDT: UInt8;
  regSP: UInt8;
  regPC: UInt16;
  constructor( regI: UInt16
             , regST: UInt8
             , regDT: UInt8
             , regSP: UInt8
             , regPC: UInt16) {
    this.regI = regI;
    this.regST = regST;
    this.regDT = regDT;
    this.regSP = regSP;
    this.regPC = regPC;
  }
}

export type CPU = {
  type: "CPU";
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
  | { type: "LD_f"; vx: Vx} // I = address of sprite for digit/char stored in Vx
  | { type: "LD_bcd"; vx: Vx} // turn Vx into decimal, put hundreds digit at [I], tens at [I+1], ones at [I]
  | { type: "LD_save"; vx: Vx} // save registers V0 thru Vx, starting at [I]
  | { type: "LD_recall"; vx: Vx} // recall registers V0 thru Vx, starting at [I]
  // this does not include Super Chip-48 opcodes

export function fromMaybe<T>(def: T, x?: T): T {
  if (x === undefined) { return def; } else { return x; }
}

export function split16BitBy4 (encoded: UInt16): UInt4[] {
  const firstNibble: UInt4 = (encoded & 0xF000) >> 12;
  const secondNibble: UInt4 = (encoded & 0x0F00) >> 8;
  const thirdNibble: UInt4 = (encoded & 0x00F0) >> 4;
  const fourthNibble: UInt4 = (encoded & 0x000F) >> 0;
  return [firstNibble, secondNibble, thirdNibble, fourthNibble];
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

export function decodeOpCode(encoded: UInt16): OpCode | undefined {
  
  return match(split16BitBy4(encoded))
    .with([0x0, 0x0, 0xE, 0x0], ()          => <OpCode>{type: 'CLS'})
    .with([0x0, 0x0, 0xE, 0xE], ()          => <OpCode>{type: 'RET'})
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
    .with([0xF, P._, 0x2, 0x9], ([,x    ]) => <OpCode>{type: 'LD_f', vx: x.toString()})
    .with([0xF, P._, 0x3, 0x3], ([,x    ]) => <OpCode>{type: 'LD_bcd', vx: x.toString()})
    .with([0xF, P._, 0x5, 0x5], ([,x    ]) => <OpCode>{type: 'LD_save', vx: x.toString()})
    .with([0xF, P._, 0x6, 0x5], ([,x    ]) => <OpCode>{type: 'LD_recall', vx: x.toString()})
    .otherwise(()=>undefined)
};
// not sure how good javascript immutability performance is, this is likely to need a second draft
export function executeOpCode(op: OpCode, cpu: CPU): CPU {
    return match(op)
      .with({type: 'CLS'}, () => <CPU>{...cpu, frameBuf: [[]]})
      .otherwise(()=>cpu) //TODO: make this explicitly partial instead of just a nop
}