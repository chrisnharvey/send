# Set the base image to latest Ubuntu LTS
FROM ubuntu:18.04

# Update package list
RUN apt-get update

# Install PHP (and extensions), composer, node, npm, etc
RUN DEBIAN_FRONTEND=noninteractive apt-get install -qq php composer nodejs npm php-zip php-mysql php-xml php-mbstring php-dom

# Clear out the local repository of retrieved package files
RUN apt-get clean