const panels = document.querySelectorAll(".qq-panel");
panels.forEach((panel) => {
  panel.addEventListener("click", () => {
    console.log("panel clicked");
    removeActiveClasses();
    panel.classList.toggle("qq-panel-active");
  });
});
function removeActiveClasses() {
  panels.forEach((panel) => {
    panel.classList.remove("qq-panel-active");
  });
}
