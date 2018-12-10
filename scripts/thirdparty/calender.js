		/*
		 * jQuery Mobile: jQuery UI Datepicker Monkey Patch
		 * https://salman-w.blogspot.com/2014/03/jquery-ui-datepicker-for-jquery-mobile.html
		 */
		(function() {
			// use a jQuery Mobile icon on trigger button
			$.datepicker._triggerClass += " ui-btn ui-btn-right ui-icon-carat-d ui-btn-icon-notext ui-corner-all";
			// replace jQuery UI CSS classes with jQuery Mobile CSS classes in the generated HTML
			$.datepicker._generateHTML_old = $.datepicker._generateHTML;
			$.datepicker._generateHTML = function(inst) {
				return $("<div></div>").html(this._generateHTML_old(inst))
					.find(".ui-datepicker-header").removeClass("ui-widget-header ui-helper-clearfix").addClass("ui-bar-inherit").end()
					.find(".ui-datepicker-prev").addClass("ui-btn ui-btn-left ui-icon-carat-l ui-btn-icon-notext").end()
					.find(".ui-datepicker-next").addClass("ui-btn ui-btn-right ui-icon-carat-r ui-btn-icon-notext").end()
					.find(".ui-icon.ui-icon-circle-triangle-e, .ui-icon.ui-icon-circle-triangle-w").replaceWith(function() { return this.childNodes; }).end()
					.find("span.ui-state-default").removeClass("ui-state-default").addClass("ui-btn").end()
					.find("a.ui-state-default.ui-state-active").removeClass("ui-state-default ui-state-highlight ui-priority-secondary ui-state-active").addClass("ui-btn ui-btn-active").end()
					.find("a.ui-state-default").removeClass("ui-state-default ui-state-highlight ui-priority-secondary").addClass("ui-btn").end()
					.find(".ui-datepicker-buttonpane").removeClass("ui-widget-content").end()
					.find(".ui-datepicker-current").removeClass("ui-state-default ui-priority-secondary").addClass("ui-btn ui-btn-inline ui-mini").end()
					.find(".ui-datepicker-close").removeClass("ui-state-default ui-priority-primary").addClass("ui-btn ui-btn-inline ui-mini").end()
					.html();
			};
			// replace jQuery UI CSS classes with jQuery Mobile CSS classes on the datepicker div, unbind mouseover and mouseout events on the datepicker div
			$.datepicker._newInst_old = $.datepicker._newInst;
			$.datepicker._newInst = function(target, inline) {
				var inst = this._newInst_old(target, inline);
				if (inst.dpDiv.hasClass("ui-widget")) {
					inst.dpDiv.removeClass("ui-widget ui-widget-content ui-helper-clearfix").addClass(inline ? "ui-content" : "ui-content ui-overlay-shadow ui-body-a").unbind("mouseover mouseout");
				}
				return inst;
			};
		})();