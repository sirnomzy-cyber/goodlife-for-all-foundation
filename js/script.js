/* ==========================================================================
   THE GOODLIFE FOUNDATION — GLOBAL SCRIPT
   ========================================================================== */
(function(){
  "use strict";

  /* ---------- Page Loader ---------- */
  window.addEventListener("load", function(){
    var loader = document.querySelector(".page-loader");
    if(loader){ setTimeout(function(){ loader.classList.add("hidden"); }, 350); }
  });

  document.addEventListener("DOMContentLoaded", function(){

    /* ---------- Sticky / Glass Navigation ---------- */
    var header = document.querySelector(".site-header");
    function onScrollHeader(){
      if(!header) return;
      if(window.scrollY > 40){ header.classList.add("scrolled"); }
      else{ header.classList.remove("scrolled"); }
    }
    onScrollHeader();
    window.addEventListener("scroll", debounce(onScrollHeader, 10));

    /* ---------- Mobile Menu ---------- */
    var toggle = document.querySelector(".nav-toggle");
    var navList = document.querySelector(".main-nav ul");
    var navBackdrop = document.querySelector(".nav-backdrop");
    function closeMobileMenu(){
      if(toggle){ toggle.classList.remove("active"); }
      if(navList){ navList.classList.remove("open"); }
      if(navBackdrop){ navBackdrop.classList.remove("open"); }
      document.body.style.overflow = "";
    }
    if(toggle && navList){
      toggle.addEventListener("click", function(){
        var opening = !navList.classList.contains("open");
        toggle.classList.toggle("active", opening);
        navList.classList.toggle("open", opening);
        if(navBackdrop){ navBackdrop.classList.toggle("open", opening); }
        document.body.style.overflow = opening ? "hidden" : "";
      });
      navList.querySelectorAll("a").forEach(function(a){
        a.addEventListener("click", closeMobileMenu);
      });
      if(navBackdrop){ navBackdrop.addEventListener("click", closeMobileMenu); }
    }

    /* ---------- Active Nav Link ---------- */
    var hereRaw = location.pathname.split("/").pop() || "";
    var here = hereRaw.replace(/\.html$/, ""); // normalize "about.html" -> "about", "" stays ""
    document.querySelectorAll(".main-nav a").forEach(function(a){
      var href = a.getAttribute("href").replace(/^\//, "").replace(/\.html$/, ""); // "/" -> "", "about.html" -> "about"
      var isHome = (here === "" || here === "index") && href === "";
      if(isHome || (href !== "" && href === here)){ a.classList.add("active"); }
    });

    /* ---------- Dark Mode Toggle ---------- */
    var themeBtn = document.querySelector(".theme-toggle");
    var savedTheme = null;
    try{ savedTheme = window.__glafTheme || null; }catch(e){}
    function applyTheme(t){
      document.documentElement.setAttribute("data-theme", t);
      if(themeBtn){ themeBtn.innerHTML = t === "dark" ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>' : '<i class="fa-solid fa-moon" aria-hidden="true"></i>'; }
      window.__glafTheme = t;
    }
    applyTheme(savedTheme || "light");
    if(themeBtn){
      themeBtn.addEventListener("click", function(){
        var current = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(current);
      });
    }

    /* ---------- Scroll Progress Bar ---------- */
    var progress = document.querySelector(".scroll-progress");
    function onProgress(){
      if(!progress) return;
      var h = document.documentElement;
      var scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      progress.style.width = scrolled + "%";
    }
    window.addEventListener("scroll", debounce(onProgress, 5));

    /* ---------- Back To Top ---------- */
    var topBtn = document.querySelector(".fab.top");
    function onTopBtn(){
      if(!topBtn) return;
      if(window.scrollY > 600){ topBtn.classList.add("show"); } else { topBtn.classList.remove("show"); }
    }
    window.addEventListener("scroll", debounce(onTopBtn, 10));
    if(topBtn){ topBtn.addEventListener("click", function(){ window.scrollTo({top:0, behavior:"smooth"}); }); }

    /* ---------- Scroll Reveal (Intersection Observer) ---------- */
    var revealEls = document.querySelectorAll("[data-reveal]");
    if("IntersectionObserver" in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry, i){
          if(entry.isIntersecting){
            entry.target.style.setProperty("--i", entry.target.dataset.i || 0);
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(function(el, i){ el.dataset.i = (i % 6); io.observe(el); });
    } else {
      revealEls.forEach(function(el){ el.classList.add("in-view"); });
    }

    /* ---------- Animated Counters ---------- */
    var counters = document.querySelectorAll("[data-count]");
    function animateCounter(el){
      var target = parseFloat(el.dataset.count);
      var suffix = el.dataset.suffix || "";
      var duration = 1800;
      var startTime = null;
      function step(ts){
        if(!startTime) startTime = ts;
        var progressPct = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progressPct, 3);
        var val = Math.floor(eased * target);
        el.textContent = val.toLocaleString() + suffix;
        if(progressPct < 1){ requestAnimationFrame(step); }
        else{ el.textContent = target.toLocaleString() + suffix; }
      }
      requestAnimationFrame(step);
    }
    if("IntersectionObserver" in window && counters.length){
      var cio = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){ animateCounter(entry.target); cio.unobserve(entry.target); }
        });
      }, { threshold: 0.4 });
      counters.forEach(function(el){ cio.observe(el); });
    }

    /* ---------- Animated Progress Bars ---------- */
    var pbars = document.querySelectorAll(".pbar > span");
    if("IntersectionObserver" in window && pbars.length){
      var pio = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){ entry.target.style.width = entry.target.dataset.pct + "%"; pio.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      pbars.forEach(function(el){ pio.observe(el); });
    }

    /* ---------- Timeline Reveal ---------- */
    var tlItems = document.querySelectorAll(".tl-item");
    if("IntersectionObserver" in window && tlItems.length){
      var tio = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){ entry.target.classList.add("reveal"); tio.unobserve(entry.target); }
        });
      }, { threshold: 0.3 });
      tlItems.forEach(function(el){ tio.observe(el); });
    }

    /* ---------- Accordion ---------- */
    document.querySelectorAll(".accordion-head").forEach(function(head){
      head.addEventListener("click", function(){
        var item = head.closest(".accordion-item");
        var body = item.querySelector(".accordion-body");
        var isOpen = item.classList.contains("open");
        item.parentElement.querySelectorAll(".accordion-item.open").forEach(function(other){
          if(other !== item){ other.classList.remove("open"); other.querySelector(".accordion-body").style.maxHeight = null; }
        });
        item.classList.toggle("open", !isOpen);
        body.style.maxHeight = !isOpen ? body.scrollHeight + "px" : null;
      });
    });

    /* ---------- Filter Buttons (Programs / Projects) ---------- */
    document.querySelectorAll(".filter-row").forEach(function(row){
      row.querySelectorAll(".filter-btn").forEach(function(btn){
        btn.addEventListener("click", function(){
          row.querySelectorAll(".filter-btn").forEach(function(b){ b.classList.remove("active"); });
          btn.classList.add("active");
          var filter = btn.dataset.filter;
          var grid = document.querySelector(row.dataset.target);
          if(!grid) return;
          grid.querySelectorAll("[data-cat]").forEach(function(card){
            if(filter === "all" || card.dataset.cat.indexOf(filter) > -1){ card.classList.remove("hidden-item"); }
            else{ card.classList.add("hidden-item"); }
          });
        });
      });
    });

    /* ---------- Program Detail Data (verbatim from official programme document) ---------- */
  var PROGRAM_DETAILS = {
    "safe-motherhood": { tag:"Flagship · Health", title:"Safe Motherhood Initiative (SMI)",
      body:"The Safe Motherhood Initiative (SMI) is GLAF's flagship health programme dedicated to reducing preventable maternal and newborn deaths. Through maternal health education, birth preparedness, antenatal sensitization, and safe delivery support, we help vulnerable pregnant women access quality healthcare and improve birth outcomes for mothers and babies.",
      focus:["Maternal Health Education","Birth Preparedness","Safe Delivery Support","Hospital Partnerships","Community Awareness"] },
    "youth-empowerment": { tag:"Youth", title:"Youth Empowerment & Skills Academy",
      body:"The future of every nation depends on its young people. Our Youth Empowerment & Skills Academy equips young people with practical, digital, vocational, and entrepreneurial skills that prepare them for employment, business ownership, leadership, and lifelong success.",
      focus:["Digital Skills Development","Entrepreneurship Training","Career Development","Vocational Skills","Leadership Development"] },
    "women-empowerment": { tag:"Women", title:"Women Empowerment Initiative",
      body:"We believe empowered women build stronger families and communities. This programme supports women through skills development, financial literacy, business support, mentorship, and access to opportunities that promote economic independence and sustainable livelihoods.",
      focus:["Business Development","Skills Acquisition","Financial Literacy","Cooperative Development","Mentorship"] },
    "health-wellness": { tag:"Health", title:"Community Health & Wellness Initiative",
      body:"Good health is the foundation of thriving communities. Through medical outreaches, preventive healthcare education, wellness campaigns, health screenings, and referral services, we improve access to essential healthcare and encourage healthier lifestyles.",
      focus:["Medical Outreach","Health Education","Preventive Healthcare","Health Screening","Wellness Promotion"] },
    "education-leaders": { tag:"Education", title:"Education & Future Leaders Initiative",
      body:"Education changes lives and creates future leaders. This programme expands access to quality education through scholarships, learning materials, mentorship, leadership development, and school support programmes that empower children and young people to reach their full potential.",
      focus:["Scholarships","School Support","Reading & Literacy Programmes","Student Mentorship","Leadership Development"] },
    "food-security": { tag:"Community", title:"Community Food Security Programme",
      body:"No family should have to choose between hunger and hope. This programme supports vulnerable households through food assistance, nutrition education, community food initiatives, and sustainable approaches that improve household food security and resilience.",
      focus:["Food Assistance","Nutrition Education","Community Food Banks","Household Support","Agricultural Initiatives"] },
    "civic-leadership": { tag:"Leadership", title:"Civic Education & Leadership Initiative",
      body:"Strong communities are built by informed, responsible, and active citizens. This programme promotes civic responsibility, democratic participation, leadership development, and community engagement while encouraging citizens to become agents of positive social change.",
      focus:["Civic Education","Leadership Training","Community Dialogue","Youth Engagement","Responsible Citizenship"] },
    "safety-peacebuilding": { tag:"Civic & Safety", title:"Community Safety & Peacebuilding Programme",
      body:"Peaceful and secure communities create opportunities for growth and development. Through collaboration with community leaders, government institutions, and security stakeholders, we promote peacebuilding, conflict prevention, public safety awareness, and stronger community relationships.",
      focus:["Peacebuilding","Community Safety","Crime Prevention Awareness","Youth Engagement","Public Education"] },
    "seniors-support": { tag:"Seniors", title:"Senior Citizens Support Programme",
      body:"Every senior citizen deserves to age with dignity, respect, and care. This programme provides welfare support, healthcare assistance, social engagement, and community-based care initiatives that improve the wellbeing and quality of life of older adults.",
      focus:["Elderly Welfare","Healthcare Support","Social Inclusion","Home Visits","Community Care"] },
    "clean-environment": { tag:"Environment", title:"Clean Communities & Environmental Action Initiative",
      body:"Healthy communities depend on a healthy environment. Through environmental education, sanitation campaigns, tree planting, waste management advocacy, and climate action initiatives, we inspire communities to protect and preserve their environment for future generations.",
      focus:["Environmental Education","Community Clean-up Campaigns","Tree Planting","Waste Management","Climate Action"] }
  };

  /* ---------- Program Detail Modal ---------- */
  var programModal = document.querySelector("#programModal");
  if(programModal){
    var pmTag = programModal.querySelector("#modalTag");
    var pmTitle = programModal.querySelector("#modalTitle");
    var pmBody = programModal.querySelector("#modalBody");
    var pmList = programModal.querySelector("#modalFocusList");

    function openProgramModal(key){
      var data = PROGRAM_DETAILS[key];
      if(!data) return;
      pmTag.textContent = data.tag;
      pmTitle.textContent = data.title;
      pmBody.textContent = data.body;
      pmList.innerHTML = "";
      data.focus.forEach(function(item){
        var li = document.createElement("li");
        li.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span></span>';
        li.querySelector("span").textContent = item;
        pmList.appendChild(li);
      });
      programModal.classList.add("open");
      document.body.classList.add("modal-open");
    }
    function closeProgramModal(){
      programModal.classList.remove("open");
      document.body.classList.remove("modal-open");
    }
    document.querySelectorAll(".js-learn-more").forEach(function(btn){
      btn.addEventListener("click", function(e){
        e.preventDefault();
        openProgramModal(btn.dataset.program);
      });
    });
    var pmClose = programModal.querySelector(".modal-close");
    if(pmClose){ pmClose.addEventListener("click", closeProgramModal); }
    programModal.addEventListener("click", function(e){ if(e.target === programModal) closeProgramModal(); });
    document.addEventListener("keydown", function(e){ if(e.key === "Escape") closeProgramModal(); });
  }

  /* ---------- Testimonials ---------- */
    /* Continuous looping marquee is handled purely via CSS animation (see .testi-track).
       No JS state needed; animation pauses automatically on hover via CSS. */

    /* ---------- Donation Amount Selection ---------- */
    function currentCurrencySymbol(){
      var cur = document.querySelector("#donationCurrency");
      return (cur && cur.value === "USD") ? "$" : "₦";
    }
    document.querySelectorAll(".amount-card").forEach(function(card){
      card.addEventListener("click", function(){
        var wrap = card.closest(".amount-grid");
        wrap.querySelectorAll(".amount-card").forEach(function(c){ c.classList.remove("selected"); });
        card.classList.add("selected");
        var donationInput = document.querySelector("#donationAmount");
        if(donationInput){ donationInput.value = card.dataset.amount || ""; }
        var customInputEl = document.querySelector("#customAmount");
        if(customInputEl){ customInputEl.value = ""; }
        var impactText = document.querySelector("#impactText");
        var sym = currentCurrencySymbol();
        if(impactText && card.dataset.impact){
          var amt = parseInt(card.dataset.amount, 10).toLocaleString();
          impactText.textContent = sym + amt + " " + card.dataset.impact;
        }
      });
    });

    /* ---------- Custom Donation Amount Input ---------- */
    var customAmountInput = document.querySelector("#customAmount");
    if(customAmountInput){
      customAmountInput.addEventListener("input", function(){
        document.querySelectorAll(".amount-card.selected").forEach(function(c){ c.classList.remove("selected"); });
        var donationInput = document.querySelector("#donationAmount");
        if(donationInput){ donationInput.value = customAmountInput.value; }
        var impactText = document.querySelector("#impactText");
        var sym = currentCurrencySymbol();
        if(impactText){
          if(customAmountInput.value){
            impactText.textContent = "Your gift of " + sym + parseInt(customAmountInput.value, 10).toLocaleString() + " creates real opportunity for someone who needs it.";
          } else {
            impactText.textContent = "Select an amount above to see the difference it can make.";
          }
        }
      });
    }

    /* ---------- Donate Page: Currency Toggle (NGN / USD) ---------- */
    var currencyToggle = document.querySelector("#currencyToggle");
    if(currencyToggle){
      var gridNGN = document.querySelector("#amountGridNGN");
      var gridUSD = document.querySelector("#amountGridUSD");
      var usdInfo = document.querySelector("#usdAccountInfo");
      var ngnInfo = document.querySelector("#ngnAccountInfo");
      var currencyField = document.querySelector("#donationCurrency");
      var customLabel = document.querySelector("#customAmountLabel");
      var customField = document.querySelector("#customAmountField");
      var customInput = document.querySelector("#customAmount");
      var impactText = document.querySelector("#impactText");
      var donationInput = document.querySelector("#donationAmount");

      currencyToggle.querySelectorAll("[data-currency]").forEach(function(btn){
        btn.addEventListener("click", function(){
          currencyToggle.querySelectorAll("[data-currency]").forEach(function(b){ b.classList.remove("active"); });
          btn.classList.add("active");
          var isUSD = btn.dataset.currency === "USD";

          if(gridNGN){ gridNGN.style.display = isUSD ? "none" : "grid"; }
          if(gridUSD){ gridUSD.style.display = isUSD ? "grid" : "none"; }
          if(usdInfo){ usdInfo.style.display = isUSD ? "block" : "none"; }
          if(ngnInfo){ ngnInfo.style.display = isUSD ? "none" : "block"; }
          if(currencyField){ currencyField.value = isUSD ? "USD" : "NGN"; }
          if(customLabel){ customLabel.textContent = isUSD ? "Or enter a custom amount ($)" : "Or enter a custom amount (₦)"; }
          if(customInput){ customInput.placeholder = isUSD ? "$ Custom amount" : "₦ Custom amount"; }

          // Reset selection state when switching currency
          document.querySelectorAll(".amount-card.selected").forEach(function(c){ c.classList.remove("selected"); });
          if(customInput){ customInput.value = ""; }
          if(donationInput){ donationInput.value = ""; }
          if(impactText){ impactText.textContent = "Select an amount above to see the difference it can make."; }
        });
      });
    }

    /* ---------- Donate Page: Giving Type Tabs ---------- */
    var donateTabs = document.querySelector("[data-donate-tabs]");
    if(donateTabs){
      var panels = {
        onetime: document.querySelector("#donatePanelGiving"),
        monthly: document.querySelector("#donatePanelGiving"),
        corporate: document.querySelector("#donatePanelCorporate"),
        legacy: document.querySelector("#donatePanelLegacy")
      };
      donateTabs.querySelectorAll("[data-tab]").forEach(function(btn){
        btn.addEventListener("click", function(){
          donateTabs.querySelectorAll("[data-tab]").forEach(function(b){ b.classList.remove("active"); });
          btn.classList.add("active");
          Object.keys(panels).forEach(function(key){
            if(panels[key]){ panels[key].style.display = "none"; }
          });
          var target = panels[btn.dataset.tab];
          if(target){ target.style.display = ""; }
        });
      });
    }

    /* ---------- Donate Page: Payment Method Selector ---------- */
    var payRow = document.querySelector("#payMethodRow");
    if(payRow){
      var bankReveal = document.querySelector("#bankDetailsReveal");
      var txnProofInput = document.querySelector("#dPaymentProof");
      var txnConfirmInput = document.querySelector("#dTxnConfirm");
      payRow.querySelectorAll("[data-pay]").forEach(function(btn){
        btn.addEventListener("click", function(){
          payRow.querySelectorAll("[data-pay]").forEach(function(b){ b.classList.remove("active"); });
          btn.classList.add("active");
          var isBank = btn.dataset.pay === "bank";
          if(bankReveal){ bankReveal.style.display = isBank ? "block" : "none"; }
          if(txnProofInput){ txnProofInput.required = isBank; if(!isBank){ txnProofInput.value = ""; } }
          if(txnConfirmInput){ txnConfirmInput.required = isBank; if(!isBank){ txnConfirmInput.checked = false; } }
        });
      });
    }

    /* ---------- Frequency Toggle (One-Time / Monthly) ---------- */
    document.querySelectorAll(".toggle-pair").forEach(function(pair){
      pair.querySelectorAll("button").forEach(function(btn){
        btn.addEventListener("click", function(){
          pair.querySelectorAll("button").forEach(function(b){ b.classList.remove("active"); });
          btn.classList.add("active");
        });
      });
    });

    /* ---------- Form Validation + Submission (Web3Forms) ---------- */
    document.querySelectorAll("form[data-validate]").forEach(function(form){
      form.addEventListener("submit", function(e){
        e.preventDefault();
        var valid = true;
        form.querySelectorAll("[required]").forEach(function(field){
          var isEmpty = (field.type === "checkbox") ? !field.checked : !field.value.trim();
          if(isEmpty){
            valid = false;
            field.style.borderColor = "var(--error)";
          } else {
            field.style.borderColor = "";
          }
        });
        var emailField = form.querySelector('input[type="email"]');
        if(emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)){
          valid = false; emailField.style.borderColor = "var(--error)";
        }
        if(!valid){ return; }

        var successBox = form.parentElement.querySelector(".form-success") || form.querySelector(".form-success");
        var submitBtn = form.querySelector('button[type="submit"]');
        var originalBtnHTML = submitBtn ? submitBtn.innerHTML : "";
        var accessKeyField = form.querySelector('input[name="access_key"]');

        function finishSuccess(){
          form.reset();
          document.querySelectorAll(".amount-card.selected").forEach(function(c){ c.classList.remove("selected"); });
          if(successBox){ successBox.classList.add("show"); setTimeout(function(){ successBox.classList.remove("show"); }, 6000); }
        }

        if(accessKeyField){
          if(submitBtn){ submitBtn.disabled = true; submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...'; }
          fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Accept": "application/json" },
            body: new FormData(form)
          }).then(function(res){ return res.json(); }).then(function(data){
            if(data && data.success){
              finishSuccess();
            } else {
              alert("Something went wrong sending your message. Please try again, or email us directly.");
            }
          }).catch(function(){
            alert("Something went wrong sending your message. Please check your connection and try again.");
          }).finally(function(){
            if(submitBtn){ submitBtn.disabled = false; submitBtn.innerHTML = originalBtnHTML; }
          });
        } else {
          finishSuccess();
        }
      });
    });

    /* ---------- Cookie Notice (shown once, remembered via localStorage) ---------- */
    var cookieBar = document.querySelector(".cookie-bar");
    if(cookieBar){
      var alreadyAccepted = false;
      try{ alreadyAccepted = window.localStorage.getItem("glafCookieConsent") === "accepted"; }catch(e){}
      if(!alreadyAccepted){
        setTimeout(function(){ cookieBar.classList.add("show"); }, 1200);
      }
      var acceptBtn = cookieBar.querySelector(".cookie-accept");
      if(acceptBtn){
        acceptBtn.addEventListener("click", function(){
          cookieBar.classList.remove("show");
          try{ window.localStorage.setItem("glafCookieConsent", "accepted"); }catch(e){}
        });
      }
    }

    /* ---------- Accessibility Panel ---------- */
    var a11yBtn = document.querySelector(".a11y-btn");
    var a11yPanel = document.querySelector(".a11y-panel");
    if(a11yBtn && a11yPanel){
      a11yBtn.addEventListener("click", function(){ a11yPanel.classList.toggle("open"); });
      var bigText = a11yPanel.querySelector(".a11y-bigtext");
      var contrast = a11yPanel.querySelector(".a11y-contrast");
      if(bigText){ bigText.addEventListener("click", function(){ document.body.classList.toggle("big-text"); }); }
      if(contrast){ contrast.addEventListener("click", function(){ document.body.classList.toggle("high-contrast"); }); }
    }

    /* ---------- Button Ripple Effect ---------- */
    document.querySelectorAll(".btn").forEach(function(btn){
      btn.addEventListener("click", function(e){
        var rect = btn.getBoundingClientRect();
        var ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.left = (e.clientX - rect.left) + "px";
        ripple.style.top = (e.clientY - rect.top) + "px";
        ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + "px";
        btn.appendChild(ripple);
        setTimeout(function(){ ripple.remove(); }, 650);
      });
    });

    /* ---------- Lazy Loading Images (native + fallback class) ---------- */
    document.querySelectorAll("img").forEach(function(img){
      if(!img.hasAttribute("loading")){ img.setAttribute("loading", "lazy"); }
    });

    /* ---------- Motion Preference Guards ---------- */
    var prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var supportsHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;

    /* ---------- Text Animation: Homepage Hero Typewriter ---------- */
    var typedEl = document.querySelector(".hero-subline[data-typed]");
    if(typedEl && !prefersReducedMotion){
      var phrases = ["Building Hope.", "Creating Opportunities.", "Empowering Communities.", "Transforming Lives."];
      var caret = document.createElement("span");
      caret.className = "typed-cursor";
      var pIndex = 0, cIndex = 0, deleting = false;
      typedEl.textContent = "";
      typedEl.appendChild(caret);
      function typeStep(){
        var current = phrases[pIndex];
        if(!deleting){
          cIndex++;
          typedEl.textContent = current.slice(0, cIndex);
          typedEl.appendChild(caret);
          if(cIndex === current.length){
            deleting = true;
            setTimeout(typeStep, 1600);
            return;
          }
          setTimeout(typeStep, 55);
        } else {
          cIndex--;
          typedEl.textContent = current.slice(0, cIndex);
          typedEl.appendChild(caret);
          if(cIndex === 0){
            deleting = false;
            pIndex = (pIndex + 1) % phrases.length;
            setTimeout(typeStep, 300);
            return;
          }
          setTimeout(typeStep, 28);
        }
      }
      typeStep();
    }

    /* ---------- Mouse Interaction: Cursor Glow (hero/page-hero sections, desktop only) ---------- */
    if(supportsHover && !prefersReducedMotion){
      var glow = document.createElement("div");
      glow.className = "cursor-glow";
      document.body.appendChild(glow);
      var glowTargets = document.querySelectorAll(".hero, .page-hero");
      var overGlowZone = false;
      glowTargets.forEach(function(zone){
        zone.addEventListener("mouseenter", function(){ overGlowZone = true; glow.classList.add("active"); });
        zone.addEventListener("mouseleave", function(){ overGlowZone = false; glow.classList.remove("active"); });
      });
      window.addEventListener("mousemove", function(e){
        if(!overGlowZone) return;
        glow.style.transform = "translate(" + (e.clientX - 210) + "px," + (e.clientY - 210) + "px)";
      });
    }

    /* ---------- Mouse Interaction: Magnetic Buttons ---------- */
    if(supportsHover && !prefersReducedMotion){
      document.querySelectorAll(".btn-primary, .btn-gold").forEach(function(btn){
        btn.classList.add("magnetic");
        btn.addEventListener("mousemove", function(e){
          var rect = btn.getBoundingClientRect();
          var relX = (e.clientX - rect.left - rect.width / 2) * 0.25;
          var relY = (e.clientY - rect.top - rect.height / 2) * 0.35;
          btn.style.transform = "translate(" + relX + "px," + relY + "px)";
        });
        btn.addEventListener("mouseleave", function(){
          btn.style.transform = "";
        });
      });
    }

  });

  /* ---------- Utility: Debounce ---------- */
  function debounce(fn, wait){
    var t;
    return function(){
      clearTimeout(t);
      var args = arguments, ctx = this;
      t = setTimeout(function(){ fn.apply(ctx, args); }, wait);
    };
  }
})();
