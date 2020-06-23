const CoCreateInit = {
	modules: {},
	observer: null,

	/**
	* key: module name
	* instance: module instance (ex, CoCreateInput or window)
	* initFunc: function instance for init
	* selector: selector
	*/
	register: function (key, instance, initFunc, selector = '') {
		if (this.modules[key]) {
			return;
		}
		this.modules[key] = {
			func: initFunc,
			selector: selector,
			instance: instance
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
