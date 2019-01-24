#!/usr/bin/env node

// @ts-check
// const ggit = require('ggit')
const shell = require('shelljs')
// exit with error on any error
shell.config.fatal = true

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git')
  shell.exit(1)
}

const currentBranch = 'fix-add'
const againstBranch = 'master'

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

// toBranch(againstBranch)
