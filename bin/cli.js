#!/usr/bin/env node

// @ts-check

const arg = require('arg')
const { wasTdd } = require('../src')
const shell = require('shelljs')

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

wasTdd({ currentBranch, againstBranch })
