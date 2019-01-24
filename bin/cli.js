#!/usr/bin/env node

// @ts-check

const shell = require('shelljs')
// exit with error on any error
shell.config.fatal = true

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git')
  shell.exit(1)
}

const currentBranch = 'fix-add'
const againstBranch = 'master'

const gitStatus = () => shell.exec('git status')
const toBranch = name => shell.exec(`git checkout ${name}`)
const toPreviousBranch = () => shell.exec(`git checkout -`)

const findChangedFiles = (branch, againstBranch) => {
  toBranch(branch)

  const cmd = `git diff --name-status --diff-filter=ACMD ${againstBranch}`
  const changedFilesExec = shell.exec(cmd, { silent: true }).stdout
  console.log('changed files')
  console.log(changedFilesExec)

  const parsedFiles = parseChangedFiles(changedFilesExec)
  console.log('all changes files\n%s', parsedFiles.join('\n'))

  // todo: use simpler minimatch
  const specFileRegex = /spec/
  const isSpecFilename = filename => specFileRegex.test(filename)
  const specFiles = parsedFiles.filter(isSpecFilename)
  console.log('changed spec files\n%s', specFiles.join('\n'))

  toPreviousBranch()

  return {
    allChangedFiles: parsedFiles,
    specChangedFiles: specFiles
  }
}

const parseChangedFiles = diffOutput => {
  const toFilename = line => line.substr(2).trim()
  const lines = diffOutput
    .split('\n')
    .filter(Boolean)
    .map(toFilename)
  return lines
}

const gitResetHard = () => shell.exec('git reset --hard', { silent: true })

const { allChangedFiles, specChangedFiles } = findChangedFiles(
  currentBranch,
  againstBranch
)

const makeBranch = name =>
  shell.exec(`git checkout -b ${name}`, { silent: true })

const checkoutFiles = (branchName, filenames) => {
  const cmd = `git checkout ${branchName} -- ${filenames.join(' ')}`
  shell.exec(cmd)
}

const runTests = shouldFail => {
  if (shouldFail) {
    shell.config.fatal = false
    const result = shell.exec('npm test')
    if (result.code) {
      console.log('✅ Great, the tests have failed as expected')
      shell.config.fatal = true
    } else {
      throw new Error('Tests should have failed, but did not')
    }
  } else {
    shell.exec('npm test')
  }
}

const randomBranchName = `test-${Math.random()
  .toString()
  .substr(2, 10)}`
console.log('was-tdd temp branch %s', randomBranchName)
makeBranch(randomBranchName)

checkoutFiles(currentBranch, specChangedFiles)
gitStatus()
runTests(true)

checkoutFiles(currentBranch, allChangedFiles)
gitStatus()
runTests()

gitResetHard()
toPreviousBranch()

console.log('✅ there are failing tests')
console.log('✅ new code fixes the failing tests')
console.log('WAS TDD')
