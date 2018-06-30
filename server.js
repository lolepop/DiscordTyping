// have fun reading my code

var express = require('express');
var p = require("promise");
var sleep = require("sleep-async")().Promise;
var envVar = require("dotenv").config();
var app = express();


app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/public/gaye.html');
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});



// Discord shit down here

var discord = require("discord.js");
var client = new discord.Client();

const reaction = [["🇱", "🇲", "🅰", "🅾"],
                  ["❌", "🇽", "🇩"],
                 ["🇪", "🅰", "🇹", "🇦", "🇸", "🇿"],
                 ["🆗", "🆒"],
                 ["🇸", "🇹", "🅾", "🅿"],
                 ["🍆", "💦", "😩", "🍴", "💯"]];


async function meme(msg)
{
  if (msg.author != client.user)
  {
    var reactNum = Math.floor(Math.random() * reaction.length);
    for (var i=0; i<reaction[reactNum].length; i++)
    {
      await msg.react(reaction[reactNum][i]).catch(console.error);
    }
  }
}

client.on("ready", () => {
  console.log("Bot connected");
});

client.on("message", async msg => {
	if (msg.content.toLowerCase() == "!ping") {
		msg.channel.send("pong " + client.ping + "ms\n\nSent by " + msg.author);
	}
  
  if (msg.content.toLowerCase() == "!me") { //too lazy to make a thing for the prefixes
		msg.channel.send("```" + msg.author + "```");
	}
  
  await meme(msg); //rate limit hell
});

/* global Map */

var blacklist = new Map();
const cooldown = 1000*5 //seconds till bot sends message can send message to user with that is typing (prevent flooding and shit from the bad api)

async function updateBlacklist(channel, user)
{
	const what = new Date().getTime();
	var flag = false;
  for (var [us, timestamp] of blacklist.entries())
  {
	console.log(us.username + " " + timestamp);
    if (what >= timestamp)
    {
      blacklist.delete(us);
	  console.log(us.username + " deleted");
    }
    else if (us==user)
    {
      flag = true;
    }
  }
  return flag;
}

client.on("typingStart", async (channel, user) => {
  var flag = await updateBlacklist(channel, user);
  
  sleep.sleep(300).then(async () => {
  while (user.typingIn(channel))
  { 
    if (flag)
      return;
  
	if (!blacklist.has(user))
	{
		await blacklist.set(user, new Date().getTime() + cooldown)
		await channel.send("Were you typing something, " + user + "?");
		console.log("sending to " + user.username);
	}
		await sleep.sleep(cooldown).then(()=>updateBlacklist(channel, user));
  }});
  
}); //hmm

client.login(process.env.BOTID);