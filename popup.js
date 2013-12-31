$(function() {
	chrome.storage.sync.get(null, function(items) {
		console.log(items);
		var $ul = $('#sites');

		for(date in items) {
			var item = items[date];
			var title = (function() {
				if(item.title.length > 43) {
					return item.title.slice(0,40) + '...';
				}
				else {
					return item.title;
				}
			})();

			var $li = $('<li>');

			var $a = $('<a href="' + item.url + '">' + title + '</a></li>');
			var $img = $('<img src="' + item.furl + '" height="16" width="16">');

			$a.prepend($img);
			$li.append($a);
			$ul.append($li);
		}
	});
});