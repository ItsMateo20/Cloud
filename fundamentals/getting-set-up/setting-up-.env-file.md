---
layout:
  title:
    visible: true
  description:
    visible: false
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
---

# 🗄 Setting up .env file

## First Method - Recommended

Open a Command Prompt and run the following command inside of the folder.

{% tabs %}
{% tab title="Command Prompt" %}
```
$ npm run setup
```
{% endtab %}

{% tab title="PowerShell" %}
```powershell
$ npm run setup
```
{% endtab %}
{% endtabs %}

## Second Method

Rename the ".env.example" file to ".env", open and edit its contents to reflect the correct FTP port and internet port that are not in use. Customize the settings to your preferences and replace the secrets with random letters, symbols, and numbers. Ensure that each secret is unique and does not exceed 32 characters. Save and close the file when you're done.

You can also change the user folder directory if you know what you are doing. If not, it's not recommended. The folder will be created in the server folder if not changed anyway.
