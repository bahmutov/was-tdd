// @ts-check

const banner = require('terminal-banner').terminalBanner
const shell = require('shelljs')
// exit with error on any error
shell.config.fatal = true

const gitStatus = () => shell.exec('git status')
const toBranch = name => shell.exec(`git checkout ${name}`)
const toPreviousBranch = () => shell.exec(`git checkout -`)

const parseChangedFiles = diffOutput => {
  const toFilename = line => line.substr(2).trim()
  const lines = diffOutput
    .split('\n')
    .filter(Boolean)
    .map(toFilename)
  return lines
}

const findChangedFiles = (branch, againstBranch) => {
  // toBranch(branch)

  const cmd = `git diff --name-status --diff-filter=ACMD ${branch}..${againstBranch}`
  const changedFilesExec = shell.exec(cmd, { silent: true }).stdout

  // console.log('changed files')
  // console.log(changedFilesExec)

  const parsedFiles = parseChangedFiles(changedFilesExec)
  // console.log('all changes files\n%s', parsedFiles.join('\n'))

  // todo: use simpler minimatch, probably pass from CLI
  const specFileRegex = /spec/
  const isSpecFilename = filename => specFileRegex.test(filename)
  const specFiles = parsedFiles.filter(isSpecFilename)
  // console.log('changed spec files\n%s', specFiles.join('\n'))

  // toPreviousBranch()

  return {
    allChangedFiles: parsedFiles,
    specChangedFiles: specFiles
  }
}

const makeBranch = name =>
  shell.exec(`git checkout -b ${name}`, { silent: true })

const checkoutFiles = (branchName, filenames) => {
  const cmd = `git checkout ${branchName} -- ${filenames.join(' ')}`
  shell.exec(cmd)
}

const runTests = (fromBranch, againstBranch, shouldFail) => {
  if (shouldFail) {
    shell.config.fatal = false
    const result = shell.exec('npm test')
    if (result.code) {
      console.log('✅ Great, the tests have failed as expected')
      shell.config.fatal = true
    } else {
      // TODO return Result
      toBranch(againstBranch)
      banner(
        `🔥 Tests from ${fromBranch} should have failed, but did not. Was NOT TDD 🔥`
      )
      process.exit(1)
    }
  } else {
    shell.exec('npm test')
  }
}

const gitResetHard = () => shell.exec('git reset --hard', { silent: true })

module.exports = {
  findChangedFiles,
  gitStatus,
  toBranch,
  toPreviousBranch,
  makeBranch,
  checkoutFiles,
  runTests,
  gitResetHard
}
