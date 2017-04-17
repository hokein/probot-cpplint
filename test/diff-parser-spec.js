const assert = require('assert')
const patchParse = require('../src/patch-parser')

it('should parse one-line patch diff', () => {
	const result = patchParse('@@ -104,3 +104,9 @@ abcd')
	assert.deepEqual([{start: 104, end: 112}], result)
})

it('should parse multiple-lines patch diff', () => {
  const result = patchParse(
    '@@ -179,6 +179,12 @@ abc\n@@ -256,6 +271,13 cde\n@@ -286,7 +299,8 dafd')
  assert.deepEqual(
    [{start: 179, end: 190}, {start: 271, end: 283}, {start: 299, end: 306}],
    result)
})
