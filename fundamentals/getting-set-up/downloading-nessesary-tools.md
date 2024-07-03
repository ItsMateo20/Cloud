---
description: The tools you have to have installed for this Cloud to work
layout:
  title:
    visible: true
  description:
    visible: true
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
---

# 💾 Downloading nessesary tools

## Windows

### Chocolatey - easiest way

{% hint style="info" %}
We really suggest downloading this, It speeds up the downloading of everything. But if this way dosen't work for you skip it (You will have to download ffmpeg somehow else tho)
{% endhint %}

* Download chocolatey from the offical page at [https://chocolatey.org/install#individual](https://chocolatey.org/install#individual)
* Open PowerShell as administrator and run the command.

{% tabs %}
{% tab title="Admin Command Prompt" %}
```
choco install git nodejs ffmpeg bun
```
{% endtab %}

{% tab title="Admin PowerShell (recommended)" %}
```powershell
$ choco install git nodejs ffmpeg bun
```
{% endtab %}
{% endtabs %}

### Node.js

* Download Nodejs from the offical page at [https://nodejs.org/en](https://nodejs.org/en) and select the recommended install.

### Bun

* Download bun from the offical page at [https://bun.sh/](https://bun.sh/)

### Git - optional

* Download Git from the offical page at [https://git-scm.com/downloads](https://git-scm.com/downloads)

### FFmpeg

* The best way of installing this is through Chocolatey using the command

{% tabs %}
{% tab title="Command Prompt" %}
```
choco install ffmpeg
```
{% endtab %}

{% tab title="PowerShell" %}
```powershell
$ choco install ffmpeg
```
{% endtab %}
{% endtabs %}

### 7-zip or WinRAR

* Download 7-Zip [https://7-zip.org/](https://7-zip.org/) or WinRAR [https://www.win-rar.com/start.html](https://www.win-rar.com/start.html) to unpack the zip that you will be downloading from [https://github.com/ItsMateo20/Cloud/releases/latest](https://github.com/ItsMateo20/Cloud/releases/latest) on future steps

## Linux - coming soon (the setup is pretty much the same)

## IOS - not supported yet (I think, didn't test)
