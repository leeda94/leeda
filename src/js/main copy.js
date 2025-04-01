// loading 화면
gsap.set("header h1", { opacity: 0 });

const images = document.querySelectorAll("img");
let isLoaded = false;
let isLoadingAnimationEnd = false;
const imgLoad = imagesLoaded(images);

const maskAnimation = () => {
  const tl = gsap.timeline();
  const start = "M 0 100 V 50 Q 50 0 100 50 V 100 z";
  const end = "M 0 100 V 0 Q 50 0 100 0 V 100 z";
  gsap.set(".mask", { autoAlpha: 1 });
  tl.to(".path", {
    duration: 0.8,
    attr: { d: start },
    ease: "power2.in",
  })
    .to(".path", {
      duration: 0.4,
      attr: { d: end },
      ease: "power2.out",
    })
    .to(".loading, .path", {
      autoAlpha: 0,
      opacity: 0,
      ease: "power2.out",
    });

  return tl;
};

const entranceAnimation = () => {
  const tl = gsap.timeline();
  tl.add(maskAnimation()).add(loadingAnimationOut(), 0.2).to(
    ".container",
    {
      opacity: 1,
      duration: 0.3,
    },
    0.8
  );
};

const loadingAnimationOut = () => {
  const tl = gsap.timeline();
  tl.to(".loading-image", {
    y: -window.innerHeight,
    duration: 1.3,
    ease: "power2.inOut",
  });

  return tl;
};

const loadingAnimation = () => {
  const tl = gsap
    .timeline({
      onComplete: () => {
        isLoadingAnimationEnd = true;
        if (isLoaded) entranceAnimation();
      },
    })
    .from(
      ".loading-image",
      {
        yPercent: window.innerHeight,
        duration: 1.5,
        ease: "power2.out",
      },
      0.5
    );
};

loadingAnimation();

imgLoad.on("always", function () {
  isLoaded = true;
  if (isLoadingAnimationEnd) entranceAnimation();
});
