#!/usr/bin/env node

const meow = require('meow')
const updateNotifier = require('update-notifier')
const axios = require('axios')
const { bold, red } = require('chalk')
const ora = require('ora')
const profile = require('./profile')

const cli = meow(`
  Usage:
      $ aboutme <username>     Show username and social network information

  Options:
      -h, --help            Show help options
      -v, --version         Show version
`, {
    flags: {
      help: {
        alias: 'h'
      },
      version: {
        alias: 'v'
      }
    }
  }
)

updateNotifier({ pkg: cli.pkg }).notify()

const run = async (cli) => {
  const input = cli.input[0]
  if(!input) {
    return console.log(cli.showHelp())
  }

  const spinner = ora(`Verifying ${bold(input)} in GitHub`)
  spinner.start()

  try {
    const data = await profile(input)
    const find = data.files.find(item => item.description.match(/about/))

    spinner.stop()

    if (!find) {
      return console.log(`[!] username not have a info`)
    }

    let hasFile
    hasFile = Object.keys(find.files).find(item => item.match(/about/))

    if (!hasFile) {
      if (Object.keys(find.files).length <= 0) {
        return console.log('[!] dont have a file credencials')
      }
      hasFile = Object.keys(find.files)[0]
    }

    const { data: result } = await axios.get(find.files[hasFile].raw_url)
    const payload = {
      ...result
    }

    console.log(`
    ${bold('name')}: ${data.name}
    ${bold('location')}: ${data.location}
    ${bold('bio')}: ${data.bio}
    ${bold('social')}:`)

    for (obj in payload) {
      console.log(`       ${bold(obj)}: ${payload[obj]}`)
    }
  } catch (error) {
    spinner.stop()
    console.log(error)
    if (error.response.status == 403) {
      return console.log(`  [${bold('!')}] ${red(error.response.data.message)}`)
    }
    return console.log(error.response)
  }

}

run(cli)
