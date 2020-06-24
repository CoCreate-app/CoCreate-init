const CoCreateInit = {
	modules: new Map(),
	observer: null,

	/**
	 * register a new watch for an element 
	 * @param {function} initFunc the call function that is called when a mutation happen in selector
	 * @param {string} selector a css selector to watch for change
	 * @param {object} [instance=window] optional module instance (ex, CoCreateInput or window)
	 */
	register: function (initFunc, selector = '', instance = window) {
		if (this.modules.has(initFunc))
			return;

		this.modules.set(initFunc, {
			func: initFunc,
			selector: selector,
			instance: instance
		})
	},

	/**
	 * unregister a watch 
	 * @param {function} initFunc the callback function given to this.register to start a watch
	 */
	unregister: function (initFunc) {
		if (this.modules.has(initFunc)) {
			this.modules.delete(initFunc)
		}
	},

	init: function () {
		if (this.observer) {
			return;
		}
		try {
			const self = this;
			this.observer = new MutationObserver(function (mutations) {
				self.mutationLogic(mutations)
			});
			const config = { attribute: false, childList: true, characterData: false, subtree: true };
			this.observer.observe(document.body, config);
		} catch (error) {

		}
	},

	mutationLogic: function (mutations) {
		const self = this;
		console.log('mutations event.....');
		mutations.forEach(function (mutation) {
			if (mutation.type == "childList" && mutation.addedNodes.length == 1) {
				const addedNode = mutation.addedNodes.item(0);
				if (!self.modules) {
					return;
				}

				for (let [key, value] of Object.entries(self.modules)) {
					let items = addedNode.querySelectorAll(value['selector']);
					items.forEach(el => {
						console.log('init element with observer', key);
						value['func'].call(value['instance'], el);
					})
				}
			}
		});
	},

	register_old: function (selector = '', functionInit) {
		console.log("Observer")
		let observer = null;
		try {
			observer = new MutationObserver(function (mutations) {
				mutations.forEach(function (mutation) {
					if (mutation.type == "childList"
						&& mutation.addedNodes.length == 1) {
						var addedNode = mutation.addedNodes.item(0);
						console.log(addedNode)
						var list = [];
						try {
							console.log(selector)
							list = addedNode.querySelectorAll(selector);
						} catch (error) {
							console.log(error);
						}
						list.forEach(elem => {
							console.log("Init Element with Observer ", elem)
							functionInit(elem);
						});
					}
				});
			});
			var config = { attribute: false, childList: true, characterData: false, subtree: true };
			observer.observe(document.body, config);
		} catch (error) {
			console.error('errObserver')
		}
		return observer;
	}

}

CoCreateInit.init();
