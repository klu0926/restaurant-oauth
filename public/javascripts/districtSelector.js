const countySelector = document.querySelector('#county')
const districtSelector = document.querySelector('#district')

countySelector.addEventListener('change', async () => {
  const countySelected = countySelector.value

  try {
    // 跟伺服器拿 tw-zip-code.json
    const zipDataResponse = await fetch('/data/zipcode')
    const zipData = await zipDataResponse.json()

    // 找到對應的地區資料(region)
    const countyObject = zipData.find(county => county.name === countySelected)
    const regionArray = countyObject.region

    // 開始做資料 (第一個資料是空的，之後用array生出來)
    districtSelector.innerHTML = `<option value="">選擇地區</option>`
    regionArray.forEach(region => {
      const option = `
        <option value="${region.name}">${region.name}</option>
        `
      // 放進去地區input select裡面
      districtSelector.innerHTML += option
    });

  } catch (err) {
    console.log('districtSelector:', err)
  }
})
