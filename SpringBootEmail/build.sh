PROFILE=$1
TAG=$2
#dependency:copy-dependencies
#mvn clean install dependency:copy-dependencies -P${PROFILE} -Dmaven.test.skip=true 
mvn -Daws.account=528757825990 -Daws.region=us-east-2 clean compile install dependency:copy-dependencies -DincludeScope=runtime -Dmaven.test.skip=true -P${PROFILE}
#mvn compile -DincludeScope=runtime -Dmaven.test.skip=true -P${PROFILE}
#docker build -t spring_lamda:${TAG} .
docker-compose build app

