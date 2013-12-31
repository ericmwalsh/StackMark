//MAIN
var bkg = chrome.extension.getBackgroundPage();

$(function() {
	makePopup();

	$('#action').click(function() {
		modifyStack(bkg.stacked);
	});
});

//fetches stack from storage and renders list in DOM
function makePopup() {
	chrome.storage.sync.get(null, function(items) {
		renderButton();
		renderList(items);
	});
};

//chooses appropriate color and text of the button, 
//according to saved state of the page
function renderButton() {
	if(bkg.stacked !== null) {
		$('#action').text('Remove this page');
	}
	else {
		$('#action').text('Add this page');	
	}
};

//toggles button between the add and remove state
function toggleButton() {
	if($('#action').text() == 'Add this page') {
		$('#action').text('Remove this page');
	}
	else {
		$('#action').text('Add this page');	
	}
}

//HELPER: generateList()
//renders sites list in DOM
function renderList(items) {
	
	for(date in items) {
		var item = items[date];
		appendSiteToList(item, date);
	}
};

//self explanatory
//item: {url, title, furl}
function appendSiteToList(item, date) {
	var $ul = $('#sites');

	if(item.furl == undefined) {
		item.furl = 'eric.png';
	}
	var shortTitle = item.title.length > 43 ? item.title.slice(0,40) + '...' : item.title;

	var $li = $('<li id="' + date + '">').click((function(url, date) {
		return function() {
			chrome.storage.sync.remove(date);
			window.open(url, '_blank');	
		}
	})(item.url, date.toString()));

	var $a = $('<a title="' + item.title + '" target="_blank">' + shortTitle + '</a>');
	var $img = $('<img src="' + item.furl + '" height="16" width="16">');

	$a.prepend($img);
	$li.append($a);
	$ul.append($li);
}

//callback for when the button is pressed
function modifyStack(stacked) {
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
			if(stacked !== null){
				bkg.stacked = null;
				toggleButton();

				$('#' + stacked).remove();

				chrome.storage.sync.remove(stacked.toString(), function(){
					chrome.browserAction.setIcon({path:'icon.png'}, function(){
						chrome.browserAction.setTitle({title:defTitle});
						stacked = null;
					});
				});
			}
			// Add a new item to the stack.
			else{
				bkg.stacked = d;
				info = {url:url, title:title, furl:furl };
				
				appendSiteToList(info, d);
				toggleButton();

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