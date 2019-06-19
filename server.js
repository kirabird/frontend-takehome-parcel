const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const RUBY_GEMS_URL = 'https://rubygems.org/api/v1/search.json?query=';
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );

  next();
});

app.get('/api/*', (req, res) => {
  console.log(req.originalUrl);
  const url = `${RUBY_GEMS_URL}${req.path}`;
  request.get(url, (err, response, body) => {
    if (err) {
      console.log('error fetching');
    }
    if (response.statusCode === 400) {
      res.send([]);
    } else {
      // data = JSON.stringify(body, null, 2);
      res.send(body);
    }
  });
});
// app.get('/api/**/*', (req, res) => {
//   const url = `${RUBY_GEMS_URL}${req.originalUrl}`;
//   console.log(req.originalUrl);
//   request.get(url, (err, response, body) => {
//     if (response.statusCode === 400) {
//       res.send([]);
//     } else {
//       res.send(body);
//     }
//   });
// });

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
}

app.listen(PORT);

console.log(`Ruby Gems proxy API is now running at: http://localhost:${PORT}`);
