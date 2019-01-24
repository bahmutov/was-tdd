// @ts-check

const {
  findChangedFiles,
  toBranch,
  makeBranch,
  checkoutFiles,
  runTests,
  gitResetHard
} = require('./utils')

const pluralize = require('pluralize')
const Listr = require('listr')

const findChangedFilesTask = (ctx, task) => {
  const { allChangedFiles, specChangedFiles } = findChangedFiles(
    ctx.currentBranch,
    ctx.againstBranch
  )
  ctx.allChangedFiles = allChangedFiles
  ctx.specChangedFiles = specChangedFiles
  task.title = `${pluralize(
    'changed spec file',
    specChangedFiles.length,
    true
  )} among ${pluralize('changed file', allChangedFiles.length, true)}`
}

const switchToTempBranchTask = (ctx, task) => {
  const randomBranchName = `test-${Math.random()
    .toString()
    .substr(2, 10)}`
  task.title = `was-tdd temp branch ${randomBranchName}`
  makeBranch(randomBranchName)
}

const runSpecsExpectFail = (ctx, task) => {
  checkoutFiles(ctx.currentBranch, ctx.specChangedFiles)
  return runTests(ctx.currentBranch, ctx.againstBranch, true)
}

const runSpecsExpectPass = (ctx, task) => {
  checkoutFiles(ctx.currentBranch, ctx.allChangedFiles)
  return runTests(ctx.currentBranch, ctx.againstBranch, false)
}

const wasTdd = ({ currentBranch, againstBranch }) => {
  const tasks = new Listr([
    {
      title: 'Finding changed files',
      task: findChangedFilesTask
    },
    {
      title: 'Switch to temp branch',
      task: switchToTempBranchTask
    },
    {
      title: 'Running just tests, expect to fail',
      task: runSpecsExpectFail
    },
    {
      title: 'Checking out all code, expect tests to pass',
      task: runSpecsExpectPass
    },
    {
      title: 'Code reset',
      task: ctx => {
        gitResetHard()
        toBranch(ctx.againstBranch)
      }
    }
  ])

  return tasks.run({ currentBranch, againstBranch })
}

module.exports = { wasTdd }
