class Restaurant {
  constructor(name, area, id) {
    this.name = name;
    this.area = area;
    this.id = id;
  }
}

var load = 'load';
var done = 'done';
var error = 'error';
var noResult = 'noresult';

// locations
var vancouverDowntown = 'Vancouver Downtown';
var metrotown = 'Metrotown';
var mainBroadway = 'Main St. - Broadway';
var richmond = 'Richmond';
var coquitlam = 'Coquitlam';
var locations = [vancouverDowntown, metrotown, mainBroadway, richmond, coquitlam];

// Restaurant data
var list = [];
list.push(new Restaurant('Jinya', vancouverDowntown, '18501934'));
list.push(new Restaurant('Yahyaya Ramen', vancouverDowntown, '18431759'));
list.push(new Restaurant('Five Guys', vancouverDowntown, '16626546'));
list.push(new Restaurant('O Sushi', vancouverDowntown, '16627598'));
list.push(new Restaurant('Zac-Zac Japanese Curry House', vancouverDowntown, '16626755'));
list.push(new Restaurant('Gyudon Ya', vancouverDowntown, '16622972'));
list.push(new Restaurant('Burger King', vancouverDowntown, '16626035'));

// LOL, this is a really bad practice to expose API key in public
// But I'll do it just to save time to make this little tool
// Please do not steal it.
var key = '719067df4b11924989b4310c2b9837a7';

var fetchRes = function(card, res_id){
  card.dispatchEvent(new Event(load));
  axios.get('https://developers.zomato.com/api/v2.1/restaurant', {
    params: {
      res_id,
      apikey: key
    }
  })
  .then(function (response) {
    card.dispatchEvent(new CustomEvent(done, {"detail": {"data":response.data}}));
  })
  .catch(function (error) {
    card.dispatchEvent(new Event(error));
    console.err(error);
  });
};

var onLoading = function(card){
  card.innerHTML = '<img style="margin-top: 40px;" src="/images/loading.svg">';
}

//fetchRes(16774318);

window.onload = function(){
  var card = document.getElementById('restaurantInfo');
  var dropdown = document.getElementById('location');
  var startBtn = document.getElementById('start');
/*
  var title = document.getElementsByClassName('title')[0];
  var address = document.getElementsByClassName('address')[0];
  var ctaBtn = document.getElementById('cta');
*/
  var locationFilter = function(restaurant){
    return restaurant.area == dropdown.value;
  }

  // Initialize location dropdown
  locations.forEach((item) => {
    var o = document.createElement('option');
    o.innerHTML = item;
    o.value = item;
    dropdown.add(o);
  });

  // on ajax loading
  card.addEventListener('load', function(){
    onLoading(card);
  });

  card.addEventListener('done', function(e){
    /*******
      Extract:
      name
      average_cost_for_two
      cuisines
      featured_image
      location.address
      menu_url
      url
      user_rating.aggregate_rating
     *******/
     let {name, location, menu_url} = e.detail.data;
     card.innerHTML = '<h1 class="title">' + name + '</h1>'
                      + '<div class="info"><h4 class="address">' + location.address +'</h4>'
                      + '</div>' + '<a id="cta" href="' + menu_url +
                      '" target="_blank" type="button" class="button button-blue cta">Open Menu</a>';
  });

  card.addEventListener(noResult, function(){
    card.innerHTML = '<h1 class="title">' + 'Oops! Can\'t find anything...' + '</h1>';
  });

  // start button clicked
  startBtn.addEventListener('click', function(){
    var filtered = list.filter(locationFilter);
    var bingo = filtered.randomElement();
    if(bingo !== undefined){
      fetchRes(card, bingo.id);
    } else {
      card.dispatchEvent(new Event(noResult));
    }
  });
}

Array.prototype.randomElement = function() {
    return this[Math.floor(Math.random() * this.length)];
}
