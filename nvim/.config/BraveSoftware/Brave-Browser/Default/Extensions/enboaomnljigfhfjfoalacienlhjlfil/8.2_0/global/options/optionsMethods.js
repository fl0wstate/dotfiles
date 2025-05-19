function getLocalizedOptionName(optionObjectName) {
  if (optionObjectName.hasOwnProperty(app_language)) {
    return optionObjectName[app_language];
  } else if (optionObjectName.hasOwnProperty("en")) {
    return optionObjectName.en;
  } else {
    return optionObjectName;
  }
}

function getLocalizedGroupName(groupObjectName) {
  if (groupObjectName.hasOwnProperty(app_language)) {
    return groupObjectName[app_language];
  } else if (groupObjectName.hasOwnProperty("en")) {
    return groupObjectName.en;
  } else {
    return groupObjectName;
  }
}

function getLocalizedCategoryName(categoryObjectName) {
  if (categoryObjectName.hasOwnProperty(app_language)) {
    return categoryObjectName[app_language];
  } else if (categoryObjectName.hasOwnProperty("en")) {
    return categoryObjectName.en;
  } else {
    return categoryObjectName;
  }
}

function getAllOptions(categories) {
  const allOptions = [];

  // Helper function to recursively collect options
  function collectOptions(options) {
    for (const option of options) {
      allOptions.push(option);

      // Check if the option has childOnOptions
      if (option.childOnOptions) {
        collectOptions(option.childOnOptions);
      }

      // Check if the option has childOffOptions
      if (option.childOffOptions) {
        collectOptions(option.childOffOptions);
      }
    }
  }

  // Loop through the categories
  for (const category of categories) {
    for (const group of category.categoryGroups) {
      // Check if the group has "options"
      if (group.options) {
        collectOptions(group.options);
      }
    }
  }

  // Add untrap_global_enable
  allOptions.push(...OTHER_SETTINGS);

  return allOptions;
}

function findOptionById(id) {
  // Helper function to recursively find an option by ID
  function findOption(options) {
    for (const option of options) {
      // Check if the current option has the given ID
      if (option.id === id) {
        return option;
      }

      // Check if the option has childOnOptions
      if (option.childOnOptions) {
        const foundOption = findOption(option.childOnOptions);
        if (foundOption) {
          return foundOption;
        }
      }

      // Check if the option has childOffOptions
      if (option.childOffOptions) {
        const foundOption = findOption(option.childOffOptions);
        if (foundOption) {
          return foundOption;
        }
      }
    }

    // Return null if no element with the given ID is found
    return null;
  }

  // Loop through the categories
  for (const category of ACTUAL_CATEGORIES) {
    for (const group of category.categoryGroups) {
      // Check if the group has "options"
      if (group.options) {
        const foundOption = findOption(group.options);
        if (foundOption) {
          return foundOption;
        }
      }
    }
  }

  return null; // Return null if no element with the given ID is found
}

function isDesktop(href) {
  const desktopUrlParts = ["www.youtube.com"];
  const mobileUrlParts = ["m.youtube.com"];

  if (href.includes(desktopUrlParts) && !href.includes(mobileUrlParts)) {
    return true;
  } else if (!href.includes(desktopUrlParts) && href.includes(mobileUrlParts)) {
    return false;
  } else {
    return true;
  }
}

function isBrowserSafari() {
  let userAgent = window.navigator.userAgent;

  if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    return true;
  } else {
    return false;
  }
}

// MARK: - Search Methods

function searchOptions(options, query) {
  // Split the query into words and convert them to lowercase
  const searchWords = query.toLowerCase().split(" ");

  // Filter the options array based on the search query
  const results = options.filter((option) => {
    if (
      option.hasOwnProperty("name") &&
      !option.hasOwnProperty("childOnOptions") &&
      !option.hasOwnProperty("childOffOptions")
    ) {
      const name = getLocalizedOptionName(option.name).toLowerCase(); // Use optional chaining

      // Check if all search words are present in the name
      return searchWords.every((word) => name && name.includes(word)); // Check if name is defined
    }
  });

  return results;
}

function recreateCascadeStructure(options) {
  const recreatedCategories = [];

  for (const category of ACTUAL_CATEGORIES) {
    const recreatedCategory = {
      categoryName: category.categoryName,
      categoryId: category.categoryId,
      categoryGroups: [],
    };

    for (const group of category.categoryGroups) {
      const recreatedGroup = {
        groupName: group.groupName,
        groupId: group.groupId,
        parentCategoryId: group.parentCategoryId,
        options: [],
      };

      for (const option of group.options) {
        if (options.some((selectedOption) => selectedOption.id === option.id)) {
          recreatedGroup.options.push(option);
        }

        // Check childOffOptions

        if (option.hasOwnProperty("childOffOptions")) {
          for (const childOption of option.childOffOptions) {
            if (
              options.some(
                (selectedOption) => selectedOption.id === childOption.id
              )
            ) {
              recreatedGroup.options.push(childOption);
            }
          }
        }

        // Check childOnOptions

        if (option.hasOwnProperty("childOnOptions")) {
          for (const childOption of option.childOnOptions) {
            if (
              options.some(
                (selectedOption) => selectedOption.id === childOption.id
              )
            ) {
              recreatedGroup.options.push(childOption);
            }
          }
        }
      }

      if (recreatedGroup.options.length > 0) {
        recreatedCategory.categoryGroups.push(recreatedGroup);
      }
    }

    if (recreatedCategory.categoryGroups.length > 0) {
      recreatedCategories.push(recreatedCategory);
    }
  }

  return recreatedCategories;
}

// MARK: - Prepare Options For Popup

var ACTUAL_CATEGORIES = [];

function prepareActualSetting(href) {
  for (const category of CATEGORIES) {
    var actualCategoryGroups = [];

    // Just to dont add embeds on Safari

    if (category.hasOwnProperty("notInBrowser")) {
      if (isBrowserSafari()) {
        continue;
      }
    }

    if (isDesktop(href)) {
      const actualCategory = {
        categoryId: category.categoryId,
        categoryName: category.categoryDesktopName,
        categoryGroups: category.categoryDesktopGroups,
      };

      ACTUAL_CATEGORIES.push(actualCategory);
    } else if (category.hasOwnProperty("categoryMobileGroups")) {
      const actualCategory = {
        categoryId: category.categoryId,
        categoryName: category.categoryMobileName,
        categoryGroups: category.categoryMobileGroups,
      };

      ACTUAL_CATEGORIES.push(actualCategory);
    }
  }
}
