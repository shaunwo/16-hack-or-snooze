"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 * - showDeleteLink: show a link to delete a story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteLink = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // show favorite/not-favorite star ONLY IF the surrent user has been signed in
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${showDeleteLink ? getDeleteLinkCode() : ""}
        ${showStar ? getStarCode(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

// creating HTML for a trash can to add next to each story to delete it
function getDeleteLinkCode() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

// creating HTML for the star to be addded to each article
function getStarCode(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


/** Handle deleting a story. */
async function deleteStory(evt) {
  console.debug("deleteStory");
  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");
  await storyList.removeStory(currentUser, storyId);
  // re-generate story list
  await putUserStoriesOnPage();
}
$myStories.on("click", ".trash-can", deleteStory);

/** Handle submitting new story form. */
async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();
  // grab all info from form
  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const author = $("#create-author").val();
  const username = currentUser.username
  const storyData = {title, url, author, username };
  const story = await storyList.addStory(currentUser, storyData);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
  // hide the form and reset it
  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}
$submitForm.on("submit", submitNewStory);

// creating list of the current user's stories and putting them on the screen
function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");
  $myStories.empty();
  if (currentUser.myStories.length === 0) {
    $myStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.myStories) {
      let $story = generateStoryMarkup(story, true);
      $myStories.append($story);
    }
  }
  $myStories.show();
}
/******************************************************************************
 * Functionality for favorites list and starr/un-starr a story
 */
/** Put favorites list on page. */
function putFavoritesListOnPage() {
  console.debug("putFavoritesListOnPage");
  $favoritedStories.empty();
  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h5>No favorites added!</h5>");
  } else {
    // loop through all of users favorites and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }
  $favoritedStories.show();
}

// favorite / unfavorite a story
$storiesLists.on("click", ".star", toggleStoryFavorite);
async function toggleStoryFavorite(evt) {
    console.debug("toggleStoryFavorite");
    const $tgt = $(evt.target);
    const $closestLi = $tgt.closest("li");
    const storyId = $closestLi.attr("id");
    const story = storyList.stories.find(s => s.storyId === storyId);
    
    // see if the item is already favorited (checking by presence of star)
    if ($tgt.hasClass("fas")) {
        // currently a favorite: remove from user's fav list and change star
        await currentUser.removeFavorite(story);
        $tgt.closest("i").toggleClass("fas far");
    } else {
        // currently not a favorite: do the opposite
        await currentUser.addFavorite(story);
        $tgt.closest("i").toggleClass("fas far");
    }
}
