/**
 * Created by jean
 * 2020-06-08
 */

const CoCreateInit = {
	register : function (selector = '',functionInit) {
		console.log("Observer")
		let observer = null;
		try{
			observer = new MutationObserver(function(mutations){
					mutations.forEach(function(mutation){
					if (mutation.type == "childList" 
						&& mutation.addedNodes.length == 1) {
						var addedNode = mutation.addedNodes.item(0);
							console.log(addedNode)
							var list = [];
							try{
								console.log(selector)
								list = addedNode.querySelectorAll(selector);
							}catch (error) {
								console.log(error);
							} 
							list.forEach(elem=>{
								console.log("Init Element with Observer ",elem)
								functionInit(elem);
							});
						}
					});
			});
			var config = { attribute:false, childList: true, characterData: false, subtree: true };
			observer.observe(document.body, config);
		}catch (error) {
			console.error('errObserver')
		}
		return observer;
	}
	
}