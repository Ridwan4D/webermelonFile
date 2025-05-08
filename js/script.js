const professionToggleBtn = document.querySelector("#professionToggleBtn");
const industryToggleBtn = document.querySelector("#industryToggleBtn");
const professionFilterBox = document.querySelector("#professionFilter");
const industryFilterBox = document.querySelector("#industryFilter");

professionToggleBtn.addEventListener("click", () => {
  professionFilterBox.classList.toggle("collapsed");

  let toggleIcon = document.querySelector("#toggleIcon");
  const isCollapsed = professionFilterBox.classList.contains("collapsed");
  toggleIcon.src = isCollapsed ? "../image/plus.svg" : "../image/minus.svg";
});

industryToggleBtn.addEventListener("click", () => {
  industryFilterBox.classList.toggle("collapsed");

  let toggleIcon = document.querySelector("#industryToggleIcon");
  const isCollapsed = industryFilterBox.classList.contains("collapsed");
  toggleIcon.src = isCollapsed ? "../image/plus.svg" : "../image/minus.svg";
});
