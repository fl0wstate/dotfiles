/*
 * This file is part of AdBlock  <https://getadblock.com/>,
 * Copyright (C) 2013-present  Adblock, Inc.
 *
 * AdBlock is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * AdBlock is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdBlock.  If not, see <http://www.gnu.org/licenses/>.
 */

/* For ESLint: List any global identifiers used in this file below */
/* global translate, License, MABPayment, processReplacementChildrenInContent,
   activateTab, browser, initializeProxies, send,
   SubscriptionsProxy, isPremiumFilterListURL, SubscriptionAdapter   */

// the elements array below are in the order they appear on the page
const premiumFiltersUIitems = [
  {
    id: "distraction-control",
    title: translate("enhanced_distraction_control"),
    description: translate("enhanced_distraction_control_description"),
    disclaimer: `${translate("please_note")} ${translate("distraction_control_new")} ${translate("your_participation")} ${translate("dc_more_information")}`,
    urlToOpen:
      "https://help.getadblock.com/support/solutions/articles/6000250028-about-distraction-control",
    imageURL: "icons/distraction-control-video.svg",
    topLineClass: "",
  },
  {
    id: "cookies-premium",
    title: translate("cookie_consent_cutter_title"),
    description: translate("cookie_consent_cutter_description"),
    disclaimer: `${translate("cookie_consent_cutter_desclaimer_I")} ${translate("cookie_consent_cutter_desclaimer_II")}`,
    imageURL: "icons/cookie_consent_cutter.svg",
    topLineClass: "top-line",
  },
];

async function getDefaultPFFilterUI(entry, isActiveLicense) {
  const $filterTitle = $("<span>").addClass("premium_filter_list_title").text(entry.title);

  const $extraInformation = $("<div>").addClass("premium_extra_info").text(entry.description);

  const $filterInfo = $("<div>").append($filterTitle).append($extraInformation);

  const $label = $("<label>").append($filterInfo);

  if (entry.disclaimer) {
    const $premiumDisclaimer = $("<div>")
      .addClass("premium_disclaimer")
      .addClass("top-line")
      .text(entry.disclaimer);
    $label.append($premiumDisclaimer);

    // if the entry has link text, add a span tag, and style it like an anchor
    if (entry.disclaimer.includes("[[") && entry.disclaimer.includes("]]") && entry.urlToOpen) {
      const replacementElementId = `${entry.id}_disclaimer_link`;
      $premiumDisclaimer
        .attr("id", `${entry.id}_disclaimer`)
        .attr("i18n_replacement_el", replacementElementId);
      const $replacementEl = $("<span>")
        .attr("id", replacementElementId)
        .addClass("link-text-color");
      $premiumDisclaimer.append($replacementEl);
      processReplacementChildrenInContent($premiumDisclaimer);
      $premiumDisclaimer.on("click", () => {
        send("openTab", { urlToOpen: entry.urlToOpen });
      });
    }
  }

  const $lockIcon = $("<i>lock_open</i>")
    .css({
      color: "white",
    })
    .attr("role", "img")
    .attr("aria-hidden", "true")
    .addClass("md-48")
    .addClass("material-icons");

  const $lockOverlay = $("<span>")
    .addClass("premium_locked_overlay")
    .addClass("do-not-display")
    .append($lockIcon);

  const $image = $("<img>").attr("src", entry.imageURL);

  const $imageWrapper = $("<div>")
    .addClass("premium_image_wrapper")
    .append($image)
    .append($lockOverlay);

  const $description = $("<span>").addClass("premium_subscription_description").append($label);

  let $iconWrapper;

  if (isActiveLicense) {
    const $checkBox = $("<input>")
      .attr("type", "checkbox")
      .attr("data-url", entry.url)
      .attr("id", entry.id)
      .prop("checked", entry.isSelected);

    const $lensIcon = $("<i>lens</i>")
      .attr("role", "img")
      .attr("aria-hidden", "true")
      .addClass("unchecked")
      .addClass("material-icons");

    const $checkedCircleIcon = $("<i>check_circle</i>")
      .attr("role", "img")
      .attr("aria-hidden", "true")
      .addClass("checked")
      .addClass("circle-icon-bg-24")
      .addClass("checkbox-icon")
      .addClass("material-icons");

    $iconWrapper = $("<span>")
      .addClass("checkbox")
      .addClass("md-stack")
      .addClass("premium_icon")
      .append($checkBox)
      .append($lensIcon)
      .append($checkedCircleIcon);

    const subscribed = await SubscriptionsProxy.has(entry.url);
    $checkBox.on("change", async function onOptionSelectionChange() {
      const isEnabled = $(this).is(":checked");
      if (isEnabled) {
        await SubscriptionsProxy.add(entry.url);
      } else {
        await SubscriptionsProxy.remove(entry.url);
      }
    });

    $checkBox.prop("checked", subscribed);
    $label.attr("for", entry.id);
  } else {
    const $checkBoxIcons = $("<i>lock</i>")
      .attr("role", "img")
      .attr("aria-hidden", "true")
      .addClass("premium_locked_icon")
      .addClass("material-icons");

    $iconWrapper = $("<span>")
      .addClass("checkbox")
      .addClass("md-stack")
      .addClass("premium_icon")
      .append($checkBoxIcons);
  }

  const $filterListRow = $("<div>")
    .addClass("premium_filter_list_row")
    .append($iconWrapper)
    .append($description);

  const $premiumSubscription = $("<div>")
    .addClass("premium_subscription")
    .addClass("premium_section_padding")
    .append($filterListRow)
    .append($imageWrapper);

  const $filterWrapper = $("<div>")
    .addClass("filter-subscription-wrapper")
    .addClass(entry.topLineClass)
    .append($premiumSubscription);

  if (!isActiveLicense) {
    $filterWrapper.addClass("locked");
    $premiumSubscription.addClass("locked");
    $premiumSubscription.click((e) => {
      // ignore clicks when the premium_disclaimer text has a hyperlink
      if ($(e.target).is(".premium_disclaimer") && $(e.target).find(".link-text-color").length) {
        return;
      }
      browser.tabs.create({ url: License.MAB_CONFIG.payURL });
    });
  }

  return $filterWrapper;
}

const preparePFItems = async function preparePFItems(isActiveLicense) {
  const subs = await SubscriptionAdapter.getAllSubscriptionsMinusText();
  for (const index in premiumFiltersUIitems) {
    const entry = premiumFiltersUIitems[index];
    entry.url = subs[entry.id].url;
    // eslint-disable-next-line no-await-in-loop
    $("#premium-filter-lists").append(await getDefaultPFFilterUI(entry, isActiveLicense));
  }
};

$(async () => {
  await initializeProxies();

  if (!License || $.isEmptyObject(License) || !MABPayment) {
    preparePFItems(false);
    return;
  }
  preparePFItems(License.isActiveLicense());
  const payInfo = MABPayment.initialize("distraction-control");
  if (License.shouldShowMyAdBlockEnrollment()) {
    MABPayment.freeUserLogic(payInfo);
    $("#get-it-now-distraction-control").on("click", MABPayment.userClickedPremiumCTA);
  } else if (License.isActiveLicense()) {
    MABPayment.paidUserLogic(payInfo);
  }

  $("a.link-to-tab").on("click", (event) => {
    activateTab($(event.target).attr("href"));
  });
});

const updateCheckbox = function (item, isChecked) {
  if (isPremiumFilterListURL(item.url)) {
    $(`input[data-url="${item.url}"]`).prop("checked", isChecked);
  }
};

const onPremiumSubAdded = function (items) {
  let item = items;
  if (Array.isArray(items)) {
    [item] = items;
  }
  updateCheckbox(item, true);
};
SubscriptionsProxy.onAdded.addListener(onPremiumSubAdded);

const onPremiumSubRemoved = function (items) {
  let item = items;
  if (Array.isArray(items)) {
    [item] = items;
  }
  updateCheckbox(item, false);
};
SubscriptionsProxy.onRemoved.addListener(onPremiumSubRemoved);
