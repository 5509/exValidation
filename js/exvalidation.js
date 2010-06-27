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
			var bindingListener = 'blur click';//$.browser.msie ? 'blur click' : 'blur';
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
	
	// Return random number for ID
	function randomInt() {
		return Math.floor(Math.random()*10)+1;
	}

})(jQuery);