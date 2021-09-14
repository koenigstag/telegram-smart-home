
const Slimbot = require('slimbot');
const axios = require('axios')
const shell = require('shelljs')
const clipboard = require('clipboardy')

const slimbot = new Slimbot(process.env['TELEGRAM_BOT_TOKEN']);

function callback(err, obj) {
  if (err) {
    // handle error
    console.log(err);
  }
  // handle returned object
  console.log(obj);
};

slimbot.on('message', async message => {
  console.log(`New msg - ${message.text}\nHandling...\n`)

  if (/freeman .*/.test(message.text)) {
    if (message.chat.id !== 672406205) {
      console.log(message)
      console.log('\nMsg not handled..')
      return
    }
    const command = message.text.replace('freeman ', '')
    const result = shell.exec(command)
    const stderr = result.stderr
    const stdout = result.stdout
    slimbot.sendMessage(message.chat.id, 'Stdout:\n' + stdout + "\n\n" +"Stderr:\n" + stderr)
  }
  else {
  switch (message.text) {
    case 'battery-status': {
      //await clipboard.write('battery-status')
      const batStat = JSON.parse(shell.exec('termux-battery-status').stdout)
      slimbot.sendMessage(message.chat.id, `Percentage: ${batStat.percentage}. Status: ${batStat.status}`)
      break
    }
    case 'get-ip': {
      const ip = await axios.get('https://api.ipify.org')
      //console.log(ip)
      slimbot.sendMessage(message.chat.id, ip.data)
      break
    }
    case 'get-ip-lan': {
      const ip = shell.exec(`ifconfig wlan0 | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n 1`).stdout
      console.log(ip)
      slimbot.sendMessage(message.chat.id, ip)
      break
    }
    default: {
      slimbot.sendMessage(
        message.chat.id,
       'Message received',
       callback
      );
      break
    }
  }
  }

  console.log('\nMsg handled..')
});

slimbot.startPolling(callback)
console.log('Started polling...')

setInterval(() => {}
, 2000)
