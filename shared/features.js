function mountFeaturesPage(elementId) {
  const el = document.getElementById(elementId);
  if (!el || el.dataset.mounted === "true") return;

  el.innerHTML = `
    <div class="about-page">
      <div class="about-hero">
        <h1>Features / Solution</h1>
        <p>How NU Bite addresses long queues and inefficient ordering at the NU Manila Campus canteen.</p>
      </div>

      <article class="about-card">
        <h2>Key Features</h2>
        <p>NU Bite is a web-based pre-ordering system with separate experiences for students, guests, and stall administrators. The features below match what is available in this application.</p>

        <ol class="feature-list">
          <li class="feature-item">
            <span class="feature-num">1</span>
            <div>
              <h3>Login Page & Roles</h3>
              <p>The login page is the entry point for the system. <strong>Students</strong> sign in with their credentials to open the student dashboard. <strong>Stall admins</strong> sign in with their stall account and are taken to that stall’s dashboard only. Anyone can choose <strong>Continue as Guest</strong> to order without an account.</p>
            </div>
          </li>
          <li class="feature-item">
            <span class="feature-num">2</span>
            <div>
              <h3>Student Dashboard</h3>
              <p>After login, students use the sidebar to open <strong>Menu Dashboard</strong>, <strong>Track Order</strong>, <strong>About</strong>, <strong>Features / Solution</strong>, and <strong>Feedback</strong>. The menu hero shows <strong>NU Manila Campus</strong> and <strong>Fast Pickup</strong>. Students can log out to return to the login page.</p>
            </div>
          </li>
          <li class="feature-item">
            <span class="feature-num">3</span>
            <div>
              <h3>Guest Mode</h3>
              <p>Guests get the same menu, tracking, about, features, and feedback pages as students, labeled <strong>Guest Mode</strong> with a <strong>Leave</strong> button instead of logout. Checkout uses <strong>Cash on Pickup</strong> only—pay at the canteen when collecting the order. No sign-up is required.</p>
            </div>
          </li>
          <li class="feature-item">
            <span class="feature-num">4</span>
            <div>
              <h3>Three-Stall Menu Browsing</h3>
              <p>The canteen has <strong>Stall 1</strong>, <strong>Stall 2</strong>, and <strong>Stall 3</strong>. Users pick a stall first, then browse that stall’s menu. Items are grouped by <strong>Breakfast</strong>, <strong>Lunch</strong>, and <strong>Drinks</strong> (with an <strong>All</strong> view). Each card shows the dish image, name, category, price, and a <strong>Popular</strong> tag when applicable. A search bar filters items by name. Switching stalls with items in the cart prompts to clear the cart—each order must come from one stall only.</p>
            </div>
          </li>
          <li class="feature-item">
            <span class="feature-num">5</span>
            <div>
              <h3>Cart & Pre-Ordering</h3>
              <p>Users add items to the cart, adjust quantities, and see the cart total and which stall they are ordering from. <strong>Proceed to Checkout</strong> opens payment: students choose <strong>Cash on Pickup</strong>, <strong>GCash QR Code</strong>, <strong>GCash Number Transfer</strong>, or <strong>Instapay Transfer</strong> (with on-screen payment details where applicable). Guests confirm checkout with cash on pickup. Placing an order saves it so staff can prepare it before the customer arrives, reducing time spent in line.</p>
            </div>
          </li>
          <li class="feature-item">
            <span class="feature-num">6</span>
            <div>
              <h3>Order Tracking</h3>
              <p>On <strong>Track Order</strong>, users enter an order ID or select from their orders. A progress view shows <strong>Order Placed</strong>, <strong>Payment</strong>, <strong>Preparing</strong>, and <strong>Ready to Pick Up</strong>. The current status and payment method are displayed. When stall staff update the order on their dashboard, the tracking view reflects the new status (including <strong>Picked Up</strong> when complete).</p>
            </div>
          </li>
          <li class="feature-item">
            <span class="feature-num">7</span>
            <div>
              <h3>Customer Feedback</h3>
              <p>Students and guests rate <strong>Service</strong>, <strong>Food Quality</strong>, <strong>NU Bite System</strong>, and <strong>Ambiance</strong> (1–5 stars each), add written comments, and optionally leave a name. Recent submissions appear below the form. Stall admins open the <strong>Feedback</strong> tab to see all submissions, search by name or message, and filter by date or role (<strong>Student</strong> / <strong>Guest</strong>).</p>
            </div>
          </li>
          <li class="feature-item">
            <span class="feature-num">8</span>
            <div>
              <h3>Stall Admin Dashboard</h3>
              <p>Each stall admin sees their stall name on the dashboard and can use: <strong>Pending Orders</strong>, <strong>Completed Orders</strong>, <strong>Menu Management</strong>, <strong>Sales & Reports</strong>, <strong>Feedback</strong>, <strong>About</strong>, and <strong>Features / Solution</strong>. Only orders and data for that logged-in stall are shown—other stalls’ orders are hidden.</p>
            </div>
          </li>
          <li class="feature-item">
            <span class="feature-num">9</span>
            <div>
              <h3>Order Management (Admin)</h3>
              <p><strong>Pending Orders</strong> lists every order for the stall that is not yet <strong>Picked Up</strong>. <strong>Completed Orders</strong> lists orders marked <strong>Picked Up</strong>. Admins can search by order ID and filter by date. For active orders, staff set status to <strong>Preparing</strong>, <strong>Ready to Pick Up</strong> (Ready button), or <strong>Picked Up</strong>. Each card shows order ID, date, time, customer role (Student/Guest), payment method, total, and line items.</p>
            </div>
          </li>
          <li class="feature-item">
            <span class="feature-num">10</span>
            <div>
              <h3>Menu Management & Sales Reports (Admin)</h3>
              <p><strong>Menu Management</strong> lets the stall admin add items, edit name/category/price/image/popular flag, or delete items that belong only to their stall. Search and category filters help find items. Updates are stored in the browser and reflected on student and guest menus when they reload or have the page open.</p>
              <p style="margin-top: 10px;"><strong>Sales & Reports</strong> shows menu item count, pending and completed order counts, today’s sales, total sales, top-selling items, and recent completed orders—all for that stall only.</p>
            </div>
          </li>
        </ol>
      </article>

      <article class="about-card">
        <h2>System Flow</h2>
        <p><strong>Student / guest ordering</strong></p>
        <div class="flow-steps">
          <span class="flow-step">Login or Guest</span>
          <span class="flow-arrow">→</span>
          <span class="flow-step">Choose Stall</span>
          <span class="flow-arrow">→</span>
          <span class="flow-step">Browse & Search Menu</span>
          <span class="flow-arrow">→</span>
          <span class="flow-step">Add to Cart</span>
          <span class="flow-arrow">→</span>
          <span class="flow-step">Checkout & Pay</span>
          <span class="flow-arrow">→</span>
          <span class="flow-step">Track Order</span>
          <span class="flow-arrow">→</span>
          <span class="flow-step">Pick Up at Canteen</span>
        </div>
        <p class="flow-note">One stall per order. Guests pay cash when picking up. Students may use cash on pickup, GCash, or Instapay as selected at checkout.</p>

        <p style="margin-top: 18px;"><strong>Stall admin operations</strong></p>
        <div class="flow-steps">
          <span class="flow-step">Stall Login</span>
          <span class="flow-arrow">→</span>
          <span class="flow-step">Pending / Completed Orders</span>
          <span class="flow-arrow">→</span>
          <span class="flow-step">Update Status</span>
          <span class="flow-arrow">→</span>
          <span class="flow-step">Menu Management</span>
          <span class="flow-arrow">→</span>
          <span class="flow-step">Sales & Reports</span>
        </div>
        <p class="flow-note">Each stall account (<strong>canteen_admin01</strong>–<strong>03</strong>) only manages its own stall. Feedback and informational pages (About, Features / Solution) are available on all roles.</p>
      </article>

      <article class="about-card">
        <h2>Proposed Solution</h2>
        <p>NU Bite digitizes campus canteen ordering at NU Manila Campus: students and guests pre-order from one of three stalls, pay using the options available to their role, and track preparation status; each stall’s staff manage incoming orders, update statuses, maintain that stall’s menu, and review sales and feedback from a dedicated dashboard. Together, these features target shorter wait times, less crowding at peak hours, and a clearer experience for both customers and canteen personnel.</p>
      </article>
    </div>
  `;

  el.dataset.mounted = "true";
}

document.addEventListener("DOMContentLoaded", () => {
  mountFeaturesPage("featuresMount");
});
