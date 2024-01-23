// =====================================
// Earning
// =====================================
function earningFunc() {
  const trxApi = `${api_endpoint}/api/trx`;
  const trxReqBody = {
    purchase_date: "2023-04",
    limit: 800,
  };

  let trxData;

  $.ajax({
    url: trxApi,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(trxReqBody),
    async: false,
    success: function (data) {
      console.log("API Response:", data);
      trxData = data.data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error making API request:", textStatus, errorThrown);
    },
  });
  const reversedData = trxData.reverse();

  const pricesArray = reversedData.map((obj) => obj.price);

  const totalSum = trxData.reduce((accumulator, currentValue) => {
    if (currentValue.hasOwnProperty("price")) {
      const price = parseInt(currentValue.price, 10);

      if (!isNaN(price)) {
        return accumulator + price;
      }
    }
    return accumulator;
  }, 0);

  const totalSumString = totalSum.toLocaleString();

  $("#mtd_earnings").text(`$ ${totalSumString}`);

  var earning = {
    chart: {
      id: "sparkline3",
      type: "area",
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
      fontFamily: "Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
    },
    series: [
      {
        name: "Earnings",
        color: "#49BEFF",
        data: pricesArray,
      },
    ],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      colors: ["#f3feff"],
      type: "solid",
      opacity: 0.05,
    },

    markers: {
      size: 0,
    },
    tooltip: {
      theme: "dark",
      fixed: {
        enabled: true,
        position: "right",
      },
      x: {
        show: false,
      },
    },
  };
  new ApexCharts(document.querySelector("#earning"), earning).render();
}
earningFunc();
