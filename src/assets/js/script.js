$("#custSearch").on("click", function () {
  const customer_id = $("#custId").val();
  console.log(customer_id);
  chartFunc(customer_id);
});

$("#custId").on("keypress", function (e) {
  if (e.which === 13) {
    console.log("Enter key pressed. Input value:", $(this).val());
    const customer_id = $("#custId").val();
    console.log(customer_id);
    chartFunc(customer_id);
  }
});
