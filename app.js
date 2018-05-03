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
  <li id="${result.id.videoId}">
    <a href="">
      <img class="js-thumbnail" src="${result.snippet.thumbnails.default.url}" alt="thumbnail">
    </a>
    <p class="title"><a class="js-title" href="#">${result.snippet.title}</a></p>
    <p class="source"><a href="" class="js-channel" id="${result.snippet.channelId}">${result.snippet.channelTitle}</a></p>
  </li>
  `;
}

function displayResults(data) {
  console.log(data);
  $('.pages').css('display', 'block');
  if(data.nextPageToken) {
    appState.nextPageToken = data.nextPageToken;
  } else {
    appState.nextPageToken = '';
  }
  if(data.prevPageToken) {
    appState.prevPageToken = data.prevPageToken;
  } else {
    appState.prevPageToken = '';
  }
  if(data.items.length > 0) {
    const results = data.items.map(item => renderResult(item));
    $('.results').html(results);
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
    appState.searchMode = 'channel';
    appState.channelId = $(this).attr('id');
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