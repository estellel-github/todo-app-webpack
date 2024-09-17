function storeToLocal(allProjects) {
  const taskCatalogJson = JSON.stringify(allProjects);
  localStorage.setItem("taskCatalog", taskCatalogJson);
}

function retrieveLocalCatalog() {
  const storedCatalogJson = localStorage.getItem("taskCatalog");
  if (storedCatalogJson && storedCatalogJson.length != 0) {
    tempCatalog = JSON.parse(storedCatalogJson);

    })
    displayBookList();
  } else {
    console.log("No books found in Local Storage.");
  }
}