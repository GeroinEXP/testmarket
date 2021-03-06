/**
 * Created by orel- on 15/May/17.
 */

const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const { catchAsync } = require('../utils');

const router = express.Router();

//const CLIENT_ID = process.env.CLIENT_ID;
//const CLIENT_SECRET = process.env.CLIENT_SECRET;

const GUILD_ID = "626104995225403403";
const BOT_TOKEN = "NjI2MDc0Mjk2NzA3NDQ4ODQ0.XZaAfw.247XxspME_tvnm_IBEBVeMFV_78";
const CLIENT_ID = "626074296707448844";
const CLIENT_SECRET = "OrPA_cuwkcqcW-PXCYDGzv7tyzUMjvQq";
const redirect = encodeURIComponent('http://ec2-35-180-111-238.eu-west-3.compute.amazonaws.com:50451/api/discord/callback');
router.get('/login', (req, res) => {
	console.log("Connecting to Discord authorize... ");
  res.redirect("https://discordapp.com/api/oauth2/authorize?client_id=`+CLIENT_ID+`&scope=identify%20guilds.join&response_type=code&redirect_uri=${redirect}");
});

router.get('/callback', catchAsync(async (req, res) => {
  if (!req.query.code) throw new Error('NoCodeProvided');
  const code = req.query.code;
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${creds}`,
      },
    });
  const json = await response.json();
  //res.redirect(`http://ec2-35-180-111-238.eu-west-3.compute.amazonaws.com/?token=${json.access_token}`);
  res.redirect(`https://albion-trade.com/?token=${json.access_token}`);
  
  
  	console.log("token="+json.access_token);
	const response1 = await fetch(`https://discordapp.com/api/users/@me`,
    {
      method: 'GET',
      headers: {
		Authorization: `Bearer ${json.access_token}`,        
      },
    });
  const user = await response1.json();
  console.log("User:\t"+user.username+"#"+user.discriminator);
  console.log("User country: "+user.locale);
  
  
  const response2 = await fetch(`https://discordapp.com/api/guilds/` + GUILD_ID + `/members/` + user.id,
    {
      method: 'PUT',
      headers: {
            Authorization: `Bearer ${json.access_token}`,         
      },
    });
  const guildjoin = await response2.json();
  console.log(guildjoin);
}));


module.exports = router;
