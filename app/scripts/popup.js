//Set initial button label
function set_button_label() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // Send a message to the content script.
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "isDisabled" },
      function (response) {
        if (!response || response.isDisabled === "notSet") {
          document.getElementById("popup-text").innerText =
            "It is not possible to toggle visibility for this URL because you have not configured it yet.";
          document.getElementById("popup-button").style.display = "none";
        } else {
          document.getElementById("popup-text").innerText =
            "Click on the following button to temporarily Hide/Show the label:";
          document.getElementById("popup-button").style.display = "block";
          document.getElementById("popup-button").innerText =
            response.isDisabled ? "Show Label" : "Hide Label";
        }
      }
    );
  });
}

//Set initial quick config values
function set_default_values() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "getConfig" },
      function (response) {
        if (response && response.currentConfig) {
          document.getElementById("uuid").value =
            response.currentConfig.uuid || uuidv4();
          document.getElementById("name").value = response.currentConfig.name;
          document.getElementById("address").value =
            response.currentConfig.address;
          document.getElementById("color").value =
            response.currentConfig.color.toString();
          document.getElementById("color").dispatchEvent(new Event("blur"));
          document.getElementById("add").value = "Save";
        } else {
          document.getElementById("uuid").value = uuidv4();
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "getDomain" },
            function (response) {
              if (response && response.domain) {
                document.getElementById("address").value = response.domain;
                document.getElementById("name").value = response.domain
                  .replace(/\./g, "")
                  .toUpperCase();
              }
            }
          );
          document.getElementById("color").value = (
            (Math.random() * 0xffffff) <<
            0
          ).toString(16);
          document.getElementById("color").dispatchEvent(new Event("blur"));
        }
      }
    );
  });
}

function saveData() {
  var config = {};
  config.uuid = document.getElementById("uuid").value;
  config.name = document.getElementById("name").value;
  config.address = document.getElementById("address").value;
  config.color = document.getElementById("color").value;

  // Send a message to the content script.
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "setConfig", parameter: config },
      function (response) {
        // Result
      }
    );
  });
}

//Toggle button label
function toggle_label() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // Send a message to the content script.
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "toggle" },
      function (response) {
        set_button_label();
      }
    );
  });
}

//Open configuration screen
function open_configuration() {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL("options.html"));
  }
}

function initialize_colorpicker() {
  var options = {
    zIndex: 99999,
  };
  new jscolor("color", options);
}

function set_initial_config() {
  set_button_label();
  set_default_values();
  initialize_colorpicker();
}

document.addEventListener("DOMContentLoaded", set_initial_config);
document.getElementById("popup-button").addEventListener("click", toggle_label);
document
  .getElementById("quick-configuration")
  .addEventListener("submit", saveData);
document
  .getElementById("go-to-options")
  .addEventListener("click", open_configuration);
