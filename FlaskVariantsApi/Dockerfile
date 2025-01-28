FROM ubuntu:latest

RUN apt-get update && apt-get install -y gosu
# non-root user for security
RUN addgroup appgroup && adduser -S -G appgroup appUser
USER appUser

# FROM python:3.12 AS build-image
# FROM python:3.12-slim
FROM public.ecr.aws/lambda/python:3.12

EXPOSE 3000
WORKDIR /

########## local development ####################
# RUN mkdir src
# COPY ./src /src
# RUN chmod 755 /src
# COPY ./requirements.txt .
# RUN pip install -r /requirements.txt
# ENTRYPOINT [ "python3", "/src/app.py", "runserver" ]
##################################################


################ Lambda Deployment ################
RUN mkdir -p function
COPY ./src ${LAMBDA_TASK_ROOT}
RUN chmod 755 /function
COPY ./requirements.txt ${LAMBDA_TASK_ROOT}
RUN pip install -r ${LAMBDA_TASK_ROOT}/requirements.txt
##################################################

# Use a slim version of the base Python image to reduce the final image size
# FROM python:3.12-slim

# Copy in the built dependencies
# COPY --from=build-image /function /function
# ENTRYPOINT [ "/usr/local/bin/python", "-m", "awslambdaric" ]


# Pass the name of the function handler as an argument to the runtime
CMD [ "app.handler" ]
