# Running UI tests locally and in browserstack

**PREREQUISITES:** IW VPN, browserstack account (UserId and Access Key)

Selenium Webdriver Executables

- Open Chrome (or install it if you don't have it) and check you have the latest version.
- Go here: [https://chromedriver.chromium.org/downloads](https://chromedriver.chromium.org/downloads) and download the latest `chromedriver`.
- Go here: [https://github.com/mozilla/geckodriver](https://github.com/mozilla/geckodriver) and download the latest `geckodriver` (for firefox).
- After downloading, make sure the `chromedriver` and `geckodriver` executables are in your `PATH`

Download Maven from here: [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)

Download Java and install OpenJDK 13. For Mac: `curl https://download.java.net/java/GA/jdk13.0.2/d4173c853231432d94f001e99d882ca7/8/GPL/openjdk-13.0.2\_osx-x64\_bin.tar.gz | tar -xz mv jdk-13.0.2.jdk/ /Library/Java/JavaVirtualMachines/` (this might need `sudo` infront if you get permission denied)

Update `JAVA_HOME` environment variable.

Assuming your `.bash_profile` has `export JAVA_HOME=$(/usr/libexec/java_home)` just do: `source ~/.bash_profile`

### Running the tests locally

On MacOS: - When you first run the UI tests on your machine, you might receive an error telling you that '“chromedriver” cannot be opened because the developer cannot be verified'. If you receive this error, open **System Preferences** > **Security & Privacy** > **General** and select 'Allow Anyway' alongside the message about `chromedriver`. - The next time you receive an error window, click through to allow `chromedriver` to run.

To run the tests, either click the green arrow to the left of the @Test annotation (if using intelliJ), or run one of the local make commands, eg. `make test-chrome-local`

To change to hit your local version of the site, change the homepage URL to your localhost URL. This will run the tests on your local machine

### Running the tests remotely

To run the tests on BrowserStack you must first install the BrowserStack local CLI, see [https://www.browserstack.com/local-testing/automate#command-line](https://www.browserstack.com/local-testing/automate#command-line) for details.

You can then start a local tunnel to BrowserStack by running:

`BrowserStackLocal --key ${YOUR_BROWSERSTACK_KEY} --force-local`

`YOUR_BROWSERSTACK_KEY` can be found by logging into BrowserStack and finding it in your account details. The tests can then be run remotely using the remote make commands eg. `BROWSERSTACK_USERNAME=${YOUR\_USERNAME} BROWSERSTACK\_KEY=${YOUR_BROWSERSTACK_KEY} make test-windows-chrome-remote`
