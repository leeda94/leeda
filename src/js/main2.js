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

// loading
//document.getElementById("bg-video").play();

const mediaElements = document.querySelectorAll("img, video");
let isLoaded = false;
let isLoadingAnimationEnd = false;
const imgLoad = imagesLoaded(mediaElements);

const textElement = document.querySelector(".scroll_txt");
const letters = textElement.textContent.split("");
textElement.innerHTML = "";

letters.forEach((letter) => {
  const span = document.createElement("span");
  span.textContent = letter === " " ? "\u00A0" : letter;
  span.style.display = "inline-block";
  textElement.appendChild(span);
});

gsap.set("header h1", { opacity: 0 });
gsap.set(".scroll_txt span", { opacity: 0, y: 500 });

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
    .to(".path", { duration: 0.4, attr: { d: end }, ease: "power2.out" })
    .to(".loading-screen", { autoAlpha: 0 })
    .call(() => {
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";
      document.documentElement.style.height = "auto";
      document.body.style.height = "auto";
    })
    .to("header h1", { autoAlpha: 1, duration: 2, ease: "power2.out" })
    .to(".scroll_txt span", {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
    });

  return tl;
};

const entranceAnimation = () => {
  const tl = gsap.timeline();
  tl.add(maskAnimation()).add(loadingAnimationOut(), 0.2).to(
    ".main",
    {
      opacity: 1,
      duration: 0.3,
    },
    0.8
  );
};

const loadingAnimationOut = () => {
  const tl = gsap.timeline();
  tl.to(".loading-text", {
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
      ".loading-text",
      {
        yPercent: window.innerHeight,
        opacity: 1,
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

document.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    gsap.to(".scroll_txt span", {
      y: 500, // 500px 내려가며 사라짐
      opacity: 0,
      duration: 1,
      stagger: 0.1, // 글자가 한 글자씩 사라지도록 설정
      ease: "power3.out",
      delay: 0.5, // 0.5초 지연 후 애니메이션 시작
    });
  } else {
    gsap.to(".scroll_txt span", {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      delay: 1,
    });
  }
});

// intro
const sections = gsap.utils.toArray(".text_sections section");
sections.forEach((section, idx) => {
  const section_tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      pin: true,
      scrub: 0,
      start: "top top",
      end: "+=3000",
      toggleActions: "play none none reverse",
      onEnterBack: () => {
        if (idx == sections.length - 1) {
          gsap.to("header h1", {
            color: "#fff",
            duration: 1,
            ease: "power2.out",
          });
        }
      },
      onLeave: () => {
        if (idx == sections.length - 1) {
          gsap.to("header h1", {
            color: "#000",
            duration: 1,
            ease: "power2.out",
          });
        }
      },
    },
  });

  const text = section.querySelectorAll(".section-des p");

  section_tl.fromTo(
    text,
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 1,
      stagger: 0.5,
      ease: "power2.out",
    }
  );
  section_tl.to(
    text,
    {
      autoAlpha: 0,
      duration: 1,
      stagger: 0.5,
      ease: "power2.out",
    },
    "+=1"
  );
});

// .top_ani 애니메이션 설정
gsap.utils.toArray(".top_ani").forEach((el) => {
  gsap.fromTo(
    el,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: () => {
          const lastSection = sections[sections.length - 1];
          return ScrollTrigger.create({ trigger: lastSection }).end + " 90%";
        },
        end: "top 10%",
        toggleActions: "play none none reverse",
        markers: false,
      },
    }
  );
});

// .work 요소가 화면 상단에 도달할 때 .intro_video의 opacity를 0으로 설정하고, 다시 스크롤하면 opacity를 1로 복원
gsap.to(".intro", {
  opacity: 0,
  scrollTrigger: {
    trigger: ".work",
    start: "center 90%",
    end: "bottom top",
    scrub: true,
    onEnter: () => gsap.to(".intro", { opacity: 0 }),
    onLeaveBack: () => gsap.to(".intro", { opacity: 1 }), // 스크롤을 다시 위로 올리면 .intro_video의 opacity를 1로 복원
  },
});
