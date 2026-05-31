let editingMenuId = null;

function escapeMenuText(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showMenuToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) {
    alert(message);
    return;
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function itemAtAdminStall(item) {
  const stallId = getAdminStallId();
  return item.stalls && item.stalls.includes(stallId);
}

function loadMenuAdmin() {
  const container = document.getElementById("menuAdminList");
  if (!container) return;

  const stallId = getAdminStallId();
  const stallName = getAdminSession()?.stallName || `Stall ${stallId}`;
  const search = (document.getElementById("menuSearchAdmin")?.value || "").toLowerCase();
  const category = document.getElementById("menuCategoryFilter")?.value || "";

  const title = document.getElementById("menuAdminTitle");
  const desc = document.getElementById("menuAdminDesc");
  if (title) title.textContent = `${stallName} — Menu Management`;
  if (desc) desc.textContent = `View and manage menu items available at ${stallName} only.`;

  let items = getMenu().filter(item => itemAtAdminStall(item));

  items = items.filter(item => {
    const matchSearch = !search || item.name.toLowerCase().includes(search);
    const matchCategory = !category || item.category === category;
    return matchSearch && matchCategory;
  });

  const countLabel = document.getElementById("menuCountLabel");
  if (countLabel) {
    const total = getMenu().filter(item => itemAtAdminStall(item)).length;
    countLabel.textContent = `${total} item${total !== 1 ? "s" : ""} at ${stallName}${items.length !== total ? ` · Showing ${items.length}` : ""}`;
  }

  if (!items.length) {
    container.innerHTML = typeof emptyStateMessage === "function"
      ? emptyStateMessage(`No menu items found for ${stallName}.`)
      : `<p class='empty-message'>No menu items found for ${stallName}.</p>`;
    if (typeof renderIcons === "function") renderIcons(container);
    return;
  }

  container.innerHTML = `<div class="menu-admin-grid">${items.map(menuAdminCard).join("")}</div>`;
  if (typeof renderIcons === "function") renderIcons(container);
}

function menuAdminCard(item) {
  const popular = item.popular ? '<span class="popular-tag">Popular</span>' : "";
  const canDelete = item.stalls && item.stalls.length === 1;
  return `
    <article class="menu-admin-card">
      <div class="menu-admin-card-image">
        <img src="${escapeMenuText(item.img)}" alt="${escapeMenuText(item.name)}" onerror="this.style.display='none'">
      </div>
      <div class="menu-admin-card-body">
        <h3>${escapeMenuText(item.name)}</h3>
        <p class="menu-admin-card-meta">${escapeMenuText(item.category)}${popular}</p>
        <p class="menu-admin-card-price">₱${item.price}</p>
      </div>
      <div class="menu-admin-card-actions">
        <button type="button" class="btn-edit-menu" onclick="openMenuForm('${item.id}')">Edit</button>
        ${canDelete
          ? `<button type="button" class="btn-delete-menu" onclick="confirmDeleteMenuItem('${item.id}')">Delete</button>`
          : `<button type="button" class="btn-delete-menu" onclick="confirmDeleteMenuItem('${item.id}')">Remove from stall</button>`}
      </div>
    </article>
  `;
}

function openMenuForm(itemId = null) {
  editingMenuId = itemId;
  const modal = document.getElementById("menuFormModal");
  const title = document.getElementById("menuFormTitle");
  const form = document.getElementById("menuItemForm");
  const stallId = getAdminStallId();
  const stallName = getAdminSession()?.stallName || `Stall ${stallId}`;

  if (!modal || !form) return;

  form.reset();
  document.getElementById("menuItemPopular").checked = false;

  if (itemId) {
    const item = getMenuItem(itemId);
    if (!item || !itemAtAdminStall(item)) {
      showMenuToast("You can only edit items at your stall.", "warning");
      return;
    }
    title.textContent = `Edit Item — ${stallName}`;
    document.getElementById("menuItemName").value = item.name;
    document.getElementById("menuItemCategory").value = item.category;
    document.getElementById("menuItemPrice").value = item.price;
    document.getElementById("menuItemImg").value = item.img;
    document.getElementById("menuItemPopular").checked = !!item.popular;
  } else {
    title.textContent = `Add Item — ${stallName}`;
    document.getElementById("menuItemCategory").value = "Lunch";
    document.getElementById("menuItemImg").value = "../images/";
  }

  modal.style.display = "flex";
}

function closeMenuForm() {
  editingMenuId = null;
  const modal = document.getElementById("menuFormModal");
  if (modal) modal.style.display = "none";
}

function saveMenuItem(event) {
  event.preventDefault();

  const stallId = getAdminStallId();
  const name = document.getElementById("menuItemName").value.trim();
  const category = document.getElementById("menuItemCategory").value;
  const price = Number(document.getElementById("menuItemPrice").value);
  const img = document.getElementById("menuItemImg").value.trim();
  const popular = document.getElementById("menuItemPopular").checked;

  if (!name) {
    showMenuToast("Please enter an item name.", "warning");
    return;
  }

  if (!MENU_CATEGORIES.includes(category)) {
    showMenuToast("Please select a valid category.", "warning");
    return;
  }

  if (!price || price < 0) {
    showMenuToast("Please enter a valid price.", "warning");
    return;
  }

  let stalls = [stallId];
  if (editingMenuId) {
    const existing = getMenuItem(editingMenuId);
    if (!existing || !itemAtAdminStall(existing)) {
      showMenuToast("You can only edit items at your stall.", "warning");
      return;
    }
    stalls = existing.stalls || [stallId];
  }

  const wasEdit = !!editingMenuId;

  upsertMenuItem({
    id: editingMenuId || undefined,
    name,
    category,
    price,
    img: img || "../images/placeholder.png",
    popular,
    stalls
  });

  closeMenuForm();
  loadMenuAdmin();
  showMenuToast(wasEdit ? "Menu item updated." : "Menu item added.", "success");
}

function confirmDeleteMenuItem(id) {
  const item = getMenuItem(id);
  const stallId = getAdminStallId();
  if (!item || !itemAtAdminStall(item)) return;

  if (item.stalls.length > 1) {
    if (!confirm(`Remove "${item.name}" from your stall only? It will remain at other stalls.`)) return;
    upsertMenuItem({
      ...item,
      stalls: item.stalls.filter(s => s !== stallId)
    });
    loadMenuAdmin();
    showMenuToast(`${item.name} removed from your stall.`, "warning");
    return;
  }

  if (!confirm(`Delete "${item.name}" from the menu?`)) return;

  deleteMenuItem(id);
  loadMenuAdmin();
  showMenuToast(`${item.name} removed from menu.`, "warning");
}

function clearMenuFilters() {
  const search = document.getElementById("menuSearchAdmin");
  const category = document.getElementById("menuCategoryFilter");
  if (search) search.value = "";
  if (category) category.value = "";
  loadMenuAdmin();
}
