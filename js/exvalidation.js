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
 
//if ( window.console ) window.console = { log: function() {}, debug: function() {} };

var validationRules = {};
(function($) {
	
	var exValidation = function(form, conf) {
	
		if ( form.length > 1 ) alert('You cannot select any forms ');
		
		this.form = form;
		// for browse
		var _this = this,
			conf = this.conf = $.extend({
				errInsertPos: 'body', // 'body' or target before
				err: null,
				ok: null,
				scrollDuration: 500,
				scrollToErr: true,
				scrollAdjust: -10,
				position: 'absolute', // fixed
				errZIndex: 500,
				customSubmit: null, // function(){}
				customListener: 'blur keyup change focus',
				customBind: null,
				/*
					{
						object: $(button),
						listener: 'blur keyup change focus',
						callback: function() {}
					}
				*/
				customGetErrHeight: null,
				firstValidate: false,
				errPrefix: '\* ',
				errTipPos: 'right', // left
				inputs: 'input:text,input:password,input:hidden,textarea,select,[class*="group"],[class*="radio"],[class*="checkbox"]',
				groupInputs: 'input:text,input:password,input:checkbox,input:radio,select,textarea'
				//validationRules: null
			}, conf || {});
			
		if ( fnConfirmation(conf.customSubmit) ) {
			form.submit(function() {
				return false;
			});
		}
		$('input:checkbox, input:radio, input:button, input:submit, input:reset').click(function() {
			errFocusClear(conf.errZIndex);
		});
		
		// addClasses for each inputs by validation rules
		for ( var c in conf.rules ) {
			$('#'+c).addClass(conf.rules[c]);
		}
		
		// If this form doesn't have ID, formID for error tips is to be decided by random integer
		var formID = $(form).attr('id')
			? 'form_' + $(form).attr('id')
			: 'form_' + randomInt()*randomInt();
		
		var inputs = $(conf.inputs, form)
			.filter(function() { return !$(this).parents().hasClass('group'); }),
			classReg = _this.returnReg(),
			idReg = '';
			
		inputs.each(function() {
			var self = $(this),
				cl = this.className,
				offset = self.offset(),
				id = this.id;

			if ( conf.errTipPos == 'right' ) {
				self.addClass('errPosRight');
			}
			
			// classRegを含んでいなければ対象外
			if( cl.match(classReg) ) {
				if ( conf.errInsertPos=='body' ) {
					$('body').append(_this.generateErr(id, formID));
				} else {
					self.after(_this.generateErr(id, formID));
				}
				$('.userformError').mouseenter(function() {
					$(this).fadeOut();
				});
				
				if ( conf.position=='absolute' ) {
					if ( fnConfirmation(conf.customGetErrHeight) ) {
						_this.customGetErrHeight(id);
					} else {
						_this.getErrHeight(id, conf.errZIndex);
					}
					
					// Reget the position
					$(window).resize(function() {
						if ( fnConfirmation(conf.customGetErrHeight) ) {
							_this.customGetErrHeight(id);
						} else {
							_this.getErrHeight(id, conf.errZIndex);
						}
					});
				}
				$('#err_'+id).hide();
			}
		});
		
		if ( conf.firstValidate ) {
			var bindingListener = conf.customListener;//$.browser.msie ? 'blur click' : 'blur';
			inputs.each(function() {
				if ( $(this).hasClass('group') ) {
					var self = $(this);
					$(conf.groupInputs, self).bind(bindingListener, function() {
						_this.basicValidate(self, conf.err, conf.ok);
						errFocus('#err_' + self.attr('id'), conf.errZIndex);
					}).blur(function() {
						errFocusClear(conf.errZIndex);
					});
				} else {
					var self = $(this);
					self.bind(bindingListener, function(){
						_this.basicValidate(this, conf.err, conf.ok);
						errFocus('#err_' + self.attr('id'), conf.errZIndex);
					}).blur(function() {
						errFocusClear(conf.errZIndex);
					});
				}
			});
		}
		
		// You call this func everytime, everywhere you like after init
		this.laterCall = function(t) {
			_this.basicValidate(t, conf.err, conf.ok);
		}
				
		function _exeValidation(customBindCallback) {
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
						errFocus('#err_' + self.attr('id'), conf.errZIndex);
					}).blur(function() {
						errFocusClear(conf.errZIndex);
					});
				} else {
					self.bind(conf.customListener, function() {
						_this.basicValidate(this, conf.err, conf.ok);
						errFocus('#err_' + self.attr('id'), conf.errZIndex);
					}).blur(function() {
						errFocusClear(conf.errZIndex);
					});
				}
			});
			
			var err = $('.formError:visible[class*="'+formID+'"]');
			// エラーが表示されている場合は
			if ( err.length>0 ) {
				if ( conf.scrollToErr ) {
					var reverseOffsetTop = $(err[0]).offset().top,
						scrollTarget = $.support.boxModel
							? navigator.appName.match(/Opera/) ?
								'html' : 'html,body'
							: 'body';
							
					for ( var i=0; i<err.length; i++ ) {
						reverseOffsetTop = $(err[i]).offset().top < reverseOffsetTop
							? $(err[i]).offset().top : reverseOffsetTop;
					}
					$(scrollTarget).animate({
						scrollTop: reverseOffsetTop + conf.scrollAdjust
					}, {
						easing: $.easing.easeInOutCirc ? 'easeInOutCirc' : 'swing',
						duration: conf.scrollDuration
					});
				} else
				return false;
			// エラーがない場合
			} else {
				// CustomBindCallBack
				if ( fnConfirmation(customBindCallback) ) {
					customBindCallback();
				} else {
					// customSubmit
					if ( fnConfirmation(conf.customSubmit) ) {
						conf.customSubmit();
						return false;
					// Default Postback
					} else {
						// OK
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
			'<div id="err_'+id+'" class="formError userformError'+' '+formID+' '+this.conf.position+'">',
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
	
	
	exValidation.prototype.insertErrMsg = function(t, id, c, errMsg) {
		var msgs = $('.errMsg', '#err_'+id),
			returnFlg = true;	
		if ( msgs.length > 0 ) {
			$.each(msgs, function() {
				if ( $(this).hasClass(c) ) {
					returnFlg = false;
				}
			});
		}
		if ( !returnFlg ) return false;
		$('.msg', '#err_'+id).append(
			$('<span/>')
				.addClass('errMsg')
				.addClass(c)
				.text(errMsg)
			);
		this.getErrHeight(id);
	}
	
	exValidation.prototype.getErrHeight = function(id, zIndex) {
		if ( this.conf.position != 'absolute' ) return false;
	
		var input = $('#'+id),
			target = input.is(':hidden') ? input.next() : input,
			pos = target.offset(),
			left = target.hasClass('errPosRight')
				? pos.left + target.attr('offsetWidth') - 40
				: pos.left - 20,
			err = $('#err_'+id).css({
				position: 'absolute',
				top: pos.top - $('#err_'+id).attr('offsetHeight'),
				left: left
			});
		
		if ( zIndex ) {
			err.css('zIndex', zIndex);
		}
	}
			
	exValidation.prototype.basicValidate = function(t, err, ok) {
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
				if ( c.match(/min/i) && CL.match(/min(\d+)/i) ) {
					msg = RegExp.$1+msg;
				} else
				if ( c.match(/max/i) && CL.match(/max(\d+)/i) ) {
					msg = RegExp.$1+msg;
				}
				
				if( fnConfirmation(err) ) {
					err(t, id, _this.conf.errPrefix + msg);
				} else {
					$(t).addClass('err');
					$('#err_'+id).fadeIn();
					_this.insertErrMsg(t, id, c, _this.conf.errPrefix + msg);
					$('.'+c, '#err_'+id).show();
					_this.getErrHeight(id);
				}
				this.isError = true;
			}
		}
		for ( c in chk ) {
			if ( CL.match(c) ) {
				if ( typeof(chk[c][1]) != 'function' ) {
					if ( !txt.match(chk[c][1]) ) { // txt && !txt.match(chk[c][1])
						check.failed(t, c);
					} else {
						if ( $('.errMsg:visible', '#err_'+id).length > 1 ) {
							$('.'+c, '#err_'+id).hide();
							_this.getErrHeight(id);
						}
					}
				} else {
					if ( !chk[c][1](txt, t) ) {
						check.failed(t, c);
					} else {
						if ( $('.errMsg:visible', '#err_'+id).length > 1 ) {
							$('.'+c, '#err_'+id).hide();
							_this.getErrHeight(id);
						}
					}
				}
			}
		}
		
		if ( !check.isError ) {
			if ( fnConfirmation(ok) ) {
				ok(t, id);
			} else {
				$(t).removeClass('err');
				$('#err_'+id).fadeOut();
			}
		}
	}
		
	exValidation.prototype.serializeParams = function(elms) {
		var _params = elms.filter(function() { return this.name && this.name.length>0; }).serializeArray(),
			_sendParams = {};
		for ( var i=0; i<_params.length; i++ ) {
			_sendParams[_params[i].name] = _params[i].value ? _params[i].value : '';
		}
		return _sendParams;
	}
	
	// Extense the namespace of jQuery as method
	// This function returns (the) instance(s)
	$.fn.exValidation = function(options) {
		return new exValidation(this, options);
	}
	
	function errFocusClear(errZIndex) {
		$('.formError')
			.removeClass('fadeOut')
			.css('zIndex', errZIndex)
	}
	
	function errFocus(id, errZIndex) {
		$('.formError').removeClass('fadeOut').css('zIndex', errZIndex);
		$('.formError').not(id).addClass('fadeOut');
		$(id).css({
			zIndex: errZIndex + 100
		});
	}
	
	// Confirmation fn=='function'
	function fnConfirmation(fn) {
		return fn && typeof fn=='function';
	}
	
	// Return random number for ID
	function randomInt() {
		return Math.floor(Math.random()*10)+1;
	}

})(jQuery);