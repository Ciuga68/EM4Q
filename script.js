var template_path = Qva.Remote + "?public=only&name=Extensions/EM4Q/";
var em4qId = "";
var mapSize = {w:0,h:0,em4qData:{},em4qDataLen:0};
var em4qDiv = {};
var iframe = document.createElement('iframe');
			iframe.src = template_path+"Blue.html";
			iframe.width = "100%";
			iframe.height = "100%";
			
			
var tableDiv = document.createElement('div');
function loadScriptText(url,callback)
{
	var xmlhttp;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 )
		{
			callback(xmlhttp.responseText);
		}
	}
	iframe.contentWindow.console.log(template_path+url);
	xmlhttp.open("GET",template_path + url,true);
	xmlhttp.send();
}
Qva.AddExtension('EM4Q', function() { 
	  
		mapSize.em4qData = {items:[]};
		em4qDiv = this;
		var html = "<table>";
		for (var i = 0; i < this.Data.Rows.length; i++) { 
			var row = this.Data.Rows [i];
			// Generate html 
			html += "<tr><td>" + row[0].text + "</td><td>" + row[1].text + "</td></tr>"; 
			var dataElement = {};
			for(var j=0;j<this.Data.TotalSize.x;j++)
			{
				var thisHeader = this.Data.HeaderRows[0][j].text;
				dataElement[thisHeader+" Text"] = row[j].text;
				if(row[j].data)
					dataElement[thisHeader+" Data"] = row[j].data;
				if(row[j].value)
					dataElement[thisHeader+" Value"] = row[j].value;
			}
			mapSize.em4qData.items.push(dataElement);
		}

		html += "</table>";

		tableDiv.innerHTML = html;
		em4qId = this.Layout.ObjectId+"_"+parent.$('.qvtr-tabs .selected span, .qvtr-tabs .selectedtab span').html();
		em4qId = em4qId.replace(/\\/g,'');
		if(this.Element.getElementsByTagName('iframe').length == 0)
		{
			if(localStorage[em4qId+"width"])
			{
				mapSize.w = parseInt(localStorage[em4qId+"width"]);
				mapSize.h = parseInt(localStorage[em4qId+"height"]);
			}
			else
			{
				mapSize.w = 900;
				mapSize.h = 500;
			}
			this.Element.style.width = mapSize.w+"px";
			this.Element.style.height = mapSize.h+"px";
			this.Element.parentElement.style.width = mapSize.w+"px";
			this.Element.parentElement.style.height = mapSize.h+"px";
			this.Element.appendChild(iframe);
			this.Element.appendChild(tableDiv);
			window.setInterval(checkResize,1000);
		}
		else
		{
			if(mapSize.em4qDataLen != this.Data.Rows.length)
			{
				window.setTimeout(function(){
					iframe.contentWindow.onDataChanged();
				},500);
			}
		}
		mapSize.em4qDataLen = this.Data.Rows.length;
		iframe.contentWindow.qRemote = Qva.Remote;
		iframe.contentWindow.data = mapSize.em4qData;
		iframe.contentWindow.qdata = this.Data.Rows;
		iframe.contentWindow.qmeta = this.Data;
		iframe.contentWindow.qScript = this;
		iframe.contentWindow.docId = em4qId;
		
	   /*iframe.contentWindow.qRemote = Qva.Remote+ "?public=only&name=Extensions/EM4Q/";
	   console.log(Qva.Remote);
	   var test = document.createElement('h1');
	   test.innerHTML = iframe.contentWindow.qRemote;
	   this.Element.appendChild(test);
	   Qva.LoadScript(template_path+"test.js");*/
  // });
});

function checkResize()
{
	if(parseInt(em4qDiv.Element.style.width) != mapSize.w &&
	parseInt(em4qDiv.Element.style.height) != mapSize.h)
	{
		mapSize.w = parseInt(em4qDiv.Element.style.width);
		mapSize.h = parseInt(em4qDiv.Element.style.height);
		localStorage.setItem(em4qId+"width",mapSize.w);
		localStorage.setItem(em4qId+"height",mapSize.h);
	}
}