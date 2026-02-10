function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for(var i in uiBathrooms) {
    if(uiBathrooms[i].checked) {
        return parseInt(i)+1;
    }
  }
  return -1; // Invalid Value
}

function getApiBaseUrl() {
  // If opening app.html directly from file://, call local Flask explicitly.
  if (window.location.protocol === "file:") {
    return "http://127.0.0.1:5000";
  }

  // If running from localhost on another port, call Flask on 5000.
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    if (window.location.port && window.location.port !== "5000") {
      return "http://127.0.0.1:5000";
    }
  }

  // In production (e.g., Vercel), use same-origin relative paths.
  return "";
}

function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for(var i in uiBHK) {
    if(uiBHK[i].checked) {
        return parseInt(i)+1;
    }
  }
  return -1; // Invalid Value
}

function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");
  var sqft = document.getElementById("uiSqft");
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations");
  var estPrice = document.getElementById("uiEstimatedPrice");

  var apiBase = getApiBaseUrl();
  var url = apiBase + "/api/predict_home_price";

  $.post(url, {
      total_sqft: parseFloat(sqft.value),
      bhk: bhk,
      bath: bathrooms,
      location: location.value
  },function(data, status) {
      console.log(data.estimated_price);
      estPrice.innerHTML = "<h2>" + data.estimated_price.toString() + " Lakh</h2>";
      console.log(status);
  });
}

function onPageLoad() {
  console.log( "document loaded" );
  var apiBase = getApiBaseUrl();
  var url = apiBase + "/api/get_location_names";
  $.get(url,function(data, status) {
      console.log("got response for get_location_names request");
      if(data) {
          var locations = data.locations;
          var uiLocations = document.getElementById("uiLocations");
          $('#uiLocations').empty();

          var defaultOpt = new Option("Choose a Location", "");
          defaultOpt.disabled = true;
          defaultOpt.selected = true;
          $('#uiLocations').append(defaultOpt);

          for(var i in locations) {
              var opt = new Option(locations[i]);
              $('#uiLocations').append(opt);
          }
      }
  }).fail(function(xhr, status, error) {
      console.error("Failed to load locations:", status, error);
      var uiLocations = document.getElementById("uiLocations");
      $('#uiLocations').empty();
      var fallbackOpt = new Option("Could not load locations", "");
      fallbackOpt.disabled = true;
      fallbackOpt.selected = true;
      $('#uiLocations').append(fallbackOpt);
  });
}

window.onload = onPageLoad;
