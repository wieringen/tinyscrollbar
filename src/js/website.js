//Initialize
$(document).ready(function(){
	//Example 1
	var oScroll1 = $('#scrollbar1');
	if(oScroll1.length > 0){
		oScroll1.tinyscrollbar();
	}

	//Example 2
	var oScroll2 = $('#scrollbar2');
	if(oScroll2.length > 0){
		oScroll2.tinyscrollbar({ axis: 'x' });
	}

	//Example 3
	var oScroll3 = $('#scrollbar3');
	if(oScroll3.length > 0){
		oScroll3.tinyscrollbar({ trackSize: 100 });
	}

	//Example 4
	var oScroll4 = $('#scrollbar4');
	if(oScroll4.length > 0){
		oScroll4.tinyscrollbar({ thumbSize: 15 });
	}

	//Example 5
	var oScroll5 = $('#scrollbar5');
	if(oScroll5.length > 0){

		oScroll5.tinyscrollbar();

		/* update default (top) */
		$('#scroll5load').click(function(){
			$('.overview', oScroll5)[0].innerHTML = $('#scroll5text')[0].innerHTML;
			oScroll5.tinyscrollbar_update();
			return false;
		});
		$('#scroll5load2').click(function(){
			$('.overview', oScroll5)[0].innerHTML = $('#scroll5text2')[0].innerHTML;
			oScroll5.tinyscrollbar_update();
			return false;
		});
		$('#scroll5load3').click(function(){
			$('.overview', oScroll5)[0].innerHTML = $('#scroll5text3')[0].innerHTML;
			console.log(oScroll5);
			oScroll5.tinyscrollbar_update();
			return false;
		});

		/* update relative */
		$('#scroll5load4').click(function(){
			$('.overview', oScroll5)[0].innerHTML = $('#scroll5text2')[0].innerHTML;
			oScroll5.tinyscrollbar_update('relative');
			return false;
		});
		$('#scroll5load5').click(function(){
			$('.overview', oScroll5)[0].innerHTML = $('#scroll5text3')[0].innerHTML;
			oScroll5.tinyscrollbar_update('relative');
			return false;
		});

		/* update bottom */
		$('#scroll5load6').click(function(){
			$('.overview', oScroll5)[0].innerHTML = $('#scroll5text2')[0].innerHTML;
			oScroll5.tinyscrollbar_update('bottom');
			return false;
		});
		$('#scroll5load7').click(function(){
			$('.overview', oScroll5)[0].innerHTML = $('#scroll5text3')[0].innerHTML;
			oScroll5.tinyscrollbar_update('bottom');
			return false;
		});
	}

	//Example 6
	var oScroll6 = $('#scrollbar6');
	if(oScroll6.length > 0){

		oScroll6.tinyscrollbar();

		$('#scroll6load').click(function(){
			oScroll6.tinyscrollbar_update(50);
			return false;
		});
		$('#scroll6load2').click(function(){
			oScroll6.tinyscrollbar_update(200);
			return false;
		});
		$('#scroll6load3').click(function(){
			oScroll6.tinyscrollbar_update(350);
			return false;
		});
	}

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

//Fake html5 in ie
document.createElement('header');
document.createElement('footer');
document.createElement('nav');
document.createElement('section');
document.createElement('article');
document.createElement('aside');