$(document).ready(function() {
	$('.survival_interaction_point').on({
	    mouseenter: function(e) {
	        $(e.target).next(".survival_interaction_tip").css("display", "block");
	    },
	    mouseleave: function(e) {
	        $(e.target).next(".survival_interaction_tip").css("display", "none");
	    }
	});
})