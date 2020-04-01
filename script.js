$(document).ready(function () {
  function load() {
    // event.preventDefault();
    var searchList = localStorage.getItem("cityName");
    searchList = JSON.parse(searchList);
    console.log(searchList);
    var cityList = $("<button class='btn border text-muted shadow-md' style='width: 10rem;'>").text(searchList);
    var cityDiv = $("<div>");
    cityDiv.append(cityList);
    $(".history").append(cityDiv);
  }

  $("#search-button").on("click", function (event) {
    // stops page from refreshing
    event.preventDefault();
    //variable of search value created, trimmed for blank space and then wiped from input box
    var searchValue = $("#search-value").val().trim();
    //var of city name from the input
    var cityName = $(this).siblings("input").val();
    //creating an array to push in the city inputs
    var cityArray = [];
    //pushing in city name inputs into the array
    cityArray.push(cityName);
    //setting those items into local storage
    window.localStorage.setItem("cityName", JSON.stringify(cityArray));

    

    //calling the function that runs the initial search when clicked
    searchWeather(searchValue);
    load(searchValue);
    getForecast(searchValue);
  });
  

  $(".history").on("click", "button", function () {
    event.preventDefault();
    searchWeather($(this).text());
  });

  function searchWeather(searchValue) {
    var dailyURL = "http://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=cf0ca804702ef30757539cdff28dee0f&units=imperial";
    $.ajax({
      url: dailyURL,
      method: 'GET',
    }).then(function (response) {
      console.log(response);

      $("#today").empty();
      var displayDate = moment();

      var title = $("<h3>").addClass("card-title").text(response.name + " (" + new Date().toLocaleDateString() + ")");
      var card = $("<div>").addClass("card");
      var wind = $("<p>").addClass("card-text").text("Wind Speed: " + response.wind.speed + " MPH");
      var humid = $("<p>").addClass("card-text").text("Humidity: " + response.main.humidity + "%");
      var temp = $("<p>").addClass("card-text").text("Temperature: " + response.main.temp + " °F");
      var cardBody = $("<div>").addClass("card-body");
      var currentweather = response.weather[0].main;


      if (currentweather === "Rain") {
        var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
        currentIcon.attr("style", "height: 60px; width: 60px");
      } else if (currentweather === "Clouds") {
        var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
        currentIcon.attr("style", "height: 60px; width: 60px");
      } else if (currentweather === "Clear") {
        var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
        currentIcon.attr("style", "height: 60px; width: 60px");
      } else if (currentweather === "Drizzle") {
        var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
        currentIcon.attr("style", "height: 60px; width: 60px");
      } else if (currentweather === "Snow") {
        var currentIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
        currentIcon.attr("style", "height: 60px; width: 60px");
      }


      //appending the icon to the title
      title.append(displayDate, currentIcon);
      //appending the variables of wind, temmp, humidity and title to the card body
      cardBody.append(title, temp, humid, wind);
      //appending the card body to the card itself
      card.append(cardBody);
      //appending the card to the today div
      $("#today").append(card);
      // makeRow();
      getUVIndex(response.coord.lat, response.coord.lon);
      getForecast(searchValue);
    });


  };

  function getForecast(searchValue) {
    $.ajax({
      url: "http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&units=imperial&appid=cf0ca804702ef30757539cdff28dee0f",
      method: "GET",
    }).then(function (response) {
      $("#foreDiv").empty();
      console.log("5 day forecast: ", response);
      //creating a variable to shorthand object getting process
      // var feedBack = response.list
      for (var i = 0; i < response.list.length; i += 8) {
        var foreCards = $("<ul class='card text-white bg-info m-3 p-2 float-right' style='width: 10rem; height: 12rem' >");

        // if (response.list[i].dt_txt.indexOf("15:00:00") !== -1) {

        //creating date for card (stack overflow)
        var date = response.list[i].dt_txt;
        var dateSet = date.substr(0, 10);
        //creating temp for card, still unsure if its in Kelvin or not
        var setTemp = response.list[i].main.temp;
        //creating humidity variable for card
        var setHum = response.list[i].main.humidity;


        //making the elements for the variables above to be displayed
        var cardDate = $("<p class='card-date' style='font-weight:bold'>").text(dateSet);
        var cardTemp = $("<p class='card-text'>").text("Temp: " + setTemp);
        var cardHum = $("<p class='card-text'>").text("Humidity: " + setHum);

        //creating a var called weather so I can add icons to display weather in forecast cards
        var weatherRes = response.list[i].weather[0].main;

        //if statement to display the weather in the cards, images from open-weather (stack-overflow help)
        if (weatherRes === "Rain") {
          var cardImg = $('<img>').attr("src", "http://openweathermap.org/img/wn/09d.png");
          cardImg.attr("style", "height: 45px; width: 45px; text-align: center");
        } else if (weatherRes === "Clear") {
          var cardImg = $('<img>').attr("src", "http://openweathermap.org/img/wn/01d.png");
          cardImg.attr("style", "height: 45px; width: 45px; text-align: center");
        } else if (weatherRes === "Clouds") {
          var cardImg = $('<img>').attr("src", "http://openweathermap.org/img/wn/03d.png");
          cardImg.attr("style", "height: 45px; width: 45px; text-align: center");
        } else if (weatherRes === "Drizzle") {
          var cardImg = $('<img>').attr("src", "http://openweathermap.org/img/wn/10d.png");
          cardImg.attr("style", "height: 45px; width: 45px; text-align: center");
        } else if (weatherRes === "Snow") {
          var cardImg = $('<img>').attr("src", "http://openweathermap.org/img/wn/13d.png");
          cardImg.attr("style", "height: 45px; width: 45px; text-align: center");
        }

        //appending items to the cards created above
        foreCards.append(cardDate, cardImg, cardTemp, cardHum);
        // foreCards.append(cardImg);
        // foreCards.append(cardTemp);
        // foreCards.append(cardHum);
        // foreCards.append(cardImg);
        console.log(foreCards);
        $("#foreDiv").append(foreCards);
        // }
      }

    });
  };

  function getUVIndex(lat, lon) {
    $.ajax({
      url: "http://api.openweathermap.org/data/2.5/uvi?appid=cf0ca804702ef30757539cdff28dee0f&lat=" + lat + "&lon=" + lon,
      method: "GET"
      // dataType: "json"
    }).then(function (response) {
      $("#uv-btn").empty();
      console.log(response);
      var uv = $("<p>").text("UV Index: ");
      var uvIndex = response.value;
      if (uvIndex <= 5) {
        var uvBtn = $("<button>").addClass("btn btn-success").text(response.value);

      } else if (uvIndex <= 8 && uvIndex > 5) {
        var uvBtn = $("<button>").addClass("btn btn-warning").text(response.value);
      } else if (uvIndex > 8) {
        var uvBtn = $("<button>").addClass("btn btn-danger").text(response.value);
      }

      $("#uv-btn").append(uv.append(uvBtn));


    })
  }

  // getUVIndex(lat, lon)

  load();




});

// function makeRow(text) {
//   var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
//   $(".history").append(li);
// }

// if (history.indexOf(searchValue) === -1) {
//   history.push(searchValue);
//   window.localStorage.setItem("history", JSON.stringify(history));

//   makeRow(searchValue);
// }
// });