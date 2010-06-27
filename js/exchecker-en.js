(function($) {

	var exChecker = {
		required: [
			'\*This feild is required',
			function(txt,t){
				if($(t).hasClass('group')){
					var flag = 0;
					$('input,select',t).each(function(){
						if($(this).val().length>0) flag++;
					});
					//console.log(txt);
					//return txt && flag==$('input,select',t).length;
					if($(t).hasClass('eventTerm')){
						return txt && flag==$('input,select',t).length;
					}else if(txt && flag==$('input,select',t).length){
						if(txt.match(/^[ 　\r\n\t]+$/)){
							return false;
						}else{
							return true;
						}
					}
				}else{
					if(txt && txt.length>0){
						if(txt.match(/^[ 　\r\n\t]+$/)){
							return false;
						}else{
							return true;
						}
					}
				}
			}
		],
		retype: [
			'\*You has wrong words',
			function(txt,t){
				var elm = $('#'+$(t).attr('class').split('retype\-')[1].split(/\b/)[0]);
				if(elm.hasClass('group')){
					var chktxt = $('input',elm), txt = $('input',t);
					for(var i=0,flag=false;i<chktxt.length;i++){
						if(chktxt[i].value==txt[i].value) flag = true;
						else flag = false;
					}
					if(flag) return true;
				}else{
					return elm.val() == txt;
				}				
			}
		],
		email: [
			'\*Not valid Email address',
			/^[^\@]+?@[A-Za-z0-9_\.\-]+\.+[A-Za-z\.\-\_]+$/
		],
		hankaku: [
			'\*Multibytes characters are not allowed',
			/^[a-zA-Z0-9@\;\:\[\]\{\}\|\^\=\/\!\*\`\"\#\$\+\%\&\'\(\)\,\.\-\_\?\\\s]*$/
		],
		zenkaku: [
			'\*Using only multibytes characters',
			/^[^a-zA-Z0-9@\;\:\[\]\{\}\|\^\=\/\!\*\"\#\$\+\%\&\'\(\)\,\.\-\_\?\\\s]+$/
		],
		hiragana: [
			'\*Using only HIRAGANA',
			/^[あ-んー～]+$/
		],
		katakana: [
			'\*Using only KATAKANA',
			/^[ア-ンー～]+$/
		],
		furigana: [
			'\*ふりがなはひらがな、数字、アルファベットと〜、ー、（）が利用できます',
			/^[あ-ん０-９ー～（）\(\)\d 　]+$/
		],
		nochar: [
			'\*英数字で入力してください',
			/^[a-zA-Z0-9]+$/
		],
		nocaps: [
			'\*英数字(小文字のみ)で入力してください',
			/^[a-z0-9]+$/
		],
		numonly: [
			'\*半角数字のみで入力してください',
			function(txt,t){
				if(txt && txt.length>0){
					if(txt.match(/^[0-9]+$/)){
						return true;
					}else{
						return false;
					}
				}else{
					return true;
				}
			}
		],
		min: [
			'文字以上で入力してください',
			function(txt,t){
				if(txt.length==0) return true;
			 	var length = $(t).attr('class').match(/singleMin(\d+)/) ? RegExp.$1 : null;
				return txt.length >= length;
			}
		],
		max: [
			'文字以内で入力してください',
			function(txt,t){
				var length = $(t).attr('class').match(/singleMax(\d+)/) ? RegExp.$1 : null;
				return txt.length <= length;
			}
		],
		radio: [
			'\*選択してください',
			function(txt,t){
				return $('input:checked',t).length>0;
			}
		],
		checkbox: [
			'\*選択してください',
			function(txt,t){
				return $('input:checked',t).length>0;
			}
		],
		url: [
			'\*正しいURLの形式を入力してください',
			function(txt,t){
				if(txt && txt.length>0){
					if(txt.match(/^http(s)?\:\/\/[^\/]*/)){
						return true;
					}else{
						return false;
					}
				}else{
					return true;
				}
			}
		],
		tel: [
			'\*正しい電話番号を入力してください',
			function(txt,t){
				if(txt && txt.length>0){
					if(txt.match(/^\(?\d+\)?\-?\d+\-?\d+$/)){
						return true;
					}else{
						return false;
					}
				}else{
					return true;
				}
			}
		],
		fax: [
			'\*正しいファックス番号を入力してください',
			function(txt,t){
				if(txt && txt.length>0){
					if(txt.match(/^\(?\d+\)?\-?\d+\-?\d+$/)){
						return true;
					}else{
						return false;
					}
				}else{
					return true;
				}
			}
		]
	}
	
	$.extend(validationRules, exChecker);

})(jQuery);
