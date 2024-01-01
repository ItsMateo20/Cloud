# Vulnerability Disclosure Policy

I appreciate the efforts of security researchers and users in helping me maintain the security of my project. If you discover a security vulnerability, please follow the steps below:

## How you can report a vulnerabilty

- Send an email to [itsmateo20@gmail.com](mailto:itsmateo20@gmail.com) with details of the vulnerability. (Provide a clear and concise description of the issue, including steps to reproduce if possible.)
- Click on the [Security tab](https://github.com/ItsMateo20/Cloud/security) and follow [these](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability#privately-reporting-a-security-vulnerability) steps if your lost.

## Expectations

- I will acknowledge the receipt of your report promptly.
- I will investigate and assess the reported vulnerability.
- I aim to provide regular updates on the progress of the investigation.
- Once a fix is developed, I will coordinate the disclosure of the vulnerability.

## Acknowledgment

I appreciate responsible disclosure and may publicly acknowledge individuals who report security vulnerabilities, subject to their preference.

## Scope

This vulnerability disclosure policy applies to the "Cloud Storage" project, covering all its components, modules, or scripts.

## Legal Protections

I commit not to take legal action against individuals who report security vulnerabilities responsibly and adhere to the guidelines outlined in this policy.

Thank you for helping me ensure the security of this project.

---

# List of Vulnerabilities in this project

## CSRF Vulnerability

### What it means:

[Cross-Site Request Forgery (CSRF)](https://wikipedia.org/wiki/Cross-site_request_forgery) is a serious security vulnerability where an attacker tricks a user's browser into making unwanted requests to a web application where the user is authenticated. This can lead to unintended actions being performed on behalf of the user without their consent.

#### Potential Consequences:

1. **Unauthorized Actions:** An attacker may force authenticated users to perform unintended actions, such as changing account settings and password.

2. **Data Manipulation:** CSRF attacks can lead to the manipulation of user data, potentially causing data loss or corruption.

3. **Session Hijacking:** Attackers may attempt to hijack user sessions, gaining unauthorized access to the victim's account.

### Future Update:

In an upcoming release, efforts will be made to address and mitigate this vulnerability to prevent potential data leaks, including sensitive information such as passwords, emails, and files. Users are strongly encouraged to stay informed about updates and apply them promptly to enhance the security of the application.

---

*Please note that the information provided here is subject to change as the investigation and mitigation efforts progress.*
