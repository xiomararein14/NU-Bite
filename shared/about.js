function mountAboutPage(elementId) {
  const el = document.getElementById(elementId);
  if (!el || el.dataset.mounted === "true") return;

  el.innerHTML = `
    <div class="about-page">
      <div class="about-hero">
        <h1>About & Problem Background</h1>
        <p>Learn how NU Bite improves campus dining through digital pre-ordering.</p>
      </div>

      <article class="about-card">
        <h2>About NU Bite</h2>
        <p>NU Bite is a web-based canteen food ordering system designed to make food purchasing within the campus faster, more organized, and more convenient. The platform enables students and guests to browse menu items, view prices, place orders in advance through the cart and checkout flow, and track order status in real time. Additionally, the system provides an admin dashboard that allows canteen staff to monitor incoming orders and update order statuses efficiently. Through digitalization, NU Bite aims to improve the overall campus dining experience while reducing delays and congestion in canteen operations.</p>
      </article>

      <article class="about-card">
        <h2>Problem Background</h2>
        <p>Campus canteens frequently experience long queues and delays during peak hours, particularly during breaks and lunchtime. The traditional manual food-ordering process often leads to overcrowding, inefficient service, and longer waiting times for students. As a result, students may spend a significant portion of their break time waiting in line and may even arrive late to their next classes. At the same time, canteen staff face challenges in handling multiple orders simultaneously, which can affect service quality and operational efficiency. These issues negatively impact the overall dining experience within the campus.</p>
        <p>To address these challenges, NU Bite introduces a digital pre-ordering system that allows students to place orders ahead of time and receive updates on their order status. By streamlining the ordering and pickup process, the system helps reduce waiting times, minimize overcrowding, and improve the efficiency of canteen operations.</p>
      </article>

      <article class="about-card">
        <h2>Sustainable Development Goals (SDGs)</h2>
        <p>NU Bite supports Sustainable Development Goal (SDG) 9: Industry, Innovation, and Infrastructure by utilizing digital technology to modernize traditional canteen operations and promote innovative solutions within educational institutions. The system also contributes to SDG 11: Sustainable Cities and Communities by helping create a more organized, efficient, and accessible campus environment through reduced congestion and improved service management. By integrating technology into everyday campus activities, NU Bite promotes smarter and more sustainable community practices.</p>
        <div class="sdg-grid">
          <div class="sdg-item">
            <strong>SDG 9 — Industry, Innovation & Infrastructure</strong>
            <p>Digital technology modernizes traditional canteen operations and promotes innovative solutions within educational institutions.</p>
          </div>
          <div class="sdg-item">
            <strong>SDG 11 — Sustainable Cities & Communities</strong>
            <p>A more organized, efficient, and accessible campus environment through reduced congestion and improved service management.</p>
          </div>
        </div>
      </article>
    </div>
  `;

  el.dataset.mounted = "true";
}

document.addEventListener("DOMContentLoaded", () => {
  mountAboutPage("aboutMount");
});
