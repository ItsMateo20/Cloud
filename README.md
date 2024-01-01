# Cloud Storage
![Lines Of Code](https://tokei.rs/b1/github/ItsMateo20/Cloud?style=for-the-badge)

![Header image](https://github.com/ItsMateo20/Cloud/assets/84156177/9fc28c5c-44df-4b75-a2da-699bd0ab7f8e)

## Overview

The Cloud Storage App is a web-based application designed for users to store and manage their files and folders in the cloud. It offers a convenient way to organize, upload, download, and delete files and folders, making it easy to access your data from anywhere.

This project was created for fun but will be used by me to store my files, eliminating the need for services like Google Photos or other web cloud storage solutions. The project was completed in just 2-3 weeks.

## Features

- **User Authentication**: Users can create accounts, log in securely, and access their own cloud storage space.
  >  ![image](https://github.com/ItsMateo20/Cloud/assets/84156177/2caa6185-e227-4ce2-9cea-fe469a86973f)

- **File Management**: Easily upload, download, and delete files and folders.
  >  ![image](https://github.com/ItsMateo20/Cloud/assets/84156177/e03be5cf-c636-4d5c-882b-43915eadefda)

- **Folder Navigation**: Navigate through your folder structure and access nested folders.
  >  ![image](https://github.com/ItsMateo20/Cloud/assets/84156177/c3b8150b-9fd9-4ab9-9aac-f276131bc5e8)

- **File Preview**: View images and videos directly within the web interface.
  >  ![image](https://github.com/ItsMateo20/Cloud/assets/84156177/5ad4e947-b5b9-4976-ae33-3ad2cd1d35dc)

- **Security**: Secure access to your files and folders with user authentication.
  >  ![image](https://github.com/ItsMateo20/Cloud/assets/84156177/8006b5d9-e806-4a8e-861b-b8f2e48e52ca)

- **Responsive Design**: The app is responsive and works seamlessly on both desktop and mobile devices.
  >  ![image](https://github.com/ItsMateo20/Cloud/assets/84156177/30b138fb-50e4-4d57-976f-db0d2476f699)  ![image](https://github.com/ItsMateo20/Cloud/assets/84156177/6765f26a-26fd-47ca-8017-bbfad9f37625)
     ![image](https://github.com/ItsMateo20/Cloud/assets/84156177/e03be5cf-c636-4d5c-882b-43915eadefda)

- **Dark theme**: Dark theme provides a sleek and visually appealing option for users who prefer it.
  >  ![image](https://github.com/ItsMateo20/Cloud/assets/84156177/89ce5857-f195-42ff-9885-5edc28077663)

- **FTP**: By using FTP (File Transfer Protocol) you can access user/server files by local ip not public ip (yet)
  >  **(Admin view)**
     ![image](https://github.com/ItsMateo20/Cloud/assets/84156177/12b2865b-6536-4678-a140-c20aa3f021a0)

## How to migrate to newer versions of this project
1. Move your database.sqlite and .env file outside of the folder and clear the content of the folder.
2. Download the new version and extract the files from it.
3. Move the database.sqlite and .env file in the folder that you extracted the files into.
4. And run it, and you're migrated!

## FAQ
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

## Technologies Used

- **Node.js:** <img src="./ReadmeImages/nodejs.svg" alt="Node.js" width="auto" height="25">
- **Express.js:** <img src="./ReadmeImages/expressjs.svg" alt="Express.js" width="auto" height="25">
- **Sqlite3:** <img src="./ReadmeImages/sqlite3.svg" alt="Sqlite3" width="auto" height="25">
- **Sequelize:** <img src="./ReadmeImages/sequelize.svg" alt="Sequelize" width="auto" height="25">
- **Ejs:** <img src="./ReadmeImages/ejs.svg" alt="Ejs" width="auto" height="25">
- **Css:** <img src="./ReadmeImages/css.svg" alt="Css" width="auto" height="25">
- **FFmpeg:** <img src="./ReadmeImages/ffmpeg.svg" alt="FFmpeg" width="auto" height="25">
- **JSON:** <img src="./ReadmeImages/json.svg" alt="JSON" width="auto" height="25">
- **JavaScript:** <img src="./ReadmeImages/javascript.svg" alt="JavaScript" width="auto" height="25">
- **Bootstrap:** <img src="./ReadmeImages/bootstrap.svg" alt="Bootstrap" width="auto" height="25">
- **Bootstrap Icons:** <img src="./ReadmeImages/bootstrap.svg" alt="Bootstrap Icons" width="auto" height="25">

- And some other [**npm**](https://npmjs.com) packages (full list in [**package.json**](./package.json))

## How to Report Issues

- To ask a question, [click here](https://github.com/ItsMateo20/Cloud/issues/new?labels=question&template=QUESTION.yml&title=%5BQuestion%5D%3A+).
- To report a bug, [click here](https://github.com/ItsMateo20/Cloud/issues/new?assignees=ItsMateo20&labels=bug&template=BUG-REPORT.yml&title=%5BBug%5D%3A+).
- To report a vulnerability, [click here](https://github.com/ItsMateo20/Cloud/issues/new?assignees=ItsMateo20&labels=vulnerability&template=VULNERABILTY.yml&title=%5BVulnerability%5D%3A+).

## Security

For security-related matters, please refer to our [Security Policy](./SECURITY.md).

## Contributing
Contributions are welcome! If you have any ideas or improvements, feel free to submit a pull request or ask anything [here](https://github.com/ItsMateo20/Cloud/issues/new?labels=question&template=QUESTION.yml&title=%5BQuestion%5D%3A+).

## License
This project is licensed under the [MIT License](https://github.com/ItsMateo20/Cloud/blob/main/LICENSE.md).
