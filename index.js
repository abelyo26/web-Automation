const puppeteer = require("puppeteer");
const { getRandomEvenNumbers, getRandomOddNumbers } = require("./utils");
(async () => {
  console.log("------>", process.env.NODE_ENV);
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(100000);
  //   await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });

  await page.emulate(puppeteer.devices["iPhone X"]);
  await page.goto("https://vamos.bet/");
  await page.click('button[class="main-header__log-in-button"]');

  // username and password to login
  await page.type("#login", "0912345678");
  await page.type("#password", "12345");

  await page.click('button[class="auth__button"]');

  // Wait for the <ul> element to be visible and clickable
  await page.waitForSelector("ul.sport-bar__list");

  // Click on the third <li> element (index 2)
  await page.evaluate(() => {
    const liElements = document.querySelectorAll("ul.sport-bar__list li");
    if (liElements.length >= 3) {
      liElements[2].querySelector("div.sport-bar__button").click();
    }
  });

  await page.waitForSelector("ul.modal-games");

  await page.evaluate(() => {
    // Get the fifth <li> element (index 4)
    const liElement = document.querySelectorAll("ul.modal-games li")[4];

    // Find the <img> tag inside the <li> element
    const imgElement = liElement.querySelector("img");

    // Trigger a click event on the <img> tag
    if (imgElement) {
      imgElement.click();
    }
  });
  await page.waitForTimeout(9000);
  await page.waitForSelector("#eg-iframe");
  const iframeElement = await page.$("#eg-iframe");
  const frame = await iframeElement.contentFrame();
  if (frame) {
    if (process.env.NODE_ENV === "Development") {
      const button = await frame.$(".demo-play__demo-button ");
      if (button) {
        await button.evaluate((button) =>
          button.dispatchEvent(new MouseEvent("click", { bubbles: true }))
        );
      }
    } else {
      const button = await frame.$(".demo-play__play-button ");
      if (button) {
        await button.evaluate((button) =>
          button.dispatchEvent(new MouseEvent("click", { bubbles: true }))
        );
      }
    }
  }

  await page.waitForTimeout(2000);
  const playBoardIFrameElement = await page.$("#eg-iframe");
  const playBoardFrame = await playBoardIFrameElement.contentFrame();
  let betPlaced = false;

  if (playBoardFrame) {
    setInterval(async () => {
      try {
        const timerValue = await playBoardFrame.evaluate(() => {
          const timerElement = document.querySelector(".time__text");
          return timerElement
            ? parseInt(timerElement.innerText.slice(3, 5))
            : "Timer element not found";
        });

        if (timerValue < 58 && timerValue > 2 && !betPlaced) {
          console.log("bet in progress----");

          await playBoardFrame.evaluate(() => {
            function getRandomOddNumbers() {
              const oddNumbers = [];
              while (oddNumbers.length < 4) {
                const randomNumber = Math.floor(Math.random() * 36) + 1;
                if (
                  randomNumber % 2 !== 0 &&
                  !oddNumbers.includes(randomNumber)
                ) {
                  oddNumbers.push(randomNumber);
                }
              }
              return oddNumbers.map((number) => number.toString());
            }

            function getRandomEvenNumbers() {
              const evenNumbers = [];
              while (evenNumbers.length < 4) {
                const randomNumber = Math.floor(Math.random() * 36) + 1;
                if (
                  randomNumber % 2 === 0 &&
                  !evenNumbers.includes(randomNumber)
                ) {
                  evenNumbers.push(randomNumber);
                }
              }
              return evenNumbers.map((number) => number.toString());
            }
            const buttons = document.querySelectorAll("button");

            bet("EVEN", getRandomEvenNumbers());
            // bet("ODD", getRandomOddNumbers());
            setTimeout(() => bet("ODD", getRandomOddNumbers()), 5000);

            /* const oddNum = ["1", "11", "21", "33"];
            const evenNum = ["6", "14", "26", "34"];

            bet("EVEN", evenNum);
            // bet("ODD", getRandomOddNumbers());
            setTimeout(() => bet("ODD", oddNum), 5000); */

            function bet(type, randomNumbers) {
              buttons.forEach(async (button) => {
                const span = button.querySelector("span:first-child");
                if (span) {
                  if (
                    span.innerText === type ||
                    randomNumbers.includes(span.innerText)
                  ) {
                    button.click();
                  }
                }
              });
              const betButton = document.querySelector("button.main__button");
              betButton.click();

              //   <button class="main__button">DEMO BET</button>
            }
          });

          betPlaced = !betPlaced;
        } else if (timerValue < 2 && betPlaced) betPlaced = !betPlaced;

        // console.log("Timer Value:", timerValue, betPlaced);
      } catch (err) {
        console.error("Error while evaluating timer:", err);
      }
    }, 1000);
  }

  //   await page.screenshot({ path: "photo.png" });

  //   await brawser.close();
})();
