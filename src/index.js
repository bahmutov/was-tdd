// @ts-check

const {
  findChangedFiles,
  toBranch,
  gitStatus,
  makeBranch,
  checkoutFiles,
  runTests,
  gitResetHard
} = require('./utils')

const banner = require('terminal-banner').terminalBanner
const shell = require('shelljs')
// exit with error on any error
shell.config.fatal = true

const wasTdd = ({ currentBranch, againstBranch }) => {
  banner('Finding changed files')
  const { allChangedFiles, specChangedFiles } = findChangedFiles(
    currentBranch,
    againstBranch
  )

  const randomBranchName = `test-${Math.random()
    .toString()
    .substr(2, 10)}`
  banner(`was-tdd temp branch ${randomBranchName}`)
  makeBranch(randomBranchName)

  checkoutFiles(currentBranch, specChangedFiles)
  gitStatus()
  banner('Running just tests - they should fail')
  runTests(currentBranch, againstBranch, true)

  checkoutFiles(currentBranch, allChangedFiles)
  gitStatus()
  banner('Running tests with changed code - should pass')
  runTests(currentBranch, againstBranch, false)

  gitResetHard()
  toBranch(againstBranch)

  console.log('✅ there are failing tests')
  console.log('✅ new code fixes the failing tests')
  banner('WAS TDD')
}

module.exports = { wasTdd }
