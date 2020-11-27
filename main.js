// Foursquare API Info
const clientId = 'VP1GPHC2CE3VTZ0PDUMXLDAZHRO5TOXUIEJC4K11TZ1H5HGE';
const clientSecret = 'WZEO0XN0GD4MBGHT0JFEXLKWFKMPK24ZXWPQJ1R1ZTBCWRFP';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';

// OpenWeather Info
const openWeatherKey = 'f8da2d72518b7dfed98a6752f5896fbd';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$('#venue1'), $('#venue2'), $('#venue3'), $('#venue4')];
const $weatherDiv = $('#weather1');
const weekDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// Add AJAX functions here:
const getVenues = async () => {
  const city = $input.val();
  const urlToFetch = `${url}${city}&limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=20200521`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      const venues = jsonResponse.response.groups[0].items.map(
        (item) => item.venue
      );
      return venues;
    }
  } catch (error) {
    console.log(error);
  }
};

const getForecast = async () => {
  const urlToFetch = `${weatherUrl}?&q=${$input.val()}&APPID=${openWeatherKey}`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const jsonResponse = await response.json();
      return jsonResponse;
    }
  } catch (error) {
    console.log(error);
  }
};

// Render functions
const renderVenues = (venues) => {
  $venueDivs.forEach(($venue, index) => {
    const venue = venues[index];
    const venueIcon = venue.categories[0].icon;
    const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`;
    let venueContent = createVenueHTML(venue.name, venue.location, venueImgSrc);
    $venue.append(venueContent);
  });
  $destination.append(`<h2>${venues[0].location.city}</h2>`);
};

const renderForecast = (day) => {
  let weatherContent = createWeatherHTML(day);
  $weatherDiv.append(weatherContent);
};

//function used for click event to clear each venue, weather, and destination before searching.
//calls api and renders for venues and weather.
const executeSearch = () => {
  $venueDivs.forEach((venue) => venue.empty());
  $weatherDiv.empty();
  $destination.empty();
  $container.css('visibility', 'visible');
  getVenues().then((venues) => {
    renderVenues(venues);
  });
  getForecast().then((forecast) => {
    renderForecast(forecast);
  });
  return false;
};

//click event that handles api search
$submit.click(executeSearch);
