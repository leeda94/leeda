gsap.registerPlugin(ScrollTrigger);

// const video = document.getElementById("bg-video");
// video.play();

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
    // .call(() => {
    //   document.documentElement.style.overflow = "auto";
    //   document.body.style.overflow = "auto";
    //   document.documentElement.style.height = "auto";
    //   document.body.style.height = "auto";
    // })
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

// loading 화면
// gsap.set("header h1", { opacity: 0 });

// document.addEventListener("DOMContentLoaded", () => {
//   const loadingScreen = document.getElementById("loading-screen");
//   const content = document.querySelector(".main_wrap");
//   const progressBar = document.querySelector(".progress");
//   const percentageText = document.querySelector(".percentage");

//   let totalImages = document.images.length;
//   let loadedImages = 0;
//   let loadingStartTime = Date.now();

//   // 로딩 진행 상태 업데이트 함수
//   function updateProgressBar() {
//     let progress = Math.floor((loadedImages / totalImages) * 100);
//     progressBar.style.width = `${progress}%`;
//     percentageText.textContent = `${progress}%`;

//     const textElement = document.querySelector(".scroll_txt");
//     const letters = textElement.textContent.split("");
//     textElement.innerHTML = "";

//     letters.forEach((letter) => {
//       const span = document.createElement("span");
//       span.textContent = letter === " " ? "\u00A0" : letter;
//       span.style.display = "inline-block";
//       textElement.appendChild(span);
//     });

//     gsap.set(".scroll_txt span", { opacity: 0, y: 500 });

//     if (progress >= 100) {
//       let elapsedTime = Date.now() - loadingStartTime;
//       let minDuration = 3500; // 최소 3.5초 동안 유지
//       let duration = Math.max(minDuration, elapsedTime);

//       setTimeout(() => {
//         gsap.to(loadingScreen, {
//           scale: 0.2,
//           opacity: 0,
//           duration: 1,
//           yPercent: 30,
//           ease: "power2.inOut",
//           onComplete: () => {
//             loadingScreen.style.display = "none"; // 로딩 화면 숨기기
//             content.style.display = "block"; // 콘텐츠 표시
//             document.documentElement.style.overflow = "auto"; // 스크롤 가능하게 설정
//             document.body.style.overflow = "auto"; // 스크롤 가능하게 설정
//             // html과 body의 height를 auto로 설정
//             document.documentElement.style.height = "auto"; // 높이 자동으로 설정
//             document.body.style.height = "auto"; //

//             // h1 서서히 나타나게 하기
//             gsap.to("header h1 , .scroll_txt span", {
//               opacity: 1,
//               duration: 3,
//               ease: "power3.out",
//             });

//             // ✨ 한 글자씩 나타나는 효과 추가 (scroll_txt)
//             gsap.to(".scroll_txt span", {
//               y: 0,
//               opacity: 1,
//               duration: 1,
//               stagger: 0.1,
//               ease: "power3.out",
//               delay: 1,
//             });
//           },
//         });
//       }, duration - elapsedTime);
//     }
//   }

//   if (totalImages === 0) {
//     updateProgressBar();
//   } else {
//     for (let img of document.images) {
//       if (img.complete) {
//         loadedImages++;
//         updateProgressBar();
//       } else {
//         img.onload = () => {
//           loadedImages++;
//           updateProgressBar();
//         };
//         img.onerror = () => {
//           loadedImages++;
//           updateProgressBar();
//         };
//       }
//     }
//   }
// });

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

//header h1
// ScrollTrigger.create({
//   trigger: ".about",
//   start: "top 50%",
//   end: "top 50%",
//   onEnter: () => {
//     gsap.to("header h1", {
//       color: "#000",
//       duration: 1,
//       ease: "power2.out",
//     });
//   },
// });

// 📌 .intro 애니메이션 설정
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

  const text = section.querySelectorAll(".line");
  //gsap.set(text, { visibility: "hidden", autoAlpha: 0 });

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

  if (el.matches(".par1")) {
    gsap.fromTo(
      el,
      { y: 50 },
      {
        y: "-30%",
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      }
    );
  }
});

// .about_bg
// const rotator = document.querySelector(".about_bg p");
// const words = document.querySelectorAll(".about_bg p span");

// let main = gsap.timeline({
//   repeat: -1,
// });
// let wordLength;

// main.timeScale(0.75);

// for (let i = 0; i < words.length; i++) {
//   let delay = i - 1;
//   // find 'active' span width and apply to rotator wrap to start each iteration. animate w/css.
//   let wordWidth = words[i].offsetWidth;
//   let wordTL = gsap.timeline({
//     onStart: function () {
//       gsap.to(rotator, {
//         duration: 1,
//         width: wordWidth,
//         delay: 0.25,
//         ease: "power4.in",
//       });
//     },
//   });

//   if (i !== 0) {
//     wordTL.from(words[i], {
//       duration: 1,
//       yPercent: -100,
//       autoAlpha: 0,
//       ease: "power4.in",
//     });
//   } else {
//     // Handle the first one specially
//     delay += 1;
//     gsap.set(words[0], { autoAlpha: 1, yPercent: 0 });
//   }
//   if (i !== words.length - 1) {
//     wordTL.to(words[i], 1, { yPercent: 100, autoAlpha: 0, ease: "power4.in" });
//   } else {
//     wordTL.to(words[i], 1, {
//       yPercent: 100,
//       autoAlpha: 0,
//       ease: "power4.in",
//       onComplete: () => {
//         main.seek(0);
//       },
//     });
//   }

//   main.add(wordTL, delay);
//}
// gsap.set(".about_bg p", { rotate: 45 });
// gsap.timeline({
//   scrollTrigger: {
//     trigger: ".about",
//     start: "top center",
//     end: "bottom top",
//     //pin: true,
//     scrub: true,
//     onEnter: () => {
//       gsap.to(".about_bg p span", {
//         x: "-100%", // 왼쪽으로 무한 이동
//         duration: 5, // 속도 조절
//         ease: "none", // 일정한 속도 유지
//         repeat: -1, // 무한 반복
//       });
//     },
//   },
// });
// .to(".about_bg p.top", {
//   duration: 4,
//   xPercent: -50,
// })
// .to(".about_bg p.bottom", {
//   duration: 4,
//   xPercent: 50,
// });

// .sub_section_tit 애니메이션 설정
gsap.utils.toArray(".sub_section .sub_section_tit h2").forEach((h2) => {
  gsap.set(h2, { opacity: 0, y: 0 });

  let subSection = h2.closest(".sub_section"); // 해당 h2가 속한 부모 section 가져오기
  let subSectionTitle = h2.closest(".sub_section_tit"); // 제목 부분 가져오기

  gsap.timeline({
    scrollTrigger: {
      trigger: subSectionTitle,
      start: "top top",
      end: () => "+=" + (subSection.offsetHeight - window.innerHeight), // 해당 섹션의 높이를 반영
      pin: true,
      scrub: 0,
      toggleActions: "play none none reverse",
      onEnter: () => {
        gsap.to(h2, {
          y: window.innerHeight / 2 - h2.offsetHeight / 2,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        });
      },
      onLeaveBack: () => {
        gsap.to(h2, {
          y: 0,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        });
      },
      onLeave: () => {
        gsap.to(h2, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        });
      },
      onEnterBack: () => {
        gsap.to(h2, {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        });
      },
    },
  });
});

//cursor
let cursor = document.querySelector(".cursor");
let cursorScale = document.querySelectorAll(".cursor-scale");
let mouseX = 0;
let mouseY = 0;

gsap.to({}, 0.016, {
  repeat: -1,
  onRepeat: function () {
    gsap.set(cursor, {
      css: {
        left: mouseX,
        top: mouseY,
      },
    });
  },
});

window.addEventListener("mousemove", (e) => {
  cursor.style.opacity = 1;
  mouseX = e.clientX;
  mouseY = e.clientY;
});

cursorScale.forEach((link) => {
  link.addEventListener("mousemove", () => {
    cursor.classList.add("grow");
    if (link.classList.contains("more")) {
      cursor.classList.remove("grow");
      cursor.classList.add("grow-more");
    }
  });

  link.addEventListener("mouseleave", () => {
    cursor.classList.remove("grow");
    cursor.classList.remove("grow-more");
  });
});

// 📌 한 글자씩 나타나는 애니메이션 함수
// function animateText() {
//   const textElement = document.querySelector(".scroll_txt");
//   const letters = textElement.textContent.split("");
//   textElement.innerHTML = "";

//   letters.forEach((letter) => {
//     const span = document.createElement("span");
//     span.textContent = letter;
//     span.style.display = "inline-block";
//     textElement.appendChild(span);
//   });

//   // ✅ span 요소가 추가된 후 실행되도록 보장
//   requestAnimationFrame(() => {
//     gsap.set(".scroll_txt span", { opacity: 0, y: 20 });

//     gsap.to(".scroll_txt span", {
//       opacity: 1,
//       y: 0,
//       duration: 0.6,
//       stagger: 0.1,
//       ease: "power3.out",
//       delay: 1,
//     });
//   });
// }

// document.addEventListener("DOMContentLoaded", animateText);

// 팝업
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
      "image-url": [
        "https://images.pexels.com/photos/3348748/pexels-photo-3348748.jpeg",
      ],
    },
  ],
};

const workLinks = document.querySelectorAll(".work a");
workLinks.forEach((aTag) => {
  aTag.addEventListener("click", (e) => {
    e.preventDefault();
    const index = aTag.dataset.index;
    openPopup(index);
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  });
});

function openPopup(index) {
  const popup = document.querySelector(".popup");
  const popupContent = document.querySelector(".popup-content");
  const popupTitle = popup.querySelector(".popup-title");
  const popupOverlay = popup.querySelector(".popup-overlay");

  // 동적으로 추가된 이미지 및 설명만 초기화
  const existingImagesContainer = popupContent.querySelector(
    ".popup-images-container"
  );
  if (existingImagesContainer) {
    existingImagesContainer.remove(); // 기존의 이미지 및 설명을 포함한 컨테이너 삭제
  }

  // 오버레이를 먼저 숨기기
  popupOverlay.style.display = "block";

  // 텍스트 설정 (제목은 그대로)
  popupTitle.textContent = data.workList[index]["title"];

  // 이미지들을 불러오기
  const imageUrls = data.workList[index]["image-url"];
  const imageTitUrls = data.workList[index]["image-tit"];

  // 이미지들을 담을 div 생성
  const popupImagesContainer = document.createElement("div");
  popupImagesContainer.classList.add("popup-images-container");

  // "image-tit"이 존재하면, 따로 div를 생성해서 그 안에 이미지를 넣음
  if (imageTitUrls && imageTitUrls.length > 0) {
    const titImagesContainer = document.createElement("div");
    titImagesContainer.classList.add("popup-tit-images-container");

    imageTitUrls.forEach((url) => {
      const imgElement = document.createElement("img");
      imgElement.src = url;
      imgElement.alt = "Work image title";
      titImagesContainer.appendChild(imgElement);
    });

    popupImagesContainer.appendChild(titImagesContainer);
  }

  // popup-description을 popupImagesContainer 뒤에 추가
  const popupDescription = document.createElement("p");
  popupDescription.classList.add("popup-description");
  popupDescription.id = "popup-description";
  popupDescription.innerHTML = data.workList[index]["des"]; // description 내용 추가
  popupImagesContainer.appendChild(popupDescription);

  // 일반 이미지들 불러오기
  imageUrls.forEach((url) => {
    const imgElement = document.createElement("img");
    imgElement.src = url;
    imgElement.alt = "Work image";
    popupImagesContainer.appendChild(imgElement); // 일반 이미지들은 popupImagesContainer에 추가
  });

  // 팝업 내용에 popupImagesContainer 추가
  popupContent.appendChild(popupImagesContainer);

  // 팝업 애니메이션
  gsap.set(popup, { opacity: 0 });
  gsap.set(popupContent, { opacity: 0 });

  gsap.to(popup, { opacity: 1, duration: 0.5 }); // 팝업 FadeIn
  gsap.to(popupContent, { opacity: 1, duration: 0.5 });
  gsap.fromTo(
    popupOverlay,
    { opacity: 1 },
    {
      opacity: 0,
      duration: 0.5,
      onComplete: function () {
        popupOverlay.style.display = "none"; // 로딩 화면 숨기기
      },
    }
  ); // 오버레이 FadeOut

  popup.style.display = "flex"; // 팝업을 flex로 표시
}

// 팝업 닫기
document.querySelector(".close-popup").addEventListener("click", function () {
  const popup = document.querySelector(".popup");
  const popupOverlay = document.querySelector(".popup-overlay");

  // 팝업 FadeOut 애니메이션
  gsap.to([popup, popupOverlay], {
    opacity: 0, // opacity를 0으로 설정
    duration: 0.5, // 0.5초 동안 애니메이션
    onComplete: function () {
      popup.style.display = "none"; // 애니메이션 후 팝업을 display: none으로 변경
      popupOverlay.style.display = "none"; // 애니메이션 후 오버레이를 display: none으로 변경
    },
  });

  // document.documentElement.style.overflow = "auto";
  //document.body.style.overflow = "auto";
});

//모바일
// function updateMarginLeft() {
//   const title = document.querySelector(".about_title");
//   const minMarginLeftDivs = document.querySelectorAll(".m-mgl");

//   if (!title || minMarginLeftDivs.length === 0) return; // 요소가 없으면 종료

//   if (window.innerWidth <= 768) {
//     const titleWidth = title.offsetWidth; // 모바일에서만 가져오기
//     minMarginLeftDivs.forEach((div) => {
//       div.style.marginLeft = `${titleWidth}px`;
//       console.log(titleWidth);
//     });
//   } else {
//     // 768px 이상일 때 원래 상태로 복원
//     minMarginLeftDivs.forEach((div) => {
//       div.style.removeProperty("margin-left"); // 기존 margin 제거
//     });
//   }
// }

// 페이지 로드 및 창 크기 변경 시 적용
//window.addEventListener("load", updateMarginLeft);
//window.addEventListener("resize", updateMarginLeft);

// function setViewportHeight() {
//   const vh = window.innerHeight * 0.01; // 1vh 값 계산
//   document.documentElement.style.setProperty("--vh", `${vh}px`);
// }

// // 페이지 로드 및 창 크기 변경 시 적용
// window.addEventListener("load", setViewportHeight);
// window.addEventListener("resize", setViewportHeight);

// function setFullHeight() {
//   document.documentElement.style.setProperty(
//     "--vh",
//     `${window.innerHeight * 0.01}px`
//   );
// }

// // 초기 실행
// setFullHeight();

// // 화면 크기 변경(회전 포함) 시 다시 실행
// window.addEventListener("resize", setFullHeight);
// document.documentElement.style.setProperty("--full-height", innerHeight + "px");

// if (e && prevWindowHeight < (t.offsetHeight || windowHeight)) {
//   document.documentElement.style.setProperty(
//     "--full-height",
//     (t.offsetHeight || windowHeight) + "px"
//   );
//   currentWindowHeight = t.offsetHeight || windowHeight;
//   prevWindowHeight = currentWindowHeight;
// }

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

// 초기 실행
setFullHeight();

// 화면 크기 변경(회전 포함) 시 다시 실행
window.addEventListener("resize", setFullHeight);
