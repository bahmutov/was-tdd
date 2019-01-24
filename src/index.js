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

const pluralize = require('pluralize')
const Listr = require('listr')
const banner = require('terminal-banner').terminalBanner
const shell = require('shelljs')
// exit with error on any error
shell.config.fatal = true

const wasTdd1 = ({ currentBranch, againstBranch }) => {
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

const findChangedFilesTask = (currentBranch, againstBranch) => (ctx, task) => {
  const { allChangedFiles, specChangedFiles } = findChangedFiles(
    currentBranch,
    againstBranch
  )
  ctx.allChangedFiles = allChangedFiles
  ctx.specChangedFiles = specChangedFiles
  task.title = `${pluralize(
    'changed spec file',
    specChangedFiles.length,
    true
  )} among ${pluralize('changed file', allChangedFiles.length, true)}`
}

const wasTdd = ({ currentBranch, againstBranch }) => {
  const tasks = new Listr([
    {
      title: 'Finding changed files',
      task: findChangedFilesTask(currentBranch, againstBranch)
    }
  ])

  return tasks.run()
}

module.exports = { wasTdd }
