// get URL of the extension (wut)
//document.addEventListener('DOMContentLoaded', function(){alert(document.URL);});


var twitchHelper = {

	getUsername : function(url) {
		// Validate that this is a twitch channel (directory seems to be the only off case)
		var usernameRegex = new RegExp(/twitch\.tv\/[^\/]+$/);
		if (url.match(usernameRegex) != null) {
			var validatedURL = url.split("/");
			return validatedURL[validatedURL.length - 1].toString();
		} else {
			console.log("ERROR => " + url + " is not twitch.tv url");
		}
	}
}

var streamerList = {

	getSummonerName : function(twitchID) {
		return this.streamerList[twitchID.toLowerCase()];
	},


	streamerList : {
		"tsm_theoddone" : {"region" : "na", "summoner" : "theoddone"},
		"chaoxlol" : {"region" : "na", "summoner" : "chaox"},
		"dandinh" : {"region" : "na", "summoner" : "dan dinh"},
		"sivhd" : {"region" : "euw", "summoner" : "siv hd"}
	}

}


var elophantHelper = {

	// hide the API Key for Github
	apiKey : "----",

	getSummonerInfo : function(summonerData) {

		var apiURL = 'http://api.elophant.com/v2/' +
						summonerData["region"] + 
						'/summoner/' +
						encodeURIComponent(summonerData["summoner"]) +
						"?key=" + 
						this.apiKey;
		var curObject = this;
		$.getJSON(apiURL, function(json) {
			if (json.success == true) {
				// can't call "this.getCurrentRunePages", because /this/ refers to something else
				curObject.getCurrentRunePages(json.data.summonerId, summonerData["region"]);
				curObject.getCurrentMasteriesPages(json.data.summonerId, summonerData["region"]);
			} else {
				console.log(json.error);
			}
		});	
	},


	getCurrentMasteriesPages : function(summonerID, region) {
		var apiURL = "http://api.elophant.com/v2/" +
						region + 
						"/mastery_pages/" + 
						summonerID + 
						"?key=" + 
						this.apiKey;
		$.getJSON(apiURL, function(json) {
			if (json.success == true) {
				var bookpages = json.data.bookPages;
				var currentPage = null;
				for (var index = 0; index < bookpages.length; index++) {
					if (bookpages[index].current == true) {
						currentPage = bookpages[index];
						break;
					}
				}
			}

		});
		return apiURL;
	},

	getCurrentRunePages : function(summonerID, region) {
		var apiURL = "http://api.elophant.com/v2/" +
						region +
						"/rune_pages/" + 
						summonerID + "?key=" + this.apiKey;
		var curObject = this;
		$.getJSON(apiURL, function(json) {
			if (json.success == true) {
				var bookpages = json.data.bookPages;
				var currentPage = null;
				for (var index = 0; index < bookpages.length; index++) {
					if (bookpages[index].current == true) {
						currentPage = bookpages[index];
						var runePageName = document.createElement('h2');
						runePageName.innerHTML = currentPage.name;
						document.body.appendChild(runePageName);
						break;
					}
				}
				var curPageVal = curObject.processCurrentRunePages(currentPage.slotEntries);
				console.log(Object.keys(curPageVal).length);

			}
		});

		return apiURL;

	},

	runeHash : {
		"5335" : [{"type" : "attackDamage", "value" : 2.25}],
		"5247" : [{"type" : "attackSpeed" , "value" : 1.7}],
		"5245" : [{"type" : "attackDamage", "value" : 0.95}],
		"5289" : [{"type" : "magicResist" , "value" : 1.34}],
		"5317" : [{"type" : "armor", "value" : 1.41}],
		"5402" : [{"type" : "armorPen", "value" : 0.9}, {"type" : "magicPen", "value" : 0.62}],
		"5365" : [{"type" : "movement", "value" : 1.5}],
		"5295" : [{"type" : "cooldown", "value" : -0.83}],
		"5290" : [{"type" : "magicResist@18", "value" : 2.7}],
		"5357" : [{"type" : "abilityPower", "value" : 4.95}],
		"5318" : [{"type" : "armor@18", "value" : 2.7}],
		"5367" : [{"type" : "GP10", "value" : 1}],
		"5337" : [{"type" : "attackSpeed" , "value" : 3.4}],
		"5347" : [{"type" : "armor", "value" : 4.26}],
		"5268" : [{"type" : "abilityPower@18", "value" : 1.8}],
		"5298" : [{"type" : "abilityPower@18", "value" : 3.06}],
		"5343" : [{"type" : "armorPen", "value" : 2.56}],
		"5273" : [{"type" : "magicPen", "value" : 0.87}],
		"5345" : [{"type" : "health", "value" : 26}],
		"5253" : [{"type" : "armorPen", "value" : 1.28}],
		"5412" : [{"type" : "lifesteal", "value" : 2}],
		"5257" : [{"type" : "armor", "value" : 0.91}],
		"5297" : [{"type" : "abilityPower", "value" : 1.19}],
		"5277" : [{"type" : "attackSpeed", "value" : 0.64}],
		"5299" : [{"type" : "mana", "value" : 11.25}],
		"5302" : [{"type" : "manaRegen@18", "value" : 0.99}],
		"5301" : [{"type" : "manaRegen", "value" : 0.31}],
		"5359" : [{"type" : "mana", "value" : 37.5}],
		"5319" : [{"type" : "magicResist", "value" : 0.74}],
		"5332" : [{"type" : "manaRegen@18", "value" : 1.17}],
		"5406" : [{"type" : "increaseHealth", "value" : 1.5}],
		"5349" : [{"type" : "magicResist", "value" : 4}],
		"5320" : [{"type" : "magicResist@18", "value" : 1.8}],
		"5409" : [{"type" : "spellVamp", "value" : 2}],
		"5328" : [{"type" : "abilityPower@18", "value" : 1.8}],
		"5287" : [{"type" : "armor", "value" : 0.7}],
		"5403" : [{"type" : "GP10", "value" : 0.25}],
		"5303" : [{"type" : "magicResist", "value" : 0.63}],
		"5300" : [{"type" : "mana@18", "value" : 25.56}],
		"5331" : [{"type" : "manaRegen", "value" : 0.41}],
		"5267" : [{"type" : "abilityPower", "value" : 0.59}],
		"5361" : [{"type" : "manaRegen", "value" : 1.25}],
		"5260" : [{"type" : "magicResist@18", "value" : 1.26}],
		"5350" : [{"type" : "magicResist@18", "value" : 6.66}],
		"5316" : [{"type" : "health@18", "value" : 19.44}],
		"5346" : [{"type" : "health@18", "value" : 48.6}],
		"5315" : [{"type" : "health", "value" : 5.35}],
		"5361" : [{"type" : "manaRegen", "value" : 1.25}],
		"5305" : [{"type" : "attackDamage", "value" : 0.43}],
		"5255" : [{"type" : "health" , "value" : 3.47}],
		"5368" : [{"type" : "experience", "value" : 2}],
		"5321" : [{"type" : "healthRegen", "value" : 0.43}],

	},

	processCurrentRunePages : function(runeSlots) {
		var pageValue = {};

		for (var index = 0; index < runeSlots.length; index++) {
			var runeID = runeSlots[index].runeId;
			var runeStatArray = this.runeHash[runeID];
			if (runeStatArray == null) {
				console.log(runeSlots[index]);
				continue;
			}
			for (var runeIndex = 0; runeIndex < runeStatArray.length; runeIndex++) {
				if (pageValue[runeStatArray[runeIndex].type] == null) {
					pageValue[runeStatArray[runeIndex].type] = runeStatArray[runeIndex].value;
				} else {
					pageValue[runeStatArray[runeIndex].type] += runeStatArray[runeIndex].value;
				}
			}
		}

		return pageValue;
	}
}


chrome.tabs.getSelected(null, function(tab) {
	var streamName = twitchHelper.getUsername(tab.url);
	var summonerInfo = streamerList.getSummonerName(streamName);
	elophantHelper.getSummonerInfo(summonerInfo);
});
