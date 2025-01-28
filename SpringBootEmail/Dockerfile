FROM ubuntu:latest

RUN apt-get update && apt-get install -y gosu
# non-root user for security
RUN addgroup appgroup && adduser -S -G appgroup appUser
USER appUser

FROM public.ecr.aws/lambda/java:17

EXPOSE 8080
COPY target/spring-docker.jar ${LAMBDA_TASK_ROOT}
ADD target .
COPY target/classes ${LAMBDA_TASK_ROOT}
COPY target/dependency/* ${LAMBDA_TASK_ROOT}/lib/

RUN chmod -R 755 /var/lang/bin

#ENTRYPOINT [ "java", "-jar", "spring-docker.jar" ]
CMD ["com.demospringbootapi.emailmicroservice.StreamLambdaHandler::handleRequest"]