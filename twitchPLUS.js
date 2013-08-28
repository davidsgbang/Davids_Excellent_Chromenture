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
	}

}


var elophantHelper = {

	apiKey : "VgxuxoeUotZdXCTsqYG1",
	getSummonerInfo : function(summonerName) {

		var apiURL = 'http://api.elophant.com/v2/' +
						summonerName["region"] + 
						'/summoner/' +
						encodeURIComponent(summonerName["summoner"]) +
						"?key=" + 
						this.apiKey;
		$.getJSON(apiURL, function(json) {
			if (json.success == true) {

				getCurrentRunePages(json.data.summonerId, summonerName["region"]);
				getCurrentMasteriesPages(json.data.summonerId, summonerName["region"]);


			}
			console.log(json);
		});	
	},


	getCurrentRunePages : function(summonerID, region) {
		var apiURL = "http://api.elophant.com/v2/" +
						region + 
						"/mastery_pages/" + 
						summonerID + 
						"?key=" + 
						this.apiKey;
	},

	getCurrentMasteriesPages : function(summonerID, region) {
		var apiURL = "http://api.elophant.com/v2/" +
						region +
						"/rune_pages/" + 
						summonerID + "?key=" + this.apiKey;

	}
}


chrome.tabs.getSelected(null, function(tab) {
	var streamName = twitchHelper.getUsername(tab.url);
	var summonerInfo = streamerList.getSummonerName(streamName);
	console.log(elophantHelper.getSummonerInfo(summonerInfo));
});