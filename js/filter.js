let allUser = [];
let selectedType = "all";
let selectedProfessions = [];
let selectedIndustries = [];
let currentPage = 1;
let usersPerPage = 10;
let filteredUsers = [];

const memberGrid = document.querySelector(".member_custom_grid");
const searchInput = document.getElementById("search_input");
const memberTypeForm = document.getElementById("memberTypeForm");
const professionCheckboxes = document.querySelectorAll(
  '#professionForm input[type="checkbox"]'
);
const industryCheckboxes = document.querySelectorAll(
  '#industryForm input[type="checkbox"]'
);
const paginationContainer = document.querySelector(".pagination_container");

// Pagination info elements
const startRangeElement = document.getElementById("startRange");
const endRangeElement = document.getElementById("endRange");
const totalUsersElement = document.getElementById("totalUsers");

document.addEventListener("DOMContentLoaded", () => {
  fetch("https://ridwan4d.github.io/ezway_api/ezway_api.json")
    .then((res) => res.json())
    .then((data) => {
      allUser = data;
      filteredUsers = allUser;
      renderUsers(getPaginatedUsers());
      setupPagination();
    })
    .catch((err) => console.log("Fetch error:", err));
});

function getPaginatedUsers() {
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  return filteredUsers.slice(startIndex, endIndex);
}

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
            <div><img src="${user.image}" alt="user" class="user_img"></div>
            <div>
              <p class="user_name m-0">${user.first_name} ${user.last_name}</p>
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
              <p class="info_value fw-semibold m-0">${
                user.phone_number || "N/A"
              }</p>
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

  // Update pagination info text using the existing HTML elements
  const startRange =
    filteredUsers.length > 0 ? (currentPage - 1) * usersPerPage + 1 : 0;
  const endRange = Math.min(currentPage * usersPerPage, filteredUsers.length);
  const totalUsers = filteredUsers.length;

  startRangeElement.textContent = startRange;
  endRangeElement.textContent = endRange;
  totalUsersElement.textContent = totalUsers;
}

function setupPagination() {
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  // Get pagination container elements
  const paginationNumbers = document.querySelector(".pagination_numbers");
  const prevButton = document.querySelector(".pagination_prev");
  const nextButton = document.querySelector(".pagination_next");

  // Clear existing page numbers
  paginationNumbers.innerHTML = "";

  if (totalPages <= 1) {
    // Hide pagination if only one page
    paginationContainer.style.display = "none";
    return;
  } else {
    paginationContainer.style.display = "flex";
  }

  // Determine which page numbers to show
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  // Adjust if we're near the end
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  // Create page number links
  for (let i = startPage; i <= endPage; i++) {
    const pageLink = document.createElement("a");
    pageLink.href = "#";
    pageLink.className = `pagination_link pagination_number ${
      i === currentPage ? "pagination_active" : ""
    }`;
    pageLink.textContent = i;
    pageLink.addEventListener("click", (e) => {
      e.preventDefault();
      goToPage(i);
    });
    paginationNumbers.appendChild(pageLink);
  }

  // Update event listeners for prev/next buttons
  prevButton.onclick = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  nextButton.onclick = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  // Disable/enable back button based on current page
  if (currentPage === 1) {
    prevButton.classList.add("disabled");
  } else {
    prevButton.classList.remove("disabled");
  }

  // Disable/enable next button based on current page
  if (currentPage === totalPages) {
    nextButton.classList.add("disabled");
  } else {
    nextButton.classList.remove("disabled");
  }
}

function goToPage(pageNumber) {
  currentPage = pageNumber;
  renderUsers(getPaginatedUsers());
  setupPagination();
  window.scrollTo(0, 0);
}

function applyFilters() {
  currentPage = 1; // Reset to first page when filters change
  filteredUsers = allUser;

  // Normalize selected profession and industry values by replacing spaces with "-" (or "_" as needed)
  const normalizedSelectedProfessions = selectedProfessions.map((profession) =>
    profession.replace(/\s+/g, "-").toLowerCase()
  );

  const normalizedSelectedIndustries = selectedIndustries.map((industry) =>
    industry.replace(/\s+/g, "-").toLowerCase()
  );

  if (selectedType !== "all") {
    filteredUsers = filteredUsers.filter((user) => user.badge == selectedType);
  }

  // Filter based on selected professions
  if (normalizedSelectedProfessions.length > 0) {
    filteredUsers = filteredUsers.filter((user) => {
      const roles = user.member_type.toLowerCase().split(",");
      return normalizedSelectedProfessions.some((p) =>
        roles.some((role) =>
          role.replace(/\s+/g, "-").toLowerCase().includes(p)
        )
      );
    });
  }

  // Filter based on selected industries
  if (normalizedSelectedIndustries.length > 0) {
    filteredUsers = filteredUsers.filter((user) => {
      const userIndustry = user.member_type.toLowerCase().split(",");
      return normalizedSelectedIndustries.some((industry) =>
        userIndustry.some((role) =>
          role.replace(/\s+/g, "-").toLowerCase().includes(industry)
        )
      );
    });
  }

  // Finally, render the filtered users with pagination
  renderUsers(getPaginatedUsers());
  setupPagination();
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  currentPage = 1; // Reset to first page when searching

  filteredUsers = allUser.filter((user) => {
    return (
      user.first_name.toLowerCase().includes(query) ||
      user.last_name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.phone?.toLowerCase().includes(query)
    );
  });

  renderUsers(getPaginatedUsers());
  setupPagination();
});

memberTypeForm.addEventListener("change", () => {
  selectedType = memberTypeForm.memberType.value;
  applyFilters();
});

professionCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    selectedProfessions = Array.from(professionCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.id.toLowerCase());
    console.log("Selected Professions:", selectedProfessions); // Debugging line
    applyFilters();
  });
});

industryCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    selectedIndustries = Array.from(industryCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.id.toLowerCase());
    console.log("Selected Industries:", selectedIndustries); // Debugging line
    applyFilters();
  });
});
