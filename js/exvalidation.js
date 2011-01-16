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
		if ( form.length > 1 ) alert('You cannot select any forms ');
		
		this.form = form;
		// for browse
		var _this = this,
			conf = this.conf = $.extend({
				errInsertPos: 'body', // 'body' or after(before)
				err: null,
				ok: null,
				errFocus: false,
				errHoverHide: false,
				stepValidation: false,
				scrollToErr: true,
				scrollDuration: 500,
				scrollAdjust: -10,
				customScrollAdjust: false,
				errPosition: 'absolute', // fixed
				errTipPos: 'right', // left
				errTipCloseBtn: true,
				errTipCloseLabel: '×',
				errZIndex: 500,
				errMsgPrefix: '\* ',
				customAddError: null, // function(){}
				customClearError: null, // function(){}
				customSubmit: null, // function(){}
				customListener: 'blur keyup change focus',
				customBind: null,
				/* Using this conf, you can bind validation func to any element
					{
						object: $(button),
						listener: 'blur keyup change focus',
						callback: function() {}
					}
				*/
				customGetErrHeight: null,
				firstValidate: false,
				inputs: 'input:text,input:password,input:hidden,textarea,select,[class*="group"],[class*="radio"],[class*="checkbox"]',
				groupInputs: 'input:text,input:password,input:checkbox,input:radio,select,textarea'
			}, conf || {});
			
		this.errFocus = function(id) {
			if ( !conf.errFocus ) return false;
			errFocus(id, conf.errZIndex);
		}
		this.errFocusClear = function() {
			if ( !conf.errFocus ) return false;
			errFocusClear(conf.errZIndex);
		}			
			
		if ( fnConfirmation(conf.customSubmit) ) {
			form.submit(function() {
				return false;
			});
		}
		$('input:checkbox,input:radio,input:button,input:submit,input:reset').click(function() {
			_this.errFocusClear();
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
			classReg = returnReg(),
			idReg = '',
			bindValidateFuncs = function(target, group) {
				var self = group ? group : target;
				target.bind(conf.customListener, function() {
					_this.basicValidate(group ? group : this, conf.err, conf.ok);
					_this.errFocus('#err_' + self.attr('id'));
				}).blur(function() {
					_this.errFocusClear();
				});
			}
			
		inputs.each(function() {
			var self = $(this),
				cl = this.className,
				offset = self.offset(),
				id = this.id;

			if ( conf.errTipPos == 'right' ) {
				self.addClass('errPosRight');
			}
			
			// if target has one of classRegulations
			if( cl.match(classReg) ) {
				if ( conf.errInsertPos=='body' ) {
					$('body').append(_this.generateErr(id, formID));
				} else {
					self[conf.errInsertPos](_this.generateErr(id, formID));
					self.addClass(conf.errInsertPos);
				}
				
				if ( conf.errHoverHide ) {
					$('#err_'+id).mouseenter(function() {
						$(this).fadeOut();
					});
				}
				if ( conf.errTipCloseBtn ) {
					$('#err_'+id).append(
						$('<span/>')
							.addClass('formErrorClose')
							.text(conf.errTipCloseLabel)
							.click(function() {
								$(this).parent().fadeOut();
							})
					);
				}
				
				if ( conf.errPosition=='absolute' ) {
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
			inputs.each(function() {
				if ( $(this).hasClass('group') ) {
					var self = $(this);
					bindValidateFuncs($(conf.groupInputs, self), self);
				} else {
					var self = $(this);
					bindValidateFuncs(self);
				}
			});
		}
		
		// You call this func everytime you like after init
		this.laterCall = function(t) {
			_this.basicValidate(t, conf.err, conf.ok);
		}
				
		function _exeValidation(customBindCallback) {
			if ( conf.firstValidation ) {
				inputs.unbind('blur keyup change click');
				conf.firstValidate = false;
			}
			inputs.each(function() {
				var self = $(this);
				_this.basicValidate(this, conf.err, conf.ok, true);
				
				if ( self.hasClass('group') ) {
					bindValidateFuncs($(conf.groupInputs, self), self);
				} else {
					bindValidateFuncs(self);
				}
			});
			
			var err = $('.formError:visible[class*="'+formID+'"]');
			// if errs are displayed
			if ( err.length>0 ) {
				if ( fnConfirmation(conf.customAddError) ) {
					conf.customAddError();
				}
				if ( conf.scrollToErr ) {
					var reverseOffsetTop,
						scrollTarget = $.support.boxModel
							? navigator.appName.match(/Opera/) ?
								'html' : 'html,body'
							: 'body';
					if ( !conf.customScrollAdjust ) {
						reverseOffsetTop = $(err[0]).offset().top,
							errTop = $(err[0]);
								
						for ( var i=0; i<err.length; i++ ) {
							reverseOffsetTop = $(err[i]).offset().top < reverseOffsetTop
								? $(err[i]).offset().top : reverseOffsetTop;
							errTop = $(err[i]).offset().top < reverseOffsetTop
								? $(err[i]) : errTop;
						}
						
						if ( conf.errPosition == 'fixed' ) {
							reverseOffsetTop -= $('#'+errTop.attr('id').replace('err_', ''))
													.attr('offsetHeight');
						}
					} else {
						reverseOffsetTop = fnConfirmation(conf.customScrollAdjust)
							? parseFloat(conf.customScrollAdjust()) : parseFloat(conf.customScrollAdjust);
					}
					
					$(scrollTarget).animate(
						{
							scrollTop: reverseOffsetTop + conf.scrollAdjust
						},
						{
							easing: $.easing.easeInOutCirc ? 'easeInOutCirc' : 'swing',
							duration: conf.scrollDuration
						}
					);
					return false;
				} else
				return false;
				
			// if no err is displayed
			} else {
				if ( fnConfirmation(conf.customClearError) ) {
					// falseが返ってきた場合はキャンセルする
					var result = conf.customClearError();
					if ( result === false ) return false;
				}	
				// CustomBindCallBack
				if ( fnConfirmation(customBindCallback) ) {
					customBindCallback();
					return false;
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
	
	// Common prototype functions
	exValidation.prototype = {
		// Errtip content
		// this HTML source code from "A jQuery inline form validation, because validation is a mess"
		// thanks to http://bit.ly/onlNv (http://www.position-relative.net/)
		generateErr: function(id, formID) {
			return [
				'<div id="err_'+id+'" class="formError userformError'+' '+formID+' '+this.conf.errPosition+'">',
					'<div class="formErrorMsg formErrorContent"/>',
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
		},
		// Insert error message
		insertErrMsg: function(t, id, c, errMsg) {
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
			$('.formErrorMsg', '#err_'+id).append(
				$('<span/>')
					.addClass('errMsg')
					.addClass(c)
					.text(errMsg)
				);
			this.getErrHeight(id);
		},
		// Basic get error height
		getErrHeight: function(id, zIndex) {
			if ( this.conf.errPosition != 'absolute' ) return false;
			var input = $('#'+id),
				err = $('#err_'+id),
				target = input.is(':hidden') ? input.next() : input,
				pos = target.offset();
			
			if ( !!pos ) {
				var left = target.hasClass('errPosRight')
						? pos.left + target.attr('offsetWidth') - 40
						: pos.left - 20;
						
				err.css({
					position: 'absolute',
					top: pos.top - err.attr('offsetHeight'),
					left: left
				});
			}
			
			if ( zIndex ) {
				err.css('zIndex', zIndex);
			}
		},
		// Basic validation
		basicValidate: function(t, err, ok) {
			var CL = $(t).attr('class'),
				chk = validationRules,
				id = $(t).attr('id'),
				txt = '',
				_this = this;
			
			if ( $(t).hasClass('group') ) {
				var groupInputs = $(_this.conf.groupInputs, t);
				groupInputs.each(function(i) {
					txt += $(this).val();
					if( CL.match(/email/) && i==0 && $(this).val().length>0 )
						txt += "@";
				});
			} else {
				txt = $(t).val();
			}
			
			var check = {
				isError: false,
				failed: function(t, c) {
					var msg = chk[c][0];
					if ( c.match(/min/i) && CL.match(/min(\d+)/i) ) {
						msg = RegExp.$1 + msg;
					} else
					if ( c.match(/max/i) && CL.match(/max(\d+)/i) ) {
						msg = RegExp.$1 + msg;
					}
					
					if( fnConfirmation(err) ) {
						err(t, id, _this.conf.errMsgPrefix + msg);
					} else {
						$(t).addClass('err');
						$('.'+c, '#err_'+id).show();
						$('#err_'+id).fadeIn();
						_this.insertErrMsg(t, id, c, _this.conf.errMsgPrefix + msg);
						_this.getErrHeight(id);
					}
					this.isError = true;
				}
			}

			var c;
			for ( c in chk ) {
				if ( $(t).hasClass(c)
				|| (c == 'min' && CL.match(/(?:\s+|^)min\d+(?:\s+|$)/) )
				|| (c == 'max' && CL.match(/(?:\s+|^)max\d+(?:\s+|$)/) )
				|| ( CL.match(c) && CL.match(/retype/) ) ) {
					if ( typeof(chk[c][1]) != 'function' ) {
						if ( !txt.match(chk[c][1]) ) {
							check.failed(t, c);
						} else
						if ( _this.conf.stepValidation ) {
							if ( $('.errMsg:visible', '#err_'+id).length > 1 ) {
								$('.'+c, '#err_'+id).hide();
								_this.getErrHeight(id);
							}
						}
					} else {
						if ( !chk[c][1](txt, t) ) {
							check.failed(t, c);
						} else
						if ( _this.conf.stepValidation ) {
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
	}
	
	// Common functions
	function returnReg() {
		var validationClasses = '';
		for( var c in validationRules ) {
			validationClasses += '(?:\\s+|^)'+c+'(?:\\s+|$)|';
		}
		validationClasses += '(?:\\s+|^)min\\d+(?:\\s+|$)|';
		validationClasses += '(?:\\s+|^)max\\d+(?:\\s+|$)|';
		validationClasses = validationClasses.replace(/\|$/,'');
		return new RegExp(validationClasses);
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
	function fnConfirmation(fn) {
		return fn && typeof fn=='function';
	}
	function randomInt() {
		return Math.floor(Math.random()*10)+1;
	}
	
	// Extense the namespace of jQuery as method
	// This function returns instance
	$.fn.exValidation = function(options) {
		return new exValidation(this, options);
	}
	if ( !$.fn.validation ) {
		$.fn.validation = $.fn.exValidation;
	}

})(jQuery);