import postToCrawl from "./utils/postToCrawl.js";
import validateAndExtractBaseUrl from "./utils/validateUrl.js";

// Run to get Local Storage
chrome.runtime.onInstalled.addListener((details) => {
  // Get Data Before
  chrome.storage.local.get(["count", "lastFetchTime", "thirdUseTime"], (result) => {
    let tempCount = result.count;
    let tempLastFetchTime = result.lastFetchTime ? new Date(result.lastFetchTime) : null;
    let tempThirdUseTime = result.thirdUseTime
      ? JSON.parse(result.thirdUseTime)
      : { time: null, last: null, countThirdTime: 0 };

    // clear storage after the previous data is retrieved
    chrome.storage.local.clear(() => {
      if (!tempCount) {
        tempCount = 0;
      }

      if (!tempLastFetchTime) {
        tempLastFetchTime = null;
      }

      chrome.storage.local.set(
        {
          isDataFetched: false,
          // count: tempCount,
          lastFetchTime: tempLastFetchTime?.toString(),
          thirdUseTime: JSON.stringify(tempThirdUseTime),
        },
        () => {
          console.log("isDataFetched and fetch count data init");
        }
      );
    });
  });
});

// Event Analyze
chrome.runtime.onMessage.addListener((message) => {
  const { event, data } = message;

  switch (event) {
    case "OnStartLinkAnalysis":
      chrome.storage.local.set({
        response: null,
      });
      processAnalyze(data.url);
      break;
    case "OnResetResponse":
      resetLocal();
      break;
    default:
  }
});

// Process & Limit 5 times
const processAnalyze = async (url) => {
  chrome.storage.local
    .get(["count", "lastFetchTime"])
    .then(async (result) => {
      let count = result.count || 0;
      let lastFetchTime = result.lastFetchTime
        ? new Date(result.lastFetchTime)
        : null;
    
      const currentTime = new Date();
      
      // Limit 5
      if (count >= 5) {
        const timeDifference = currentTime - lastFetchTime;
        const timeDifferenceInHours = timeDifference / 1000 / 60 / 60;

        if (timeDifferenceInHours < 1) {
          const message = {
            event: "OnFinishLinkAnalysis",
            status: false,
            info: "You have reached the usage limit of this tool",
            data: null,
          };
          chrome.runtime.sendMessage(message, () => {
            if (chrome.runtime.lastError) {
            }
          });
          return;
        } else {
          count = 0;
          lastFetchTime = currentTime.toString();

          chrome.storage.local.set({
            // count: count,
            lastFetchTime: lastFetchTime,
          });
        }
      }

      const baseUrl = validateAndExtractBaseUrl(url);

      if (baseUrl) {
        chrome.storage.local.set({ isDataFetched: true }, () => {
          console.log("isDataFetched saved as true.");
        });

        const data = await postToCrawl(baseUrl);

        if (data) {
          const message = {
            event: "OnFinishLinkAnalysis",
            status: true,
            response: data,
          };

          // count++;
          lastFetchTime = currentTime.toString();

          chrome.storage.local.set({
            // count: count,
            lastFetchTime: lastFetchTime,
          });

          await checkAndUpdateThirdUseTime();

          chrome.runtime.sendMessage(message, () => {
            if (chrome.runtime.lastError) {
              chrome.storage.local.set({ response: data });
            }
          });
        } else {
          const message = {
            event: "OnFinishLinkAnalysis",
            status: false,
            info: "Something went wrong, please try again!",
            data: null,
          };
          chrome.runtime.sendMessage(message);
        }
      } else {
        const message = {
          event: "OnFinishLinkAnalysis",
          status: false,
          info: "The url is invalid! please provide with the correct URL.",
          data: null,
        };
        chrome.runtime.sendMessage(message);
      }
    });
};

// Reset Local Storage
const resetLocal = () => {
  chrome.storage.local.set({ response: null }, () => {
    console.log("response set to null.");
    chrome.storage.local.set({ isDataFetched: false }, () => {
      console.log("isDataFetched saved as false.");
    });
  });
};

const checkAndUpdateThirdUseTime = async () => {
  const currentTime = new Date();
  const result = await chrome.storage.local.get(["count", "thirdUseTime"]);
  let count = result.count || 0;
  let thirdUseTime = result.thirdUseTime
    ? JSON.parse(result.thirdUseTime)
    : null;

  if (count === 3) {
    if (!thirdUseTime) {
      thirdUseTime = {
        time: currentTime,
        last: currentTime,
        countThirdTime: count,
      };
    } else {
      // check if 24 hours or not
      const timeDifference = currentTime - new Date(thirdUseTime.last);
      const timeDifferenceInHours = timeDifference / 1000 / 60 / 60;

      if (timeDifferenceInHours >= 24) {
        thirdUseTime = {
          time: currentTime,
          last: currentTime,
          countThirdTime: count,
        };
      } else {
        thirdUseTime.time = currentTime;
        
        if (thirdUseTime.countThirdTime < 3) {
          thirdUseTime.countThirdTime = count;
        }
      }
    }

    chrome.storage.local.set({
      thirdUseTime: JSON.stringify(thirdUseTime),
    });
  } else if (count < 3) {
    if (!thirdUseTime) {
      thirdUseTime = {
        time: currentTime,
        last: currentTime,
        countThirdTime: count,
      };
    } else {
      thirdUseTime.time = currentTime;

      if (thirdUseTime.countThirdTime < 3) {
        thirdUseTime.countThirdTime = count;
      }
    }

    chrome.storage.local.set({
      thirdUseTime: JSON.stringify(thirdUseTime),
    });
  }
};
