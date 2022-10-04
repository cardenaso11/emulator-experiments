import * as L from 'monocle-ts/Lens';
import { increment, pipe } from 'fp-ts/lib/function';
import { assert, expect, test } from 'vitest';
import {decodeOpCode, OpCode, combine2Nibbles, combine3Nibbles, executeOpCode, CPU, Registers, frameBufferHeight, FrameBuffer, incrementPC, newCPU, newRegisters} from '../src/Interpreter';

test('decode opcode', () => {
  expect(decodeOpCode(0x00E0)).toStrictEqual({type: 'CLS'});
  expect(decodeOpCode(0x00EE)).toStrictEqual({type: 'RET'});
  expect(decodeOpCode(0x1987)).toStrictEqual({type: 'JP', addr: 0x987});
  
});

test('execute opcode', () => {
  const emptyRegs: Registers = newRegisters();
  //reminder: programs do not actually start at 0x0, they start at 0x200
  const emptyCPU: CPU = newCPU();
  const emptyFrameBuf: FrameBuffer = new BigUint64Array(frameBufferHeight);
  let nonEmptyFrameBuf: FrameBuffer = new BigUint64Array(frameBufferHeight);
  nonEmptyFrameBuf.set([0xFFFF_FFFF_FFFF_FFFF_FFFF_FFFF_FFFF_FFFFn]);


  const emptyCPUAfterInstr: CPU = incrementPC(emptyCPU);

  const emptyCPUNonemptyFramebuf: CPU = pipe(
    L.id<CPU>(), 
    L.prop('frameBuf'), 
    L.modify((x)=>x)
    )(emptyCPU);
  const cpuAfterCLS = executeOpCode({type:'CLS'}, emptyCPUNonemptyFramebuf);
  const regs_ : Registers = cpuAfterCLS.regs;
  console.log(`cpu after CLS: ${cpuAfterCLS.regs}`);
  console.log(`emptyCPUNonemptyFramebuf: ${emptyCPUNonemptyFramebuf.regs}`)
  console.log(`emptyCPU: ${emptyCPU.regs}`)
  console.log(`test1: ${emptyCPU.regs} test2: ${incrementPC(emptyCPU).regs}`)
  console.log(`reference: ${emptyCPUAfterInstr.regs}`)
  expect(cpuAfterCLS).toEqual(emptyCPUAfterInstr);

  //let emptyCPUAfterInstrWithStack = pipe(
  //  L.id<CPU>,
  //  L.prop('')
  //)(emptyCPU);

  //expect (executeOpCode({type:'RET'}, emptyCPU))
})

test('combine nibbles', () => {
  expect(combine2Nibbles([0x0,0x2])).toStrictEqual(0x02);
  expect(combine3Nibbles([0x9,0x8,0x7])).toStrictEqual(0x987);
});