const debug = require('debug')('cpplint-runner')
const proc = require('child_process')
const path = require('path')
const request = require('request')
const CPPLINT = path.resolve(__dirname, '../cpplint/cpplint.py')

function runCppLint(code) {
  return new Promise((resolve, reject) => {
    cpplint_process = proc.execFile(CPPLINT, ['-'], (err, stdout, stderr) => {
      resolve(stderr)
    })
    cpplint_process.stdin.write(code)
    cpplint_process.stdin.end()
  })
}

function fetchFileContent(content_url) {
  return new Promise((resolve, reject) => {
    request({url: content_url,
             headers: {'User-Agent': 'probot-lint'}}, (err, res, body) => {
      if (err) reject(err)
      resolve(body)
    })
  })
}

module.exports = (file) => {
  return new Promise(async (resolve, reject) => {
    const url = file.contents_url;
    const filename = file.filename;
    debug('fetch file: ' + filename)
    const file_content = await fetchFileContent(url)
    const json_body = JSON.parse(file_content)
    const buf = Buffer.from(json_body.content, 'base64')
    const lint_reports = await runCppLint(buf.toString())
    debug(lint_reports)
    const lint_report_pattern = /-:(\d+): {2}(.*)/
    let result = []
    for (let report of lint_reports.split('\n')) {
      const matches = lint_report_pattern.exec(report)
      if (matches) {
        line = parseInt(matches[1]) + 1 // 1-based line count
        message = matches[2]
        result.push({line, message})
      }
    }
    debug('cpplint results: ')
    debug(result)
    resolve(result)
  })
}
