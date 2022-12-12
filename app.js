const uploadForm = document.querySelector(".file-upload__form"),
  fileInput = document.querySelector(".file-input"),
  progressContainer = document.querySelector(".progress-container"),
  uploadedContainer = document.querySelector(".uploaded-container");
uploadForm.addEventListener("click", () => {
  fileInput.click();
});

fileInput.onchange = ({ target }) => {
  let file = target.files[0];
  if (file) {
    let fileName = file.name;
    if (fileName.length >= 12) {
      let splitName = fileName.split(".");
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    uploadFile(fileName);
  }
};

function uploadFile(name) {
  let xhrRequest = new XMLHttpRequest();
  const endpoint = "uploadFile.php";
  xhrRequest.open("POST", endpoint);
  xhrRequest.upload.addEventListener("progress", ({ loaded, total }) => {
    let fileLoaded = Math.floor((loaded / total) * 100);
    let fileTotal = Math.floor(total / 1000);
    let fileSize;
    fileTotal < 1024
      ? (fileSize = fileTotal + " KB")
      : (fileSize = (loaded / (1024 * 1024)).toFixed(2) + " MB");
    let progressMarkup = `<li class="row">
                          <i class="fas fa-file-alt"></i>
                          <div class="content-wrapper">
                            <div class="details-wrapper">
                              <span class="name">${name} | <span>Uploading</span></span>
                              <span class="percent">${fileLoaded}%</span>
                            </div>
                            <div class="progress-bar-wrapper">
                              <div class="progress-wrapper" style="width: ${fileLoaded}%"></div>
                            </div>
                          </div>
                        </li>`;
    uploadedContainer.classList.add("onprogress");
    progressContainer.innerHTML = progressMarkup;
    if (loaded == total) {
      progressContainer.innerHTML = "";
      let uploadedMarkup = `<li class="row">
                            <div class="content-wrapper upload">
                              <i class="fas fa-file-alt"></i>
                              <div class="details-wrapper">
                                <span class="name">${name} | <span>Uploaded</span></span>
                                <span class="file-size">${fileSize}</span>
                              </div>
                            </div>
                          </li>`;
      uploadedContainer.classList.remove("onprogress");
      uploadedContainer.insertAdjacentHTML("afterbegin", uploadedMarkup);
    }
  });
  let data = new FormData(uploadForm);
  xhrRequest.send(data);
}
