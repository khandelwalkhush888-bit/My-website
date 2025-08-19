// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBd0e1diSH5RnQbYjzBVgnnL-kGI55jTP8",
  authDomain: "my-kush-project-75267.firebaseapp.com",
  databaseURL: "https://my-kush-project-75267-default-rtdb.firebaseio.com",
  projectId: "my-kush-project-75267",
  storageBucket: "my-kush-project-75267.firebasestorage.app",
  messagingSenderId: "523289754861",
  appId: "1:523289754861:web:edf817f6210d3b194da0e4",
  measurementId: "G-5YWX6CHWGB"
};

// ✅ Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
const database = firebase.database();

// ✅ Upload file function
function uploadFile() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) {
    alert("Please choose a file first!");
    return;
  }

  const storageRef = storage.ref("uploads/" + file.name);
  const uploadTask = storageRef.put(file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      console.log("Uploading...");
    },
    (error) => {
      console.error("Upload failed:", error);
    },
    () => {
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log("File available at", downloadURL);
        // Save file URL in database
        database.ref("uploads").push({
          name: file.name,
          url: downloadURL,
        });
        alert("File uploaded!");
        showFiles();
      });
    }
  );
}

// ✅ Show uploaded files
function showFiles() {
  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";

  database.ref("uploads").on("child_added", (snapshot) => {
    const file = snapshot.val();
    const li = document.createElement("li");
    li.innerHTML = `<a href="${file.url}" target="_blank">${file.name}</a>`;
    fileList.appendChild(li);
  });
}

// Load existing files
showFiles();