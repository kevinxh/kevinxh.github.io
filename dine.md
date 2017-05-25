---
layout: page
title: My Dine Picker
permalink: /dinepicker/
tags: dinepicker
---
<div class="form-stacked" style="margin-bottom:24px;">
  <label for="location">Location</label>
  <select id="location" name="location">
  </select>
  <button id="start" type="button" class="button button-blue">Gimme a good one!</button>
</div>
<div id="restaurantInfo" class="card">
  <h1 class="title"></h1>
  <div class="info">
    <h3 class="address"></h3>
    <h3 class="hours"></h3>
  </div>
  <button id="cta" href="" type="button" class="button button-blue cta"></button>
</div>
<script type="text/javascript" src="/js/dinepicker.js"></script>
