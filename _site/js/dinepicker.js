class Restaurant {
  constructor(name, area, address, phone, hours) {
    this.name = name;
    this.area = area;
    this.address = address;
    this.phone = phone;
    this.hours = hours;
  }
}

// locations
var vancouverDowntown = 'Vancouver Downtown';
var metrotown = 'Metrotown';
var mainBroadway = 'Main St. - Broadway';
var richmond = 'Richmond';
var coquitlam = 'Coquitlam';
var locations = [vancouverDowntown, metrotown, mainBroadway, richmond, coquitlam];

// Restaurant data
var list = [];
list.push(new Restaurant('Jinya', vancouverDowntown, '541 Robson St, Vancouver', '(604)-699-9377', 'hours'));


window.onload = function(){
  var card = document.getElementById('restaurantInfo');
  var dropdown = document.getElementById('location');
  var startBtn = document.getElementById('start');

  var title = document.getElementsByClassName('title')[0];
  var address = document.getElementsByClassName('address')[0];
  var hours = document.getElementsByClassName('hours')[0];

  var locationFilter = function(restaurant){
    return restaurant.area == dropdown.value;
  }

  // Initialize location dropdown
  locations.forEach((item) => {
    var o = document.createElement("option");
    o.innerHTML = item;
    o.value = item;
    dropdown.add(o);
  });
  // Initialize card
  card.style.visibility = 'hidden';
  startBtn.addEventListener('click', function(){
    card.style.visibility = 'visible';

    var filtered = list.filter(locationFilter);
    var bingo = filtered.randomElement();
console.log(bingo)
    title.textContent = bingo.name;
    address.textContent = bingo.address;
    hours.textContent = bingo.hours;
  });
}

Array.prototype.randomElement = function() {
    return this[Math.floor(Math.random() * this.length)]
}
