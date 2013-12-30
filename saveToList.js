// Main script file that listens for the button click and then adds it to the list.
// Also makes sure the icon/title appropriately reflect if a website is 'Stacked' or not.
var stacked = null;
chrome.tabs.onActivated.addListener(function(){
	chrome.storage.sync.get(null, function(items) {
		var queryHelper = {'active': true, 'currentWindow': true};
		var defTitle = 'StackMark\n\nLeft click to add to your list.\nRight click to bookmark and list.';
		var newTitle = 'StackMark\n\nLeft click to remove from list.'
		var x, checkStorage = false;

		//First check if the tab (website) is already in StackMark storage.  If it is, make sure the icon/title reflect that.
	    var allKeys = Object.keys(items);
	    chrome.tabs.query(queryHelper, function(tabs){
	    	x = tabs[0].url;
	    	var y = tabs[0].favIconUrl, z = tabs[0].title;
	    	//CHECK IF IT'S THE NEWTABPAGE
			if(z == 'New Tab'){
				if(y == 'https://www.google.com/favicon.ico' || x == 'chrome-search://local-ntp/local-ntp.html'){
					console.log('changes to new tab page');
				}
			}
	    	allKeys.forEach(function(key){
				if(items[key].url == x){
					checkStorage=true;
					chrome.browserAction.getTitle({},function(result){
                        if(result==defTitle){
                        	chrome.browserAction.setIcon({path:'icon2.png'}, function(){
								chrome.browserAction.setTitle({title:newTitle});
								stacked = key;
							});
                        }
                        else{
                        	stacked=key;
                        }
                    });
				}
			});
			//Otherwise if it isn't in storage, make sure the default icon/title is showing.
			if(checkStorage==false){
				chrome.browserAction.getTitle({},function(result){
                        if(result==newTitle){
                        	chrome.browserAction.setIcon({path:'icon.png'}, function(){
								chrome.browserAction.setTitle({title:defTitle});
								stacked = null;
							});
                        }
                        else{
                        	stacked = null;
                        }
                });
			}
	    });
	});
});

//Called when the user clicks on the StackMark icon
function markIt() {
	var url, title, furl, d, obj={}, info={};
	d = Date.now();
	var queryHelper = {'active': true, 'currentWindow': true};
	var defTitle = 'StackMark\n\nLeft click to add to your list.\nRight click to bookmark and list.';
	var newTitle = 'StackMark\n\nLeft click to remove from list.'

	chrome.tabs.query(queryHelper, function (tabs) {
    	url = tabs[0].url;
    	title = tabs[0].title;
    	furl = tabs[0].favIconUrl;
    	// If the page hasn't finished loading then nothing will happen.
    	if(!url || !title){
			console.log('ERROR NO URL OR TITLE!');
			return;
		}
		else{
			// Remove an already 'stacked' item from the list.
			if(stacked){
				//var tempD= d.toString();
				chrome.storage.sync.remove(stacked.toString(), function(){
					chrome.browserAction.setIcon({path:'icon.png'}, function(){
						chrome.browserAction.setTitle({title:defTitle});
						stacked = null;
					});
				});
			}
			// Add a new item to the stack.
			else{
				info = {'url':url, 'title':title, 'furl':furl };
				obj[d]=info;
				chrome.storage.sync.set(obj, function(){
						chrome.browserAction.setIcon({path:'icon2.png'}, function(){
							chrome.browserAction.setTitle({title:newTitle});
							stacked = d;
						});
					
				});
			}
		}
	});
	
};