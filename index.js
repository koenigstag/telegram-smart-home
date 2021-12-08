
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

  let responseText = '';
  if (message.chat.id === 672406205 && /freeman .*/.test(message.text)) {
    const command = message.text.replace('freeman ', '')
    const result = shell.exec(command)
    const stderr = result.stderr
    const stdout = result.stdout
    responseText = '**Stdout:**\n' + stdout + '\n\n' +'**Stderr:**\n' + stderr
  }
  else {
  switch (message.text) {
    case 'battery-status': {
      //await clipboard.write('battery-status')
      const batStat = JSON.parse(shell.exec('termux-battery-status').stdout)
      responseText = `Percentage: ${batStat.percentage}. Status: ${batStat.status}`
      break
    }
    case 'get-ip': {
      const ip = await axios.get('https://api.ipify.org')
      //console.log(ip)
      responseText = ip.data
      break
    }
    case 'get-ip-lan': {
      const ip = shell.exec(`ifconfig wlan0 | grep -E "([0-9]{1,3}\.){3}[0-9]{1,3}" | grep -v 127.0.0.1 | awk '{ print $2 }' | cut -f2 -d: | head -n 1`).stdout
      console.log(ip)
      responseText = ip
      break
    }
    default: {
      responseText = 'Message received'
      break
    }
  }
  }

  //slimbot.sendMessage(message.chat.id, responseText, callback)

  slimbot.sendMessage(message.chat.id, responseText, {
    reply_markup: JSON.stringify({
      keyboard: [[
        {text: 'freeman echo Vibrate && termux-vibrate '},
        {text: 'freeman echo Notif sound && termux-media-player play ~/notif.mp3 '},
        {text: 'freeman echo TTS && termux-tts-speak "хихи хихи"'},

      ]]
    })
  })

  console.log('\nMsg handled..')
});

slimbot.startPolling(callback)
console.log('Started polling...')

setInterval(() => {}
, 2000)
