const assert = require('assert')
const cppLint = require('../src/cpplint-runner')
const debug = require('debug')

it('should run cpplint', async () => {
  const file = { filename: 'test/data/main.cc',
                 contents_url: 'https://api.github.com/repos/hokein/probot-cpplint-test/contents/main.cc?ref=a77eef300b16fa4888b1e15b77b62b9e990580da' }
  const results = await cppLint(file)
  assert.equal(results.length, 5)
});
