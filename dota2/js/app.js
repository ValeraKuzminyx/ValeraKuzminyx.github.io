document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    $(".owl-carousel").owlCarousel({
	  margin: 0,
	  loop: true,
	  autoplay: true,
    //   autoWidth: true,
      nav: false,
      smartSpeed: 2000,
      responsiveClass: true,
      dots: false,
      responsive: {
        0: {
          items: 1,
        },
        800: {
          items: 1,
        },
        1100: {
          items: 1,
        },
      },
    });
    $(".preloader").delay(1000).fadeOut("slow");
  }, 0);

  $(".news-list__item").click(function () {
    var tabName = $(this).attr("show-tab");
    $(this).addClass("active").siblings().removeClass("active");
    $(".news-list__content ." + tabName)
      .addClass("active")
      .siblings()
      .removeClass("active");
  });

  $(".heroes-list__item").click(function () {
    var tabName = $(this).attr("show-tab");
    $(this).addClass("active").siblings().removeClass("active");
    $(".heroes-list__content ." + tabName)
      .addClass("active")
      .siblings()
      .removeClass("active");
  });
});

const ease = {
  exponentialIn: (t) => {
    return t == 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0));
  },
  exponentialOut: (t) => {
    return t == 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t);
  },
  exponentialInOut: (t) => {
    return t == 0.0 || t == 1.0
      ? t
      : t < 0.5
      ? +0.5 * Math.pow(2.0, 20.0 * t - 10.0)
      : -0.5 * Math.pow(2.0, 10.0 - t * 20.0) + 1.0;
  },
  sineOut: (t) => {
    const HALF_PI = 1.5707963267948966;
    return Math.sin(t * HALF_PI);
  },
  circularInOut: (t) => {
    return t < 0.5
      ? 0.5 * (1.0 - Math.sqrt(1.0 - 4.0 * t * t))
      : 0.5 * (Math.sqrt((3.0 - 2.0 * t) * (2.0 * t - 1.0)) + 1.0);
  },
  cubicIn: (t) => {
    return t * t * t;
  },
  cubicOut: (t) => {
    const f = t - 1.0;
    return f * f * f + 1.0;
  },
  cubicInOut: (t) => {
    return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
  },
  quadraticOut: (t) => {
    return -t * (t - 2.0);
  },
  quarticOut: (t) => {
    return Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0;
  },
};

class ShapeOverlays {
  constructor(elm) {
    this.elm = elm;
    this.path = elm.querySelectorAll("path");
    this.numPoints = 10;
    this.duration = 900;
    this.delayPointsArray = [];
    this.delayPointsMax = 300;
    this.delayPerPath = 250;
    this.timeStart = Date.now();
    this.isOpened = false;
    this.isAnimating = false;
  }
  toggle() {
    this.isAnimating = true;
    for (var i = 0; i < this.numPoints; i++) {
      this.delayPointsArray[i] = Math.random() * this.delayPointsMax;
    }
    if (this.isOpened === false) {
      this.open();
    } else {
      this.close();
    }
  }
  open() {
    this.isOpened = true;
    this.elm.classList.add("is-opened");
    this.timeStart = Date.now();
    this.renderLoop();
  }
  close() {
    this.isOpened = false;
    this.elm.classList.remove("is-opened");
    this.timeStart = Date.now();
    this.renderLoop();
  }
  updatePath(time) {
    const points = [];
    for (var i = 0; i < this.numPoints; i++) {
      points[i] =
        (1 -
          ease.cubicInOut(
            Math.min(
              Math.max(time - this.delayPointsArray[i], 0) / this.duration,
              1
            )
          )) *
        100;
    }

    let str = "";
    str += this.isOpened ? `M 0 0 V ${points[0]}` : `M 0 ${points[0]}`;
    for (var i = 0; i < this.numPoints - 1; i++) {
      const p = ((i + 1) / (this.numPoints - 1)) * 100;
      const cp = p - ((1 / (this.numPoints - 1)) * 100) / 2;
      str += `C ${cp} ${points[i]} ${cp} ${points[i + 1]} ${p} ${
        points[i + 1]
      } `;
    }
    str += this.isOpened ? `V 100 H 0` : `V 0 H 0`;
    return str;
  }
  render() {
    if (this.isOpened) {
      for (var i = 0; i < this.path.length; i++) {
        this.path[i].setAttribute(
          "d",
          this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * i))
        );
      }
    } else {
      for (var i = 0; i < this.path.length; i++) {
        this.path[i].setAttribute(
          "d",
          this.updatePath(
            Date.now() -
              (this.timeStart + this.delayPerPath * (this.path.length - i - 1))
          )
        );
      }
    }
  }
  renderLoop() {
    this.render();
    if (
      Date.now() - this.timeStart <
      this.duration +
        this.delayPerPath * (this.path.length - 1) +
        this.delayPointsMax
    ) {
      requestAnimationFrame(() => {
        this.renderLoop();
      });
    } else {
      this.isAnimating = false;
    }
  }
}

(function () {
  const elmHamburger = document.querySelector(".hamburger");
  const gNavItems = document.querySelectorAll(".global-menu__item");
  const elmOverlay = document.querySelector(".shape-overlays");
  const overlay = new ShapeOverlays(elmOverlay);

  elmHamburger.addEventListener("click", () => {
    if (overlay.isAnimating) {
      return false;
    }
    overlay.toggle();
    if (overlay.isOpened === true) {
      elmHamburger.classList.add("is-opened-navi");
      for (var i = 0; i < gNavItems.length; i++) {
        gNavItems[i].classList.add("is-opened");
      }
    } else {
      elmHamburger.classList.remove("is-opened-navi");
      for (var i = 0; i < gNavItems.length; i++) {
        gNavItems[i].classList.remove("is-opened");
      }
    }
  });
})();

//инициализация видео с ютуба

function findVideos() {
  let videos = document.querySelectorAll(".video");

  for (let i = 0; i < videos.length; i++) {
    setupVideo(videos[i]);
  }
}

function setupVideo(video) {
  let link = video.querySelector(".video__link");
  let media = video.querySelector(".video__media");
  let button = video.querySelector(".video__button");
  let id = parseMediaURL(media);

  video.addEventListener("click", () => {
    let iframe = createIframe(id);

    link.remove();
    button.remove();
    video.appendChild(iframe);
  });

  link.removeAttribute("href");
  video.classList.add("video--enabled");
}

function parseMediaURL(media) {
  let regexp = /https:\/\/i\.ytimg\.com\/vi\/([a-zA-Z0-9_-]+)\/maxresdefault\.jpg/i;
  let url = media.src;
  let match = url.match(regexp);

  return match[1];
}

function createIframe(id) {
  let iframe = document.createElement("iframe");

  iframe.setAttribute("allowfullscreen", "");
  iframe.setAttribute("allow", "autoplay");
  iframe.setAttribute("src", generateURL(id));
  iframe.classList.add("video__media");

  return iframe;
}

function generateURL(id) {
  let query = "?rel=0&showinfo=0&autoplay=1";

  return "https://www.youtube.com/embed/" + id + query;
}

findVideos();
