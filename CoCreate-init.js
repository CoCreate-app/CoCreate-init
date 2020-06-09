/**
 * Created by jean
 * 2020-06-08
 */

 CoCreateObserver = {
  register : function (selector = '',functionInit) {
      let observer = null;
      try{
          observer = new MutationObserver(function(mutations){
                  mutations.forEach(function(mutation){
                    if (mutation.type == "childList" 
                        && mutation.addedNodes.length == 1) {
                        var addedNode = mutation.addedNodes.item(0);
                        var list = [];
                        try{
                            list = addedNode.querySelectorAll(selector);
                        }catch (error) {} 
                        list.forEach(elem=>{
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