const ADMIN_SESSION_KEY = "nubite_admin";

const STALL_ADMIN_ACCOUNTS = {
  canteen_admin01: { password: "admin01", stall: 1 },
  canteen_admin02: { password: "admin02", stall: 2 },
  canteen_admin03: { password: "admin03", stall: 3 }
};

function authenticateStallAdmin(username, password) {
  const account = STALL_ADMIN_ACCOUNTS[username];
  if (!account || account.password !== password) return null;

  return {
    username,
    stall: account.stall,
    stallName: typeof getStallName === "function" ? getStallName(account.stall) : `Stall ${account.stall}`
  };
}

function setAdminSession(session) {
  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

function getAdminSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem(ADMIN_SESSION_KEY));
    if (!session || !session.stall) return null;
    return session;
  } catch {
    return null;
  }
}

function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

function requireAdminAuth() {
  const session = getAdminSession();
  if (!session) {
    window.location.href = "../login/login.html";
    return null;
  }
  return session;
}

function getAdminStallId() {
  const session = getAdminSession();
  return session ? Number(session.stall) : null;
}

function orderBelongsToStall(order, stallId) {
  if (!order || stallId == null) return false;
  return Number(order.stall) === Number(stallId);
}

function filterOrdersForAdmin(orders) {
  const stallId = getAdminStallId();
  if (!stallId) return [];
  return orders.filter(order => orderBelongsToStall(order, stallId));
}
