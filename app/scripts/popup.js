//Set initial button label
function set_button_label() {
	chrome.tabs.getSelected(null, function(tab) {
	  // Send a request to the content script.
	  chrome.tabs.sendRequest(tab.id, {action: 'isDisabled'}, function(response) {
	  	if(response.isDisabled === 'notSet') {
	  		document.getElementById('popup-text').innerText = 'You have not set a label for this URL address.';
	  		document.getElementById('popup-button').style.display = 'none';
	  	} else {
	  		document.getElementById('popup-text').innerText = 'Click on the following button to temporarily Hide/Show the label:';
	  		document.getElementById('popup-button').style.display = 'block';
	  		document.getElementById('popup-button').innerText = response.isDisabled ? 'Show Label' : 'Hide Label';
	  	}
	  });
	});
} 

//Toggle button label
function toggle_label() {
	chrome.tabs.getSelected(null, function(tab) {
	  // Send a request to the content script.
	  chrome.tabs.sendRequest(tab.id, {action: 'toggle'}, function(response) {
	  	set_button_label();
	  });
	});
}

//Open configuration screen
function open_configuration() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
}

document.addEventListener('DOMContentLoaded', set_button_label);
document.getElementById('popup-button').addEventListener('click', toggle_label);
document.getElementById('go-to-options').addEventListener('click', open_configuration);