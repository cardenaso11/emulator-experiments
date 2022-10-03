import { assert, expect, test } from 'vitest'
import {decodeOpCode, OpCode} from '../src/Interpreter'

test('decode opcode', () => {
  expect(decodeOpCode(0x00E0)).toStrictEqual({type: "CLS"});
})
