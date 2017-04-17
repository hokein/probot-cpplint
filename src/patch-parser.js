const debug = require('debug')('patch-parser')

module.exports = patch_diff => {
  const re = /^@@ -[0-9,]+ \+(\d+)(,(\d+))?/
  const lines = patch_diff.split('\n')
  let result = []
  for (let line of patch_diff.split('\n')) {
    const matches = re.exec(line)
    debug(matches)
    if (matches) {
      start_line = parseInt(matches[1])
      line_count = 1
      if (matches[3]) {
        line_count = parseInt(matches[3])
        result.push({start: start_line, end: start_line + line_count - 1})
      }
    }
  }
  debug(result)
  return result
}
