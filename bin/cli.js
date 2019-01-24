#!/usr/bin/env node

// @ts-check

const arg = require('arg')
const {
  findChangedFiles,
  toBranch,
  gitStatus,
  makeBranch,
  checkoutFiles,
  runTests,
  gitResetHard
} = require('../src/utils')
const banner = require('terminal-banner').terminalBanner
const shell = require('shelljs')
// exit with error on any error
shell.config.fatal = true

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git')
  shell.exit(1)
}

const args = arg({
  '--branch': String,
  '--against': String,

  // aliases
  '-b': '--branch',
  '-a': '--against',
  '--current': '--branch',
  '--parent': '--against'
})

const currentBranch = args['--branch']
const againstBranch = args['--against']

if (!currentBranch) {
  console.error('⚠️ missing branch to check, use --branch <name> argument')
  process.exit(1)
}
if (!againstBranch) {
  console.error('⚠️ missing parent branch, use --against <name> argument')
  process.exit(1)
}

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
