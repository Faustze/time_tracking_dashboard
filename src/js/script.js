// ============================================
// TIME TRACKING DASHBOARD — JavaScript
// ============================================
// Этот файл отвечает за:
// 1. Загрузку данных из data.json
// 2. Отображение часов в карточках
// 3. Переключение между Daily / Weekly / Monthly
// 4. Hover-эффекты для интерактивных элементов
// ============================================

let globalData;
let currentPeriod = 'weekly';
const periodLabels = { daily: 'Day', weekly: 'Week', monthly: 'Month' }
const cardsNodeList = document.querySelectorAll('[data-activity]')

async function loadData() {
  const response = await fetch('./data.json')
  if (!response.ok) {
    console.log('Response is NOT ok')
    return null
  }
  return await response.json()
}

function renderCards(period) {
  if (!globalData) return
  if (!['daily', 'weekly', 'monthly'].includes(period)) return

  cardsNodeList.forEach(node => {
    const attr = node.getAttribute('data-activity')

    const found = globalData.find(obj => String(obj.title).toLowerCase() === attr)
    if (!found) return

    const currentVal = found.timeframes[period].current
    const previousVal = found.timeframes[period].previous
    node.querySelector('.dashboard__card-current').textContent = `${currentVal}hrs`
    node.querySelector('.dashboard__card-previous').textContent = `Last ${periodLabels[period]} — ${previousVal}hrs`
  })
}

function updateActiveButton(container, clickedEl) {
  const currentActive = container.querySelector('.dashboard__profile-period--active')
  currentActive.classList.remove('dashboard__profile-period--active')
  currentActive.setAttribute('aria-pressed', 'false')
  
  clickedEl.classList.add('dashboard__profile-period--active')
  clickedEl.setAttribute('aria-pressed', 'true')
}

function periodsHandler() {
  const timeframesContainer = document.querySelector('.dashboard__profile-timeframes')
  timeframesContainer.addEventListener('click', (e) => {
    const clickedEl = e.target.closest('[data-period]')
    // console.log(clickedEl)
  
    if (clickedEl === null) return
  
    currentPeriod = clickedEl.getAttribute('data-period')
    updateActiveButton(timeframesContainer, clickedEl)
    renderCards(currentPeriod)
  })
}

async function init() {
  globalData = await loadData()
  if (!globalData) console.error('Load data error')
  renderCards(currentPeriod)
  periodsHandler()
}

init()