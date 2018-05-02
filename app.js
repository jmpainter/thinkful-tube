const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_EMBED_URL = 'https://www.youtube.com/embed/'
https://www.youtube.com/embed/tgbNymZ7vqY

function getSearchTermDataFromApi(searchTerm, callback) {
  const query = {
    part: 'snippet',
    key: 'AIzaSyDz1msOIOSeKQO_-4y4_RTn7r5v7fI7OPI',
    q: searchTerm
  };
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function getChannelDataFromApi(channelId, callback) {
  const query = {
    part: 'snippet',
    key: 'AIzaSyDz1msOIOSeKQO_-4y4_RTn7r5v7fI7OPI',
    channelId: channelId
  };
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function renderResult(result) {
  return `
  <li id="${result.id.videoId}">
    <a href="#">
      <img class="js-thumbnail thumbnail" src="${result.snippet.thumbnails.default.url}" alt="thumbnail">
    </a>
    <p class="title"><a class="js-title" href="#">${result.snippet.title}</a></p>
    <p class="source"><a href="#" class="js-channel" id="${result.snippet.channelId}">${result.snippet.channelTitle}</a></p>
  </li>
  `;
}

function displayResults(data) {
  console.log(data);
  const results = data.items.map(item => renderResult(item));
  $('.results').html(results);
}

function handleSearchSubmit() {
  $('.js-form').submit(event => {
    event.preventDefault();
    const query = $(event.currentTarget).find('#js-query').val();
    console.log(query);
    getSearchTermDataFromApi(query, displayResults)
  });
}

function setVideo(videoId) {
  $('.js-video').attr('src', YOUTUBE_EMBED_URL + videoId);
}

function handleThumbnailClick() {
  $('.results').on('click', '.js-thumbnail', function(event) {
    setVideo($(this).closest('li').attr('id'));
  });
}

function handleTitleClick() {
  $('.results').on('click', '.js-title', function(event) {
    setVideo($(this).closest('li').attr('id'));
  });
}

function handleChannelClick() {
  $('.results').on('click', '.js-channel', function(event) {
    const channelId = $(this).attr('id');
    console.log(channelId);
    getChannelDataFromApi(channelId, displayResults)
  });
}

function startApp() {
  handleSearchSubmit();
  handleThumbnailClick();
  handleTitleClick();
  handleChannelClick();
}

$(startApp);