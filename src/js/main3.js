gsap.registerPlugin(ScrollTrigger);

// FullHeight값
function setFullHeight() {
  var t = document.createElement("div");
  t.style.width = "100vw";
  t.style.height = "100vh";
  document.documentElement.append(t);

  document.documentElement.style.setProperty("--vw", t.offsetWidth + "px");
  document.documentElement.style.setProperty("--vh", t.offsetHeight + "px");
  document.documentElement.style.setProperty(
    "--full-height",
    t.offsetHeight + "px"
  );

  t.remove();
}

setFullHeight();
window.addEventListener("resize", setFullHeight);
