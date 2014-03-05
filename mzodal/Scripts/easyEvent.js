
(function ($)
{
	// register namespace
	$.extend(true, window, {
		"easyEvent": easyEvent
	});

	function easyEvent(legacyEvent) {
		this.legacyEvent = legacyEvent;
		var handlers = [];

		this.subscribe = function (fn) {
			handlers.push(fn);
		};

		this.unsubscribe = function (fn) {
			for (var i = handlers.length - 1; i >= 0; i--) {
				if (handlers[i] === fn)
					handlers.splice(i, 1);
			}
		};

		this.unsubscribeAll = function () {
			handlers = [];
		};

		this.notify = function (args, e, scope) {
			e = e || new easyEventData();
			scope = scope || this;

			var returnValue = null;
			for (var i = 0; i < handlers.length && !(e.isPropagationStopped() || e.isImmediatePropagationStopped()) ; i++) {
				returnValue = handlers[i].call(scope, e, args);
			}

			if (this.legacyEvent)
				$(document).trigger(this.legacyEvent, args);

			return returnValue;
		};
	}

	function easyEventData() {
		var isPropagationStopped = false;
		var isImmediatePropagationStopped = false;

		this.stopPropagation = function () {
			isPropagationStopped = true;
		};

		this.isPropagationStopped = function () {
			return isPropagationStopped;
		};

		this.stopImmediatePropagation = function () {
			isImmediatePropagationStopped = true;
		};

		this.isImmediatePropagationStopped = function () {
			return isImmediatePropagationStopped;
		};
	}
})(jQuery);