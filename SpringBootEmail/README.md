# Demo Spring API
This is a demo spring api with some unit tests and swagger api configured

###Cmds
`
    mvn clean install -Pdocker -Dmaven.test.skip=true
    docker-compose build app
`

### test api: http://localhost:8080/api/
### test db: http://localhost:8080/h2-console # brew install h2 && brew services start h2
### Swagger: http://localhost:8080/swagger-ui/index.html

### Rate Limit
20 per min for dev

## To Do:
 - Add mailer endpoint
 - API Authentication and private endpoints
 - Complete Unit Tests
 - Deploy

