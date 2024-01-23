// =====================================
// Breakup
// =====================================
function breakupFunc() {
  const trxApi = "http://localhost:3700/api/trx";
  const trxReqBody = {
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

  console.log("breakup", trxData);

  const totalSum = trxData.reduce((accumulator, currentValue) => {
    if (currentValue.hasOwnProperty("price")) {
      const price = parseInt(currentValue.price, 10);

      if (!isNaN(price)) {
        return accumulator + price;
      }
    }
    return accumulator;
  }, 0);

  const last_year_sum_1 = totalSum - (1.09 * totalSum - totalSum);
  const last_year_sum_2 =
    last_year_sum_1 - (1.09 * last_year_sum_1 - last_year_sum_1);
  const totalSumString = totalSum.toLocaleString();

  $("#ytd_earnings").text(`$ ${totalSumString}`);

  var breakup = {
    color: "#adb5bd",
    series: [
      totalSum,
      Number(last_year_sum_1.toFixed(0)),
      Number(last_year_sum_2.toFixed(0)),
    ],
    labels: ["2023", "2022", "2021"],
    chart: {
      width: 180,
      type: "donut",
      fontFamily: "Plus Jakarta Sans', sans-serif",
      foreColor: "#adb0bb",
    },
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "75%",
        },
      },
    },
    stroke: {
      show: false,
    },

    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },
    colors: ["#5D87FF", "#ecf2ff", "#F9F9FD"],

    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 150,
          },
        },
      },
    ],
    tooltip: {
      theme: "dark",
      fillSeriesColor: false,
    },
  };

  var chart = new ApexCharts(document.querySelector("#breakup"), breakup);
  chart.render();
}

breakupFunc();
