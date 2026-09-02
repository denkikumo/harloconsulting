
        (() => {

  const MIN_PRICE = 84;
  const MAX_PRICE = 112;

  const indicator =
    document.querySelector(".price-indicator");

  const valueEl =
    document.querySelector(".indicator-value");

  if (!indicator || !valueEl) return;


  /* =========================
     STATE
  ========================= */

  let currentPrice = 97;
  let currentVelocity = 0;

  let targetPrice = 97;

  let nextTargetTime =
    performance.now() + 1800;

  let lastTime =
    performance.now();


  /* =========================
     HELPERS
  ========================= */

  const clamp = (value, min, max) =>
    Math.min(
      max,
      Math.max(min, value)
    );


  function priceToPercent(price) {

    return (
      (price - MIN_PRICE) /
      (MAX_PRICE - MIN_PRICE)
    ) * 100;

  }


  /* =========================
     UPDATE DISPLAY
  ========================= */

  function updateVisual(price) {

    indicator.style.left =
      `${priceToPercent(price)}%`;

    valueEl.textContent =
      `$${Math.round(price)}`;

  }


  /* =========================
     CHOOSE NEXT PRICE
  ========================= */

  function chooseNewTarget(now) {

    /*
      Favor the middle of the range.

      Averaging several random values
      creates a natural bell-like
      distribution instead of treating
      every price equally.
    */

    const center = 98;

    const randomA = Math.random();
    const randomB = Math.random();
    const randomC = Math.random();

    const centeredRandom =
      (
        (randomA + randomB + randomC) /
        3 - 0.5
      ) * 2;


    let candidate =
      center +
      centeredRandom * 11;


    /*
      Occasionally allow a larger
      excursion toward either side.
    */

    if (Math.random() < 0.12) {

      candidate +=
        (Math.random() - 0.5) * 5;

    }


    /*
      Keep it slightly away from the
      absolute endpoints.
    */

    targetPrice = clamp(
      candidate,
      MIN_PRICE + 1.5,
      MAX_PRICE - 1.5
    );


    /*
      Don't allow enormous jumps.
    */

    const maxJump = 6.5;

    const difference =
      targetPrice - currentPrice;


    if (
      Math.abs(difference) >
      maxJump
    ) {

      targetPrice =
        currentPrice +
        Math.sign(difference) *
        maxJump;

    }


    /*
      Random hesitation before it
      decides to move somewhere else.
    */

    nextTargetTime =
      now +
      1400 +
      Math.random() * 2600;

  }


  /* =========================
     ANIMATION
  ========================= */

  function animate(now) {

    const delta = Math.min(
      (now - lastTime) / 1000,
      0.033
    );

    lastTime = now;


    const distance =
      targetPrice - currentPrice;


    /*
      Soft spring.

      Lower strength =
      slower acceleration.

      Higher damping =
      less snapping/jolting.
    */

    const springStrength = 0.48;
    const damping = 0.965;


    currentVelocity +=
      distance *
      springStrength *
      delta;


    currentVelocity *=
      Math.pow(
        damping,
        delta * 60
      );


    /*
      Prevent sudden fast movement.
    */

    const maxVelocity = 0.055;

    currentVelocity = clamp(
      currentVelocity,
      -maxVelocity,
      maxVelocity
    );


    /*
      Extremely subtle organic drift.

      Two different sine waves prevent
      the movement from feeling like
      a perfect repeating animation.
    */

    const breath =
      Math.sin(now / 2300) *
      0.0007 +

      Math.sin(now / 4100) *
      0.0004;


    currentVelocity += breath;


    /*
      Move indicator.
    */

    currentPrice +=
      currentVelocity *
      delta *
      10;


    currentPrice = clamp(
      currentPrice,
      MIN_PRICE,
      MAX_PRICE
    );


    updateVisual(currentPrice);


    /*
      Determine whether the indicator
      has gently settled near its
      destination.
    */

    const settled =
      Math.abs(distance) < 0.4 &&
      Math.abs(currentVelocity) < 0.012;


    /*
      Once settled and after its pause,
      choose another destination.
    */

    if (
      now >= nextTargetTime &&
      settled
    ) {

      chooseNewTarget(now);

    }


    /*
      Failsafe so it never gets stuck
      waiting forever.
    */

    if (
      now >
      nextTargetTime + 5000
    ) {

      chooseNewTarget(now);

    }


    requestAnimationFrame(animate);

  }


  /* =========================
     START
  ========================= */

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (reducedMotion) {

    updateVisual(97);
    return;

  }


  updateVisual(currentPrice);

  chooseNewTarget(
    performance.now()
  );

  requestAnimationFrame(animate);

})();


(() => {

  const story =
    document.querySelector(
      "#wtp-story"
    );


  if (!story) return;



  const distribution =
    story.querySelector(
      ".customer-distribution"
    );


  const featuredCustomers =
    story.querySelectorAll(
      ".featured-customer"
    );


  const ticks =
    story.querySelectorAll(
      ".final-tick"
    );


  const originalLabels =
    story.querySelectorAll(
      ".original-axis-labels span"
    );


  const originalAxisLabels =
    story.querySelector(
      ".original-axis-labels"
    );


  const finalAxis =
    story.querySelector(
      ".final-axis"
    );


  const originalLine =
    story.querySelector(
      ".original-line"
    );


  if (!distribution) return;



  /* =====================================
     MASTER PRICE SCALE
  ===================================== */

  const MIN_PRICE =
    75;


  const MAX_PRICE =
    125;


  /*
    Must match:

    .final-axis {
      top: 310px;
    }
  */

  const FINAL_AXIS_Y =
    310;



  /* =====================================
     CUSTOMER DISTRIBUTION
  ===================================== */

  const customers = [

    80,

    84,

    85,
    85,

    89,

    90,
    90,
    90,

    94,

    95,
    95,
    95,
    95,

    99,

    100,
    100,
    100,
    100,
    100,
    100,

    104,

    105,
    105,
    105,
    105,
    105,

    109,

    110,
    110,
    110,
    110,

    114,

    115,
    115,

    120

  ];



  /* =====================================
     HELPERS
  ===================================== */

  function clamp(
    value,
    min,
    max
  ) {

    return Math.min(
      max,
      Math.max(
        min,
        value
      )
    );

  }



  function priceToPercent(
    price
  ) {

    return (

      (
        price -
        MIN_PRICE
      )

      /

      (
        MAX_PRICE -
        MIN_PRICE
      )

    ) * 100;

  }



  function smoothstep(
    value
  ) {

    value =
      clamp(
        value,
        0,
        1
      );


    return (

      value *
      value *
      (
        3 -
        2 * value
      )

    );

  }



  function lerp(
    start,
    end,
    amount
  ) {

    return (

      start +

      (
        end -
        start
      )

      *
      amount

    );

  }



  /* =====================================
     FEATURED CUSTOMERS
  ===================================== */

  featuredCustomers.forEach(
    customer => {

      const price =
        Number(
          customer.dataset.price
        );


      customer.style.setProperty(
        "--x",
        `${priceToPercent(price)}%`
      );

    }
  );



  /* =====================================
     DISPERSED AXIS LABELS
  ===================================== */

  originalLabels.forEach(
    label => {

      const price =
        Number(
          label.dataset.price
        );


      label.style.setProperty(
        "--x",
        `${priceToPercent(price)}%`
      );

    }
  );



  /* =====================================
     FINAL AXIS TICKS
  ===================================== */

  ticks.forEach(
    tick => {

      const price =
        Number(
          tick.dataset.price
        );


      tick.style.setProperty(
        "--x",
        `${priceToPercent(price)}%`
      );

    }
  );



  /* =====================================
     CREATE CUSTOMER BUBBLES
  ===================================== */

  distribution.innerHTML =
    "";


  const bucketCounts =
    {};


  const dots =
    [];


  const scatterPattern = [

    115,

    167,

    218,

    142,

    253,

    190,

    272,

    155,

    230,

    105,

    251,

    180,

    133,

    207,

    164,

    240

  ];



  customers.forEach(
    (
      price,
      index
    ) => {


      const dot =
        document.createElement(
          "div"
        );


      dot.className =
        "distribution-dot";



      /* =================================
         DISPERSED POSITION
      ================================= */

      const scatterX =

        priceToPercent(
          price
        )

        +

        Math.sin(
          index * 1.71
        )

        * 1.45;



      const scatterY =

        scatterPattern[
          index %
          scatterPattern.length
        ]

        +

        Math.cos(
          index * 1.29
        )

        * 8;



      /* =================================
         FINAL $5 PRICE BUCKET
      ================================= */

      const finalPrice =

        clamp(

          Math.round(
            price / 5
          )

          * 5,

          80,

          120

        );



      if (
        bucketCounts[
          finalPrice
        ] ===
        undefined
      ) {

        bucketCounts[
          finalPrice
        ] =
          0;

      }



      const stackIndex =

        bucketCounts[
          finalPrice
        ]++;



      const finalX =

        priceToPercent(
          finalPrice
        );



      const finalY =

        FINAL_AXIS_Y

        -

        18

        -

        stackIndex * 23;



      dot.dataset.scatterX =
        scatterX;


      dot.dataset.scatterY =
        scatterY;


      dot.dataset.finalX =
        finalX;


      dot.dataset.finalY =
        finalY;



      dot.style.left =
        `${scatterX}%`;


      dot.style.top =
        `${scatterY}px`;



      distribution.appendChild(
        dot
      );


      dots.push(
        dot
      );

    }
  );



  /* =====================================
     SCROLL ANIMATION
  ===================================== */

  function updateStory() {


    const rect =
      story.getBoundingClientRect();



    const scrollDistance =

      Math.max(

        1,

        story.offsetHeight -
        window.innerHeight

      );



    let progress =

      -rect.top /
      scrollDistance;



    progress =
      clamp(
        progress,
        0,
        1
      );



    /* =================================
       INTRO
    ================================= */

    story.classList.toggle(
      "show-intro",
      progress >= 0.05
    );



    /* =================================
       FADE ORIGINAL 3 CUSTOMERS
    ================================= */

    const featuredFade =

      smoothstep(

        (
          progress -
          0.18
        )

        /

        0.11

      );



    featuredCustomers.forEach(
      customer => {

        customer.style.opacity =

          1 -
          featuredFade;

      }
    );



    /* =================================
       DISPERSED PRICE RANGE LABELS
    ================================= */

    const rangeLabelProgress =

      smoothstep(

        clamp(

          (
            progress -
            0.25
          )

          /

          0.10,

          0,

          1

        )

      );



    /* =================================
       REVEAL DISTRIBUTED CUSTOMERS
    ================================= */

    const revealStart =
      0.24;


    const revealEnd =
      0.46;



    const revealProgress =

      clamp(

        (
          progress -
          revealStart
        )

        /

        (
          revealEnd -
          revealStart
        ),

        0,

        1

      );



    dots.forEach(
      (
        dot,
        index
      ) => {


        const threshold =

          (
            index + 1
          )

          /

          (
            dots.length + 2
          )

          *

          0.84;



        if (
          revealProgress >=
          threshold
        ) {

          dot.classList.add(
            "visible"
          );

        }

        else {

          dot.classList.remove(
            "visible"
          );

        }

      }
    );



    /* =================================
       SCATTER -> ORGANIZED DISTRIBUTION
    ================================= */

    const morphStart =
      0.50;


    const morphEnd =
      0.79;



    const rawMorph =

      clamp(

        (
          progress -
          morphStart
        )

        /

        (
          morphEnd -
          morphStart
        ),

        0,

        1

      );



    const morph =
      smoothstep(
        rawMorph
      );



    dots.forEach(
      dot => {


        const scatterX =
          Number(
            dot.dataset.scatterX
          );


        const scatterY =
          Number(
            dot.dataset.scatterY
          );


        const finalX =
          Number(
            dot.dataset.finalX
          );


        const finalY =
          Number(
            dot.dataset.finalY
          );



        const x =
          lerp(
            scatterX,
            finalX,
            morph
          );


        const y =
          lerp(
            scatterY,
            finalY,
            morph
          );



        dot.style.left =
          `${x}%`;


        dot.style.top =
          `${y}px`;

      }
    );



    /* =================================
       AXIS TRANSFORMATION
    ================================= */

    const axisProgress =

      smoothstep(

        clamp(

          (
            progress -
            0.54
          )

          /

          0.18,

          0,

          1

        )

      );



    finalAxis.style.opacity =
      axisProgress;



    originalLine.style.opacity =

      1 -
      axisProgress;



    originalLine.style.transform =

      `scaleX(${
        1 -
        axisProgress * 0.12
      })`;



    /*
      Range labels:

      - hidden initially
      - appear during dispersed stage
      - disappear again when final
        organized axis comes in
    */

    originalAxisLabels.style.opacity =

      rangeLabelProgress *

      (
        1 -
        axisProgress
      );

  }



  /* =====================================
     RAF SCROLL HANDLER
  ===================================== */

  let ticking =
    false;



  function requestUpdate() {


    if (
      ticking
    ) return;



    ticking =
      true;



    requestAnimationFrame(
      () => {


        updateStory();


        ticking =
          false;

      }
    );

  }



  window.addEventListener(
    "scroll",
    requestUpdate,
    {
      passive: true
    }
  );


  window.addEventListener(
    "resize",
    requestUpdate
  );


  updateStory();


})();