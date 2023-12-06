# Cloud Storage
![Lines Of Code](https://tokei.rs/b1/github/ItsMateo20/Cloud?style=for-the-badge)

![Header image](https://github.com/ItsMateo20/Cloud/assets/84156177/9fc28c5c-44df-4b75-a2da-699bd0ab7f8e)

## Overview

The Cloud Storage App is a web-based application designed for users to store and manage their files and folders in the cloud. It offers a convenient way to organize, upload, download, and delete files and folders, making it easy to access your data from anywhere.

This project was created for fun but will be used by me to store my files, eliminating the need for services like Google Photos or other web cloud storage solutions. The project was completed in just 2-3 weeks.

## Features

- **User Authentication**: Users can create accounts, log in securely, and access their own cloud storage space.

![image](https://github.com/ItsMateo20/Cloud/assets/84156177/2caa6185-e227-4ce2-9cea-fe469a86973f)

- **File Management**: Easily upload, download, and delete files and folders.
  
![image](https://github.com/ItsMateo20/Cloud/assets/84156177/e03be5cf-c636-4d5c-882b-43915eadefda)

- **Folder Navigation**: Navigate through your folder structure and access nested folders.

![image](https://github.com/ItsMateo20/Cloud/assets/84156177/c3b8150b-9fd9-4ab9-9aac-f276131bc5e8)

- **File Preview**: View images and videos directly within the web interface.

![image](https://github.com/ItsMateo20/Cloud/assets/84156177/5ad4e947-b5b9-4976-ae33-3ad2cd1d35dc)

- **Security**: Secure access to your files and folders with user authentication.

![image](https://github.com/ItsMateo20/Cloud/assets/84156177/8006b5d9-e806-4a8e-861b-b8f2e48e52ca)

- **Responsive Design**: The app is responsive and works seamlessly on both desktop and mobile devices.
  
![image](https://github.com/ItsMateo20/Cloud/assets/84156177/30b138fb-50e4-4d57-976f-db0d2476f699)  ![image](https://github.com/ItsMateo20/Cloud/assets/84156177/6765f26a-26fd-47ca-8017-bbfad9f37625)

![image](https://github.com/ItsMateo20/Cloud/assets/84156177/e03be5cf-c636-4d5c-882b-43915eadefda)

- **Dark theme**: Dark theme provides a sleek and visually appealing option for users who prefer it.

![Image](https://github.com/ItsMateo20/Cloud/assets/84156177/5fb2a9cb-8d29-4a46-92eb-faa00a85948c)

## How to migrade to newer versions of this project
1. Move your database.sqlite file outside of the folder and clear the content of the folder.
2. Download the new version and extract the files from it.
3. Move the database.sqlite file in the folder that you extracted the files into.
4. And run it and your migrated!

## FAQ
Q: I keep getting an error containing "users_backup, usersettings_backup, whitelists_backup" what should i do?..

A: Run the command "npm run fix" and that should fix the error your having!

## Technologies Used
- Node.js
- Express.js
- Sqlite3
- Sequelize
- Ejs
- Css
- FFmpeg
- JSON
- JavaScript
- Bootstrap
- And some other [npm](https://npmjs.com) packages (full list in [package.json](https://github.com/ItsMateo20/Cloud/blob/main/package.json))

## Contributing
Contributions are welcome! If you have any ideas or improvements, feel free to submit a pull request.

## License
This project is licensed under the [MIT License](https://github.com/ItsMateo20/Cloud/blob/main/COPYRIGHT.md).
