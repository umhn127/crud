//html elemntleri
const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

//DÜZENLEME SEÇENEKLERİ
let editElement; //düzenleme yapılan ögeyi temsil eder
let editFlag = false; //düzenleme modunda olup olmadığını belirtir
let editID = ""; //benzersiz ıd

//form gönderildiğinde addItem fonksiyonunu çağır
form.addEventListener("submit", addItem);
//temizle düğmesine basıldığında clearItems fonksiyonunu çağırır
clearBtn.addEventListener("click", clearItems);
// sayfa yüklendiğinde setupItems fonksiyonunu çağır
window.addEventListener("DOMContentLoaded", setupItems);

//!functions
function addItem(e) {
  e.preventDefault();
  const value = grocery.value; //inputun giriş değerini al
  const id = new Date().getTime().toString(); //benzersiz id oluşturduk

  if (value !== "" && !editFlag) {
    //burası boş değil ve düzenleme modunda değilse
    const element = document.createElement("article"); //html elementi oluşturduk
    let attr = document.createAttribute("data-id"); //yeni bir veri kimliği oluşturduk
    attr.value = id; //üstte tanımladığımız id i value olarak data-id e gönderdik
    element.setAttributeNode(attr); //attr elemente(article) ekledik
    element.classList.add("grocery-item"); //html elementine class ekledik

    //console.log(element);

    element.innerHTML = `
    <p class="title">${value}</p>
            <div class="btn-container">
              <button class="edit-btn" type="button">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="delete-btn" type="button">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>`;

    const deleteBtn = element.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", deleteItem);

    const editBtn = element.querySelector(".edit-btn");
    editBtn.addEventListener("click", editItem);

    list.appendChild(element);
    //alert
    displayAlert("Başarıyla eklendi", "success");
    //show-container
    container.classList.add("show-container");
    //localStorage ekleme
    addToLocalStorage(id, value);
    //içeriği temizlem
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
    displayAlert("Değer değiştirildi", "success");
    editLocalStorage(editID, value);
    setBackToDefault();
  } else {
    displayAlert("Lütfen bir değer giriniz.", "danger");
  }
}

//!ALERT FONKSİYONU (success,danger)
function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  console.log(alert);

  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
}
//temizleme
function setBackToDefault() {
  // inputun içini temizledik
  grocery.value = "";
  editFlag = false;
  editID = "";
  submitBtn.textContent = "submit";
}
//silme işlemi
function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement; //kapsayıcıya eventin target özelliği ile ulaştıknt;
  //console.log(element)
  const id = element.dataset.id; //localStorage da kullanılacak

  list.removeChild(element);

  if (list.children.length == 0) {
    container.classList.remove("show-container");
  }

  displayAlert("Eleman kaldırıldı", "danger");

  // yerel depodan kaldır
  removeFromLocalStorage(id);
}


//düzenleme fonksiyonu
function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  // consol.log(editElement);

  //form değeri düzenlenen ögenin metniyle doldur
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id; //düzenlenen elementin kimliği
  submitBtn.textContent = "edit";
}

// listeyi temizleme
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach(function (item) {
      list.removeChild(item); // her öğeyi listeden kaldırır
    });
  }
  container.classList.remove("show-container");
  displayAlert("Liste temizlendi", "danger");
  setBackToDefault();
}




//! localStorage işlemleri

// yerel depoya öğe ekleme işlemi
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

// localStoragedan verileri alma işlemi
function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}
function removeFromLocalStorage(id) {
  let items = getLocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
}
function editLocalStorage(id, value) {}

function setupItems() {
  let items = getLocalStorage();
}
