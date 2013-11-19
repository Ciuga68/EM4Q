var template_path = Qva.Remote + "?public=only&name=Extensions/EM4Q/";
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
	  
		var em4qData = {items:[]};
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
			em4qData.items.push(dataElement);
		}

		html += "</table>";

		tableDiv.innerHTML = html;
		if(this.Element.getElementsByTagName('iframe').length == 0)
		{
			this.Element.style.width = "900px";
			this.Element.style.height = "500px";
			this.Element.parentElement.style.width = "900px";
			this.Element.parentElement.style.height = "500px";
			this.Element.appendChild(iframe);
			this.Element.appendChild(tableDiv);
			iframe.contentWindow.qRemote = Qva.Remote;
			iframe.contentWindow.data = em4qData;
			iframe.contentWindow.qdata = this.Data.Rows;
			iframe.contentWindow.qmeta = this.Data;
		}
	   /*iframe.contentWindow.qRemote = Qva.Remote+ "?public=only&name=Extensions/EM4Q/";
	   console.log(Qva.Remote);
	   var test = document.createElement('h1');
	   test.innerHTML = iframe.contentWindow.qRemote;
	   this.Element.appendChild(test);
	   Qva.LoadScript(template_path+"test.js");*/
  // });
});