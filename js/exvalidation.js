(function($j){

	var exValidation = function(from,conf){
	
		// Validate (the) target form(s)
		//var form = form;
		this.form = form; // This is OK that form is not form element
	
		// Default validation rules
		this.validateRules = {
			required: {
				message: 'This field is required',
				condition: function(text,target){
					if($(target).hasClass('group')){
						var flag = 0;
						$('input,select',target).each(function(){
							if($(this).val().length>0) flag++;
						});
						return text && flag==$('input,select',target).length;
					}else{
						return text && text > 0;
					}
				}
			}
		}
		
		
		// Standby the validation on target form
		// If 
		this.init(this.form);
	
	}
	
		exValidation.prototype = {
		
		}
		
		
	$.fn.exValidation = function(){
	}
	
	if($.fn.validation){
		$.fn.validation = $.fn.exValidation;
	}

})(jQuery);