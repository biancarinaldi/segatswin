systems = null;

$(document).ready(function()
{
	var systemNames = getSystemNames();
	loadSystems(systemNames);
	addSystemBoxes();
});

function loadSystems(systemNames)
{
	systems = [];
	
	var i;
	
	for(i = 0; i < systemNames.length; i++)
		systems.push(getSystem(systemNames[i]));
}

function addSystemBoxes()
{
	var systemBoxesHTML = [];
	
	var i;
	
	for(i = 0; i < systems.length; i++)
	{
		var system = systems[i];
		var shortName = system["name"].split(" ")[0];
	
		systemBoxesHTML.push("<div class=\"system\">");
		systemBoxesHTML.push("<h3>" + shortName + "</h3>");
		systemBoxesHTML.push("<h4>Type</h4>");
		systemBoxesHTML.push("<p>" + system["type"] + "</p>");
		systemBoxesHTML.push("<h4>Description</h4>");
		systemBoxesHTML.push("<p>" + system["desc"] + "</p>");
		systemBoxesHTML.push("<h4>Download</h4>");
		systemBoxesHTML.push("<p><a href=\"../systems/" + shortName.toLowerCase() + "/rawdata/" + shortName.toLowerCase() + "-bundle" + ".zip\">Bundle</a></p>");
		systemBoxesHTML.push("<p><a href=\"#\">" + system.versions.length + " Versions</a></p>");
		systemBoxesHTML.push("</div>");
	}
	
	$("#systems").html(systemBoxesHTML.join("\r\n"));
}

function getSystemNames()
{
	var systems = [];
	
	var systemsFileText = retrieveSystemsFile();
	var systemFileLines = systemsFileText.split("\n");
	
	var i;
	
	for(i = 0; i < systemFileLines.length; i++)
	{
		var line = systemFileLines[i].trim();
	
		if(line.length != 0) systems.push(line);
	}
	
	return systems;
}

function addSystems(systems)
{
	var systemsHTML = [];

	var i;

	for(i = 0; i < systems.length; i++)
	{
		var system = systems[i];
		systemsHTML.push(getSystemHTML(system));
	}
	
	$("#systems").html(systemsHTML.join("\r\n"));
}

//function getSystemHTML(system)
//{
//	var systemObject = getSystem(system);
//	
//	var shortName = systemObject["name"].split(" ")[0];
//
//	var systemHTML = [];
//
//	systemHTML.push("<div class=\"system\">");
//	systemHTML.push("<h3>" + shortName + "</h3>");
//	
//	systemHTML.push("<p><a href=\"../systems/" + system + "/rawdata/" + system + "-bundle" + ".zip\">Bundle</a></p>");
//	
//	systemHTML.push("<ol>");
//	
//	var versions = systemObject["versions"];
//	
//	var i;
//	
//	for(i = 0; i < versions.length; i++)
//	{
//		var version = versions[i];
//		systemHTML.push("<li><strong>" + version.id + ":</strong> <a href=\"../systems/" + system + "/rawdata/" + version.file + ".zip\">" + version.file + "</a></li>");
//	}
//	
//	systemHTML.push("</ol>");
//	
//	systemHTML.push("</div>");
//	
//	return systemHTML.join("\r\n");
//}

function getSystem(systemName)
{
	var versionsFileText = retrieveVersionsFile(systemName);
	var versionsFileLines = versionsFileText.split("\n");
	
	var systemObject = {};
	
	var versions = [];
	
	var i;
	
	for(i = 0; i < versionsFileLines.length; i++)
	{
		var line = versionsFileLines[i];
	
		if(line.trim().length==0) continue;
		else if(line.charAt(0) == "#") continue;
		else if(line.charAt(0) == "%")
		{
			var metaDataTokens = line.substring(1).split("=");
			
			systemObject[metaDataTokens[0]] = metaDataTokens[1];
			
			continue;
		}
		else if(line.charAt(0) == ">") continue;
		else if(line.charAt(0) == "@") continue;
		else
		{
			var tokens = line.split(",");
			
			var rsn = tokens[0].trim();
			var id = tokens[1].trim();
			var file = tokens[2].trim();
			
			versions.push({"rsn": + rsn, "id": id, "file": file});
		}
	}
	
	systemObject["versions"] = versions;
	
	return systemObject;
}

function retrieveVersionsFile(system)
{
	var text = "";
	$.ajax({url: "../systems/versions/" + system + ".versions", async:false, success:function(data){ text = data; }});
	
	return text;
}

function retrieveSystemsFile()
{
	var text = "";
	$.ajax({url: "../systems/helix.systems", async:false, success:function(data){ text = data; }});
	
	return text;
}