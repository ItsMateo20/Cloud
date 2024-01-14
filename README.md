# Cloud Storage
![Lines Of Code](https://tokei.rs/b1/github/ItsMateo20/Cloud?style=for-the-badge) ![Website](https://img.shields.io/website?url=https%3A%2F%2Fitsmateo20.github.io%2FCloud&up_message=ONLINE&down_message=OFFLINE&style=for-the-badge&label=Cloud%20Storage%20Preview%20Website&labelColor=white&color=gray)


![Header image](https://github.com/ItsMateo20/Cloud/assets/84156177/9fc28c5c-44df-4b75-a2da-699bd0ab7f8e)

## Overview

The Cloud Storage App is a web-based application designed for users to store and manage their files and folders in the cloud. It offers a convenient way to organize, upload, download, and delete files and folders, making it easy to access your data from anywhere.

This project was created for fun but will be used by me to store my files, eliminating the need for services like Google Photos or other web cloud storage solutions. The project was completed in just 2-3 weeks.

You can preview what this project can do on the [Github page](https://itsmateo20.github.io/Cloud) or for a move advanced view there is a bit of information lower down [here](#Features)
![Website](https://img.shields.io/website?url=https%3A%2F%2Fitsmateo20.github.io%2FCloud&up_message=ONLINE&down_message=OFFLINE&style=for-the-badge&label=Cloud%20Storage%20Preview%20Website&labelColor=white&color=gray)



## Features

- **User Authentication**: Users can create accounts, log in securely, and access their own cloud storage space.
  >  <img src="https://github.com/ItsMateo20/Cloud/assets/84156177/2caa6185-e227-4ce2-9cea-fe469a86973f" alt="User Authentication" width="auto" height="250">

- **File Management**: Easily upload, download, and delete files and folders.
  >  <img src="https://github.com/ItsMateo20/Cloud/assets/84156177/e03be5cf-c636-4d5c-882b-43915eadefda" alt="File Management" width="auto" height="300">

- **Folder Navigation**: Navigate through your folder structure and access nested folders.
  >  <img src="https://github.com/ItsMateo20/Cloud/assets/84156177/c3b8150b-9fd9-4ab9-9aac-f276131bc5e8" alt="Folder Navigation" width="auto" height="50">

- **File Preview**: View images and videos directly within the web interface.
  >  <img src="https://github.com/ItsMateo20/Cloud/assets/84156177/5ad4e947-b5b9-4976-ae33-3ad2cd1d35dc" alt="File Preview" width="auto" height="300">

- **Security**: Secure access to your files and folders with user authentication.
  >  <img src="https://github.com/ItsMateo20/Cloud/assets/84156177/8006b5d9-e806-4a8e-861b-b8f2e48e52ca" alt="Security" width="auto" height="250">

- **Responsive Design**: The app is responsive and works seamlessly on both desktop and mobile devices.
  >  <img src="https://github.com/ItsMateo20/Cloud/assets/84156177/30b138fb-50e4-4d57-976f-db0d2476f699" alt="Responsive Design" width="auto" height="515">  <img src="https://github.com/ItsMateo20/Cloud/assets/84156177/6765f26a-26fd-47ca-8017-bbfad9f37625" alt="Responsive Design" width="auto" height="515"> <img src="https://github.com/ItsMateo20/Cloud/assets/84156177/e03be5cf-c636-4d5c-882b-43915eadefda" alt="Responsive Design" width="auto" height="300">

- **Dark theme**: Dark theme provides a sleek and visually appealing option for users who prefer it.
  >  <img src="https://github.com/ItsMateo20/Cloud/assets/84156177/89ce5857-f195-42ff-9885-5edc28077663" alt="Dark theme" width="auto" height="300">

- **FTP**: By using FTP (File Transfer Protocol) you can access user/server files by local IP not public IP (yet)
  >  **(Admin view)**
  > 
  >  <img src="https://github.com/ItsMateo20/Cloud/assets/84156177/12b2865b-6536-4678-a140-c20aa3f021a0" alt="FTP (Admin view)" width="auto" height="300">


## How to migrate to newer versions of this project
<details>
<summary>Migration</summary>
  
  1. Move your database.sqlite and .env file outside of the folder and clear the content of the folder.
  2. Download the new version and extract the files from it.
  3. Move the database.sqlite and .env file in the folder that you extracted the files into.
  4. And run it, and you're migrated!
</details>

## Setup
<details>
  <summary>Setup Instructions</summary>

  1. Run the ```node index.js --setup``` command
  > <img src="https://github.com/ItsMateo20/Cloud/assets/84156177/84220beb-8388-4bc5-9f68-991c2bfdfa9a" alt="Step 1" width="auto" height="100">

  2. Edit the file to your likings
  > <img src="https://github.com/ItsMateo20/Cloud/assets/84156177/d28468e9-ce5e-4e73-b226-4baf666e38eb" alt="Step 2" width="auto" height="250">

  3. Now run ```node index.js```
  > <img src="https://github.com/ItsMateo20/Cloud/assets/84156177/ba218946-dc12-4ae1-84d4-95d43e9d8095" alt="Step 3" width="auto" height="300">

  4. Login to the admin account ```(email: admin@localhost, password: admin)```
  > <img src="https://github.com/ItsMateo20/Cloud/assets/84156177/5f293e89-b4e6-4903-8dd6-a770eacc56d2" alt="Step 4" width="auto" height="200">

  5. Add Your emails to whitelist and change the admin password
  > <img src="https://github.com/ItsMateo20/Cloud/assets/84156177/f1d07ccc-9c64-4c0e-9a57-ffc159418a6a" alt="Step 5a" width="auto" height="100">
  > <img src="https://github.com/ItsMateo20/Cloud/assets/84156177/c535222f-cf6a-4f74-bab9-b4c65455631c" alt="Step 5b" width="auto" height="100">

  6. Signup with your whitelisted email and login
  > <img src="https://github.com/ItsMateo20/Cloud/assets/84156177/15dca0d5-939e-4230-be9f-6201e403cfc7" alt="Step 6" width="auto" height="200">

  7. And enjoy Cloud Storage
  > <img src="https://github.com/ItsMateo20/Cloud/assets/84156177/f4dac306-c37f-44e0-8a04-ae501cdb3933" alt="Step 7" width="auto" height="300">
</details>


## FAQ
<details>
<summary>Frequently asked questions</summary>

- **Q: I keep getting an error containing "users_backup, usersettings_backup, whitelists_backup" what should I do?..**
- A: Run the command "npm run fix" and that should fix the error you're having!

- **Q: What is the port to the FTP server?...**
- A: The port to the FTP server is by default 3001 you can change it in your .env file

- **Q: What do I use to log into the FTP server?..**
- A: You log in the same way you would log in on the webpage (using your mail as the username and password as the password)

- **Q: How can I access the webpage?..**
- A: You can access the webpage using the url http://localhost:3000

- **Q: How can I access the webpage/cloud while not being connected to my home internet?..**
- A: You would have to port forward the system that your running the cloud on your router, [click here to search for solutions](https://www.google.com/search?q=how+to+port+forward+on+a+router). And then you can access your cloud using [your public ip](https://www.google.com/search?q=whats+my+ip) + the port that you have forwarded, for example http://67.273.965.234:3000 (not a real ip).

- **Q: I want to report something where do I do that?..**
- A: I have given instuctions [here](#how-to-report-issues)
</details>

## Technologies Used

- **Node.js:** <img src="./src/preview/README/nodejs.svg" alt="Node.js" width="auto" height="25">
- **Express.js:** <img src="./src/preview/README/expressjs.svg" alt="Express.js" width="auto" height="25">
- **Sqlite3:** <img src="./src/preview/README/sqlite3.svg" alt="Sqlite3" width="auto" height="25">
- **Sequelize:** <img src="./src/preview/README/sequelize.svg" alt="Sequelize" width="auto" height="25">
- **Ejs:** <img src="./src/preview/README/ejs.svg" alt="Ejs" width="auto" height="25">
- **Css:** <img src="./src/preview/README/css.svg" alt="Css" width="auto" height="25">
- **FFmpeg:** <img src="./src/preview/README/ffmpeg.svg" alt="FFmpeg" width="auto" height="25">
- **JSON:** <img src="./src/preview/README/json.svg" alt="JSON" width="auto" height="25">
- **JavaScript:** <img src="./src/preview/README/javascript.svg" alt="JavaScript" width="auto" height="25">
- **Bootstrap:** <img src="./src/preview/README/bootstrap.svg" alt="Bootstrap" width="auto" height="25">
- **Bootstrap Icons:** <img src="./src/preview/README/bootstrap.svg" alt="Bootstrap Icons" width="auto" height="25">

- And some other [**npm**](https://npmjs.com) packages (full list in [**package.json**](./package.json))

## How to Report Issues

- To ask a question, [click here](https://github.com/ItsMateo20/Cloud/issues/new?labels=question&template=QUESTION.yml&title=%5BQuestion%5D%3A+).
- To publish a feature request, [click here](https://github.com/ItsMateo20/Cloud/issues/new?assignees=ItsMateo20&labels=enhancement&template=FEATURE-REQUEST.yml&title=%5BFeature+Request%5D%3A+).
- To report a bug, [click here](https://github.com/ItsMateo20/Cloud/issues/new?assignees=ItsMateo20&labels=bug&template=BUG-REPORT.yml&title=%5BBug%5D%3A+).
- To report a vulnerability, [click here](https://github.com/ItsMateo20/Cloud/issues/new?assignees=ItsMateo20&labels=vulnerability&template=VULNERABILTY.yml&title=%5BVulnerability%5D%3A+).

## Security

For security-related matters, please refer to our [Security Policy](./SECURITY.md).

## Contributing
Contributions are welcome! If you have any ideas or improvements, feel free to [submit a feature request](https://github.com/ItsMateo20/Cloud/issues/new?assignees=ItsMateo20&labels=enhancement&template=FEATURE-REQUEST.yml&title=%5BFeature+Request%5D%3A+) (optionally with a repository fork that contains your feature).

## License
This project is licensed under the [MIT License](https://github.com/ItsMateo20/Cloud/blob/main/LICENSE.md).
