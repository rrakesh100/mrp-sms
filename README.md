Simple Sales Management App that doesn't deserve documentation yet. We'd love to write the documentation one day and want to people to use it out of the box.



#REFERENCES

## IMPORT CSV TO FIREBASE

1. Install tools

npm install -g firebase-import
npm i -g csvtojson

2. Convert csv to json

csvtojson CSV_FILE_PATH.csv >JSON_FILE_PATH

3. Push to firebase

firebase-import --database_url https://APP_PATH.firebaseio.com --path /path/to/node --json JSON_FILE_PATH.json
