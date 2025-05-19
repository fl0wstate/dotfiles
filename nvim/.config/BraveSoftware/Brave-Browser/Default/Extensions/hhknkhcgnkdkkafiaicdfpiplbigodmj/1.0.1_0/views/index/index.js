const domainURL = "https://tools.cmlabs.co";
let inputUrl = "";
const loadingElement = document.getElementById("loading");  
const btnCrawlingStatus = document.getElementById("crawling-status");
const headerHero = document.getElementById("header");
const alertLimit = document.getElementById("alert-limit");
const btnLimit = document.getElementById("btn-limit");
const logButton = document.getElementById("log-button");
const resultElement = document.getElementById("result");
const readLatestBlog = document.getElementById("read__latest-blog");
const consultationBox = document.getElementById("consultation-box");

// Add Box Shadow Navbar
const shadowHeader = () => {
  const navbar = document.getElementById("navbar");
  // When the scroll is greater than 50 viewport height, add the shadow-navbar class
  this.scrollY >= 50
    ? navbar.classList.add("shadow-navbar")
    : navbar.classList.remove("shadow-navbar");
};
window.addEventListener("scroll", shadowHeader);

// Function check Chrome tab URL
function tabChrome() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var currentTab = tabs[0];
      var currentUrl = currentTab.url;

      resolve(currentUrl);
    });
  });
}

// Load DOM Extension
document.addEventListener("DOMContentLoaded", function () {
  tabChrome().then((currentUrl) => {
    let urlContainer = document.getElementById("url-container");
    urlContainer.textContent = currentUrl;
    inputUrl = currentUrl;
  });

  logButton.addEventListener("click", function () {
    launch();
  });
  checkLocalStorage();
});

// Run Extension
const launch = async () => {
  showLoading(true);
  resultElement.innerHTML = "";

  const isDataFetched = await checkFetchStatus();

  setTimeout(() => {
    if (isDataFetched) {
      logButton.style.display = "none";
    } else {
      tabChrome().then((currentUrl) => {
        const message = {
          event: "OnStartLinkAnalysis",
          data: {
            url: currentUrl,
          },
        };

        chrome.runtime.sendMessage(message);
      });
    }
  }, 5000);
};

// Check Status Extension Service Worker
const checkFetchStatus = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["isDataFetched"], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.isDataFetched);
      }
    });
  });
};

// Check Daily Use
const checkDailyUse = () => {
  chrome.storage.local.get(["thirdUseTime"], (result) => {
    let thirdUseTime = result.thirdUseTime
      ? JSON.parse(result.thirdUseTime)
      : null;

    if (thirdUseTime && thirdUseTime.countThirdTime === 3) {
      const timeDifference = new Date() - new Date(thirdUseTime.last);
      const timeDifferenceInHours = timeDifference / 1000 / 60 / 60;

      if (timeDifferenceInHours < 24) {
        consultationBox.classList.remove("d-none");
        consultationBox.classList.add("d-block");
      } else {
        consultationBox.classList.remove("d-block");
        consultationBox.classList.add("d-none");
      }
    }
  });
};

// Local Storage
const checkLocalStorage = () => {
  showLoading(true);
  resultElement.innerHTML = "";

  chrome.storage.local.get(["response"], (result) => {
    showLoading(false);

    if (result.response) {
      displayResultHttpHeader(result.response);
    } else {
      showLoading(true);
      launch();
    }
  });
};

// Show / Hide Section
const showLoading = (status) => {
  if (status) {
    consultationBox.classList.remove("d-block");
    consultationBox.classList.add("d-none");
    btnCrawlingStatus.classList.remove("d-none");
    btnCrawlingStatus.classList.add("d-block");
    loadingElement.classList.remove("d-none");
    loadingElement.classList.add("d-block");
    headerHero.classList.remove("d-none");
    headerHero.classList.add("d-flex");
    readLatestBlog.classList.remove("d-none");
    readLatestBlog.classList.add("d-block");
    logButton.classList.remove("d-block");
    logButton.classList.add("d-none");
  } else {
    btnCrawlingStatus.classList.remove("d-block");
    btnCrawlingStatus.classList.add("d-none");
    loadingElement.classList.remove("d-block");
    loadingElement.classList.add("d-none");
    headerHero.classList.remove("d-block");
    headerHero.classList.add("d-none");
    readLatestBlog.classList.remove("d-block");
    readLatestBlog.classList.add("d-none");
  }
};

// Display Result HTTP Header
const displayResultHttpHeader = (response) => {
  showLoading(false);
  checkDailyUse();
  const technologies = response.technologies;
  console.log('technologies: ', technologies);
  const technologiesByCategory = {};

  technologies.forEach((technology) => {
    technology.categories.forEach((category) => {
      const categoryId = category.id;
      if (!technologiesByCategory[categoryId]) {
        technologiesByCategory[categoryId] = [];
      }
      technologiesByCategory[categoryId].push(technology);
    });
  });

  let resultHTML = `
    <div class="accordion">
  `;

  Object.entries(technologiesByCategory).forEach(([categoryId, categoryTechnologies], index) => {
    const categoryName = categoryTechnologies[0].categories[0].name;
    const categoryCount = categoryTechnologies.length;
    resultHTML += `
      <div class="tab">
        <input type="checkbox" name="accordion-${index}" id="cb${index}">
        <div>
          <label for="cb${index}" class="tab__label">
              <div>
                <span class="name">${categoryName}</span>
                <span class="count">
                    ${categoryCount}
                </span>
               </div>
               <img src="../../assets/icon/arrow-down.svg" alt="Arrow Down Icon">
          </label>
        </div>
        <div class="tab__content">
    `;

    categoryTechnologies.forEach((technology) => {
      resultHTML += `<div class="item_container">
                        <div class="tech_item">
                          <img src="${domainURL}/media/technologyLookup/icons/${technology.icon}" alt="technology icon">
                          <p>${technology.name}</p>
                        </div>
                         <div class="tech_version">
                              ${technology.version ? technology.version : 'N/A'}
                         </div>
                     </div>
                     `;
    });
    resultHTML += `
        </div>
      </div>
    `;
  });

  resultHTML += `
    </div>
    <div class="details__container">
      <a href="${domainURL}/en/technology-lookup?url=${inputUrl.replace(/\/$/, "")}&auto=true" target="_blank" class="see__details">Want to see more details? See details</a>
      <img src="../../assets/icon/external-link.svg" alt="icon arrow" class="detail__icon">
    </div>
  `;

  resultElement.innerHTML = resultHTML;
  alertLimit.classList.remove("d-block");
  alertLimit.classList.add("d-none");
  logButton.classList.remove("d-none");
  logButton.classList.add("d-block");

  const message = {
    event: "OnResetResponse",
    data: null,
  };
  chrome.runtime.sendMessage(message);
};

// After Run Service Worker
chrome.runtime.onMessage.addListener((message) => {
  const { event, response, status, info } = message;

  switch (event) {
    case "OnFinishLinkAnalysis":
      if (status) {
        displayResultHttpHeader(response);
      } else {
        showLoading(false);
        resultElement.innerHTML = "";
        
        btnCrawlingStatus.classList.remove("d-block");
        btnCrawlingStatus.classList.add("d-none");
        headerHero.classList.add("d-flex");
        headerHero.classList.remove("d-none");
        alertLimit.classList.add("d-block");
        alertLimit.classList.remove("d-none");
        btnLimit.classList.add("d-flex");
        btnLimit.classList.remove("d-none");
        logButton.classList.add("d-none");
        logButton.classList.remove("d-block");
        readLatestBlog.classList.add("d-block");
        readLatestBlog.classList.remove("d-none");
      }
      break;
    default:
  }
});
