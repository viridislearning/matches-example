var baseUrl = 'https://staging.viridislearning.com/';

var sessionData = {};

// Some old browsers do not implement Date.prototype.toISOString
function toISOString(date) {
  function pad(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }

  return date.getUTCFullYear() +
    '-' + pad(date.getUTCMonth() + 1) +
    '-' + pad(date.getUTCDate()) +
    'T' + pad(date.getUTCHours()) +
    ':' + pad(date.getUTCMinutes()) +
    ':' + pad(date.getUTCSeconds()) +
    '.' + (date.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
    'Z';
}

// Login with the provided account details
function login(username, password) {
  var data = {
    login: username,
    password: password
  };

  return $.ajax({
    url: baseUrl + 'actors/login',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data)
  }).then(function(res) {
    // Save the auth info
    sessionData.auth = {
      authtoken: res.auth.authtoken,
      secret: res.auth.secret
    };
    // Save the actor info
    sessionData.actor = res.actor;
  });
}

// Sets the authorization headers for a xhr request
function setAuthHeaders(xhr) {
  var timeStamp = toISOString(new Date());
  var signatureHash = CryptoJS.HmacSHA1(timeStamp, sessionData.auth.secret).toString();

  xhr.setRequestHeader('x-authtoken', sessionData.auth.authtoken);
  xhr.setRequestHeader('x-signature', signatureHash);
  xhr.setRequestHeader('x-request-timestamp', timeStamp);
}

function getMatches(pageId, options) {
  pageId = pageId || 1;
  options = options || {
    radius: '',
    occupations: null,
    industries: [],
    keywords: '',
    sort: 'date'
  };
  return $.ajax({
    url: baseUrl + 'jobs/matches/' + sessionData.actor._id + '/' + pageId,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(options),
    beforeSend: setAuthHeaders
  }).then(function(res) {
    var $matches = $('#matches');

    $matches.empty();

    $.each(res.data, function(i, match) {
      $matches.append(
        '<li>' +
          '<p><a href="' + match.job.link + '" target="_blank">' + match.job.title + '</a> - ' + match.match + '%</p>' +
          '<p><b>Company:</b>' + match.job.company + '</p>' +
          '<p><b>Summary:</b>' + match.job.summary + '</p>' +
        '</li>'
      );
    });
  });
}

$(document).ready(function() {
  $('#login').on('submit', function(e) {
    e.preventDefault();

    var email = $('#loginEmail').val();
    var password = $('#loginPassword').val();

    login(email, password).then(function() {
      $('#login').hide();
      $('#logout').show();
      $('#getMatches').show();
    });
  });

  $('#logout').on('click', function(e) {
    location.reload();
  });

  $('#getMatches').on('click', function(e) {
    getMatches();
  });
});