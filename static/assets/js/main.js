"use strict";

/*
	Tessellate by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
  */

(function ($) {
  var $window = $(window),
    $body = $("body");

  // Breakpoints.
  breakpoints({
    wide: ["1281px", "1680px"],
    normal: ["1001px", "1280px"],
    narrow: ["737px", "1000px"],
    mobile: [null, "736px"],
  });

  // Play initial animations on page load.
  $window.on("load", function () {
    window.setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);
  });

  // Scrolly.
  $(".scrolly").scrolly();
})(jQuery);

//---------------------------------------------------------------
//_________________slideshow container_________________________
//---------------------------------------------------------------
var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides((slideIndex += n));
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides((slideIndex = n));
}

var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides((slideIndex += n));
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

//initial table hide
$("#outcomeTableSection").hide();

var selFam = document.getElementById("Family");
var selGen = document.getElementById("Genus");
var selSpe = document.getElementById("Species");
var selCon = document.getElementById("Country");

$("#Genus").prop("disabled", true);
$("#Species").prop("disabled", true);
$("#Country").prop("disabled", true);

//------------------------------------------------------------------------------
//_________________________populating family dropdown___________________________
//------------------------------------------------------------------------------
var familyList = ["Vespertilionidae", "Hipposideridae", "Rhinolophidae"];

for (var i = 0; i < 3; i++) {
  var temp = document.createElement("option");
  temp.textContent = familyList[i];
  temp.value = familyList[i];
  selFam.appendChild(temp);
}
var temp = document.createElement("option");
temp.textContent = "Any";
temp.value = "Any";
selFam.appendChild(temp);

//---------------------------------------------------------------------------
//_________________________populating Genus dropdown_________________________
//---------------------------------------------------------------------------
selFam.addEventListener("change", function () {
  $("#Species").prop("disabled", true);
  $("#Country").prop("disabled", true);
  var fam = $("#Family :selected").text();

  fetch(`http://127.0.0.1:5000/api/distinct/Genus/${fam}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      var temp;
      $("#Genus").find("option").not(":first").remove();
      $("#Species").find("option").not(":first").remove();
      $("#Country").find("option").not(":first").remove();
      for (var i = 0; i < data.GenusArray.length; i++) {
        temp = document.createElement("option");
        temp.textContent = data.GenusArray[i];
        temp.value = "toRemove";
        selGen.appendChild(temp);
      }
      temp = document.createElement("option");
      temp.textContent = "Any";
      temp.value = "toRemove";
      selGen.appendChild(temp);
    });
  $("#Genus").prop("disabled", false);
});

//---------------------------------------------------------------------------
//_________________________populating Species dropdown_________________________
//---------------------------------------------------------------------------
selGen.addEventListener("change", function () {
  $("#Country").prop("disabled", true);

  var gen = $("#Genus :selected").text();
  var fam = $("#Family :selected").text();

  fetch(`http://127.0.0.1:5000/api/distinct/Species/${gen}/${fam}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $("#Species").find("option").not(":first").remove();
      $("#Country").find("option").not(":first").remove();
      var temp;
      for (var i = 0; i < data.Species.length; i++) {
        temp = document.createElement("option");
        temp.textContent = data.Species[i];
        temp.value = "toRemove";
        selSpe.appendChild(temp);
      }
      temp = document.createElement("option");
      temp.textContent = "Any";
      temp.value = "toRemove";
      selSpe.appendChild(temp);
    });
  $("#Species").prop("disabled", false);
});

//---------------------------------------------------------------------------
//_________________________populating Country dropdown_________________________
//---------------------------------------------------------------------------
selSpe.addEventListener("change", function () {
  var gen = $("#Genus :selected").text();
  var fam = $("#Family :selected").text();
  var spe = $("#Species :selected").text();

  if (spe == "papillosa / lenis") {
    spe = "papillosa_lenis";
  }

  fetch(`http://127.0.0.1:5000/api/distinct/Country/${spe}/${gen}/${fam}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      $("#Country").find("option").not(":first").remove();
      var temp;
      for (var i = 0; i < data.Country.length; i++) {
        temp = document.createElement("option");
        temp.textContent = data.Country[i];
        temp.value = "toRemove";
        selCon.appendChild(temp);
      }
      temp = document.createElement("option");
      temp.textContent = "Any";
      temp.value = "toRemove";
      selCon.appendChild(temp);
    })
    .catch(function (error) {
      console.log(error);
    });
  $("#Country").prop("disabled", false);
});

//-------------------------------------------------------------------------------
//_________________________Table Output____________________________________________
//-------------------------------------------------------------------------------
//adds function to submit button to display the required output
var submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", function () {
  $("#outcomeTableSection").show();

  var fam = $("#Family :selected").text();
  var gen = $("#Genus :selected").text();
  var spe = $("#Species :selected").text();
  var con = $("#Country :selected").text();

  if (spe == "papillosa / lenis") {
    spe = "papillosa_lenis";
  }

  //outputs the table by calling api
  fetch(`http://127.0.0.1:5000/api/output/table/${fam}/${gen}/${spe}/${con}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      var table = document.getElementById("outcomeTable");
      $("#outcomeTable").empty();
      let thead = table.createTHead();
      let row = thead.insertRow();

      let tbody = document.createElement("tbody");
      table.appendChild(tbody);

      data[0].forEach((element) => {
        let th = document.createElement("th");
        let text = document.createTextNode(element);
        th.appendChild(text);
        row.appendChild(th);
      });

      data[1].forEach((element) => {
        let row = tbody.insertRow();
        element.forEach((key) => {
          let cell = row.insertCell();
          let text = document.createTextNode(key);
          cell.appendChild(text);
        });
      });
    });
});

//----------------------------------------------------------------
//___________________reset Search_________________________________
//----------------------------------------------------------------

document.getElementById("reset").addEventListener("click", function () {
  $("#outcomeTableSection").hide();

  $("#Genus").find("option").not(":first").remove();
  $("#Species").find("option").not(":first").remove();
  $("#Country").find("option").not(":first").remove();

  $("#Family").val("placeholder");
});
