let data; // Declare a global variable to store the fetched data
// Add these variables to track search state
let searchQuery = "";
// Get the selected property for filtering
const propertySelect = document.getElementById("propertySelect");
var property = propertySelect.value;
propertySelect.addEventListener("change", function () {
  property = propertySelect.value;
});

// Fetch data from the API endpoint
fetch(
  "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
)
  .then((response) => response.json())
  .then((fetchedData) => {
    // Store the fetched data globally
    data = fetchedData;

    // Process the data and populate the table
    populateTable(property);
  })
  .catch((error) => console.error("Error fetching data:", error));

function handleKeyPress(event) {
  if (event.key === "Enter") {
    search();
  }
}
// Function to perform search
function search() {
  // Get the search input value
  const searchInput = document.getElementById("searchInput");
  searchQuery = searchInput.value.toLowerCase();

  // Repopulate the table with the search results
  populateTable(property);
}

// Function to filter data based on search query
function filterData(data) {
  return data.filter((user) =>
    user[property].toLowerCase().includes(searchQuery)
  );
  // return data.filter((user) => user.name.toLowerCase().includes(searchQuery));
}

// Function to populate the table with data
// function populateTable() {
//   // Get the table body element
//   const tableBody = document.getElementById("tableBody");

//   // Clear existing rows
//   tableBody.innerHTML = "";

//   // Apply search filter to the data
//   const filteredData = filterData(data);

//   // Calculate total pages based on the number of items and items per page
//   totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   // Update pagination buttons
//   updatePagination();

//   // Display only items for the current page
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentPageData = filteredData.slice(startIndex, endIndex);

//   // Loop through the data and create table rows for the current page
//   currentPageData.forEach((user) => {
//     const row = document.createElement("div");
//     row.classList.add("table-row");
//     row.setAttribute("data-id", user.id);
//     row.innerHTML = `
//         <div><input type="checkbox" data-id="${user.id}"></div>
//         <div style="overflow:auto">${user.name}</div>
//         <div style="overflow:hidden">${user.email}</div>
//         <div>${user.role}</div>
//         <div>
//           <button class="edit" onclick="editRow(${user.id})"><img src="https://cdn-icons-png.flaticon.com/128/13169/13169974.png" style="width: 1rem;" alt=""></button>
//           <button class="delete" onclick="deleteRow(${user.id})"><img src="https://cdn-icons-png.flaticon.com/128/12225/12225511.png" style="width: 1rem;" alt=""></button>
//         </div>
//       `;
//     tableBody.appendChild(row);
//   });
// }
function populateTable(property) {
  // Get the table body element
  const tableBody = document.getElementById("tableBody");

  // Clear existing rows
  tableBody.innerHTML = "";

  // Apply search filter to the data based on the selected property
  const filteredData = filterData(data, property);

  // Calculate total pages based on the number of items and items per page
  totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Update pagination buttons
  updatePagination();

  // Display only items for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  // Loop through the data and create table rows for the current page
  currentPageData.forEach((user) => {
    const row = document.createElement("div");
    row.classList.add("table-row");
    row.setAttribute("data-id", user.id);
    row.innerHTML = `
        <div><input type="checkbox" data-id="${user.id}"></div>
        <div style="overflow:auto">${user.name}</div>
        <div style="overflow:hidden">${user.email}</div>
        <div>${user.role}</div>
        <div>
          <button class="edit" onclick="editRow(${user.id})"><img src="https://cdn-icons-png.flaticon.com/128/13169/13169974.png" style="width: 1rem;" alt=""></button>
          <button class="delete" onclick="deleteRow(${user.id})"><img src="https://cdn-icons-png.flaticon.com/128/12225/12225511.png" style="width: 1rem;" alt=""></button>
        </div>
      `;
    tableBody.appendChild(row);
  });
}

// Variables to track pagination state
const itemsPerPage = 10;
let currentPage = 1;
let totalPages;

// Function to update pagination buttons
function updatePagination() {
  // Update current page display
  document.getElementById("currentPage").innerText = currentPage;
  document.getElementById(
    "paginationText"
  ).innerText = `Showing Page ${currentPage} out of ${totalPages}`;

  // Enable/disable pagination buttons based on current page
  document.querySelector(".first-page").disabled = currentPage === 1;
  document.querySelector(".previous-page").disabled = currentPage === 1;
  document.querySelector(".next-page").disabled = currentPage === totalPages;
  document.querySelector(".last-page").disabled = currentPage === totalPages;
}

// Function to navigate to the next page
function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    populateTable(property);
  }
}

// Function to navigate to the previous page
function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    populateTable();
  }
}

// Function to go to a specific page
function goToPage(pageNumber) {
  if (pageNumber >= 1 && pageNumber <= totalPages) {
    currentPage = pageNumber;
    populateTable();
  }
}

function editRow(id) {
  console.log(data);
  // Find the editable cells for name and email
  const nameCell = document.querySelector(
    `.table-row[data-id="${id}"] > div:nth-child(2)`
  );
  const emailCell = document.querySelector(
    `.table-row[data-id="${id}"] > div:nth-child(3)`
  );
  const roleCell = document.querySelector(
    `table.row[data-id="${id}] > div:nth-child(4)`
  );

  // Add the 'editing-row' class to highlight the editing row
  const editingRow = document.querySelector(`.table-row[data-id="${id}"]`);
  editingRow.classList.add("editing-row");

  // Make the cells contenteditable
  nameCell.contentEditable = true;
  emailCell.contentEditable = true;

  // Listen for focusout event to save changes
  // Listen for focusout event to save changes
  function saveChanges() {
    // Find the index of the user in the data array
    const indexToUpdate = data.findIndex((user) => user.id == id);

    // Check if the user is found
    if (indexToUpdate !== -1) {
      // Update the data array with the new name and email
      data[indexToUpdate].name = nameCell.innerText;
      data[indexToUpdate].email = emailCell.innerText;

      // Remove the event listener after saving changes
      nameCell.removeEventListener("focusout", saveChanges);
      emailCell.removeEventListener("focusout", saveChanges);
    } else {
      console.error("User not found in the data array.");
    }

    // Reset contenteditable property
    nameCell.contentEditable = false;
    emailCell.contentEditable = false;

    // Remove the 'editing-row' class to remove the highlight
    editingRow.classList.remove("editing-row");

    // setTimeout(() => {
    //   saveChangesDelayed();
    // }, 60000);

    alert("Changes Saved");
  }

  console.log("after" + data);
  // Attach focusout event listeners
  nameCell.addEventListener("focusout", saveChanges);
  emailCell.addEventListener("focusout", saveChanges);
}

// Function to delete a row
// Function to delete a row
function deleteRow(id) {
  const indexToDelete = data.findIndex((user) => user.id == id);

  if (indexToDelete !== -1) {
    // Remove the row from the data array
    data.splice(indexToDelete, 1);

    // Repopulate the table
    populateTable();
  } else {
    console.error("User not found in the data array.");
  }

  data = data.filter((user) => user.id !== id);
  populateTable(property);
}

// Function to toggle select/deselect all rows on the current page
function toggleSelectAll() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = !checkbox.checked;
  });
  document.getElementById("deleteAll").style.display = "block";
}

// Function to delete selected rows
function deleteSelected() {
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  checkboxes.forEach((checkbox) => {
    const id = checkbox.getAttribute("data-id");
    deleteRow(id);
  });
  document.getElementById("deleteAll").style.display = "none";

  populateTable(property);
}

// ... (existing code)
