/**
 * Created by jean
 * 2020-06-08
 */

const CoCreateInit = {
	modules: {},
	newModules: {},
	observer: null,
	
	/**
	 * key: module name
	 * instance: module instance (ex, CoCreateInput or window)
	 * initFunc: function instance for init
	 */
	register : function (key, instance, initFunc) {
		if (this.modules[key]) {
			return;
		}
		this.modules[key] = {
			func: initFunc,
			instance: instance
		}
	},
	
	init: function() {
		if (this.observer) {
			return ;
		}
		try {
			const self = this;
			this.observer = new MutationObserver(function(mutations) {
				self.mutationLogic(mutations)
			});
			const config = { attribute:false, childList: true, characterData: false, subtree: true };
			this.observer.observe(document.body, config);
		} catch (error) {
			
		}
	},
	
	registerModules : function (key, instance, initFunc) {
		if (this.newModules[key]) {
			return;
		}
		this.newModules[key] = {
			func: initFunc,
			instance: instance
		}
	},
	
	runInit: function(container) {
		// console.log(this.newModules, container)
		for (let [key, value] of Object.entries(this.newModules)) {
			value['func'].call(value['instance'], container);
		}
	},
	
	mutationLogic: function(mutations) {
		const self = this;
		// console.log('mutations event.....');
		mutations.forEach(function(mutation){
			// if (mutation.type == "childList" && mutation.addedNodes.length == 1) {
			// 	const addedNode = mutation.addedNodes.item(0);
			// 	if (!self.modules) {
			// 		return;
			// 	}
				
			//     if (!addedNode.querySelectorAll || !addedNode.getAttribute) { 
			//       return;
			//     }
				
			// 	for (let [key, value] of Object.entries(self.modules)) {
			// 		value['func'].call(value['instance'], addedNode);
			// 		// let items = addedNode.querySelectorAll(value['selector']);
			// 		// items.forEach(el => {
			// 		// 	console.log('init element with observer', key);
			// 		// 	value['func'].call(value['instance'], el);
			// 		// })
			// 	}
			// }
			
			if (mutation.type == "childList" && mutation.addedNodes.length > 0) {
				if (!self.modules) {
					return ;
				}
				mutation.addedNodes.forEach((node) => {
				    if (!node.querySelectorAll || !node.getAttribute) { 
				      return;
				    }
				    
				    for (let [key, value] of Object.entries(self.modules)) {
				    	value['func'].call(value['instance'], node);
				    }
					
				})
			}
		});
	},
	
	setInitialized: function(element) {
		element.initialized = true;
	},
	
	getInitialized: function(element) {
		if (!element.initialized) {
			return false;
		} else {
			return true;
		}
	}
}

CoCreateInit.init();