document.addEventListener("DOMContentLoaded", (e) => {
  gsap.registerPlugin(ScrollTrigger);

  const scrollerWrapper = document.querySelector(".scroll-wrapper");

  ScrollTrigger.normalizeScroll({
    allowNestedScroll: true,
    target: scrollerWrapper,
    type: "touch,pointer,wheel",
    //pinType: "transform",
  });

  let isFirstScroll = true;
  window.addEventListener("wheel", () => {
    if (isFirstScroll) {
      isFirstScroll = false;
      ScrollTrigger.refresh();
    }
  });

  const mediaElements = document.querySelectorAll("img, video");
  let isLoaded = false;
  let isLoadingAnimationEnd = false;
  const imgLoad = imagesLoaded(mediaElements);

  const textElement = document.querySelector(".scroll-txt");
  const letters = textElement.textContent.split("");
  textElement.innerHTML = "";

  letters.forEach((letter) => {
    const span = document.createElement("span");
    span.textContent = letter === " " ? "\u00A0" : letter;
    span.style.display = "inline-block";
    textElement.appendChild(span);
  });

  gsap.set("header h1", { opacity: 0 });
  gsap.set(".scroll-txt span", { autoAlpha: 0, y: 800 });

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
      .to("header h1", { autoAlpha: 1, duration: 2, ease: "power2.out" })
      .to(".scroll-txt span", {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
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

  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  });

  // .intro
  const sections = gsap.utils.toArray(".text-sections section");

  sections.forEach((section, idx) => {
    const section_tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: true,
        pinType: "fixed",
        scrub: true,
        start: "top top",
        end: "+=3000",
        toggleActions: "play none none reverse",
        scroller: scrollerWrapper,
        // onEnterBack: () => {
        //   if (idx === sections.length - 1) {
        //     gsap.to("header h1", {
        //       color: "#fff",
        //       duration: 1,
        //       ease: "power2.out",
        //     });
        //   } else if (idx === 0) {
        //     gsap.to(".scroll-txt span", {
        //       y: 0,
        //       autoAlpha: 1,
        //       duration: 1,
        //       stagger: 0.1,
        //       ease: "power3.out",
        //       delay: 1,
        //     });
        //   }
        // },
        // onLeave: () => {
        //   if (idx === sections.length - 1) {
        //     gsap.to("header h1", {
        //       color: "#000",
        //       duration: 1,
        //       ease: "power2.out",
        //     });
        //   } else if (idx === 0) {
        //     gsap.to(".scroll-txt span", {
        //       y: 1000,
        //       autoAlpha: 0,
        //       duration: 1,
        //       stagger: 0.1,
        //       ease: "power3.out",
        //       delay: 0.5,
        //     });
        //   }
        // },
      },
    });

    const text = section.querySelectorAll(".line");

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

  let scrollTxtVisible = true;

  function updateScrollStatus() {
    //const scrollY = scrollerWrapper.scrollTop;
    const header = document.querySelector("header h1");
    const scrollTxtSpans = document.querySelectorAll(".scroll-txt span");
    const sections = gsap.utils.toArray(".text-sections section");
    const first = sections[0];
    const last = sections[sections.length - 1];

    const firstRect = first.getBoundingClientRect();
    const lastRect = last.getBoundingClientRect();

    // header 색상 변경
    if (lastRect.bottom < 0) {
      gsap.to(header, { color: "#000", duration: 0.5, ease: "power2.out" });
    } else {
      gsap.to(header, { color: "#fff", duration: 0.5, ease: "power2.out" });
    }

    // scroll-txt 애니메이션 제어
    if (
      firstRect.top < window.innerHeight &&
      firstRect.bottom < 0 &&
      scrollTxtVisible
    ) {
      scrollTxtVisible = false;
      gsap.to(scrollTxtSpans, {
        autoAlpha: 1,
        y: 800,
        duration: 1,
        stagger: 0.1,
        ease: "power3.in",
      });
    } else if (
      !(firstRect.top < window.innerHeight && firstRect.bottom < 0) &&
      !scrollTxtVisible
    ) {
      scrollTxtVisible = true;
      gsap.to(scrollTxtSpans, {
        y: 0,
        autoAlpha: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      });
    }
  }

  // .about
  const aboutText = gsap.utils.toArray(".text-rolling p, .text-rolling h2");

  aboutText.forEach((p, idx) => {
    if (idx == 0) {
      gsap.set(p, { xPercent: -40 });
      gsap.to(p, {
        xPercent: 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".sub-sections .about",
          start: "top 50%",
          end: "top 0",
          scrub: true,
          scroller: scrollerWrapper,
          toggleActions: "play none none reverse",
          //invalidateOnRefresh: true,
        },
      });
    } else if (idx == 1) {
      gsap.set(p, { xPercent: 40 });
      gsap.to(p, {
        xPercent: 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".sub-sections .about",
          start: "top 50%",
          end: "top 0",
          scrub: true,
          scroller: scrollerWrapper,
          toggleActions: "play none none reverse",
        },
      });
    } else {
      gsap.set(p, { xPercent: -40 });
      gsap.to(p, {
        xPercent: 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".sub-sections .about",
          start: "top 50%",
          end: "top 0",
          scrub: true,
          scroller: scrollerWrapper,
          toggleActions: "play none none reverse",
        },
      });
    }
  });

  // .work
  const workSlides = document.querySelector(".work-slides");

  function hiddenScroll() {
    return -(workSlides.scrollWidth - window.innerWidth);
  }

  const tween = gsap.to(workSlides, {
    ease: "none",
    x: hiddenScroll,
  });

  ScrollTrigger.create({
    trigger: workSlides,
    start: "top top",
    end: "+=500%",
    scrub: true,
    pin: true,
    pinType: "fixed",
    animation: tween,
    invalidateOnRefresh: true,
    scroller: scrollerWrapper,
  });

  // .top-ani
  gsap.utils.toArray(".top-ani").forEach((el) => {
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
            return ScrollTrigger.create({ trigger: lastSection }).end + " 70%";
          },
          end: "top 10%",
          toggleActions: "play none none reverse",
          scroller: scrollerWrapper,
        },
      }
    );
  });

  // .work 팝업
  const data = {
    workList: [
      {
        title: "KB M-able Wide",
        des: "PC, 태블릿에서도 이용을 할 수 있는 주식 투자 플랫폼 <br/>html, sass, js, gulp, git, svn 사용",
        "image-tit": ["./img/kb-mable-w01.png", "./img/kb-mable-w02.png"],
        "image-url": ["./img/kb-mable-w03.png", "./img/kb-mable-w04.png"],
      },
      {
        title: "KOLON SPORT ANTARCTICA",
        des: "원 페이지 가로 스크롤 이벤트 응모 사이트<br/>html, css, jquery, js 사용, iexplorer 10 이상 부터 가능",
        "image-tit": ["./img/kolon-antarctica01.png"],
        "image-url": [
          "./img/kolon-antarctica02.gif",
          "./img/kolon-antarctica03.png",
          "./img/kolon-antarctica04.png",
        ],
      },
      {
        title: "KOLON SPORT FLOWER POWER",
        des: "원 페이지 가로 스크롤 이벤트 응모 사이트<br/>html, css, jquery, js 사용, iexplorer 10 이상 부터 가능",
        "image-tit": ["./img/kolon-flower-power01.png"],
        "image-url": [
          "./img/kolon-flower-power02.gif",
          "./img/kolon-flower-power03.png",
          "./img/kolon-flower-power04.png",
        ],
      },
      {
        title: "HYUNDAI Smartboard",
        des: "HYUNDAI 스마트보드 기업 홈페이지로 pc(퍼블리싱 100%) + mobile(일부)<br/>html, css, jquery, js 사용, iexplorer 10 이상 부터 가능",
        "image-tit": [
          "./img/hyundai-smartboard01.png",
          "./img/hyundai-smartboard02.png",
        ],
        "image-url": [
          "./img/hyundai-smartboard03.png",
          "./img/hyundai-smartboard04.png",
        ],
      },
      {
        title: "KOLON SPORT ABOUT NOAH",
        des: "원 페이지 세로 스크롤 이벤트 응모 사이트<br/>html, css, jquery, js 사용",
        "image-tit": [
          "./img/kolon-about-noah01.png",
          "./img/kolon-about-noah02.png",
        ],
        "image-url": ["./img/kolon-about-noah03.png"],
      },
      {
        title: "YOKOWA",
        des: "PC 사이트 및 태블릿 메뉴 추가<br/>html, css, jquery, js 사용",
        "image-tit": [
          "./img/yokowa01.png",
          "./img/yokowa03.png",
          "./img/yokowa02.png",
        ],
        "image-url": ["./img/yokowa04.gif", "./img/yokowa05.png"],
      },
      {
        title: "JISAN FOREST RESORT",
        des: "시즌&비시즌 홈페이지 리뉴얼 및 운영<br/>html, css, jquery, js 사용, iexplorer 9 이상 부터 가능",
        "image-tit": [
          "./img/jisan-forest-resort01.png",
          "./img/jisan-forest-resort02.png",
        ],
        "image-url": ["./img/jisan-forest-resort03.png"],
      },
      {
        title: "cafe24 & makeshop & godomall",
        des: "쇼핑몰 솔루션 이용한 홈페이지 구축 및 운영<br/>html, css, jquery, js 사용, iexplorer 10 이상 부터 가능",
        "image-url": ["./img/shoppingmall01.png", "./img/shoppingmall02.png"],
      },
    ],
  };

  const workLinks = document.querySelectorAll(".work a");

  workLinks.forEach((aTag) => {
    aTag.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      const index = aTag.dataset.index;
      openPopup(index);
      scrollerWrapper.style.overflow = "hidden";
    });
  });

  function openPopup(index) {
    const popup = document.querySelector(".popup");
    const popupContent = document.querySelector(".popup-content");
    const popupTitle = popup.querySelector(".popup-title");
    const popupOverlay = popup.querySelector(".popup-overlay");
    const closeBtn = document.querySelector(".close-popup");

    const existingImagesContainer = popupContent.querySelector(
      ".popup-images-container"
    );
    if (existingImagesContainer) {
      existingImagesContainer.remove();
    }

    popupOverlay.style.display = "block";
    popupTitle.textContent = data.workList[index]["title"];

    const imageUrls = data.workList[index]["image-url"];
    const imageTitUrls = data.workList[index]["image-tit"];

    const popupImagesContainer = document.createElement("div");
    popupImagesContainer.classList.add("popup-images-container");

    if (imageTitUrls && imageTitUrls.length > 0) {
      const titImagesContainer = document.createElement("div");
      titImagesContainer.classList.add("popup-tit-images-container");

      imageTitUrls.forEach((url) => {
        const imgElement = document.createElement("img");
        imgElement.src = url;
        imgElement.alt = `${data.workList[index]["title"] + " 예시 이미지"}`;
        titImagesContainer.appendChild(imgElement);
      });

      popupImagesContainer.appendChild(titImagesContainer);
    }

    const popupDescription = document.createElement("p");
    popupDescription.classList.add("popup-description");
    popupDescription.id = "popup-description";
    popupDescription.innerHTML = data.workList[index]["des"];
    popupImagesContainer.appendChild(popupDescription);

    imageUrls.forEach((url) => {
      const imgElement = document.createElement("img");
      imgElement.src = url;
      imgElement.alt = `${data.workList[index]["title"] + " 관련 이미지"}`;
      popupImagesContainer.appendChild(imgElement);
    });

    popupContent.appendChild(popupImagesContainer);

    gsap.set(popup, { opacity: 0 });
    gsap.set(popupContent, { opacity: 0 });

    gsap.to(popup, { opacity: 1, duration: 0.5 });
    gsap.to(popupContent, {
      opacity: 1,
      duration: 0.5,
      onComplete: () => {
        const rect = popupContent.getBoundingClientRect();
        closeBtn.style.left = `${rect.right - closeBtn.offsetWidth}px`;

        gsap.to(closeBtn, {
          autoAlpha: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      },
    });
    gsap.fromTo(
      popupOverlay,
      { opacity: 1 },
      {
        opacity: 0,
        duration: 0.5,
        onComplete: function () {
          popupOverlay.style.display = "none";
        },
      }
    );

    popup.style.display = "flex";
  }

  document
    .querySelector(".close-popup")
    .addEventListener("mousedown", function (e) {
      if (e.button !== 0) return;

      const popup = document.querySelector(".popup");
      const popupOverlay = document.querySelector(".popup-overlay");

      gsap.to([popup, popupOverlay], {
        opacity: 0,
        duration: 0.5,
        onComplete: function () {
          popup.style.display = "none";
          popupOverlay.style.display = "none";
          scrollerWrapper.style.overflowY = "auto";
        },
      });

      scrollerWrapper.style.overflowY = "auto";
    });

  function setFullHeight() {
    // let t = document.createElement("div");
    // t.style.width = "100vw";
    // t.style.height = "100vh";
    // document.documentElement.append(t);

    let vw = window.innerWidth * 0.01;
    let vh = window.innerHeight * 0.01;

    document.documentElement.style.setProperty("--vw", `${vw}px`);
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    document.documentElement.style.setProperty(
      "--full-height",
      `${vh * 100}px`
    );

    // t.remove();
  }

  setFullHeight();

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      setFullHeight();
      ScrollTrigger.refresh();
      updateScrollStatus();
    }, 150);
  });

  scrollerWrapper.addEventListener("scroll", updateScrollStatus);
});

//cursor
// let cursor = document.querySelector(".cursor");
// let cursorScale = document.querySelectorAll(".cursor-scale");
// let mouseX = 0;
// let mouseY = 0;

// gsap.to({}, 0.016, {
//   repeat: -1,
//   onRepeat: function () {
//     gsap.set(cursor, {
//       css: {
//         left: mouseX,
//         top: mouseY,
//       },
//     });
//   },
// });

// window.addEventListener("mousemove", (e) => {
//   cursor.style.opacity = 1;
//   mouseX = e.clientX;
//   mouseY = e.clientY;
// });

// cursorScale.forEach((link) => {
//   link.addEventListener("mousemove", () => {
//     cursor.classList.add("grow");
//     if (link.classList.contains("more")) {
//       cursor.classList.remove("grow");
//       cursor.classList.add("grow-more");
//     }
//   });

//   link.addEventListener("mouseleave", () => {
//     cursor.classList.remove("grow");
//     cursor.classList.remove("grow-more");
//   });
// });

if (navigator.userAgent.indexOf("MSIE") !== -1 || !!document.documentMode) {
  // alert(
  //   "Internet Explorer는 일부 지원되지 않을 수 있습니다. 다른 브라우저를 이용해주세요 😢"
  // );

  document.querySelector(".popup-ie").style.display = "inline-block";
}
