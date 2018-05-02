const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';

function getDataFromApi(searchTerm, callback) {
  const query = {
    part: 'snippet',
    key: 'AIzaSyDz1msOIOSeKQO_-4y4_RTn7r5v7fI7OPI',
    q: searchTerm
  };
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}

function renderResult(result) {
  return `
  <li>
    <a href="#">
      <img class="thumbnail" id="${result.id.videoId}" src="${result.snippet.thumbnails.default.url}" alt="thumbnail">
    </a>
    <p class="title">${result.snippet.title}</p>
    <p class="source"><a href="#" id="${result.snippet.channelId}">${result.snippet.channelTitle}</a></p>
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
    getDataFromApi(query, displayResults)
  });
}

function handleThumbnailClick() {
  $('.results').on('click', '.thumbnail', function(event) {
    const videoId = $(this).attr('id');
    $('.js-video').attr('src', 'https://www.youtube.com/watch?v=' + videoId);
    // https://www.youtube.com/watch?v=xW0i-1iIFrI
  });
}

function startApp() {
  handleSearchSubmit();
  handleThumbnailClick();
}

$(startApp);