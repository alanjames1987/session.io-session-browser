module.exports = function(cookieParser, sessionStore, cookie, auth) {

	var _sessionStore = sessionStore, _cookieParser = cookieParser, _cookie = ( typeof cookie == 'function' ? null : cookie) || 'connect.sid', _auth = ( typeof cookie == 'function' ? cookie : auth);

	return function(req, device, callback) {

		function _next(err) {
			_auth ? _auth(req, callback) : callback(err, true);
		}

		if (req && req.headers && req.headers.cookie) {

			_cookieParser(req, {}, function(err) {

				if (err) {
					_next('COOKIE_PARSE_ERROR');
				}

				var sessionId = req.signedCookies[_cookie];

				_sessionStore.load(sessionId, function(err, session) {

					// TEMP
					session.device = {
						'name' : device.name,
						'form' : 'laptop',
						'os' : device.os
					};

					if (err || !session) {
						_next('INVALID_SESSION');
					} else {
						req.session = session;
						_next(null);
					}

				});

			});

		} else {

			_next('MISSING_COOKIE');

		}

	};

};
