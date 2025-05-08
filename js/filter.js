let allUser = [];
let selectedType = 0;
let selectedProfession = "all";
let selectedIndustry = "all";
const memberGrid = document.querySelector(".member_custome_grid");
const searchInput = document.getElementById("search_input");

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://ridwan4d.github.io/ezway_api/ezway_api.json")
    .then((res) => res.json())
    .then((data) => {
      allUser = data;
      renderUsers(allUser);
    })
    .catch((err) => console.log("Fetch error:", err));
});

function renderUsers(users) {
  memberGrid.innerHTML = "";

  if (users.length === 0) {
    memberGrid.innerHTML = "<p>No members found.</p>";
    return;
  }

  const badgeMap = {
    0: "Free User",
    1: "Platinum",
    2: "Gold",
    3: "Silver",
    4: "VIP",
  };

  users.forEach((user) => {
    const badgeLabel = badgeMap[user.badge] || "Unknown";
    const roles = user.member_type;
    const formattedRoles = roles
      .split(",")
      .map((role) => role.charAt(0).toUpperCase() + role.slice(1))
      .join(" | ");

    memberGrid.innerHTML += `
        <div class="user_card">
          <div class="card_top d-flex">
            <div class="ct_left">
              <div>
                <img src="${user.image}" alt="user" class="user_img">
              </div>
              <div>
                <p class="user_name m-0">
                  ${user.first_name} ${user.last_name}
                </p>
                <p class="user_email m-0">${user.email}</p>
              </div>
            </div>
            <div class="ct_right">
              <div class="card_badge d-flex align-items-center gap-1">
                <img src="./image/streamline_star-badge.svg" alt="badge">
                <p class="badge_text m-0">${badgeLabel}</p>
              </div>
            </div>
          </div>
          <div class="card_bottom">
            <div class="cb_user_role mt-1">
              <p class="m-0 status_role">${
                formattedRoles || "No profession listed"
              }</p>
            </div>
            <div class="user_info_box d-flex align-items-center justify-content-between">
              <div class="user_follower">
                <p class="infoText fw-medium m-0">Followers</p>
                <p class="info_value fw-semibold m-0">${
                  user.followers || "N/A"
                }</p>
              </div>
              <div class="user_phone">
                <p class="infoText fw-medium m-0">Phone</p>
                <p class="info_value fw-semibold m-0">
                ${user.phone_number || "N/A"}
                </p>
              </div>
            </div>
            <div class="card_button_box d-flex justify-content-between align-items-center">
              <button class="view_profile_btn common_btn_style">View Profile</button>
              <button class="connect_btn common_btn_style">Connect</button>
            </div>
          </div>
        </div>
      `;
  });
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();

  const filteredUsers = allUser.filter((user) => {
    return (
      user.first_name.toLowerCase().includes(query) ||
      user.last_name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone?.toLowerCase().includes(query)
    );
  });

  renderUsers(filteredUsers);
});
