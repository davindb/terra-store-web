function redirectToURL(url) {
  window.location.href = url;
}

$("#custSearch").on("click", function () {
  const customer_id = $("#custId").val();
  chartFunc(customer_id);
});

$("#custId").on("keypress", function (e) {
  if (e.which === 13) {
    const customer_id = $("#custId").val();
    chartFunc(customer_id);
  }
});
