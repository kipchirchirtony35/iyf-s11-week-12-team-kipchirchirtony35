// Show/hide the sidebar on small screens
  function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("show");
  }

  // Highlight the clicked link and update the heading
  function selectLink(link) {
    // remove "active" class from all links
    var links = document.querySelectorAll(".sidebar a");
    for (var i = 0; i < links.length; i++) {
      links[i].classList.remove("active");
    }

    // add "active" class to the clicked link
    link.classList.add("active");

    // update the main heading text
    document.getElementById("pageTitle").innerText = link.innerText;
  }
