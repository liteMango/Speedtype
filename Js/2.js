 // Initial target date (default to 30 minutes from now)
 let targetDate = new Date();

 // Track current timer settings
 let currentTimeValue = 30;
 let currentTimeUnit = "minutes";

 // Timer interval reference for clearing/resetting
 let countdownTimer;

 function setCountdownTime(timeValue, timeUnit, buttonElement = null) {
   // Update current timer tracking
   currentTimeValue = timeValue;
   currentTimeUnit = timeUnit;

   // Update active button
   if (buttonElement) {
     // Remove active class from all buttons
     document.querySelectorAll(".controls button").forEach((btn) => {
       btn.classList.remove("active");
     });

     // Add active class to the clicked button
     buttonElement.classList.add("active");
   }

   // Clear existing interval if any
   if (countdownTimer) {
     clearInterval(countdownTimer);
   }

   // Set new target date based on timeValue and timeUnit
   const now = new Date();
   targetDate = new Date(now);

   if (timeUnit === "seconds") {
     targetDate.setSeconds(targetDate.getSeconds() + timeValue);
   } else if (timeUnit === "minutes") {
     targetDate.setMinutes(targetDate.getMinutes() + timeValue);
   } else if (timeUnit === "hours") {
     targetDate.setHours(targetDate.getHours() + timeValue);
   }

   // Update display immediately
   updateAllSegments();

   // Start the countdown
   countdownTimer = setInterval(() => {
     const isComplete = updateAllSegments();

     if (isComplete) {
       clearInterval(countdownTimer);
     }
   }, 1000);

   console.log(
     `Timer set to ${timeValue} ${timeUnit}. New target:,
     targetDate`
   );
 }

 function resetCurrentTimer() {
   // Reset to the currently active timer settings
   setCountdownTime(currentTimeValue, currentTimeUnit);
   console.log(`Timer reset to ${currentTimeValue} ${currentTimeUnit}`);
 }

 function getTimeSegmentElements(segmentElement) {
   const segmentDisplay = segmentElement.querySelector(".segment-display");
   const segmentDisplayTop = segmentDisplay.querySelector(
     ".segment-display__top"
   );
   const segmentDisplayBottom = segmentDisplay.querySelector(
     ".segment-display__bottom"
   );

   const segmentOverlay = segmentDisplay.querySelector(".segment-overlay");
   const segmentOverlayTop = segmentOverlay.querySelector(
     ".segment-overlay__top"
   );
   const segmentOverlayBottom = segmentOverlay.querySelector(
     ".segment-overlay__bottom"
   );

   return {
     segmentDisplayTop,
     segmentDisplayBottom,
     segmentOverlay,
     segmentOverlayTop,
     segmentOverlayBottom,
   };
 }

 function updateSegmentValues(displayElement, overlayElement, value) {
   displayElement.textContent = value;
   overlayElement.textContent = value;
 }

 function updateTimeSegment(segmentElement, timeValue) {
   const segmentElements = getTimeSegmentElements(segmentElement);

   if (
     parseInt(segmentElements.segmentDisplayTop.textContent, 10) ===
     timeValue
   ) {
     return;
   }

   segmentElements.segmentOverlay.classList.add("flip");

   updateSegmentValues(
     segmentElements.segmentDisplayTop,
     segmentElements.segmentOverlayBottom,
     timeValue
   );

   function finishAnimation() {
     segmentElements.segmentOverlay.classList.remove("flip");
     updateSegmentValues(
       segmentElements.segmentDisplayBottom,
       segmentElements.segmentOverlayTop,
       timeValue
     );

     this.removeEventListener("animationend", finishAnimation);
   }

   segmentElements.segmentOverlay.addEventListener(
     "animationend",
     finishAnimation
   );
 }

 function updateTimeSection(sectionID, timeValue) {
   const firstNumber = Math.floor(timeValue / 10) || 0;
   const secondNumber = timeValue % 10 || 0;
   const sectionElement = document.getElementById(sectionID);
   const timeSegments = sectionElement.querySelectorAll(".time-segment");

   updateTimeSegment(timeSegments[0], firstNumber);
   updateTimeSegment(timeSegments[1], secondNumber);
 }

 function getTimeRemaining(targetDateTime) {
   const nowTime = Date.now();
   const complete = nowTime >= targetDateTime;

   if (complete) {
     return {
       complete,
       seconds: 0,
       minutes: 0,
       hours: 0,
     };
   }

   const secondsRemaining = Math.floor((targetDateTime - nowTime) / 1000);
   const hours = Math.floor(secondsRemaining / 60 / 60);
   const minutes = Math.floor(secondsRemaining / 60) - hours * 60;
   const seconds = secondsRemaining % 60;

   return {
     complete,
     seconds,
     minutes,
     hours,
   };
 }

 function updateAllSegments() {
   const timeRemainingBits = getTimeRemaining(
     new Date(targetDate).getTime()
   );

   updateTimeSection("seconds", timeRemainingBits.seconds);
   updateTimeSection("minutes", timeRemainingBits.minutes);

   return timeRemainingBits.complete;
 }

 // Add event listeners to all time preset buttons
 document.querySelectorAll(".controls button").forEach((button) => {
   button.addEventListener("click", function () {
     const timeValue = parseInt(this.getAttribute("data-time"), 10);
     const timeUnit = this.getAttribute("data-unit");
     setCountdownTime(timeValue, timeUnit, this);
   });
 });

 // Add event listener to reset button
 document
   .getElementById("resetButton")
   .addEventListener("click", resetCurrentTimer);

 // Initialize with default time (30 minutes)
 setCountdownTime(30, "minutes");