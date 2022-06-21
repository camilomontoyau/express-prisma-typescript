FROM node:16 as prismapoc
WORKDIR /usr/src/app
RUN node -v 
RUN npm -v
EXPOSE 5001
CMD [ "npm", "start"]