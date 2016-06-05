$(document).ready(function() {
	$('.survival_interaction_point').hover(enterPoint);
	$(".survival_section").hover(enterSection);
	$(".survival_section").mouseleave(exitPoint);
	$(".survival_interaction_point").mouseleave(exitPoint);
	$(".survival_circle").hover(enterPoint);
	$(".survival_circle").mouseleave(exitPoint);
	$(".survival_interaction_point").click(switchPageFromSurvival);
	$(".survival_section").click(switchPageFromSurvival);
})

function exitPoint(){
	$(".survival_section").css("background-color", "transparent");
	$(".survival_interaction_tip").css("display", "none");
	$(".survival_interaction_point circle").css("opacity", "0.8");
	$(".survival_interaction_point circle").css("stroke-width", "4");
}

function enterPoint(event){
	if(event.target.id){
		var selector = "#" + event.target.id.replace("point", "section").replace("circle", "section");
		$(selector).css("background-color", "#F8F9A7");
		$(selector.replace("section", "tip")).css("display", "block");
		$("#" + event.target.id + " circle").css("opacity", "1");
		$("#" + event.target.id + " circle").css("stroke-width", "8");
	}
}

function enterSection(event){
	exitPoint();
	$(".survival_section").css("background-color", "transparent");
	$(".survival_interaction_tip").css("display", "none");
	if(event.target.id){
		$("#" + event.target.id).css("background-color","#F8F9A7");
		var selector = "#" + event.target.id.replace("section", "tip");
		$(selector).css("display", "block");
		$(selector.replace("tip", "point") + " circle").css("opacity", "1");
		$(selector.replace("tip", "point") + " circle").css("stroke-width", "8");
	}
}

function switchPageFromSurvival(event){
	switch(event.target.id.split("_")[2]){
		case "communication":
		case "skills":
			openConnect();
			break;
		case "safety":
			openSafetyZones();
			break;
		case "resources":
		case "supplies":
		case "evacuation":
			openFindResources();
			break;
		case "help":
			openHelp();
			break;
	}
}