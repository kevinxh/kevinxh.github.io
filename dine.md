---
layout: page
title: My Dine Picker
permalink: /dinepicker/
tags: dinepicker
---
<div class="form-stacked">
  <label for="location">Location</label>
  <select id="location" name="location">
  </select>
</div>
<script>
console.log('Dine picker development');

// names
var vancouverDowntown = 'Vancouver Downtown';
var metrotown = 'Metrotown';
var mainBroadway = 'Main St. - Broadway';
var richmond = 'Richmond';
var coquitlam = 'Coquitlam';

//var location = document.getElementById("location");
var locations = [vancouverDowntown, metrotown, mainBroadway, richmond, coquitlam];

locations.forEach((item) => {
   var o = document.createElement("option");
   o.innerHTML = item;
   o.value = item;
   document.getElementById('location').add(o);
});


var list = {
  name: 'Jinya',
  area: vancouverDowntown
};

console.log(list);
</script>
