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

# 🌀 Downloading from github

## First method - Recommended

Downloading the latest release of Cloud Storage from Github [https://github.com/ItsMateo20/Cloud/releases/latest](https://github.com/ItsMateo20/Cloud/releases/latest)

{% content-ref url="unpacking-the-zip-file.md" %}
[unpacking-the-zip-file.md](unpacking-the-zip-file.md)
{% endcontent-ref %}

## Second method

{% hint style="info" %}
Doing it this way you will have file that you won't need, like: README.md, Attributions.md, ./src/assets/README folder and much more, so I don't recommand doing it this way but if you dont care about having useless files then go ahead
{% endhint %}

Cloning the Cloud Storage repository on github to a folder using git

{% tabs %}
{% tab title="Command Prompt" %}
```
cd C://path/to/your/folder && git clone https://github.com/ItsMateo20/Cloud.git
```
{% endtab %}

{% tab title="PowerShell" %}
{% code fullWidth="false" %}
```powershell
$ cd "C://path/to/your/folder" ; git clone https://github.com/ItsMateo20/Cloud.git
```
{% endcode %}
{% endtab %}
{% endtabs %}

