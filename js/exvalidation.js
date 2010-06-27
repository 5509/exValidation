/**
 * exValidation
 *
 * @version      $Rev$
 * @author       nori (norimania@gmail.com)
 * @copyright    5509 (http://5509.me/)
 * @license      The MIT License
 * @link         http://5509.me/log/exvalidation
 *
 * $Date$
 */

var validationRules = {};
var exValidationdialog = {};
(function($) {
	
	var exValidation = function(form, conf) {
	
		if ( form.length > 1 ) alert('実行できるフォームはひとつだけです');
		
		// for browse
		var _this = this;
	
		this.form = form;
		this.validateRules = {}
		
		var conf = this.conf = $.extend({
			errInsertPos: 'body', // 'body' or target before
			err: null,
			ok: null,
			moveToErr: true,
			moveAdjust: -10,
			position: 'absolute', // fixed
			errZIndex: 500,
			customSubmit: null, // function(){}
			customListener: 'blur keyup change',
			customBind: null,
			customGetErrHeight: null,
			firstValidate: false,
			errPrefix: '\* ',
			groupInputs: 'input:text,input:password,input:checkbox,input:radio,select,textarea'
			//validationRules: null
		},conf || {});
		
		// addClasses for each inputs by validation rules
		for ( var c in conf.rules ) {
			$('#'+c).addClass(conf.rules[c]);
		}
		
		// If this form doesn't have ID, formID for error tips is to be decided by random integer
		var formID = $(form).attr('id')
			? 'form_' + $(form).attr('id')
			: 'form_' + randomInt()*randomInt();
		
		var inputs = $('input:text,input:password,input:hidden,textarea,select,[class*="group"],[class*="radio"],[class*="checkbox"]', form)
			.filter(function(){ return !$(this).parents().hasClass('group'); }),
			classReg = _this.returnReg(),
			idReg = '';
			
			
		inputs.each(function(){
			var self = $(this),
				cl = this.className,
				offset = self.offset(),
				id = this.id;
			
			// classRegを含んでいなければ対象外
			if( cl.match(classReg) ) {
				//console.debug(this);
				if ( conf.errInsertPos=='body' ) {
					$('body').append(_this.generateErr(id,formID));
				} else {
					self.after(_this.generateErr(id,formID));
				}
				$('.userformError').mouseenter(function() {
					$(this).fadeOut();
				});
				
				if ( conf.position=='absolute' ) {
					if ( conf.customGetErrHeight && typeof conf.customGetErrHeight=='function' ) {
						_this.customGetErrHeight(id);
					} else {
						_this.getErrHeight(id, conf.errZIndex);
					}
					
					// Reget the position
					$(window).resize(function() {
						if ( conf.customGetErrHeight && typeof conf.customGetErrHeight=='function' ) {
							_this.customGetErrHeight(id);
						} else {
							_this.getErrHeight(id, conf.errZIndex);
						}
					});
				}
				$('#err_'+id).hide();
			}
			
		});
		
		// You call this func everytime, everywhere you like after init
		this.laterCall = function(t) {
			_this.basicValidate(t, conf.err, conf.ok);
		}
		
		if ( conf.firstValidate ) {
			var bindingListener = 'blur keyup click';//$.browser.msie ? 'blur click' : 'blur';
			inputs.each(function() {
				if ( $(this).hasClass('group') ) {
					var self = $(this);
					$(conf.groupInputs, self).bind(bindingListener, function() {
						_this.basicValidate(self, conf.err, conf.ok);
					});
				} else {
					$(this).bind(bindingListener, function(){
						_this.basicValidate(this, conf.err, conf.ok);
					});
				}
			});
		}
		
		function _exeValidation(customBindCallback) {
			//console.debug('validation');
			if( conf.firstValidation ) {
				inputs.unbind('blur keyup change click');
				conf.firstValidate = false;
			}
			// submit時にvalidationをbindする
			inputs.each(function() {
				var self = $(this);
				_this.basicValidate(this, conf.err, conf.ok, true);
				
				if ( self.hasClass('group') ) {
					$(conf.groupInputs, self).bind(conf.customListener, function() {
						_this.basicValidate(self, conf.err, conf.ok);
					});
				} else {
					self.bind(conf.customListener, function() {
						_this.basicValidate(this, conf.err, conf.ok);
					});
				}
			});
			
			var err = $('.formError:visible[class*="'+formID+'"]');
			// エラーが表示されている場合は
			if ( err.length>0 ) {
				if ( conf.moveToErr ) {
					var reverseOffsetTop = $(err[0]).offset().top,
						scrollTarget = $.support.boxModel
							? navigator.appName.match(/Opera/) ?
								'html' : 'html,body'
							: 'body';
							
					console.debug(reverseOffsetTop)
					for ( var i=0; i<err.length; i++ ) {
						reverseOffsetTop = $(err[i]).offset().top < reverseOffsetTop
							? $(err[i]).offset().top : reverseOffsetTop;
					}
					console.debug(reverseOffsetTop)
					$(scrollTarget).animate({
						scrollTop: reverseOffsetTop + conf.moveAdjust
					}, {
						easing: $.easing.easeInOutCirc ? 'easeInOutCirc' : 'swing',
						duration: 500
					});
				}
				return false;
			// エラーがない場合
			} else {
				// CustomBindCallBack
				if ( customBindCallback && typeof customBindCallback=='function' ) {
					customBindCallback();
				} else {
					// CustomSubmit
					if ( conf.customSubmit && typeof conf.customSubmit=='function' ) {
						conf.customSubmit();
						return false;
					// Default Postback
					} else {
						// OK
						if ( conf.callback && typeof conf.callback=='function' ) {
							conf.callback();
						}
					}
				}
			}
		}
		
		// When the form is submited
		form.submit(_exeValidation);
		
		// Add the Validation
		if ( conf.customBind ) {
			conf.customBind.object.bind(conf.customBind.listener, function() {
				_exeValidation(conf.customBind.callback);
				return false;
			});
		}
		
		// Return the instance
		return this;
	}
	
	exValidation.prototype.generateErr = function(id, formID) {
		return [
			'<div id="err_'+id+'" class="formError userformError'+' '+formID+'">',
				'<div class="msg formErrorContent"/>',
				'<div class="formErrorArrow">',
					'<div class="line10"/>',
					'<div class="line9"/>',
					'<div class="line8"/>',
					'<div class="line7"/>',
					'<div class="line6"/>',
					'<div class="line5"/>',
					'<div class="line4"/>',
					'<div class="line3"/>',
					'<div class="line2"/>',
					'<div class="line1"/>',
				'</div>',
			'</div>'
		].join('');
	}
	
	exValidation.prototype.returnReg = function() {
		var validationClasses = '';
		for( var c in validationRules ) {
			validationClasses += c+'|';
		}
		validationClasses = validationClasses.replace(/\|$/,'');
		return new RegExp(validationClasses);
	}
	
	
	exValidation.prototype.insertErrMsg = function(t, id, errMsg) {
		$('.msg', '#err_'+id).html(errMsg);
		this.getErrHeight(id);
	}
	
	exValidation.prototype.basicValidate = function(t, err, ok) {
		//console.debug('basicValidate');
		var CL = $(t).attr('class'),
			chk = validationRules,
			id = $(t).attr('id'),
			txt = '',
			_this = this;
		
		if ( $(t).hasClass('group') ) {
			var groupInputs = $(_this.conf.groupInputs, t);
			groupInputs.each(function(i) {
				txt += $(this).val();
			});
		} else {
			txt = $(t).val();
		}
		
		var check = {
			isError: false,
			failed: function(t, c) {
				var msg = chk[c][0];
				//console.debug(msg);
				if ( c.match(/min/i) && CL.match(/min(\d+)/i) ) {
					msg = RegExp.$1+msg;
				} else
				if ( c.match(/max/i) && CL.match(/max(\d+)/i) ) {
					msg = RegExp.$1+msg;
				} else
				if ( t.nodeName=='SELECT' ) { // select要素の場合はメッセージを変える
					msg = '選択してください';
				}
				
				if( err && typeof err == 'function' ) {
					err(t, id, _this.conf.errPrefix + msg);
				} else {
					$(t).addClass('err');
					$('#err_'+id).fadeIn();
					_this.insertErrMsg(t, id, _this.conf.errPrefix + msg);
				}
				this.isError = true;
			}
		}
		for ( c in chk ) {
			//console.log(c+'\n'+dirCheck)
			//if(!dirCheck && !c.match(/checkDir/)){
				//console.debug(CL);
				//console.debug(c);
				if ( CL.match(c) ) {
					if ( typeof(chk[c][1]) != 'function' ) {
						//console.debug('1')
						if ( txt && !txt.match(chk[c][1]) ) {
							check.failed(t,c);
							break;
						}
					} else {
						//console.debug('2')
						if ( !chk[c][1](txt,t) ) {
							check.failed(t,c);
							break;
						}
					}
				}
			//}
		}
		
		if ( !check.isError ) {
			if ( ok && typeof ok == 'function' ) {
				ok(t,id);
			} else {
				$(t).removeClass('err');
				$('#err_'+id).fadeOut();
			}
		}
	}
		
	exValidation.prototype.getErrHeight = function(id, zIndex) {
		var input = $('#'+id),
			target = input.is(':hidden') ? input.next() : input,
			pos = target.offset(),
			left = target.hasClass('errPosRight')
				? pos.left + target.attr('offsetWidth') - 40
				: pos.left - 20,
			err = $('#err_'+id).css({
				position: 'absolute',
				top: pos.top - $('#err_'+id).attr('offsetHeight') - 5,
				left: left
			});
		
		if ( zIndex ) {
			err.css('zIndex', zIndex);
		}
	}
		
	exValidation.prototype.laterCall = function() {
		// this is noop, you can execute any function here as you like
	}
		
	exValidation.prototype.serializeParams = function() {
		
	}
	
	exValidation.prototype.exec = function() {
	
	}	
	
	$.fn.exValidation = function(options) {
		return new exValidation(this, options);
	}
	
	// エラーダイアログ関連
	exValidationdialog = {
		ids: {
			mat: "dlgmat",
			me: "dlg",
			top: "dlgtop",
			cont: "dlgcont",
			btm: "dlgbtm",
			close: "close"
		},
		create: function(msgs) {
			var dialogMat = document.createElement("div");
			var dialog = document.createElement("div");
			var closeBtn = document.createElement("span");
			var id = $.dialog.ids;
			var clearDialog = function(){
				$(dialog).fadeTo(1,0).hide();
				$(dialogMat).fadeTo(1,0).hide();
				
				// IE6でselectとobjectが全面に来る対策 - 表示
				$("select:hidden,object:hidden").css("visibility","visible");
			}
			$("body").keyup(function(e){if(e.keyCode==27) clearDialog();});
			$(dialogMat).attr("id",id.mat).fadeTo(1,0).click(function(){clearDialog();}).hide();
			$(closeBtn).attr("id",id.close).click(function(){clearDialog();})
				.hover(function(){$(this).addClass("hover");},function(){$(this).removeClass("hover");});
				
			/* 以下のようなHTMLを掃き出す -- span以外の空要素はデザイン用
			<div id="digmat" />
			<div id="dlg">
				<div id="dlgtop" />
				<div id="dlgcont">
					<div>
						<span>--Message--</span>
					</div>
				</div>
				<div id="dlgbtm" />
				<span id="close" title="--Message--" />
			</div>
			*/
			$(dialog).append("<div id='"+id.top+"'></div><div id='"+id.cont+"'><div><span></span></div></div><div id='"+id.btm+"'></div>");
			$("body").append(dialogMat).append(dialog);
			var d = {
				width: $(dialog).width(),
				height: $(dialog).height()
			}
			$(dialog).attr("id",id.me).append(closeBtn);
			$("div span","#"+id.cont).html(msgs);
			
			// div要素を一度inlineにして、文字列の幅と高さを得る
			$(dialog).css("display","inline");
			$("div",dialog).css("display","inline");
			$("div","#"+id.cont).css("display","block");
			
			// IE6は幅を指定する
			if(typeof document.body.style.maxHeight == "undefined") $(dialog).width($(dialog).width());
			$(dialog).hide().fadeTo(1,0);
		},
		fadeIn: function(msgs,options){
			var setting = $.extend({
				duration: "fast",
				matOpacity: .6,
				dialogOpacity: .9,
				closeTitle: "このメッセージを閉じる"
			},options);
			var id = $.dialog.ids;
			$("#"+id.cont+" div span").html(msgs);
			$("#"+id.me).show();
			var d = {
				width: $("#"+id.me).width(),
				height: $("#"+id.me).height()
			}
			$("#"+id.me).css("display","block");
			$("div","#"+id.me).css("display","block");
			$("#"+id.close).attr("title",setting.closeTitle);
			$("#"+id.mat).show().fadeTo(setting.duration,setting.matOpacity);
			$("#"+id.me).fadeTo(setting.duration,setting.dialogOpacity).css({
			  "margin-left": "-"+d.width/2+"px"
			});
			
			// IE6以外は以下でダイアログの位置を決める(IE6はCSS内expressionで指定
			if(typeof document.body.style.maxHeight != "undefined"){
				$("#"+id.me).css({
					"margin-top": "-"+(parseInt(d.height/2))+"px"
				});
				
				// IE7は空要素(div#dlgtop, div#dlgbtm)に最低幅を指定
				if(document.all) $("#"+id.top+",#"+id.btm).css("min-width",d.width);
			}else{
				
				// IE6でselectとobjectが全面に来る対策 - 非表示にする
				$("select,object").css("visibility","hidden");
			}
		}
	}
	
	// Return random number for ID
	function randomInt() {
		return Math.floor(Math.random()*10)+1;
	}

})(jQuery);