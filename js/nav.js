"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// display form with the user details
$navUserProfile.on("click", navProfileClick);
function navProfileClick(evt) {
  console.debug("navProfileClick", evt);
  hidePageComponents();
  $userProfile.show();
}

// display form with the new story submit details
$navSubmitStory.on("click", navSubmitStoryClick);
function navSubmitStoryClick(evt) {
  console.debug("navSubmitStoryClick", evt);
  //hidePageComponents();
  $submitForm.show();
}

// display list of my articles
$navMyStories.on("click", navMyStoriesClick);
function navMyStoriesClick(evt) {
  console.debug("navMyStoriesClick", evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $myStories.show();
}

// display list of favorites articles
$navFavorites.on("click", navFavoritesClick);
function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  putFavoritesListOnPage();
  $favoritedStories.show();
}