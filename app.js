const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_EMBED_URL = 'https://www.youtube.com/embed/';

const appState = {
  searchMode: '',
  query: '',
  channelId: '',
  nextPageToken: '',
  prevPageToken: '',
}

function getDataFromApi(nextOrPrev) {
  const query = {
    part: 'snippet',
    key: 'AIzaSyDz1msOIOSeKQO_-4y4_RTn7r5v7fI7OPI',
    maxResults: 5,
  };
  if(appState.searchMode === 'query') {
    query.q = appState.query;
  } else if(appState.searchMode === 'channel') {
    query.channelId = appState.channelId;
  }
  if(nextOrPrev === 'next') {
    query.pageToken = appState.nextPageToken;
  } else if(nextOrPrev === 'prev') {
    query.pageToken = appState.prevPageToken;    
  }
  $.getJSON(YOUTUBE_SEARCH_URL, query, displayResults);
}

function renderResult(result) {
  return `
  <li data-video-id="${result.id.videoId}">
    <a href="javascript:void(0)">
      <img class="js-thumbnail" src="${result.snippet.thumbnails.default.url}" alt="${result.snippet.title}">
    </a>
    <a class="title js-title" href="javascript:void(0)">${result.snippet.title}</a>
    <a href="javascript:void(0)" class="js-channel" role="button" data-channel-id="${result.snippet.channelId}">Channel: ${result.snippet.channelTitle}</a>
  </li>
  `;
}

function displayResults(data) {
  console.log(data);
  $('.pages').css('display', 'block');
  appState.nextPageToken = data.nextPageToken ? data.nextPageToken : '';
  appState.prevPageToken = data.prevPageToken ? data.prevPageToken : '';
  if(data.items.length > 0) {
    $('.js-results-number').html(data.pageInfo.totalResults + ' videos found:');
    const results = data.items.map(item => renderResult(item));
    $('.js-results-list').prop('hidden', false).html(results);
  } else {
    getDataFromApi('prev');
  }
}

function handleSearchSubmit() {
  $('.js-form').submit(event => {
    event.preventDefault();
    appState.searchMode = 'query';
    appState.query =  $(event.currentTarget).find('#js-query').val();
    getDataFromApi();
  });
}

function setVideo(videoId) {
  $('#js-video').attr('src', YOUTUBE_EMBED_URL + videoId);
}

function handleThumbnailClick() {
  $('.js-results-list').on('click', '.js-thumbnail', function(event) {
    setVideo($(this).closest('li').attr('data-video-id'));
  });
}

function handleTitleClick() {
  $('.js-results-list').on('click', '.js-title', function(event) {
    setVideo($(this).closest('li').attr('data-video-id'));
  });
}

function handleChannelClick() {
  $('.js-results-list').on('click', '.js-channel', function(event) {
    appState.searchMode = 'channel';
    appState.channelId = $(this).attr('data-channel-id');
    getDataFromApi();
  });
}

function handleNextClick() {
  $('.js-next').click(event => {
    if(appState.nextPageToken) {
      getDataFromApi('next');
    }
  });
}

function handlePrevClick() {
  $('.js-prev').click(event => {
    if(appState.prevPageToken) {
      getDataFromApi('prev');
    }
  });
}

function startApp() {
  handleSearchSubmit();
  handleThumbnailClick();
  handleTitleClick();
  handleChannelClick();
  handleNextClick();
  handlePrevClick();
}

$(startApp);