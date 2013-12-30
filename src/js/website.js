//Initialize
$(document).ready(function(){

	prettyPrint();

	//Other stuff
	var oCon = document.getElementById('mcon');
	if(oCon ){
		var oLink = document.createElement('a');
		var oText = document.createTextNode("Click here for my email.");
		var sParts = ['ma','ilto:wie','ringen','@gm','ail.com'];
		oLink.href = sParts[0]+sParts[1]+sParts[2]+sParts[3]+sParts[4];
		oCon.appendChild(oLink);
		oLink.appendChild(oText);
	}
});