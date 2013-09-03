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
		"dandinh" : {"region" : "na", "summoner" : "man dinh"}
	}

}


var elophantHelper = {

	apiKey : "VgxuxoeUotZdXCTsqYG1",

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
				var summoner = document.createElement('p');
				summoner.innerHTML = json.data.name;
				document.body.appendChild(summoner);
				// can't call "this.getCurrentRunePages", because /this/ refers to something else
				curObject.getCurrentRunePages(json.data.summonerId, summonerData["region"]);
				curObject.getCurrentMasteriesPages(json.data.summonerId, summonerData["region"]);
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
				console.log("current mastery page");
				console.log(currentPage);
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
						//break;
					}

					console.log(bookpages[index].slotEntries);
				}
				curObject.processCurrentRunePages(currentPage.slotEntries);
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
		"5365" : [{"type" : "movement", "value" : 1.5}]		
	},

	processCurrentRunePages : function(runeSlots) {
		var pageValue = {};

		for (var index = 0; index < runeSlots.length; index++) {
			var runeID = runeSlots[index].runeId;
			var runeStatArray = this.runeHash[runeID];

			for (var runeIndex = 0; runeIndex < runeStatArray.length; runeIndex++) {
				if (pageValue[runeStatArray[runeIndex].type] == null) {
					pageValue[runeStatArray[runeIndex].type] = runeStatArray[runeIndex].value;
				} else {
					pageValue[runeStatArray[runeIndex].type] += runeStatArray[runeIndex].value;
				}
			}
		}

		console.log(pageValue);
	}
}


chrome.tabs.getSelected(null, function(tab) {
	var streamName = twitchHelper.getUsername(tab.url);
	var summonerInfo = streamerList.getSummonerName(streamName);
	elophantHelper.getSummonerInfo(summonerInfo);
});