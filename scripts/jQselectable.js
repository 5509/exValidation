/*
	title: jQuery.jQselectable.js (ex jQuery.selectable.js)
	required: jQuery(tested on 1.3.2)
	encoding: UTF-8
	copy: Copyright 2008-2010 nori (norimania@gmail.com)
	license: MIT
	author: 5509 - http://moto-mono.net
	archive: http://jqselectable.googlecode.com/
	modified: 2010-01-09 21:48
	rebuild: 2009-09-16 22:48
	date: 2008-09-14 02:34
 */

(function($){
	
	// jQuery.jQselectable
	// Make selectbox so usuful and accesible
	// @ 2010-01-09
	var jQselectable = function(select,options,temp){
		this.conf = {
			style: 'selectable', // or 'simple'
			set: 'show', // 'show', 'slideDown' or 'fadeIn'
			out: 'hide', // 'hide', 'slideUp' or 'fadeOut'
			setDuration: 'normal', // 'slow', 'normal', 'fast' or int(millisecond)
			outDuration: 'normal',
			opacity: 1, // pulldown opacity
			top: 0,
			left: 0,
			callback: null
		}
		this.temp = {
			selectable: '<div class="sctble_cont"/>',
			simpleBox: '<div class="simple_cont"/>'
		}
		
		// Extend confs and temps by user options
		$.extend(this.conf,options || {});
		$.extend(this.temp,temp || {});
		
		this.target = $(select);
		this.attrs = {
			id: this.target.attr('id'),
			cl: this.target.attr('class')
		}
		this.generatedFlg = false;
		
		// Init start
		this.init();
	}
	
	jQselectable.prototype = {
		// Init selectable
		// @ 10-01-09 21:00
		init: function(){
			// Build selectable
			this.build();
			// Event apply
			this.bind_events();
			// Switch flag true
			this.generatedFlg = true;
		},
		
		// Rebuild selectable
		// @ 09-09-18 17:28
		rebuild: function(){
		
			//console.log('called rebuild');
		
			// unbind events from elements related selectable
			this.m_input.unbind();
			this.mat.unbind();
			$('a',this.mat).unbind();
			$('label[for="'+this.attrs.id+'"]').unbind();
			
			// Build selectable
			this.build();
			
			// Event apply
			this.bind_events();
		},
		
		// Building selectable from original select element
		// @ 2010-01-09 21:00
		build: function(){
			
			// Declare flag
			var has_optgroup = $('optgroup',this.target).length>0 ? true : false;
			
			var _this = this;
			var generate_anchors = function(obj,parent){
				var _a = $('<a/>');
				$(parent).append(_a);
				
				_a.text(obj.text()).attr({
					href: '#'+encodeURI(obj.text()),
					name: obj.val()
				});
				
				if(obj.is(':selected')){
					_this.m_text.text(obj.text());
					_a.addClass('selected');
				}
				if(obj.hasClass('br')){
					_a.after('<br/>');
				}
			}
			
			if(!this.m_input){
				this.m_input = $('<a/>');
				this.m_text = $('<span/>');
				var _style = this.conf.style.match(/simple/) ? 'sBox' : 'sctble';
				
				this.m_input.append(this.m_text).attr({
					id: this.attrs.id+'_dammy',
					href: '#'
				}).addClass('sctble_display').addClass(_style).addClass(this.attrs.cl).insertAfter(this.target);
				
				this.target.hide();
				
				this.mat = $('<div/>');
				
				// Customized
				if(_style=='simple'){
					this.mat.append(this.temp.selectable);
				}else{
					this.mat.append(this.temp.simpleBox);
				}
				// Customized end
				this.mat.attr({
					id: this.attrs.id+'_mat'
				}).addClass(_style).addClass(this.attrs.cl);
			}
			
			// For rebuilding
			if(this.generatedFlg){
				this.mat.empty();
				
				if(_style=='simple'){
					this.mat.append(this.temp.selectable);
				}else{
					this.mat.append(this.temp.simpleBox);
				}
			}
			
			this._div = $('<div class="body"/>');
			if(has_optgroup){
				this.mat.addClass('otpgroup');
				var _optgroup = $('optgroup',this.target);
				var _option = [];
				
				for(var i=0;i<_optgroup.length;i++){
					_option[i] = $('option',_optgroup[i]);
				}
				
				var _dl = $('<dl/>');
				for(var i=0;i<_optgroup.length;i++){
					var _dt = $('<dt/>');
					_dt.text($(_optgroup[i]).attr('label'));
					var _dd = $('<dd/>');
					for(var j=0;j<_option[i].length;j++){
						generate_anchors($(_option[i][j]),_dd);
					}
					_dl.append(_dt).append(_dd);
				}
				this._div.append(_dl).addClass('optg');
				$('div',this.mat).append(this._div);
				
			}else{
				this.mat.addClass('nooptgroup');
				var _option = $('option',this.target);
				for(var i=0;i<_option.length;i++){
					generate_anchors($(_option[i]),this._div);
				}
				$('div',this.mat).append(this._div.addClass('nooptg'));
			}
			
			// For rebuilding
			if(!this.generatedFlg){
				$('body').append(this.mat);
				this.mat.addClass('sctble_mat').css({
					position: 'absolute',
					zIndex: 1000,
					display: 'none'
				});
				$('*:first-child',this.mat).addClass('first-child');
				$('*:last-child',this.mat).addClass('last-child');
			}
			
			// This is for IE6 that doesn't have "max-height" properties
			if(document.all && typeof document.body.style.maxHeight == 'undefined'){
				if(this.conf.height<this.mat.height()){
					$(this._div).css('height',this.conf.height);
				}
			// Other browsers
			}else{
				$(this._div).css('maxHeight',this.conf.height);
			}
		},
		
		// Bind events
		// @ 09-09-17 22:59
		bind_events: function(){
			var _this = this;
			// Flag checking where the events was called
			var is_called = true;
			
			var set_pos = function(){
				var _pos = _this.m_input.offset();
				_this.mat.css({
					top: _pos.top + _this.m_input.height()*1.3 + _this.conf.top,
					left: _pos.left + _this.conf.left
				});
			}
			
			// Hide all mats are displayed
			var mat_hide = function(){
				var _mat = $('.sctble_mat');
				switch(_this.conf.out){
					case 'slideUp':
						_mat.slideUp(_this.conf.outDuration);
						break;
					case 'fadeOut':
						_mat.fadeOut(_this.conf.outDuration);
						break;
					default:
						_mat.hide();
						break;
				}
			}
			
			// Show the mat
			var mat_show = function(){
				mat_hide();
				switch(_this.conf.set){
					case 'slideDown':
						_this.mat.slideDown(_this.conf.setDuration).css('opacity',_this.conf.opacity);
						break;
					case 'fadeIn':
						_this.mat.css({
							display: 'block',
							opacity: 0
						}).fadeTo(_this.conf.setDuration,_this.conf.opacity);
						break;
					default:
						_this.mat.show().css('opacity',_this.conf.opacity);
						break;
				}
				
				var _interval = isNaN(_this.conf.setDuration) ? null : _this.conf.setDuration+10;
				if(_interval==null){
					if(_this.conf.setDuration.match(/slow/)){
						interval = 610;
					}else if(_this.conf.setDuration.match(/normal/)){
						interval = 410;
					}else{
						interval = 210;
					}
				}
				
				var _chk = setInterval(function(){
					$('a.selected',_this.mat).focus();
					clearInterval(_chk);
				},_interval);
			}
			
			// Call selectable
			this.m_input.click(function(event){
				set_pos();
				$(this).addClass('sctble_focus');
				$('a.sctble_display').not(this).removeClass('sctble_focus');
				
				mat_show();
				event.stopPropagation();
				return false;
			}).keyup(function(event){
				if(is_called){
					set_pos();
					mat_show();
					event.stopPropagation();
				}else{
					is_called = true;
				}
			});
			
			// Stop event propagation
			this.mat.click(function(event){
				event.stopPropagation();
			});
			
			// Hide the mat
			$('body,a').not('a.sctble_display').click(function(event){
				$('a.sctble_display').removeClass('sctble_focus');
				mat_hide();
			}).not('a').keyup(function(event){
				if(event.keyCode=='27'){
					$('a.sctble_focus').removeClass('sctble_focus');
					is_called = false;
					_this.m_input.blur();
					mat_hide();
				}
			});
			
			// Click value append to both dummy and change original select value
			$('a',this.mat).click(function(){
				var self = $(this);
				_this.m_text.text(decodeURI(self.attr('href').split('#')[1]));
				$('option[value="'+self.attr('name')+'"]',_this.target).attr('selected','selected');
				$('.selected',_this.mat).removeClass('selected');
				self.addClass('selected');
				_this.m_input.removeClass('sctble_focus');
				is_called = false;
				mat_hide();
				
				if(_this.conf.callback && typeof _this.conf.callback=='function'){
					_this.conf.callback.call(_this.target);
				}
				
				_this.m_input.focus();
				return false;
			});
			
			// Be able to click original select label
			$('label[for="'+this.attrs.id+'"]').click(function(event){
				set_pos();
				_this.m_input.addClass('sctble_focus');
				$('a.sctble_focus').not(_this.m_input).removeClass('sctble_focus');
				mat_show();
				event.stopPropagation();
				return false;
			});
		}
	}
	
	// Extense the namespace of jQuery as method
	// This function returns (the) instance(s)
	$.fn.jQselectable = function(options,temp){
		if($(this).length>1){
			var _instances = [];
			$(this).each(function(i){
				_instances[i] = new jQselectable(this,options,temp);
			});
			return _instances;
		}else{
			return new jQselectable(this,options,temp);
		}
	}
	
	// If namespace of jQuery.fn has 'selectable', this is 'jQselectable'
	// To prevent the interference of namespace
	// You can call 'selectable' method by both 'jQuery.fn.selectable' and 'jQuery.fn.jQselectable' you like
	if(!jQuery.fn.selectable){
		$.fn.selectable = $.fn.jQselectable;
	}
	
})(jQuery);