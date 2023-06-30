# Contact identity app 

### the app is hosted at https://api.rasenrhino.me/api.

### the required identity endpoint can be access by doing a POST request to https://api.rasenrhino.me/api/identity

the application is deployed on digitalocean droplet. The CI is triggered when some changes are pushed to main branch .

#### Note 
For running in docker , the file can be found in `test` branch. Run the command in the following order (after checking out to test branch)

```bash
   $ cp .env.example .env
```
```bash
   $ docker-compose up
```
the application can then be accessed from `localhost`.


all the sample data is preloaded in the database (on the deployed version, this won't be there if you run it in docker)

the sample data looks like 


```jsx
{
	id                   1                   
  phoneNumber          "123456"
  email                "lorraine@hillvalley.edu"
  linkedId             null
  linkPrecedence       "primary"
  createdAt            2023-04-01 00:00:00.374+00              
  updatedAt            2023-04-01 00:00:00.374+00              
  deletedAt            null
},
{
	id                   23                   
  phoneNumber          "123456"
  email                "mcfly@hillvalley.edu"
  linkedId             1
  linkPrecedence       "secondary"
  createdAt            2023-04-20 05:30:00.11+00              
  updatedAt            2023-04-20 05:30:00.11+00              
  deletedAt            null
}
```

## Installation

```bash
   $ npm install
```

## Set Enviroment for  configurations

```bash
   $ cp .env.example .env
```


## Config settings .env for connect MySQL

Once the database has been configured, start the Nest App via `npm run start:dev` it automatically synchronizes the entities so ready to use. :heart_eyes_cat:

```
   TYPEORM_CONNECTION = "mysql"
   TYPEORM_HOST = "localhost"
   TYPEORM_PORT = 3306
   TYPEORM_USERNAME = [:user]
   TYPEORM_PASSWORD = [:password]
   TYPEORM_DATABASE = [:database]
   TYPEORM_AUTO_SCHEMA_SYNC = true
   TYPEORM_ENTITIES = "dist/**/*.entity.js"
   TYPEORM_SUBSCRIBERS = "dist/subscriber/**/*.js"
   TYPEORM_MIGRATIONS = "dist/migrations/**/*.js"
   TYPEORM_ENTITIES_DIR = "src/entity"
   TYPEORM_MIGRATIONS_DIR = "src/migration"
   TYPEORM_SUBSCRIBERS_DIR = "src/subscriber"
```

## Install TypeScript Node

```bash
   $ npm install -g ts-node
```

## Running migrations with typeorm

```bash
   $ ts-node node_modules/.bin/typeorm migration:run -d dist/typeorm-cli.config
```

or

```bash
   $ node_modules/.bin/typeorm migration:run -d dist/typeorm-cli.config
```

## Running the app

```bash
    # development
    $ npm run start

    # watch mode
    $ npm run start:dev

```




## Url Swagger for Api Documentation

```

http://127.0.0.1:3000/docs

```
or

```

https://api.rasenrhino.me/docs

```
or

```

/docs-json 

```

or

```

/docs-yaml 

```

Configure `SWAGGER_USER` and `SWAGGER_PASSWORD` in the .env file and set `NODE_ENV` to `local` or `dev`or `staging` to access the SWAGGER(Open Api) documentation with basic authentication.

```

NODE_ENV=[:enviroments]
SWAGGER_USER=[:user]
SWAGGER_PASSWORD=[:password]

````


## Configuring the ENDPOINT_CORS environment variable for app frontend

```
   ENDPOINT_CORS='http://127.0.0.1:4200'
```

## Getting secure resource with Curl

```bash
    $ curl -H 'content-type: application/json' -v -X GET http://127.0.0.1:3000/api/secure  -H 'Authorization: Bearer [:token]'
```

