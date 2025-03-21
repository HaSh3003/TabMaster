let groups = JSON.parse(localStorage.getItem("tabGroups")) || {};

function addGroup() {
  const groupName = document.getElementById("groupName").value.trim();
  if (!groupName) return alert("يرجى إدخال اسم الجروب");
  if (groups[groupName]) return alert("هذا الجروب موجود بالفعل!");
  groups[groupName] = [];
  localStorage.setItem("tabGroups", JSON.stringify(groups));
  displayGroups();
  document.getElementById("groupName").value = "";
}

function openAddSiteModal(groupName) {
  document.getElementById("currentGroup").value = groupName;
  document.getElementById("siteName").value = "";
  document.getElementById("siteUrl").value = "";
  new bootstrap.Modal(document.getElementById("addSiteModal")).show();
}

function saveSite() {
  const groupName = document.getElementById("currentGroup").value;
  const siteName = document.getElementById("siteName").value.trim();
  const siteUrl = document.getElementById("siteUrl").value.trim();

  if (!siteName || !siteUrl || !isValidURL(siteUrl))
    return alert("يرجى إدخال اسم ورابط صحيحين");

  groups[groupName].push({ name: siteName, url: siteUrl });
  localStorage.setItem("tabGroups", JSON.stringify(groups));
  displayGroups();
  bootstrap.Modal.getInstance(document.getElementById("addSiteModal")).hide();
}

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

function displayGroups() {
  const container = document.getElementById("groupsContainer");
  container.innerHTML = "";
  for (let group in groups) {
    let div = document.createElement("div");
    div.classList.add("col-md-6", "mb-3");
    div.innerHTML = `
            <div class="card group-card shadow-sm">
                <div class="card-body text-center">
                    <h5 class="card-title">${group}</h5>
                    <button class="btn btn-success btn-sm me-2" onclick="openAddSiteModal('${group}')">
                        <i class="fa-solid fa-plus"></i> إضافة موقع
                    </button>
                    <button class="btn btn-primary btn-sm me-2" onclick="openTabs('${group}')">
                        <i class="fa-solid fa-rocket"></i> فتح التابات
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteGroup('${group}')">
                        <i class="fa-solid fa-trash"></i> حذف الجروب
                    </button>
                    <ul class="list-group mt-2">
                        ${groups[group]
                          .map(
                            (site, index) => `
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <a href="${site.url}" target="_blank">${site.name}</a>
                                <button class="btn btn-sm btn-danger" onclick="deleteSite('${group}', ${index})">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </li>`
                          )
                          .join("")}
                    </ul>
                </div>
            </div>
        `;
    container.appendChild(div);
  }
}

function openTabs(group) {
  if (!groups[group] || groups[group].length === 0) {
    Swal.fire({
      title: "لا يوجد مواقع في هذه المجموعه",
      text: "يجب عليك اولا اضافة مواقع الكترونية لفتحها اثناء تشغيل المجموعه!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "الغاء",
      confirmButtonText: "اضافة موقع جديد",
    }).then((result) => {
      if (result.isConfirmed) {
        openAddSiteModal(group);
      }
    });
    return;
  }

  groups[group].forEach((site) => {
    window.open(site, "_blank");
  });
}

function deleteGroup(group) {
  delete groups[group];
  localStorage.setItem("tabGroups", JSON.stringify(groups));
  displayGroups();
}

function deleteSite(group, index) {
  groups[group].splice(index, 1);
  localStorage.setItem("tabGroups", JSON.stringify(groups));
  displayGroups();
}

displayGroups();
