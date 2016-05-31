$(document).ready(function() {
	$('.survival_interaction_point').hover(function(event){
		$(".survival_section").css("background-color", "transparent");
		$(".survival_interaction_tip").css("display", "none");
		if(event.target.id){
			var selector = "#" + event.target.id.replace("point", "section");
			$(selector).css("background-color", "#F8F9A7");
			$("#survival_transcript").scrollTop($("#survival_transcript").scrollTop() + $(selector).position().top
   												 - $("#survival_transcript").height()/2 + $(selector).height()/2);

			$(selector.replace("section", "tip")).css("display", "block");
		}
	});

	$(".survival_section").hover(function(event){
		$(".survival_section").css("background-color", "transparent");
		$(".survival_interaction_tip").css("display", "none");
		if(event.target.id){
			$("#" + event.target.id).css("background-color","#F8F9A7");
			var selector = "#" + event.target.id.replace("section", "tip");
			$(selector).css("display", "block");
		}
	});

	$(".survival_section").mouseleave(function(event){
		$(".survival_section").css("background-color", "transparent");
		$(".survival_interaction_tip").css("display", "none");
	});

	$(".survival_interaction_point").mouseleave(function(event){
		$(".survival_section").css("background-color", "transparent");
		$(".survival_interaction_tip").css("display", "none");
	});
})