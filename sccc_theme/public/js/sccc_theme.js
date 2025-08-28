// // dom ready
// // document.addEventListener("DOMContentLoaded", (event)=>{
// //   setTimeout(()=>{
// //     improve_my_erp();
// //   }, 3000);
// // });

// $( document ).ready(function() {
//   setTimeout(()=>{
//     improve_my_erp();
//   }, 300);
// });

// let improve_my_erp = () => {
//   let user_info = frappe.user_info(frappe.session.user);

//   // Create the welcome banner
//   let improveDiv = document.createElement('div');
//   improveDiv.classList = "improve-my-erp-banner";
//   improveDiv.textContent = `👋 Welcome Back, ${user_info.fullname} !`;

//   Object.assign(improveDiv.style, {
//     background: "linear-gradient(90deg, #28a745, #218838)",
//     color: "#fff",
//     padding: "8px 16px",
//     borderRadius: "8px",
//     fontWeight: "bold",
//     fontSize: "14px",
//     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
//     marginRight: "10px",
//     transition: "transform 0.3s ease, background 0.4s ease",
//     cursor: "pointer",
//   });

//   // Hover effects
//   improveDiv.addEventListener("mouseenter", () => {
//     improveDiv.style.transform = "scale(1.05)";
//   });
//   improveDiv.addEventListener("mouseleave", () => {
//     improveDiv.style.transform = "scale(1)";
//   });

//   // Random dark color background on click
//   const getRandomDarkColor = () => {
//     const r = Math.floor(Math.random() * 100);
//     const g = Math.floor(Math.random() * 100);
//     const b = Math.floor(Math.random() * 100);
//     return `rgb(${r}, ${g}, ${b})`;
//   };

//   improveDiv.addEventListener("click", () => {
//     improveDiv.style.background = getRandomDarkColor();
//   });

//   // Create the time display div
//   let timeDiv = document.createElement("div");
//   timeDiv.classList = "current-time-banner";

//   Object.assign(timeDiv.style, {
//     background: "#343a40",
//     color: "#fff",
//     padding: "8px 16px",
//     borderRadius: "8px",
//     fontWeight: "bold",
//     fontSize: "14px",
//     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
//     marginRight: "10px",
//     marginTop: "5px",
//   });

//   const updateTime = () => {
//     const now = new Date();
//     const timeString = now.toLocaleTimeString('en-GB'); // HH:MM:SS
//     timeDiv.textContent = `${timeString}`;
//   };

//   updateTime(); // initial
//   setInterval(updateTime, 1000); // update every second

//   // Inject to DOM
//   const target = document.querySelector(".form-inline.fill-width.justify-content-end");
//   if (target) {
//     target.prepend(improveDiv);
//     target.insertBefore(timeDiv, improveDiv.nextSibling);
//   }
// };


// // let improve_my_erp = () => {
// //   let user_info = frappe.user_info(frappe.session.user);

// //   // Create a container div instead of a button
// //   let improveDiv = document.createElement('div');
// //   improveDiv.classList = "improve-my-erp-banner";
// //   improveDiv.textContent = `👋 Welcome Back, ${user_info.fullname} !`;

// //   Object.assign(improveDiv.style, {
// //     background: "linear-gradient(90deg, #28a745, #218838)",
// //     color: "#fff",
// //     padding: "8px 16px",
// //     borderRadius: "8px",
// //     fontWeight: "bold",
// //     fontSize: "14px",
// //     boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
// //     marginRight: "10px",
// //     transition: "transform 0.3s ease",
// //     cursor: "pointer",
// //   });

// //   improveDiv.addEventListener("mouseenter", () => {
// //     improveDiv.style.transform = "scale(1.05)";
// //   });
// //   improveDiv.addEventListener("mouseleave", () => {
// //     improveDiv.style.transform = "scale(1)";
// //   });

// //   const target = document.querySelector(".form-inline.fill-width.justify-content-end");
// //   if (target) {
// //     target.prepend(improveDiv);
// //   }
// // };
