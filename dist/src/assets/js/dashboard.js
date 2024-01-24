function chartFunc(customer_id) {
  $("#chart").hide();

  function constructObjectFromArray(array) {
    const resultObject = {
      customer_id: parseInt(array[0].customer_id),
    };

    for (let i = 0; i < Math.min(array.length, 5); i++) {
      resultObject[`latest_category_${i + 1}`] = array[i].category;
    }

    return resultObject;
  }

  const trxApi = `${api_endpoint}/trx`;
  const trxReqBody = {
    customer_id: customer_id,
  };

  let trxData, probaData;

  $.ajax({
    url: trxApi,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(trxReqBody),
    async: false,
    success: function (data) {
      if (!$("#alert_empty").is(":hidden")) {
        $("#alert_empty").hide();
      }

      console.log("API Response:", data);

      trxData = data.data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error making API request:", textStatus, errorThrown);

      if ($("#alert_empty").is(":hidden")) {
        $("#alert_empty").show();
      }
    },
  });

  console.log(trxData);

  const probaReqBody = constructObjectFromArray(trxData);

  console.log(probaReqBody);
  const probaApi = `${api_endpoint}/predict_proba`;

  $.ajax({
    url: probaApi,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(probaReqBody),
    async: false,
    success: function (data) {
      console.log("API Response:", data);

      probaData = data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error making API request:", textStatus, errorThrown);
    },
  });

  customerId = probaData.customer_id;
  $("#cust_id_recom")
    .html("Customer ID: " + customerId)
    .show();

  const categories = Object.keys(probaData.recommendation);
  console.log(categories);

  const probaRaw = Object.values(probaData.recommendation);
  const proba = probaRaw.map((number) => Number(number.toFixed(2)));

  console.log(proba);

  // =====================================
  // Profit
  // =====================================
  var chart = {
    series: [
      {
        name: "Next Purchase Probability",
        data: proba,
      },
    ],

    chart: {
      type: "bar",
      height: 345,
      offsetX: -15,
      toolbar: { show: true },
      foreColor: "#adb0bb",
      fontFamily: "inherit",
      sparkline: { enabled: false },
    },

    colors: ["#5D87FF", "#49BEFF"],

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "35%",
        borderRadius: [6],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },
    markers: { size: 0 },

    dataLabels: {
      enabled: false,
    },

    legend: {
      show: false,
    },

    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },

    xaxis: {
      type: "category",
      categories: categories,
      labels: {
        style: { cssClass: "grey--text lighten-2--text fill-color" },
      },
      title: {
        text: "Top Categories",
        offsetX: 0,
        offsetY: 230,
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
          fontWeight: 400,
        },
      },
    },

    yaxis: {
      show: true,
      min: 0,
      max: proba[0] + 0.05,
      tickAmount: 4,
      labels: {
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
        },
      },
      title: {
        text: "Probability",
        offsetX: 0,
        offsetY: 0,
        style: {
          cssClass: "grey--text lighten-2--text fill-color",
          fontWeight: 400,
        },
      },
    },
    stroke: {
      show: true,
      width: 3,
      lineCap: "butt",
      colors: ["transparent"],
    },

    tooltip: { theme: "light" },

    responsive: [
      {
        breakpoint: 600,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 3,
            },
          },
        },
      },
    ],
  };
  var chart = new ApexCharts(document.querySelector("#chart"), chart);
  chart.render();

  var interval = setInterval(function () {
    $("#chart").show();
  }, 1200);
}
chartFunc();
