import { assert, expect, test } from 'vitest'
import {decodeOpCode, OpCode, combine2Nibbles, combine3Nibbles} from '../src/Interpreter'

test('decode opcode', () => {
  expect(decodeOpCode(0x00E0)).toStrictEqual({type: 'CLS'});
  expect(decodeOpCode(0x00EE)).toStrictEqual({type: 'RET'});
  expect(decodeOpCode(0x1987)).toStrictEqual({type: 'JP', addr: 0x987});
  
  expect(combine2Nibbles([0x0,0x2])).toStrictEqual(0x02);
  expect(combine3Nibbles([0x9,0x8,0x7])).toStrictEqual(0x987);
})
