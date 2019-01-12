# linebot-todos

https://github.com/muitsfriday/linebot-todos


## Initiate Line Bot Service (service-message in Go)

### Enviroment variable setup
Your server must provide following enviroment variable
- MONGODB_URI a mongo connection string.
- SECRET linebot's secret.
- TOKEN linebot's token.
- TODOS_COLL todo database table/collction name.
- EDIT_URI url bot use to send when edit command called.
- PORT port that your want to run (no need to set on Heroku).


### Deploy on Heroku
- Create new app.
- See deploy using docker section.
- The command docker `heroku container:push web` and `heroku container:release web` must run on service-message folder.

### Deploy on other
There is a Dockerfile in service-message youcan build it with `docker build -t <your_image_name> .` in service-message directory and deploy it anywhere.