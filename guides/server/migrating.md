---
description: Help on how to migrate to a newer version.
---

# 🦿 Migrating

### AUTOMATIC

{% hint style="danger" %}
This feature/functionality is only available in version 1.4.7 and later.
{% endhint %}

{% tabs %}
{% tab title="Using node" %}
```
npm run update
```
{% endtab %}

{% tab title="Using bun (recommended)" %}
<pre><code><strong>bun run update
</strong></code></pre>
{% endtab %}
{% endtabs %}

This option is highly recommended because it significantly speeds up the upgrade process to newer versions.&#x20;

{% hint style="info" %}
If an error occurs after updating and restarting the application, manual migration may be necessary due to potential file corruption or loss.
{% endhint %}

### MANUAL

* Move your "`database.sqlite`" and "`.env`" files outside of the folder.
* Clear the contents of the folder.
* Download the new version and extract the files from it.

{% content-ref url="../../fundamentals/getting-set-up/downloading-from-github/unpacking-the-zip-file.md" %}
[unpacking-the-zip-file.md](../../fundamentals/getting-set-up/downloading-from-github/unpacking-the-zip-file.md)
{% endcontent-ref %}

* Move the "`database.sqlite`" and "`.env`" files into the folder where you extracted the files.
* Download the new dependencies in the folder

{% content-ref url="../../fundamentals/getting-set-up/downloading-dependencies.md" %}
[downloading-dependencies.md](../../fundamentals/getting-set-up/downloading-dependencies.md)
{% endcontent-ref %}

* Run the start command

{% content-ref url="../../fundamentals/getting-set-up/first-startup.md" %}
[first-startup.md](../../fundamentals/getting-set-up/first-startup.md)
{% endcontent-ref %}

* And you're migrated!
