// dom ready
// document.addEventListener("DOMContentLoaded", (event)=>{
//   setTimeout(()=>{
//     improve_my_erp();
//   }, 3000);
// });

$( document ).ready(function() {
  setTimeout(()=>{
    improve_my_erp();
  }, 300);
});
let improve_my_erp = () => {
  let user_info = frappe.user_info(frappe.session.user);

  // Create a container div instead of a button
  let improveDiv = document.createElement('div');
  improveDiv.classList = "improve-my-erp-banner";
  improveDiv.textContent = `👋 Welcome Back, ${user_info.fullname} !`;

  Object.assign(improveDiv.style, {
    background: "linear-gradient(90deg, #28a745, #218838)",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "14px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
    marginRight: "10px",
    transition: "transform 0.3s ease, background 0.4s ease",
    cursor: "pointer",
  });

  // Hover scale effect
  improveDiv.addEventListener("mouseenter", () => {
    improveDiv.style.transform = "scale(1.05)";
  });
  improveDiv.addEventListener("mouseleave", () => {
    improveDiv.style.transform = "scale(1)";
  });

  // Generate random dark color
  const getRandomDarkColor = () => {
    const r = Math.floor(Math.random() * 100);
    const g = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Change background on click
  improveDiv.addEventListener("click", () => {
    const darkColor = getRandomDarkColor();
    improveDiv.style.background = darkColor;
  });

  // Inject to DOM
  const target = document.querySelector(".form-inline.fill-width.justify-content-end");
  if (target) {
    target.prepend(improveDiv);
  }
};


// let improve_my_erp = () => {
//   let user_info = frappe.user_info(frappe.session.user);

//   // Create a container div instead of a button
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
//     transition: "transform 0.3s ease",
//     cursor: "pointer",
//   });

//   improveDiv.addEventListener("mouseenter", () => {
//     improveDiv.style.transform = "scale(1.05)";
//   });
//   improveDiv.addEventListener("mouseleave", () => {
//     improveDiv.style.transform = "scale(1)";
//   });

//   const target = document.querySelector(".form-inline.fill-width.justify-content-end");
//   if (target) {
//     target.prepend(improveDiv);
//   }
// };
