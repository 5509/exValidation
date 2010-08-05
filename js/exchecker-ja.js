/**
 * exChecker-js for exValidaion
 *
 * @version      $Rev$
 * @author       nori (norimania@gmail.com)
 * @copyright    5509 (http://5509.me/)
 * @license      The MIT License
 * @link         http://5509.me/log/exvalidation
 *
 * $Date$
 */

(function($) {

	var exChecker = {
		required: [
			'入力してください',
			function(txt, t) {
				if ( $(t).hasClass('group') ) {
					var flag = 0;
					$('input,select',t).each(function() {
						if ( $(this).val().length>0 ) flag++;
					});
					if ( txt && flag==$('input,select', t).length ) {
						if ( /^[ 　\r\n\t]+$/.test(txt) ) {
							return false;
						}else{
							return true;
						}
					}
				} else {
					if ( txt && txt.length>0 ) {
						if ( /^[ 　\r\n\t]+$/.test(txt) ) {
							return false;
						} else {
							return true;
						}
					}
				}
			}
		],
		select: [
			'選択してください',
			function(txt, t) {
				if ( txt && txt.length>0 ) {
					if ( /^[ 　\r\n\t]+$/.test(txt) ) {
						return false;
					} else {
						return true;
					}
				}
			}
		],
		retype: [
			'入力内容が異なります',
			function(txt, t) {
				var elm = $('#'+$(t).attr('class').split('retype\-')[1].split(/\b/)[0]);
				if ( elm.hasClass('group') ) {
					var chktxt = $('input', elm), txt = $('input', t);
					for ( var i=0, flag=false; i<chktxt.length; i++ ) {
						if ( chktxt[i].value==txt[i].value ) flag = true;
						else flag = false;
					}
					if ( flag ) return true;
				}else{
					return elm.val() == txt;
				}				
			}
		],
		email: [
			'正しいメールアドレスの形式を入力してください',
			/^[^\@]+?@[A-Za-z0-9_\.\-]+\.+[A-Za-z\.\-\_]+$/
		],
		hankaku: [
			'全角文字は使用できません',
			/^[a-zA-Z0-9@\;\:\[\]\{\}\|\^\=\/\!\*\`\"\#\$\+\%\&\'\(\)\,\.\-\_\?\\\s]*$/
		], //"
		zenkaku: [
			'全角文字で入力してください',
			/^[^a-zA-Z0-9@\;\:\[\]\{\}\|\^\=\/\!\*\"\#\$\+\%\&\'\(\)\,\.\-\_\?\\\s]+$/
		], //"
		hiragana: [
			'ひらがなで入力してください',
			/^[あ-んー～]+$/
		],
		katakana: [
			'カタカナで入力してください',
			/^[ア-ンー～]+$/
		],
		furigana: [
			'ふりがなはひらがな、数字、アルファベットと〜、ー、（）が利用できます',
			/^[あ-ん０-９ー～（）\(\)\d 　]+$/
		],
		nochar: [
			'英数字で入力してください',
			/^[a-zA-Z0-9]+$/
		],
		nocaps: [
			'英数字(小文字のみ)で入力してください',
			/^[a-z0-9]+$/
		],
		numonly: [
			'半角数字のみで入力してください',
			function(txt, t) {
				if ( txt && txt.length>0 ) {
					if ( /^[0-9]+$/.test(txt) ) {
						return true;
					} else {
						return false;
					}
				} else {
					return true;
				}
			}
		],
		min: [
			'文字以上で入力してください',
			function(txt, t) {
				if ( txt.length==0 ) return true;
			 	var length = $(t).attr('class').match(/min(\d+)/) ? RegExp.$1 : null;
				return txt.length >= length;
			}
		],
		max: [
			'文字以内で入力してください',
			function(txt, t) {
				var length = $(t).attr('class').match(/max(\d+)/) ? RegExp.$1 : null;
				return txt.length <= length;
			}
		],
		radio: [
			'選択してください',
			function(txt, t) {
				return $('input:checked',t).length>0;
			}
		],
		checkbox: [
			'選択してください',
			function(txt, t) {
				return $('input:checked',t).length>0;
			}
		],
		url: [
			'正しいURLの形式を入力してください',
			function(txt, t) {
				if ( txt && txt.length>0 ) {
					if ( /^http(s)?\:\/\/[^\/]*/.test(txt) ) {
						return true;
					} else {
						return false;
					}
				} else {
					return true;
				}
			}
		],
		tel: [
			'正しい電話番号を入力してください',
			function(txt, t) {
				if ( txt && txt.length>0 ) {
					if ( /^\(?\d+\)?\-?\d+\-?\d+$/.test(txt) ) {
						return true;
					} else {
						return false;
					}
				} else {
					return true;
				}
			}
		],
		fax: [
			'正しいファックス番号を入力してください',
			function(txt, t) {
				if ( txt && txt.length>0 ) {
					if ( /^\(?\d+\)?\-?\d+\-?\d+$/.test(txt) ) {
						return true;
					} else {
						return false;
					}
				} else {
					return true;
				}
			}
		]
	}
	
	// Extend validation rules
	$.extend(validationRules, exChecker);
})(jQuery);