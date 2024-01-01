## ⚠️ WARNING: CSRF Vulnerability

This project is currently susceptible to [CSRF (Cross-Site Request Forgery)](https://wikipedia.org/wiki/Cross-site_request_forgery) attacks.

### What it means:

Cross-Site Request Forgery (CSRF) is a serious security vulnerability where an attacker tricks a user's browser into making unwanted requests to a web application where the user is authenticated. This can lead to unintended actions being performed on behalf of the user without their consent.

### Potential Consequences:

1. **Unauthorized Actions:** An attacker may force authenticated users to perform unintended actions, such as changing account settings, making financial transactions, or even performing actions with administrative privileges.

2. **Data Manipulation:** CSRF attacks can lead to the manipulation of user data, potentially causing data loss or corruption.

3. **Session Hijacking:** Attackers may attempt to hijack user sessions, gaining unauthorized access to the victim's account.

### Future Update:

In an upcoming release, efforts will be made to address and mitigate this vulnerability to prevent potential data leaks, including sensitive information such as passwords, emails, and files. Users are strongly encouraged to stay informed about updates and apply them promptly to enhance the security of the application.

## Reporting security issues:

If you discover any security vulnerabilities or have concerns, please responsibly disclose them by contacting me at [itsmateo20@gmail.com](mailto:itsmateo20@gmail.com). We appreciate your efforts in helping me maintain the security of our project.

### Vulnerability Disclosure Policy:

We are committed to addressing security issues promptly. Our vulnerability disclosure policy outlines the process for reporting and our commitment to keeping users informed about security matters. Please review my [Vulnerability Disclosure Policy](./VULNERABILITY_DISCLOSURE_POLICY.md) for more details.
