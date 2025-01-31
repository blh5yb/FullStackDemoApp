FROM ubuntu:latest

RUN apt-get update && apt-get install -y gosu
# non-root user for security
RUN addgroup appgroup && adduser -S -G appgroup appUser
USER appUser

#FROM node:22
FROM public.ecr.aws/lambda/nodejs:22

########## local development #####################
WORKDIR /
RUN mkdir src
COPY ./src /src
RUN chmod 755 /src
RUN rm -rf ./src/swagger_output.json ./src/swagger.js

COPY ./package.json .
RUN npm install
ENTRYPOINT ["node", "/src/index.mjs"]
##################################################

############### Lambda Deployment ################
# COPY package*.json ${LAMBDA_TASK_ROOT}
# COPY ./src ${LAMBDA_TASK_ROOT}
# RUN npm install
##################################################

EXPOSE 3000
# uncomment entrypoint for local testing
CMD [ "index.handler" ]