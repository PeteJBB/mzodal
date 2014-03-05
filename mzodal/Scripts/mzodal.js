(function ($) {

	$.extend(true, $, {
		"mzodal": new mzodal()
	});

	function mzodal() {
		var elem;
		var self = this;
		var requestId = 0; // used for tracking get/posts

		// back / history collection
		var htmlStack = [];

		function init() {
			elem = $(".mzodal");
			elem.click(elem_click);

			// modal buttons
			elem.on("click", ".modal-back", modal_back_click);
			elem.on("click", ".modal-close", function () { hide(true); });
			
			$(window).resize(window_resize);

			$(document).on("click", ".js-mzodal", function (e) {
				e.preventDefault();
				var link = $(this);
				var href = link.attr("href") || link.data("href");
				get(href);
			});
		}

		function elem_click(e) {
			if (e.target == elem.get(0) && !elem.find(">div").is(".noclose")) {
				hide();
			} 
		}

		function document_keydown(e) {
			if (e.keyCode == 27) { // ESCAPE
				hide();
			}
		}

		// smooth resizing of modal window while changing content
		// css transitions at play here
		function setHtml(html) {
			var oldElem = elem.find("> div");
			var newElem = (html instanceof jQuery) ? html : $(html);

			// for repeat named pages, remove old item item from history
			var newViewName = newElem.data("name");
			var prevViewName = htmlStack.length ? $(htmlStack[htmlStack.length - 1]).data("name") : null;
			if (newViewName && newViewName == prevViewName) {
				htmlStack.pop();
			}
			
			// add page to history
			if (!newElem.is(".nostack")) {
				htmlStack.push(newElem);
			}

			if (elem.is(":visible")) {
				self.onUnload.notify();

				// resize that shiz with sweet animations
				var old_h = oldElem.height();
				var old_w = oldElem.width();
				var old_ml = oldElem.css("marginLeft");
				var old_mt = oldElem.css("marginTop");

				elem.html(newElem);
				newElem.children().css("opacity", 0);

				var new_h = newElem.height();
				var new_w = newElem.width();
				var new_ml = newElem.css("marginLeft");
				var new_mt = (-new_h / 2) + "px";

				newElem.height(old_h).width(old_w).css("marginTop", old_mt).css("marginLeft", old_ml);

				if (new_h != old_h) {
					// run animation on newElem - need to reselect with jquery for this to work
					elem.find("> div").animate({
						height: new_h,
						width: new_w,
						marginLeft: new_ml,
						marginTop: new_mt
					}, 300, "swing", function () {
						$(this).css("height", "").css("width", "").css("marginLeft", "").children().animate({ opacity: 1 }, 100);
					});
				}
				else {
					// simple fade in new content
					newElem.children().animate({ opacity: 1 }, 100);
				}
			}
			else {
				// fade in new modal
				elem.css("opacity", 0);
				elem.show();
				elem.html(newElem);
				newElem.css("marginTop", (-newElem.height() / 2) + "px");
				elem.animate({ opacity: 1 }, 200);

				$(document).bind("keydown", document_keydown);
				$(window).bind("resize", window_resize);
			}

			self.onLoad.notify();
		}

		function window_resize(e) {
			autoHeight();
		}

		function autoHeight() {
			var div = elem.find("> div");
			div.css("height", "");
			var mt = (-div.height() / 2) + "px";
			div.css("marginTop", mt);
		}

		function showSpinner(modalSize) {
			var minHeight = elem.is(":visible") ? 100 : 200;
			
			var spinner = $("<div class='nostack'><div style='height:" + minHeight + "px'><div class='spin l'></div></div></div>");

			if (modalSize || !elem.is(":visible")) {
				// set standard size
				modalSize = modalSize || "xs";
				spinner.addClass(modalSize);
			}
			else {
				// retain modal size
				var div = elem.find("> div");
				var size = div.hasClass("xs") ? "xs"
					: div.hasClass("s") ? "s"
					: div.hasClass("m") ? "m"
					: div.hasClass("l") ? "l"
					: "";
				spinner.addClass(size);

				var h = Math.max(div.height(), minHeight);
				spinner.height(h);

				spinner.css("marginLeft", div.css("marginLeft"));
				spinner.css("marginTop", div.css("marginTop"));
			}
			setHtml(spinner);
		}

		function hide(force) {
			var args = { cancel: false };
			self.onClosing.notify(args);

			if (force || !args.cancel) {
				// prevent any pending get/post from bring the window up again
				requestId++;

				// hide modal
				elem.empty().fadeOut(200);

				// clean up
				htmlStack = [];
				self.onUnload.notify();
				$(document).unbind("keydown", document_keydown);
				$(window).unbind("resize", window_resize);
			}
		}

		function modal_back_click(e) {
			e.preventDefault();
			goBack();
		}

		function goBack() {
			// skip current entry
			htmlStack.pop();
			// get previous entry
			var html = htmlStack.pop();
			if (html && html.length) {
				setHtml(html, true);
			}
			else
				hide();
		}

		function getMaxHeight() {
			return Math.floor($(window).height() * 0.9);
		}

		function get(url, args, customSpinnerHtml) {
			if (customSpinnerHtml)
				setHtml(customSpinnerHtml);
			else
				showSpinner();

			var uid = ++requestId;
			var promise = $.get(url, args, function (result) {
				if (uid == requestId)
					setHtml(result);
			})
			.fail(function (jqXHR) {
				if (jqXHR.responseText)
					setHtml("<div>" + jqXHR.responseText + "<div>");
				else
					hide(true); // cancelled or empty result
			});
			return promise;
		}

		function post(url, args, customSpinnerHtml) {
			if (customSpinnerHtml)
				setHtml(customSpinnerHtml);
			else
				showSpinner();

			var uid = ++requestId;
			var promise = $.post(url, args, function (result) {
				if (uid != requestId)
					return;
				setHtml(result);
			})
			.fail(function (jqXHR) {
				if (uid != requestId)
					return;

				if(jqXHR.responseText)
					setHtml("<div>" + jqXHR.responseText + "<div>");
				else
					hide(true);
			});
			return promise;
		}

		// Public API
		$.extend(this,
		{
			// Methods
			"showSpinner": showSpinner,
			"setHtml": setHtml,
			"hide": hide,
			"goBack": goBack,
			"autoHeight": autoHeight,
			"get": get,
			"post": post,
			"getMaxHeight": getMaxHeight,

			// Events
			
			"onClosing": new easyEvent(), // fired as modal attempts to close - can be aborted
			"onLoad": new easyEvent(), // fired after modal has loaded new HTML
			"onUnload": new easyEvent()		// fired when html changes or window is closed - use to unbind events within a modal
		});

		$(document).ready(init);

		return this;
	};
})(jQuery);