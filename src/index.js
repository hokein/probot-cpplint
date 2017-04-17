const debug = require('debug')('index')
const cpplint = require('../src/cpplint-runner')
const patchParse = require('../src/patch-parser')

async function runCppLintOnFiles(files) {
  let comments = []
  for (let file of files) {
    const commit_id_pattern = /.+ref=(.+)/
    const content_url = file.contents_url
    const id = commit_id_pattern.exec(content_url)[1]
    const filename = file.filename
    const patch = file.patch
    const patches = patchParse(patch)
    debug(patches)
    if (patches.length == 0) continue
    const start_base_line = patches[0].start
    const lint_results = await cpplint(file);
    lint_results.map((lint_result) => {
      if (patches.find((patch) => {
        return lint_result.line >= patch.start && lint_result.line <= patch.end
      })) {
        comments.push({ path: filename, body: lint_result.message,
                        commit_id: id,
                        position: lint_result.line - start_base_line + 1})
      }
    })
  }
  debug('comments')
  debug(comments)
  return comments
}

module.exports = robot => {
  const pr_event_handler = async (event, context) => {
    // A PR was just opened/reopened.
    const github = await robot.auth(event.payload.installation.id)
    debug('recieve pull_request event...')
    debug(context.issue())
    const files = await github.pullRequests.getFiles(context.issue())
    debug(files)
    const review_comments = await runCppLintOnFiles(files)
    // TODO(hokein): Early integration doesn't support createReview API yet.
    // await github.pullRequests.createReview(context.issue({'event': 'COMMENT',
    // 'comments': review_comments}))
    for (let comment of review_comments) {
      await github.pullRequests.createComment(context.issue(comment))
    }
  }
  robot.on('pull_request.opened', pr_event_handler)
  robot.on('pull_request.reopened', pr_event_handler)
}
