import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Grainient from "../components/animations/Grainient";
import CardSwap, { Card } from "../components/animations/CardSwap";
import FoldText from "../components/animations/FoldText";
import { IoneLogo } from "../assets/Logos";
import MaskedHeading from "../components/animations/MaskedHeading";

function Home() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const style = getComputedStyle(document.documentElement);
  const colorPrimary = style.getPropertyValue("--color-primary-hex");
  const colorSecondary = style.getPropertyValue("--color-secondary-hex");
  const colorTertiary = style.getPropertyValue("--color-tertiary-hex");
  const colorAccent = style.getPropertyValue("--color-accent-hex");
  const colorAccentWarm = style.getPropertyValue("--color-accent-warm-hex");

  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, MotionPathPlugin);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop / Tablet animations (screens >= 1024px)
      mm.add("(min-width: 1024px)", () => {
        // 1. Enable ScrollSmoother only on larger screens
        const smoother = ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 1.5,
          effects: true,
          smoothTouch: 0.1,
          normalizeScroll: true,
        });
        ScrollTrigger.addEventListener("refreshInit", () => {
          const wrapper = document.querySelector("#smooth-wrapper");
          // Calculate your dynamic width calculation here
          // Example: Match a specific layout grid or maximum boundary
          const targetWidth = "100%";
          // Apply the style change directly
          gsap.set(wrapper, { width: targetWidth });
        });
      });

      // General animations for all screen sizes (min-width: 0px)
      mm.add("(min-width: 0px)", () => {
        // Create a global ScrollTrigger to handle incremental section snapping
        // const panels = document.querySelectorAll(".panel");
        // panels.forEach((panel, i) => {
        //   ScrollTrigger.create({
        //     trigger: panel,
        //     start: "top bottom",
        //     snap: {
        //       snapTo: 0.25,
        //       duration: 1,
        //       ease: "power1.inOut",
        //     },
        //   });
        // });

        // ScrollTrigger.create({
        //   start: 0,
        //   end: "max",
        //   snap: {
        //     snapTo: 1 / (sections.length - 1),
        //     delay: 0,
        //     duration: { min: 0.4, max: 0.8 },
        //     ease: "power1.inOut",
        //   },
        // });

        const howItWorksTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".how-it-works",
            start: "center center",
            end: "+=300%",
            scrub: 0.5,
            pin: true,
            // markers: true,
          },
        });

        const wheelItems = gsap.utils.toArray(".wheel-item");
        const numItems = wheelItems.length;

        wheelItems.forEach((item, index) => {
          const startProgress = index / (numItems * 4);

          howItWorksTimeline.to(
            item,
            {
              motionPath: {
                path: "#wheel-path",
                align: "#wheel-path",
                alignOrigin: [0.5, 0.2],
                start: startProgress - 0.1875,
                end: startProgress,
              },
              ease: "none",
              reversed: true,
            },
            "<",
          );
        });
        howItWorksTimeline.to(
          ".wheel circle",
          {
            rotate: "-10deg",
            transformOrigin: "center center",
          },
          "<",
        );

        const ftCardsElement = document.querySelector(".card-swap-container");

        gsap.to(ftCardsElement, {
          translateY: "-10%",
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features",
            start: "top top",
            end: "+=100%",
            scrub: true,
          },
        });

        // gsap.fromTo(
        //   ".tile",
        //   { scale: 0, opacity: 0, repeatRefresh: true },
        //   {
        //     scrollTrigger: {
        //       trigger: ".tiles",
        //       start: "top 80%",
        //       toggleActions: "play none none none",
        //       once: true,
        //     },
        //     scale: 1,
        //     opacity: 1,
        //     duration: 0.75,
        //     stagger: 0.1,
        //     ease: "elastic.inOut(1, 0.75)",
        //   },
        // );

        const footerTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".footer",
            start: "90% bottom",
            toggleActions: "play none none none",
            once: true,
          },
        });

        footerTimeline
          .to(".ione-logo", {
            scale: 1,
            duration: 0.5,
            ease: "back.out(4)",
          })
          .to(
            ".filter",
            {
              filter: "blur(12.5px)",
            },
            "<",
          );

        gsap.to(".landing-page-navbar", {
          opacity: 0,
          translateY: "-100%",
          scrollTrigger: {
            trigger: ".footer",
            start: "90% bottom",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    {
      scope: containerRef,
    },
  );

  return (
    <div ref={containerRef} id="smooth-wrapper" className="landpage-container">
      <nav>
        <div className="landing-page-navbar">
          <div className="brand">
            <IoneLogo dark={false} />
          </div>
          <ul className="nav-list">
            <li className="nav-item">Features</li>
            <li className="nav-item">How It Works</li>
            <li className="nav-item">Pricing</li>
            <li className="nav-item">Contact</li>
          </ul>
          <div className="nav-buttons">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="btn sm full"
            >
              Login
            </button>
          </div>
        </div>
      </nav>
      <div id="smooth-content">
        <section className="hero" data-speed="clamp(0.5)">
          <div className="bg-filter"></div>
          <div className="content-wrapper">
            <div className="hero-content" data-speed="clamp(1.15)">
              <h1>
                Master Your Money, <br />
                Achieve Your Goals
              </h1>
              <p>
                The all-in-one expense tracker, budget planner, and investment
                vault. Achieve financial clarity with our premium dashboard.
              </p>
              <button type="button" className="btn">
                Start Managing your Finances
              </button>
            </div>
          </div>
        </section>
        <section className="how-it-works panel">
          <div className="box-content rounded-box colored">
            <Grainient
              color1={colorSecondary}
              color2={colorAccent}
              color3={colorTertiary}
              timeSpeed={0.25}
              colorBalance={0.02}
              warpStrength={1.5}
              warpFrequency={0.84}
              warpSpeed={3}
              warpAmplitude={49}
              blendAngle={75}
              blendSoftness={0.275}
              rotationAmount={200}
              noiseScale={1.25}
              grainAmount={0.025}
              grainScale={0.2}
              grainAnimated={false}
              contrast={1.5}
              gamma={1}
              saturation={1}
              centerX={0}
              centerY={0}
              zoom={0.7}
            />
            <div className="wheel-wrapper">
              <div className="wheel-container">
                <svg
                  className="wheel"
                  viewBox="0 0 1000 1000"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    transformOrigin: "center center",
                    translate: "none",
                    rotate: "none",
                    scale: "none",
                    transform: "translate(0px, 0px)",
                  }}
                >
                  <path
                    id="wheel-path"
                    d="M 500,1 A 499,499 0 1,1 500,999 A 499,499 0 1,1 500,1"
                    fill="none"
                    stroke="none"
                  ></path>
                  <circle
                    cx="500"
                    cy="500"
                    r="499.06"
                    strokeWidth="0.138512"
                    opacity="0.55"
                  ></circle>
                  <circle
                    cx="500"
                    cy="500"
                    r="499.13"
                    transform="rotate(0.15 500 500)"
                    strokeWidth="1.78512"
                    strokeDasharray="0.28 1.66"
                  ></circle>
                </svg>
              </div>
              <div data-wheel="1" className="wheel-item">
                <div className="item-number">01</div>
                <div className="item-title">
                  <span className="decoration">●</span>
                  <span className="title">Define Your Initial Balance</span>
                  <span className="decoration">●</span>
                </div>
                <div className="item-body">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Nisi, facere ducimus! Accusamus, obcaecati architecto quam,
                  harum iusto a officiis esse fugiat facilis ipsa quidem in quis
                  cumque, temporibus quaerat corrupti!
                </div>
              </div>
              <div data-wheel="2" className="wheel-item">
                <div className="item-number">02</div>
                <div className="item-title">
                  <span className="decoration">●</span>
                  <span className="title">Track All Transactions</span>
                  <span className="decoration">●</span>
                </div>
                <div className="item-body">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Repellendus veniam perferendis vel aperiam ipsam corrupti
                  tempora porro perspiciatis laboriosam quo explicabo velit ad
                  enim at laborum, adipisci ex doloribus officiis.
                </div>
              </div>
              <div data-wheel="3" className="wheel-item">
                <div className="item-number">03</div>
                <div className="item-title">
                  <span className="decoration">●</span>
                  <span className="title">Create Category Budgets</span>
                  <span className="decoration">●</span>
                </div>
                <div className="item-body">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto
                  odit at veritatis accusantium maxime eius, error voluptatum
                  tenetur deserunt voluptas cum nam laborum blanditiis,
                  explicabo molestias vel, libero quidem officia.
                </div>
              </div>
              <div data-wheel="4" className="wheel-item">
                <div className="item-number">04</div>
                <div className="item-title">
                  <span className="decoration">●</span>
                  <span className="title">Set Savings Goals</span>
                  <span className="decoration">●</span>
                </div>
                <div className="item-body">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Repellat, voluptatibus voluptate officia dolorem, cumque cum,
                  autem nam labore corrupti laborum inventore nisi accusantium
                  ducimus aperiam at. Tempore autem non a.
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="features panel">
          <div className="box-content">
            <div className="cards-container">
              <div className="feature-descriptions" data-speed="clamp(0.95)">
                <div className="card-description" data-slide-target="1">
                  <span className="header">All-in-One Dashboard</span>
                  <span className="body">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Repellat, voluptatibus voluptate officia dolorem, cumque
                    cum, autem nam labore corrupti laborum inventore nisi
                    accusantium ducimus aperiam at. Tempore autem non a.
                  </span>
                </div>
                <div className="card-description" data-slide-target="2">
                  <span className="header">Set Custom Budget Limits</span>
                  <span className="body">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Repellat, voluptatibus voluptate officia dolorem, cumque
                    cum, autem nam labore corrupti laborum inventore nisi
                    accusantium ducimus aperiam at. Tempore autem non a.
                  </span>
                </div>
                <div className="card-description" data-slide-target="3">
                  <span className="header">Multiple Accounts Support</span>
                  <span className="body">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Repellat, voluptatibus voluptate officia dolorem, cumque
                    cum, autem nam labore corrupti laborum inventore nisi
                    accusantium ducimus aperiam at. Tempore autem non a.
                  </span>
                </div>
                <div className="card-description" data-slide-target="4">
                  <span className="header">
                    Track Your Credit Card Spending
                  </span>
                  <span className="body">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Repellat, voluptatibus voluptate officia dolorem, cumque
                    cum, autem nam labore corrupti laborum inventore nisi
                    accusantium ducimus aperiam at. Tempore autem non a.
                  </span>
                </div>
                <div className="card-description" data-slide-target="5">
                  <span className="header">Your Investments In One Place</span>
                  <span className="body">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Repellat, voluptatibus voluptate officia dolorem, cumque
                    cum, autem nam labore corrupti laborum inventore nisi
                    accusantium ducimus aperiam at. Tempore autem non a.
                  </span>
                </div>
                <div className="card-description" data-slide-target="6">
                  <span className="header">
                    Set & Achieve Your Financial Goals
                  </span>
                  <span className="body">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Repellat, voluptatibus voluptate officia dolorem, cumque
                    cum, autem nam labore corrupti laborum inventore nisi
                    accusantium ducimus aperiam at. Tempore autem non a.
                  </span>
                </div>
              </div>
              <CardSwap
                cardDistance={0.03}
                verticalDistance={0.035}
                delay={5000}
                pauseOnHover={false}
                dataSpeed="clamp(1.05)"
              >
                <Card data-slide="1">
                  <div id="dashboard-ss" className="card-content"></div>
                </Card>
                <Card data-slide="2">
                  <div id="budgets-ss" className="card-content"></div>
                </Card>
                <Card data-slide="3">
                  <div id="accounts-ss" className="card-content"></div>
                </Card>
                <Card data-slide="4">
                  <div id="credit-cards-ss" className="card-content"></div>
                </Card>
                <Card data-slide="5">
                  <div id="investments-ss" className="card-content"></div>
                </Card>
                <Card data-slide="6">
                  <div id="vaults-ss" className="card-content"></div>
                </Card>
              </CardSwap>
            </div>
          </div>
        </section>
        <section className="pricing panel" data-speed="clamp(1.1)">
          <div className="box-content">
            <div className="label">
              <MaskedHeading
                text="Affordable Plans for Every Budget"
                src="/src/assets/orange-bg.jpg"
                mediaType="image"
                fillScale={2.25}
                parallax={56}
                reveal="rise"
                trigger="view"
                drift={58}
                brightness={1.35}
                saturation={1}
                grayscale={false}
                duration={1.1}
                stagger={0.09}
                align="center"
                weight={700}
                tracking={-0.03}
                lineHeight={1.5}
                textScale={0.035}
              />
              {/* <FoldText
                text="Affordable Plans for Every Budget"
                splitBy="char"
                hinge="top"
                trigger="scroll"
                duration={0.6}
                stagger={0.03}
                ease="power3.out"
                perspective={800}
                creaseShading={0.55}
                fontSize={40}
                fontWeight={800}
                color={colorPrimary}
              /> */}
            </div>
            <div className="tiles">
              <div className="tile">
                <div className="content">
                  <div className="feature-list"></div>
                  <div className="tile-footer">
                    <div className="price"></div>
                  </div>
                </div>
              </div>
              <div className="tile">
                <div className="content">
                  <div className="feature-list"></div>
                  <div className="tile-footer">
                    <div className="price">
                      <span className="amount">€9.99</span>
                      <span className="recurrence">(Monthly)</span>
                    </div>
                    <button type="button" className="btn ">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
              <div className="tile">
                <div className="content">
                  <div className="feature-list"></div>
                  <div className="tile-footer">
                    <div className="price">
                      <span className="amount">€19.99</span>
                      <span className="recurrence">(Monthly)</span>
                    </div>
                    <button type="button" className="btn ">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="footer panel">
          <div className="background-layer"></div>
          <div className="filter"></div>
          <div className="box-content">
            <div className="logo">
              <IoneLogo textSpeed="0.95" iconSpeed="1.15" dark={false} />
            </div>
            <div className="footer-content"></div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
