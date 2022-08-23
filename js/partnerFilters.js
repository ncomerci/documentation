const filterOptions = {
  hide: true,
  selection: {},
}

function isDropdownHideable() {
  return filterOptions.hide
}

function setIsDropdownHideable(isHideable) {
  filterOptions.hide = isHideable
}

function hideDropdown($filter) {
  setIsDropdownHideable(true)
  $filter.dropdown("hide")
}

function addFilter(category, value) {
  const selection = filterOptions.selection
  selection[category] = (selection[category] || new Set()).add(value)
}

function removeFilter(category, value) {
  const selection = filterOptions.selection
  if (selection[category]) {
    selection[category].delete(value)
    if (selection[category].size === 0) {
      delete selection[category]
    }
  }
}

function handleCheckboxClick(checkbox) {
  const isChecked = checkbox.prop("checked")
  const category = checkbox.data("category")
  const value = checkbox.data("value")
  const selection = filterOptions.selection
  const checkCounter = checkbox.closest(".item").find(".checks")

  if (isChecked) {
    addFilter(category, value)
  } else {
    removeFilter(category, value)
  }

  if (selection[category]) {
    checkCounter.text(selection[category].size)
  } else {
    checkCounter.text("")
  }
}

function handleCheckboxSectionClick(checkbox) {
  checkbox.prop("checked", !checkbox.prop("checked"))
  handleCheckboxClick(checkbox)
}

function getCheckboxesByCategory($checkboxes) {
  const checkboxBy = {}
  $checkboxes.each((_, elem) => {
    const $elem = $(elem)
    const category = $elem.data("category")
    const value = $elem.data("value")
    if (!checkboxBy[category]) {
      checkboxBy[category] = {}
    }
    checkboxBy[category][value] = $elem
  })

  return checkboxBy
}

function addUrlFilters() {
  let urlFilters = "?"
  Object.entries(filterOptions.selection).forEach(([category, values], idx) => {
    if (idx > 0) {
      urlFilters = urlFilters.concat("&")
    }
    urlFilters = urlFilters.concat(
      `${category}=${Array.from(values).join(",")}`
    )
  })

  window.history.pushState(
    {},
    document.title,
    urlFilters !== "?" ? urlFilters : window.location.pathname
  )
}

function applyUrlFilters(checkboxesByCategory, $filter, $partnerCards) {
  const urlFilters = new URLSearchParams(window.location.search)
  const urlCategories = urlFilters.keys()
  const categories = new Set(Object.keys(checkboxesByCategory))
  const selection = {}
  for (const urlCategory of urlCategories) {
    if (!categories.has(urlCategory)) {
      continue
    }

    const values = urlFilters.getAll(urlCategory)[0].split(",")
    selection[urlCategory] = new Set()

    for (const value of values) {
      const $checkbox = checkboxesByCategory[urlCategory][value]
      if ($checkbox) {
        $checkbox.prop("checked", true)
        selection[urlCategory].add(value)
      }
    }

    if (selection[urlCategory].size == 0) {
      delete selection[urlCategory]
    }

    const $checkbox = checkboxesByCategory[urlCategory][values[0]]

    if ($checkbox) {
      const $checkCounter = $checkbox.closest(".item").find(".checks")
      $checkCounter.text(values.length)
    }
  }
  filterOptions.selection = selection
  applyFilters($filter, $partnerCards)
}

function applyFilters($filter, $partnerCards) {
  const categories = Object.keys(filterOptions.selection)

  $partnerCards.each((_, partnerCard) => {
    const $partnerCard = $(partnerCard)
    let partnerMatches = true

    for (const category of categories) {
      const partnerCategoryValues = $partnerCard
        .attr(`data-${category.toLowerCase()}`)
        .split(";")
      const filteredValues = partnerCategoryValues.filter((value) =>
        filterOptions.selection[category].has(value)
      )
      if (filteredValues.length === 0) {
        partnerMatches = false
        break
      }
    }

    if (partnerMatches) {
      $partnerCard.show()
    } else {
      $partnerCard.hide()
    }
  })

  hideDropdown($filter)
}

function clearFilters($checkboxs, $checkCounters) {
  filterOptions.selection = {}
  $checkboxs.prop("checked", false)
  $checkCounters.text("")
}
