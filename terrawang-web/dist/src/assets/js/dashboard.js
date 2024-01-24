function chartFunc(customer_id) {
  if (!customer_id) {
    return;
  }

  $("#chart").hide();

  const probaReqBody = { customer_id: String(customer_id) };
  const probaApi = `${api_endpoint}/predict_proba`;

  let successApiCall = true;

  $.ajax({
    url: probaApi,
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(probaReqBody),
    async: false,
    success: function (data) {
      if (!$("#alert_empty").is(":hidden")) {
        $("#alert_empty").hide();
      }

      probaData = data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error making API request:", textStatus, errorThrown);
      if ($("#alert_empty").is(":hidden")) {
        $("#alert_empty").show();
      }
      $("#chart").hide();

      successApiCall = false;
    },
  });

  if (!successApiCall) {
    return;
  }

  $("#cust_id_recom")
    .html("Customer ID: " + customer_id)
    .show();

  const top_cat = probaData.top_cat;
  const probaRaw = probaData.proba;
  const proba = probaRaw.map((number) => Number(number.toFixed(2)));

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
      categories: top_cat,
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
chartFunc(15);
